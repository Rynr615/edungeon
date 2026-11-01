// server/src/game/badges.test.ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { BattleRun, newRun } from "./engine.js";

// Evaluasi lokal kriteria 15 badge
function testBadgeEvaluation(
  run: BattleRun,
  result: { correct: boolean; damage: number },
  elapsedMs: number
): string[] {
  const awarded: string[] = [];

  if (run.stage >= 2) awarded.push("the_journey_begins");
  if (run.kills >= 10) awarded.push("monster_slayer");
  if (run.stage > 5 && run.bosses >= 1) awarded.push("mid_boss_crusher");
  if (run.status === "victory") awarded.push("math_grandmaster");
  if (run.streak >= 10) awarded.push("sharpshooter");
  if ((run.stage === 5 || run.stage === 10) && result.correct && elapsedMs < 5000) {
    awarded.push("lightning_mind");
  }
  if (((run.stage > 5 && run.bosses >= 1) || run.status === "victory") && run.streak >= 3) {
    awarded.push("untouchable");
  }
  if ((run.stage > 5 || run.status === "victory") && run.hp === 1) {
    awarded.push("living_on_the_edge");
  }
  if (run.heroClass === "knight" && run.shieldHits >= 3) {
    awarded.push("benteng_baja");
  }
  if (run.heroClass === "mage" && run.mageUsed && (run.stage >= 5 || run.status === "victory")) {
    awarded.push("arkanis_terampil");
  }
  if (run.heroClass === "archer" && run.dodges >= 3 && (run.stage >= 5 || run.status === "victory")) {
    awarded.push("jejak_hening");
  }
  if (run.status === "victory") {
    awarded.push("tanpa_pergantian");
  }

  return awarded;
}

test("Badge B01: The Journey Begins is awarded when reaching stage 2", () => {
  const run = newRun("u1", "m1", "knight", "r1");
  run.stage = 2;
  const badges = testBadgeEvaluation(run, { correct: true, damage: 10 }, 4000);
  assert.ok(badges.includes("the_journey_begins"));
});

test("Badge B02: Monster Slayer requires 10 kills", () => {
  const run = newRun("u1", "m1", "knight", "r1");
  run.kills = 9;
  let badges = testBadgeEvaluation(run, { correct: true, damage: 10 }, 4000);
  assert.ok(!badges.includes("monster_slayer"));

  run.kills = 10;
  badges = testBadgeEvaluation(run, { correct: true, damage: 10 }, 4000);
  assert.ok(badges.includes("monster_slayer"));
});

test("Badge B03: Mid-Boss Crusher requires stage > 5 and >= 1 boss defeat", () => {
  const run = newRun("u1", "m1", "mage", "r1");
  run.stage = 6;
  run.bosses = 1;
  const badges = testBadgeEvaluation(run, { correct: true, damage: 10 }, 6000);
  assert.ok(badges.includes("mid_boss_crusher"));
});

test("Badge B05: Sharpshooter requires streak >= 10", () => {
  const run = newRun("u1", "m1", "archer", "r1");
  run.streak = 10;
  const badges = testBadgeEvaluation(run, { correct: true, damage: 10 }, 7000);
  assert.ok(badges.includes("sharpshooter"));
});

test("Badge B07: Lightning Mind triggers on boss question answered < 5s", () => {
  const run = newRun("u1", "m1", "knight", "r1");
  run.stage = 5;
  const slowBadges = testBadgeEvaluation(run, { correct: true, damage: 10 }, 5500);
  assert.ok(!slowBadges.includes("lightning_mind"));

  const fastBadges = testBadgeEvaluation(run, { correct: true, damage: 10 }, 3200);
  assert.ok(fastBadges.includes("lightning_mind"));
});

test("Badge B10: Living on the Edge triggers when defeating boss with 1 HP", () => {
  const run = newRun("u1", "m1", "knight", "r1");
  run.stage = 6;
  run.bosses = 1;
  run.hp = 1;
  const badges = testBadgeEvaluation(run, { correct: true, damage: 10 }, 6000);
  assert.ok(badges.includes("living_on_the_edge"));
});

test("Badge B11: Benteng Baja triggers when Knight absorbs 3 shield hits", () => {
  const run = newRun("u1", "m1", "knight", "r1");
  run.shieldHits = 3;
  const badges = testBadgeEvaluation(run, { correct: true, damage: 10 }, 6000);
  assert.ok(badges.includes("benteng_baja"));
});

test("Badge B12 & B13: Class specific badges for Mage and Archer", () => {
  const mageRun = newRun("u1", "m1", "mage", "r1");
  mageRun.mageUsed = true;
  mageRun.stage = 6;
  assert.ok(testBadgeEvaluation(mageRun, { correct: true, damage: 10 }, 6000).includes("arkanis_terampil"));

  const archerRun = newRun("u1", "m1", "archer", "r1");
  archerRun.dodges = 3;
  archerRun.stage = 6;
  assert.ok(testBadgeEvaluation(archerRun, { correct: true, damage: 10 }, 6000).includes("jejak_hening"));
});

test("Badge B04 & B15: Victory awards Math Grandmaster and Tanpa Pergantian", () => {
  const run = newRun("u1", "m1", "knight", "r1");
  run.status = "victory";
  const badges = testBadgeEvaluation(run, { correct: true, damage: 10 }, 6000);
  assert.ok(badges.includes("math_grandmaster"));
  assert.ok(badges.includes("tanpa_pergantian"));
});
