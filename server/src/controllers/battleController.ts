import { Response } from "express";
import { randomUUID } from "crypto";
import { FieldValue } from "firebase-admin/firestore";
import { db } from "../config/firebase.js";
import { AuthRequest } from "../middleware/auth.js";
import { BattleRun, newRun, resolveAnswer, applyCard } from "../game/engine.js";
import { CARDS } from "../game/cards.js";
import { OPTIONS, Option, HeroClass } from "../game/constants.js";

class BattleError extends Error {
  constructor(
    message: string,
    public httpStatus = 409,
  ) {
    super(message);
  }
}
const publicRun = (r: BattleRun) => ({
  ...r,
  question: r.question ? { ...r.question, id: undefined } : null,
  offers: r.offers.map((id) => CARDS.find((c) => c.id === id)),
  activeCard: CARDS.find((c) => c.id === r.card) ?? null,
});
const wrap =
  (fn: (req: AuthRequest, res: Response) => Promise<void>) =>
  async (req: AuthRequest, res: Response) => {
    try {
      await fn(req, res);
    } catch (e) {
      if (e instanceof BattleError)
        res.status(e.httpStatus).json({ status: "error", message: e.message });
      else {
        console.error("[BATTLE]", e);
        res
          .status(500)
          .json({
            status: "error",
            message: "Battle gagal diproses. Coba lagi.",
          });
      }
    }
  };
const runRef = (uid: string) =>
  db.collection("tb_progres_siswa").doc(`battle_${uid}`);
const requireRun = (
  data: FirebaseFirestore.DocumentData | undefined,
  runId: unknown,
): BattleRun => {
  const run = data?.battle as BattleRun | undefined;
  if (!run || run.id !== runId)
    throw new BattleError(
      "Run berubah atau tidak ditemukan. Kembali ke Challenge.",
    );
  return run;
};
// Preserve other members' progress fields; battle data lives under its own namespace.
const save = (
  tx: FirebaseFirestore.Transaction,
  ref: FirebaseFirestore.DocumentReference,
  run: BattleRun,
) =>
  tx.set(
    ref,
    {
      id_user: run.uid,id_modul: run.moduleId,battle: run,
      hp_sekarang:run.hp,charge_shield:run.shield,charge_mage:run.mage,
      kartu_terpilih:run.card,streak_benar:run.streak,
      waktu_mulai_soal:run.question?.startedAt??null,
    },
    { merge: true },
  );
export const getBattleState = wrap(async (req, res) => {
  const uid = req.user!.uid;
  const [modules, progress, active] = await Promise.all([
    db.collection("tb_modul").get(),
    db.collection("tb_progres_siswa").where("id_user", "==", uid).get(),
    runRef(uid).get(),
  ]);
  const rows = progress.docs.map((d) => d.data());
  const list = modules.docs.map((d) => {
    const m = d.data();
    const p = rows.find(
      (p) => p.id_modul === d.id && p.materi_selesai === true,
    );
    const prerequisite = String(m.id_modul_prasyarat || "");
    const unlocked =
      !prerequisite ||
      rows.some((p) => p.id_modul === prerequisite && p.modul_tamat === true);
    return {
      id: d.id,
      name: m.nama_modul ?? d.id,
      ready: unlocked && !!p,
      reason: !unlocked
        ? "Selesaikan modul prasyarat."
        : !p
          ? "Tandai materi selesai di Home terlebih dahulu."
          : null,
    };
  });
  res.json({
    status: "success",
    data: {
      modules: list,
      run: active.data()?.battle ? publicRun(active.data()!.battle) : null,
    },
  });
});
export const startRun = wrap(async (req, res) => {
  const uid = req.user!.uid;
  const { moduleId, heroClass, restart } = req.body;
  if (
    typeof moduleId !== "string" ||
    !moduleId ||
    moduleId.includes("/") ||
    !["knight", "mage", "archer"].includes(heroClass)
  )
    throw new BattleError("Modul dan Class tidak valid.", 400);
  const ref = runRef(uid);
  const runId = randomUUID();
  const run = await db.runTransaction(async (tx) => {
    const [mod, progress, current] = await Promise.all([
      tx.get(db.collection("tb_modul").doc(moduleId)),
      tx.get(db.collection("tb_progres_siswa").where("id_user", "==", uid)),
      tx.get(ref),
    ]);
    if (!mod.exists) throw new BattleError("Modul tidak ditemukan.", 404);
    const rows = progress.docs.map((d) => d.data());
    const prerequisite = mod.data()!.id_modul_prasyarat;
    if (
      !rows.some((p) => p.id_modul === moduleId && p.materi_selesai === true) ||
      (prerequisite &&
        !rows.some(
          (p) => p.id_modul === prerequisite && p.modul_tamat === true,
        ))
    )
      throw new BattleError(
        "Selesaikan materi dan prasyarat di Home terlebih dahulu.",
        403,
      );
    const existing = current.data()?.battle as BattleRun | undefined;
    if (
      existing &&
      ["active", "draft"].includes(existing.status) &&
      restart !== true
    ) {
      if (existing.moduleId !== moduleId || existing.heroClass !== heroClass)
        throw new BattleError(
          "Class terkunci selama run. Lanjutkan atau mulai ulang.",
        );
      return existing;
    }
    const fresh = newRun(uid, moduleId, heroClass as HeroClass, runId);
    save(tx, ref, fresh);
    return fresh;
  });
  res.json({ status: "success", data: publicRun(run) });
});
export const getQuestion = wrap(async (req, res) => {
  const uid = req.user!.uid;
  const ref = runRef(uid);
  const now = Date.now();
  const nonce = randomUUID();
  const data = await db.runTransaction(async (tx) => {
    const snapshot = await tx.get(ref);
    const run = requireRun(snapshot.data(), req.query.runId);
    if (run.status !== "active")
      return { run: publicRun(run), question: null, serverNow: now };
    let question: FirebaseFirestore.DocumentSnapshot;
    if (run.question)
      question = await tx.get(db.collection("tb_soal").doc(run.question.id));
    else {
      const bank = await tx.get(
        db.collection("tb_soal").where("id_modul", "==", run.moduleId),
      );
      const pool = bank.docs
        .filter(
          (d) => Number(d.data().stage ?? d.data().nomor_stage) === run.stage,
        )
        .sort(
          (a, b) => (a.data().urutan_soal ?? 0) - (b.data().urutan_soal ?? 0),
        );
      if (!pool.length)
        throw new BattleError(
          "Soal stage belum tersedia. Hubungi pengelola.",
          503,
        );
      question = pool[run.sequence % pool.length];
      run.question = {
        id: question.id,
        nonce,
        startedAt: now,
        hidden: [],
        marked: [],
        mageUsed: false,
      };
      save(tx, ref, run);
    }
    if (!question.exists) throw new BattleError("Soal tidak tersedia.", 503);
    const q = question.data()!;
    const active = run.question!;
    res.setHeader("Cache-Control", "no-store");
    return {
      run: publicRun(run),
      serverNow: Date.now(),
      question: {
        nonce: active.nonce,
        text: q.pertanyaan,
        options: OPTIONS.map((key) => ({
          key,
          text: q[`opsi_${key.toLowerCase()}`],
        })),
        deadline: active.startedAt + (run.card === "K09" ? 30000 : 20000),
        hidden: active.hidden,
        marked: active.marked,
      },
    };
  });
  res.json({ status: "success", data });
});
export const submitAnswer = wrap(async (req, res) => {
  const uid = req.user!.uid;
  const { runId, nonce, answer } = req.body;
  const now = Date.now();
  if (
    typeof nonce !== "string" ||
    (answer !== null && !OPTIONS.includes(answer))
  )
    throw new BattleError("Jawaban tidak valid.", 400);
  const data = await db.runTransaction(async (tx) => {
    const ref = runRef(uid);
    const snapshot = await tx.get(ref);
    const run = requireRun(snapshot.data(), runId);
    if (run.lastAnswer?.nonce === nonce)
      return { run: publicRun(run), result: run.lastAnswer };
    if (run.question?.nonce !== nonce || run.status !== "active")
      throw new BattleError("Soal sudah berubah. Muat ulang soal.");
    if (run.question.hidden.includes(answer))
      throw new BattleError("Opsi sudah dieliminasi.", 400);
    const q = await tx.get(db.collection("tb_soal").doc(run.question.id));
    if (!q.exists) throw new BattleError("Soal tidak tersedia.", 503);
    if (
      answer === null &&
      now - run.question.startedAt < (run.card === "K09" ? 30000 : 20000)
    )
      throw new BattleError("Waktu belum habis.", 400);
    const answeredStage = run.stage;
    const result = resolveAnswer(
      run,
      answer,
      q.data()!.kunci_jawaban,
      q.data()!.petunjuk ?? "",
      now,
    );
    if (result.retry && run.question) {
      run.question.nonce = randomUUID();
      run.question.startedAt = now;
    }
    save(tx, ref, run);
    // Publish gameplay events for Anggota 3 without implementing badge/profile logic.
    tx.create(db.collection("battle_events").doc(`${run.id}_${nonce}`), {
      uid,
      runId: run.id,
      moduleId: run.moduleId,
      stage: answeredStage,
      result,
      heroClass: run.heroClass,
      hp: run.hp,
      shieldHits: run.shieldHits,
      dodges: run.dodges,
      mageUsed: run.mageUsed,
      streak: run.streak,
      elapsedMs: now - snapshot.data()!.battle.question.startedAt,
      totals: {
        correct: run.correct,
        answers: run.answers,
        exp: run.exp,
        kills: run.kills,
        bosses: run.bosses,
      },
      status: run.status,
      createdAt: now,
    });
    if ((run as BattleRun).status === "victory")
      tx.set(
        db.collection("tb_progres_siswa").doc(`${uid}_${run.moduleId}`),
        { id_user: uid, id_modul: run.moduleId, modul_tamat: true },
        { merge: true },
      );
    return { run: publicRun(run), result };
  });
  res.json({ status: "success", data });
});
export const useSkill = wrap(async (req, res) => {
  const uid = req.user!.uid;
  const { runId, nonce, skill } = req.body;
  const now = Date.now();
  const run = await db.runTransaction(async (tx) => {
    const ref = runRef(uid);
    const snapshot = await tx.get(ref);
    const run = requireRun(snapshot.data(), runId);
    if (run.status !== "active" || run.question?.nonce !== nonce)
      throw new BattleError("Soal tidak aktif.");
    const active = run.question!;
    if (now >= active.startedAt + (run.card === "K09" ? 30000 : 20000))
      throw new BattleError("Waktu soal habis.");
    const q = await tx.get(db.collection("tb_soal").doc(active.id));
    const wrong = OPTIONS.filter(
      (o) =>
        o !== q.data()!.kunci_jawaban &&
        !active.hidden.includes(o) &&
        !active.marked.includes(o),
    );
    if (
      skill === "mage" &&
      run.heroClass === "mage" &&
      run.mage > 0 &&
      !active.mageUsed
    ) {
      const remaining = OPTIONS.filter(
        (o) => o !== q.data()!.kunci_jawaban && !active.hidden.includes(o),
      );
      if (remaining.length < 2)
        throw new BattleError("Opsi tidak cukup untuk skill.");
      active.hidden.push(...remaining.slice(0, 2));
      active.marked = active.marked.filter((o) => !active.hidden.includes(o));
      run.mage--;
      run.mageUsed = true;
      active.mageUsed = true;
    } else if (
      skill === "arcane" &&
      run.card === "K11" &&
      !run.arcaneUsed &&
      wrong.length
    ) {
      active.marked.push(wrong[0]);
      run.arcaneUsed = true;
    } else if (
      skill === "aim" &&
      run.card === "K12" &&
      !run.aimUsed &&
      wrong.length
    ) {
      active.hidden.push(wrong[0]);
      run.aimUsed = true;
    } else throw new BattleError("Skill tidak tersedia.");
    save(tx, ref, run);
    return run;
  });
  res.json({ status: "success", data: publicRun(run) });
});
export const selectCard = wrap(async (req, res) => {
  const uid = req.user!.uid;
  const { runId, cardId } = req.body;
  const run = await db.runTransaction(async (tx) => {
    const ref = runRef(uid);
    const snapshot = await tx.get(ref);
    const run = requireRun(snapshot.data(), runId);
    if (run.card === cardId && run.stage === 6) return run;
    if (
      typeof cardId !== "string" ||
      run.status !== "draft" ||
      !run.offers.includes(cardId)
    )
      throw new BattleError("Kartu tidak tersedia.");
    applyCard(run, cardId);
    save(tx, ref, run);
    tx.set(
      db.collection("tb_kartu_buff_siswa").doc(`${uid}_${cardId}`),
      {
        id_user: uid,
        id_kartu: cardId,
        id_kartu_buff: cardId,
        tgl_didapat: FieldValue.serverTimestamp(),
      },
      { merge: true },
    );
    return run;
  });
  res.json({ status: "success", data: publicRun(run) });
});
