// server/src/game/badges.ts
import { FieldValue } from "firebase-admin/firestore";
import { db } from "../config/firebase.js";
import { BattleRun } from "./engine.js";
import { CARDS } from "./cards.js";

/**
 * Helper untuk memberikan badge ke siswa jika belum pernah didapat
 */
export async function awardBadge(uid: string, badgeId: string): Promise<boolean> {
  try {
    const docId = `${uid}_${badgeId}`;
    const badgeSiswaRef = db.collection("tb_badge_siswa").doc(docId);
    const existing = await badgeSiswaRef.get();

    if (!existing.exists) {
      await badgeSiswaRef.set({
        id_user: uid,
        id_badge: badgeId,
        tgl_perolehan: new Date().toISOString(),
        created_at: FieldValue.serverTimestamp(),
      });
      console.log(`[BADGE ENGINE] Siswa ${uid} berhasil meraih badge: ${badgeId}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`[BADGE ENGINE] Gagal memberikan badge ${badgeId} ke ${uid}:`, error);
    return false;
  }
}

/**
 * Memperbarui akumulasi statistik game siswa di tb_user
 */
export async function updateUserBattleStats(
  uid: string,
  delta: {
    exp?: number;
    correct?: number;
    answers?: number;
    kills?: number;
    bosses?: number;
  }
): Promise<void> {
  try {
    const userRef = db.collection("tb_user").doc(uid);
    const updateObj: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (delta.exp) updateObj.total_exp = FieldValue.increment(delta.exp);
    if (delta.correct) updateObj.jumlah_benar = FieldValue.increment(delta.correct);
    if (delta.answers) updateObj.jumlah_jawaban = FieldValue.increment(delta.answers);
    if (delta.kills) updateObj.monster_dikalahkan = FieldValue.increment(delta.kills);
    if (delta.bosses) updateObj.boss_dikalahkan = FieldValue.increment(delta.bosses);

    await userRef.set(updateObj, { merge: true });
  } catch (error) {
    console.error(`[BADGE ENGINE] Gagal update stats user ${uid}:`, error);
  }
}

/**
 * Evaluasi 15 Badge Pencapaian Berdasarkan Status Pertempuran Realtime
 */
export async function evaluateRunBadges(
  uid: string,
  run: BattleRun,
  result: { correct: boolean; damage: number },
  elapsedMs: number
): Promise<string[]> {
  const awarded: string[] = [];

  try {
    // B01: The Journey Begins (Selesaikan Stage 1-1 / Stage >= 2)
    if (run.stage >= 2) {
      if (await awardBadge(uid, "the_journey_begins")) awarded.push("the_journey_begins");
    }

    // B02: Monster Slayer (Kalahkan total >= 10 monster biasa)
    if (run.kills >= 10) {
      if (await awardBadge(uid, "monster_slayer")) awarded.push("monster_slayer");
    }

    // B03: Mid-Boss Crusher (Kalahkan Mid-Boss Stage 5)
    if (run.stage > 5 && run.bosses >= 1) {
      if (await awardBadge(uid, "mid_boss_crusher")) awarded.push("mid_boss_crusher");
    }

    // B04: Math Grandmaster (Selesaikan semua Stage / status victory)
    if (run.status === "victory") {
      if (await awardBadge(uid, "math_grandmaster")) awarded.push("math_grandmaster");
    }

    // B05: Sharpshooter (Jawab 10 pertanyaan beruntun benar / streak >= 10)
    if (run.streak >= 10) {
      if (await awardBadge(uid, "sharpshooter")) awarded.push("sharpshooter");
    }

    // B07: Lightning Mind (Jawab benar pada Mid-Boss / Last Boss dengan waktu < 5 detik)
    if ((run.stage === 5 || run.stage === 10) && result.correct && elapsedMs < 5000) {
      if (await awardBadge(uid, "lightning_mind")) awarded.push("lightning_mind");
    }

    // B08: Untouchable (Kalahkan Boss tanpa jawaban salah selama encounter Boss)
    if ((run.stage > 5 && run.bosses >= 1) || run.status === "victory") {
      if (run.streak >= 3) {
        if (await awardBadge(uid, "untouchable")) awarded.push("untouchable");
      }
    }

    // B10: Living on the Edge (Kalahkan Boss saat HP tersisa tepat 1)
    if ((run.stage > 5 || run.status === "victory") && run.hp === 1) {
      if (await awardBadge(uid, "living_on_the_edge")) awarded.push("living_on_the_edge");
    }

    // B11: Benteng Baja (Knight: Shield menyerap 3 serangan balik)
    if (run.heroClass === "knight" && run.shieldHits >= 3) {
      if (await awardBadge(uid, "benteng_baja")) awarded.push("benteng_baja");
    }

    // B12: Arkanis Terampil (Mage: Gunakan skill sihir dan selesaikan/kalahkan Boss)
    if (run.heroClass === "mage" && run.mageUsed && (run.stage >= 5 || run.status === "victory")) {
      if (await awardBadge(uid, "arkanis_terampil")) awarded.push("arkanis_terampil");
    }

    // B13: Jejak Hening (Archer: Dodge berhasil 3 kali dan kalahkan Boss)
    if (run.heroClass === "archer" && run.dodges >= 3 && (run.stage >= 5 || run.status === "victory")) {
      if (await awardBadge(uid, "jejak_hening")) awarded.push("jejak_hening");
    }

    // B15: Tanpa Pergantian (Selesaikan modul dengan status victory)
    if (run.status === "victory") {
      if (await awardBadge(uid, "tanpa_pergantian")) awarded.push("tanpa_pergantian");
    }

    // Cek Badge Kumulatif (B06 Deck Collector, B14 Kolektor Serbabisa, B09 True Scholar)
    await evaluateCumulativeBadges(uid);
  } catch (err) {
    console.error("[BADGE ENGINE] Error evaluateRunBadges:", err);
  }

  return awarded;
}

/**
 * Evaluasi Badge Kumulatif Lintas Run (Koleksi Kartu & Modul Selesai)
 */
export async function evaluateCumulativeBadges(uid: string): Promise<void> {
  try {
    // 1. Ambil koleksi kartu siswa
    const cardsSnap = await db
      .collection("tb_kartu_buff_siswa")
      .where("id_user", "==", uid)
      .get();

    const cardIds = cardsSnap.docs.map((d) => d.data().id_kartu || d.data().id_kartu_buff);
    const uniqueCardCount = new Set(cardIds).size;

    // B06: Deck Collector (Minimal 5 kartu buff berbeda)
    if (uniqueCardCount >= 5) {
      await awardBadge(uid, "deck_collector");
    }

    // B14: Kolektor Serbabisa (Minimal 1 kartu Class dan 1 kartu Common)
    if (uniqueCardCount >= 2) {
      const selectedCards = CARDS.filter((c) => cardIds.includes(c.id));
      const hasClassCard = selectedCards.some((c) => c.heroClass !== "common");
      const hasCommonCard = selectedCards.some((c) => c.heroClass === "common");

      if (hasClassCard && hasCommonCard) {
        await awardBadge(uid, "kolektor_serbabisa");
      }
    }

    // B09: True Scholar (Selesaikan seluruh Modul Materi)
    const progressSnap = await db
      .collection("tb_progres_siswa")
      .where("id_user", "==", uid)
      .where("modul_tamat", "==", true)
      .get();

    if (progressSnap.size >= 3) {
      await awardBadge(uid, "true_scholar");
    }
  } catch (error) {
    console.error("[BADGE ENGINE] Error evaluateCumulativeBadges:", error);
  }
}
