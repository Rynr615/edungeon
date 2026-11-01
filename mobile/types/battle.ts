export type HeroClass = "knight" | "mage" | "archer";
export type Option = "A" | "B" | "C" | "D";
export interface BuffCard {
  id: string;
  name: string;
  heroClass: string;
  description: string;
}
export interface Run {
  id: string;
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
  offers: BuffCard[];
  activeCard: BuffCard | null;
  status: "active" | "draft" | "dead" | "victory";
  exp: number;
  streak: number;
  correct: number;
  answers: number;
  kills: number;
  bosses: number;
  arcaneUsed: boolean;
  aimUsed: boolean;
  question: {
    nonce: string;
    hidden: Option[];
    marked: Option[];
    mageUsed: boolean;
  } | null;
}
export interface Question {
  nonce: string;
  text: string;
  options: { key: Option; text: string }[];
  deadline: number;
  hidden: Option[];
  marked: Option[];
}
export interface QuestionResponse {
  run: Run;
  question: Question | null;
  serverNow: number;
}
export interface BattleResult {
  nonce: string;
  message: string;
  correct: boolean;
  timeout: boolean;
  damage: number;
  hint: string | null;
  retry: boolean;
}
export interface BattleModule {
  id: string;
  name: string;
  ready: boolean;
  reason: string | null;
}
