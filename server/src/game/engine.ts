import {
  BASE_HP,
  BASE_ATTACK,
  HeroClass,
  Option,
  enemyHp,
  dodgeRate,
} from "./constants.js";
import { draftCards } from "./cards.js";
export interface BattleRun {
  id: string;
  uid: string;
  moduleId: string;
  heroClass: HeroClass;
  stage: number;
  hp: number;
  maxHp: number;
  enemyHp: number;
  shield: number;
  shieldCap: number;
  mage: number;
  mageCap: number;
  buffer: number;
  card: string | null;
  offers: string[];
  status: "active" | "draft" | "dead" | "victory";
  streak: number;
  correct: number;
  answers: number;
  exp: number;
  kills: number;
  bosses: number;
  shieldHits: number;
  dodges: number;
  mageUsed: boolean;
  retryUsed: boolean;
  arcaneUsed: boolean;
  aimUsed: boolean;
  question: {
    id: string;
    nonce: string;
    startedAt: number;
    hidden: Option[];
    marked: Option[];
    mageUsed: boolean;
  } | null;
  lastAnswer: {
    nonce: string;
    message: string;
    correct: boolean;
    timeout: boolean;
    damage: number;
    hint: string | null;
    retry: boolean;
  } | null;
  sequence: number;
}
export function newRun(
  uid: string,
  moduleId: string,
  heroClass: HeroClass,
  id: string,
): BattleRun {
  return {
    id,
    uid,
    moduleId,
    heroClass,
    stage: 1,
    hp: BASE_HP,
    maxHp: BASE_HP,
    enemyHp: 10,
    shield: heroClass === "knight" ? 1 : 0,
    shieldCap: heroClass === "knight" ? 1 : 0,
    mage: heroClass === "mage" ? 3 : 0,
    mageCap: heroClass === "mage" ? 3 : 0,
    buffer: 0,
    card: null,
    offers: [],
    status: "active",
    streak: 0,
    correct: 0,
    answers: 0,
    exp: 0,
    kills: 0,
    bosses: 0,
    shieldHits: 0,
    dodges: 0,
    mageUsed: false,
    retryUsed: false,
    arcaneUsed: false,
    aimUsed: false,
    question: null,
    lastAnswer: null,
    sequence: 0,
  };
}
export function enterStage(run: BattleRun) {
  run.stage++;
  run.enemyHp = enemyHp(run.stage);
  run.shield = Math.min(run.shieldCap, run.shield + 1);
  if ((run.stage - 1) % 2 === 0) run.mage = Math.min(run.mageCap, run.mage + 1);
}
export function applyCard(run: BattleRun, id: string) {
  if (run.status !== "draft" || !run.offers.includes(id))
    throw new Error("Kartu tidak tersedia.");
  run.card = id;
  if (id === "K01") {
    run.maxHp++;
    run.hp++;
  }
  if (id === "K02") {
    run.mageCap = 4;
    run.mage = Math.min(4, run.mage + 1);
  }
  if (id === "K04") {
    if (run.hp === run.maxHp) run.buffer = 1;
    else run.hp++;
  }
  if (id === "K05") run.shieldCap = 2;
  run.offers = [];
  run.status = "active";
  enterStage(run);
}
export function resolveAnswer(
  run: BattleRun,
  answer: Option | null,
  key: Option,
  hint: string,
  now: number,
  random = Math.random,
) {
  if (!run.question || run.status !== "active")
    throw new Error("Tidak ada soal aktif.");
  const elapsed = now - run.question.startedAt;
  const timeout = elapsed >= (run.card === "K09" ? 30000 : 20000);
  if (answer === null && !timeout) throw new Error("Waktu belum habis.");
  const correct = !timeout && answer === key;
  const result = {
    nonce: run.question.nonce,
    correct,
    timeout,
    damage: 0,
    message: "",
    hint: null as string | null,
    retry: false,
  };
  run.answers++;
  if (correct) {
    run.correct++;
    run.streak++;
    result.damage =
      run.card === "K06" && elapsed < 10000
        ? 12
        : run.card === "K07" && random() < 0.25
          ? 20
          : BASE_ATTACK;
    run.enemyHp = Math.max(0, run.enemyHp - result.damage);
    run.exp +=
      (elapsed < 10000 ? 5 : 0) +
      (run.card === "K06" && elapsed < 10000 ? 15 : 0);
    result.message = `Benar! ${result.damage} damage.`;
  } else {
    run.streak = 0;
    if (run.card === "K08" && !run.retryUsed && !timeout) {
      run.retryUsed = true;
      result.retry = true;
      result.hint = hint;
      result.message = "Kesempatan belajar: coba sekali lagi.";
    } else {
      if (run.shield > 0) {
        run.shield--;
        run.shieldHits++;
        result.message = "Shield menyerap serangan.";
      } else if (
        run.heroClass === "archer" &&
        random() < dodgeRate(run.stage, run.card === "K03")
      ) {
        run.dodges++;
        result.message = "Dodge! Serangan dihindari.";
      } else if (run.buffer > 0) {
        run.buffer--;
        result.message = "Buffer menyerap serangan.";
      } else {
        run.hp = Math.max(0, run.hp - 1);
        result.message = timeout
          ? "Waktu habis. HP -1."
          : "Jawaban salah. HP -1.";
      }
      if (run.card === "K10" && random() < 0.3) {
        result.damage = 5;
        run.enemyHp = Math.max(0, run.enemyHp - 5);
        result.message += " Balasan: 5 damage.";
      }
    }
  }
  if (run.hp === 0) run.status = "dead";
  else if (run.enemyHp === 0) {
    const boss = run.stage === 5 || run.stage === 10;
    run.exp += run.stage === 10 ? 50 : run.stage === 5 ? 25 : 10;
    if (boss) run.bosses++;
    else run.kills++;
    if (run.stage === 10) run.status = "victory";
    else if (run.stage === 5) {
      run.status = "draft";
      run.offers = draftCards(run.heroClass, random);
    } else enterStage(run);
  }
  if (!result.retry) {
    run.question = null;
    run.sequence++;
  }
  // A retry receives a new nonce and deadline from the controller, retaining eliminated options.
  run.lastAnswer = result;
  return result;
}
