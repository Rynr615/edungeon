import dotenv from "dotenv";
dotenv.config({ path: "../mobile/.env" });
import assert from "node:assert/strict";
import { randomUUID } from "crypto";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { db } from "../config/firebase.js";
import { newRun } from "../game/engine.js";
import { HeroClass } from "../game/constants.js";
async function main() {
  const app = initializeApp({
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  });
  const credential = await signInWithEmailAndPassword(
    getAuth(app),
    process.env.BATTLE_TEST_EMAIL!,
    process.env.BATTLE_TEST_PASSWORD!,
  );
  const uid = credential.user.uid;
  const token = await credential.user.getIdToken();
  const base = "http://localhost:5000/api/battle";
  async function call(path: string, body?: object, expected = 200) {
    const r = await fetch(base + path, {
      method: body ? "POST" : "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    const json = await r.json();
    assert.equal(r.status, expected, JSON.stringify(json));
    return json.data;
  }
  const state = await call("/state");
  const moduleId = state.modules[0].id;
  const ref = db.collection("tb_progres_siswa").doc(`battle_${uid}`);
  const completion = db
    .collection("tb_progres_siswa")
    .doc(`${uid}_${moduleId}`);
  const backup = await ref.get();
  const completionBackup = await completion.get();
  const cardBackups = await db
    .collection("tb_kartu_buff_siswa")
    .where("id_user", "==", uid)
    .get();
  const ids: string[] = [];
  try {
    assert.equal((await fetch(base + "/state")).status, 401);
    if (!state.modules[0].ready)
      await call("/start", { moduleId, heroClass: "knight" }, 403);
    for (const hero of ["knight", "mage", "archer"] as HeroClass[]) {
      const runId = randomUUID();
      ids.push(runId);
      await ref.set(
        {
          id_user: uid,
          id_modul: moduleId,
          battle: newRun(uid, moduleId, hero, runId),
        },
        { merge: true },
      );
      let run: any;
      let count = 0;
      do {
        const q = await call(`/question?runId=${runId}`);
        assert.ok(!JSON.stringify(q).includes("kunci_jawaban"));
        assert.ok(!q.question?.id);
        if(count===0){const again = await call(`/question?runId=${runId}`);
        assert.equal(q.question.nonce, again.question.nonce);
        assert.equal(q.question.deadline, again.question.deadline);}
        if (hero === "mage" && count === 0) {
          const skill = await call("/use-skill", {
            runId,
            nonce: q.question.nonce,
            skill: "mage",
          });
          assert.equal(skill.question.hidden.length, 2);
          await call(
            "/use-skill",
            { runId, nonce: q.question.nonce, skill: "mage" },
            409,
          );
        }
        if(count===0)await call(
          "/answer",
          { runId, nonce: q.question.nonce, answer: null },
          400,
        );
        const privateRun = (await ref.get()).data()!.battle;
        const key = (
          await db.collection("tb_soal").doc(privateRun.question.id).get()
        ).data()!.kunci_jawaban;
        const body = { runId, nonce: q.question.nonce, answer: key };
        if(count===0){const answers=await Promise.all([call('/answer',body),call('/answer',body)]);assert.equal(answers[0].run.answers,answers[1].run.answers);run=answers[0].run;}
        else run=(await call('/answer',body)).run;
        count++;
        if (run.status === "draft") {
          assert.equal(run.stage, 5);
          assert.equal(new Set(run.offers.map((c: any) => c.id)).size, 3);
          await call("/draft-card", { runId, cardId: "NOT_OFFERED" }, 409);
          const chosen = run.offers.find(
            (c: any) => c.heroClass === "common",
          ).id;
          run = await call("/draft-card", { runId, cardId: chosen });
          assert.equal(run.stage, 6);
          assert.equal(run.card, chosen);
        }
      } while (run.status === "active" && count < 20);
      assert.equal(run.status, "victory");
      assert.equal(count, 13);
      assert.equal(run.bosses, 2);
      assert.equal(run.kills, 8);
      console.log(
        `${hero}: 13 answers, 10 stages, draft, duplicate protection, victory PASS`,
      );
    }
    const runId = randomUUID();
    ids.push(runId);
    const r = newRun(uid, moduleId, "mage", runId);
    r.card = "K08";
    await ref.set({ battle: r }, { merge: true });
    let q = await call(`/question?runId=${runId}`);
    const p = (await ref.get()).data()!.battle;
    const key = (
      await db.collection("tb_soal").doc(p.question.id).get()
    ).data()!.kunci_jawaban;
    const wrong = ["A", "B", "C", "D"].find((a) => a !== key)!;
    const retry = await call("/answer", {
      runId,
      nonce: q.question.nonce,
      answer: wrong,
    });
    assert.equal(retry.result.retry, true);
    assert.equal(retry.run.hp, 3);
    q = await call(`/question?runId=${runId}`);
    assert.ok(q.question.nonce !== retry.result.nonce);
    await ref.update({ "battle.question.startedAt": Date.now() - 21000 });
    const timeout = await call("/answer", {
      runId,
      nonce: q.question.nonce,
      answer: key,
    });
    assert.equal(timeout.result.timeout, true);
    assert.equal(timeout.run.hp, 2);
    console.log(
      "K08 retry, server timeout, authentication and lesson gate PASS",
    );
  } finally {
    if (backup.exists) await ref.set(backup.data()!);
    else await ref.delete();
    if (completionBackup.exists) await completion.set(completionBackup.data()!);
    else await completion.delete();
    const cards = await db
      .collection("tb_kartu_buff_siswa")
      .where("id_user", "==", uid)
      .get();
    const batch = db.batch();
    for (const doc of cards.docs) {
      const old = cardBackups.docs.find((d) => d.id === doc.id);
      if (old) batch.set(doc.ref, old.data());
      else batch.delete(doc.ref);
    }
    for (const id of ids) {
      const events = await db
        .collection("battle_events")
        .where("runId", "==", id)
        .get();
      for (const event of events.docs) batch.delete(event.ref);
    }
    await batch.commit();
    console.log(
      "Temporary battle fixtures restored/removed; lesson/profile records preserved.",
    );
  }
}
main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
