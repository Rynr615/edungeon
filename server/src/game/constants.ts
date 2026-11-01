export const BASE_HP = 3;
export const BASE_ATTACK = 10;
export const OPTIONS = ["A", "B", "C", "D"] as const;
export type Option = (typeof OPTIONS)[number];
export type HeroClass = "knight" | "mage" | "archer";
export const enemyHp = (stage: number) =>
  stage === 10 ? 30 : stage === 5 ? 20 : 10;
export const dodgeRate = (stage: number, buff: boolean) =>
  Math.min(0.7, 0.3 + Math.floor((stage - 1) / 2) * 0.1 + (buff ? 0.1 : 0));
