import { test } from "node:test";
import assert from "node:assert/strict";
import {
  newRun,
  resolveAnswer,
  applyCard,
  enterStage,
  BattleRun,
} from "./engine.js";
import { CARDS, draftCards } from "./cards.js";
import { dodgeRate } from "./constants.js";
function question(run: BattleRun, time = 0) {
  run.question = {
    id: "q",
    nonce: `q${run.answers}`,
    startedAt: time,
    hidden: [],
    marked: [],
    mageUsed: false,
  };
}
function answer(
  run: BattleRun,
  correct = true,
  now = 1000,
  random = () => 0.99,
) {
  question(run);
  return resolveAnswer(run, correct ? "A" : "B", "A", "hint", now, random);
}
test("13 correct answers complete 10 stages, draft only after mid-boss", () => {
  const run = newRun("u", "m", "knight", "r");
  let n = 0;
  while (run.status !== "victory" && n < 20) {
    if (run.status === "draft")
      applyCard(
        run,
        run.offers.find((id) => id === "K08" || id === "K09" || id === "K04")!,
      );
    else {
      answer(run);
      n++;
    }
  }
  assert.equal(n, 13);
  assert.equal(run.kills, 8);
  assert.equal(run.bosses, 2);
  assert.equal(run.hp, 3);
  assert.equal(run.stage, 10);
});
test("Knight shield absorbs first wrong answer and regenerates one per stage", () => {
  const r = newRun("u", "m", "knight", "r");
  answer(r, false);
  assert.equal(r.hp, 3);
  assert.equal(r.shield, 0);
  answer(r);
  assert.equal(r.stage, 2);
  assert.equal(r.shield, 1);
});
test("Mage restores one charge after two stages", () => {
  const r = newRun("u", "m", "mage", "r");
  r.mage = 0;
  answer(r);
  assert.equal(r.mage, 0);
  answer(r);
  assert.equal(r.mage, 1);
});
test("Dodge curve and K03 cap", () => {
  assert.deepEqual(
    Array.from({ length: 10 }, (_, i) =>
      Math.round(dodgeRate(i + 1, false) * 100),
    ),
    [30, 30, 40, 40, 50, 50, 60, 60, 70, 70],
  );
  assert.equal(dodgeRate(10, true), 0.7);
});
test("Archer success/failure are server random", () => {
  const r = newRun("u", "m", "archer", "r");
  answer(r, false, 1000, () => 0);
  assert.equal(r.hp, 3);
  answer(r, false, 1000, () => 0.99);
  assert.equal(r.hp, 2);
});
test("timeout cannot be rescued by K08", () => {
  const r = newRun("u", "m", "mage", "r");
  r.card = "K08";
  const result = answer(r, true, 20000);
  assert.equal(result.timeout, true);
  assert.equal(r.hp, 2);
  assert.equal(r.retryUsed, false);
});
test("K08 retries once with hint without losing HP", () => {
  const r = newRun("u", "m", "mage", "r");
  r.card = "K08";
  const result = answer(r, false);
  assert.equal(result.retry, true);
  assert.equal(result.hint, "hint");
  assert.equal(r.hp, 3);
  answer(r, false);
  assert.equal(r.hp, 2);
});
test("K09 deadline 30 seconds and exact deadline is timeout", () => {
  const r = newRun("u", "m", "mage", "r");
  r.card = "K09";
  assert.equal(answer(r, true, 29999).correct, true);
  assert.equal(answer(r, true, 30000).timeout, true);
});
test("K05 capacity increase does not refill immediately", () => {
  const r = newRun("u", "m", "knight", "r");
  r.stage = 5;
  r.status = "draft";
  r.offers = ["K05"];
  r.shield = 0;
  applyCard(r, "K05");
  assert.equal(r.shieldCap, 2);
  assert.equal(r.shield, 1);
  assert.equal(r.stage, 6);
});
test("K01 K02 K04 apply heal/capacity/buffer", () => {
  for (const id of ["K01", "K02", "K04"]) {
    const r = newRun("u", "m", "mage", "r");
    r.stage = 5;
    r.status = "draft";
    r.offers = [id];
    applyCard(r, id);
    if (id === "K01") {
      assert.equal(r.maxHp, 4);
      assert.equal(r.hp, 4);
    }
    if (id === "K02") {
      assert.equal(r.mageCap, 4);
      assert.equal(r.mage, 4);
    }
    if (id === "K04") assert.equal(r.buffer, 1);
  }
});
test("K04 heals injured hero and buffer absorbs once", () => {
  const r = newRun("u", "m", "mage", "r");
  r.stage = 5;
  r.status = "draft";
  r.offers = ["K04"];
  r.hp = 2;
  applyCard(r, "K04");
  assert.equal(r.hp, 3);
  assert.equal(r.buffer, 0);
  r.buffer = 1;
  answer(r, false);
  assert.equal(r.hp, 3);
  assert.equal(r.buffer, 0);
});
test("K06 fast answer deals 12 plus 15 EXP", () => {
  const r = newRun("u", "m", "mage", "r");
  r.card = "K06";
  r.enemyHp = 30;
  assert.equal(answer(r).damage, 12);
  assert.equal(r.exp, 20);
  assert.equal(answer(r, true, 10000).damage, 10);
});
test("K07 permits early victory without third boss answer", () => {
  const r = newRun("u", "m", "archer", "r");
  r.card = "K07";
  r.stage = 10;
  r.enemyHp = 30;
  answer(r, true, 1000, () => 0.99);
  answer(r, true, 1000, () => 0);
  assert.equal(r.status, "victory");
  assert.equal(r.answers, 2);
});
test("K10 counter can defeat monster on wrong answer", () => {
  const r = newRun("u", "m", "knight", "r");
  r.card = "K10";
  r.enemyHp = 5;
  const result = answer(r, false, 1000, () => 0);
  assert.equal(result.damage, 5);
  assert.equal(r.stage, 2);
});
test("death wins over counter kill; fresh run resets buffs and class", () => {
  const r = newRun("u", "m", "knight", "r");
  r.card = "K10";
  r.shield = 0;
  r.hp = 1;
  r.enemyHp = 5;
  answer(r, false, 1000, () => 0);
  assert.equal(r.status, "dead");
  const fresh = newRun("u", "m", "mage", "new");
  assert.equal(fresh.hp, 3);
  assert.equal(fresh.stage, 1);
  assert.equal(fresh.card, null);
});
test("draft contains unique own-class + two common cards", () => {
  for (const hero of ["knight", "mage", "archer"] as const)
    for (let i = 0; i < 100; i++) {
      const ids = draftCards(hero);
      assert.equal(new Set(ids).size, 3);
      assert.equal(
        ids.filter((id) => CARDS.find((c) => c.id === id)!.heroClass === hero)
          .length,
        1,
      );
      assert.equal(
        ids.filter(
          (id) => CARDS.find((c) => c.id === id)!.heroClass === "common",
        ).length,
        2,
      );
    }
});
test("unoffered cards and early timeout submissions are rejected", () => {
  const r = newRun("u", "m", "knight", "r");
  assert.throws(() => applyCard(r, "K01"));
  question(r);
  assert.throws(() => resolveAnswer(r, null, "A", "", 19999));
});
test("Shield is capped on stage advance", () => {
  const r = newRun("u", "m", "knight", "r");
  enterStage(r);
  assert.equal(r.shield, 1);
});
