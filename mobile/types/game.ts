// mobile/types/game.ts
export interface Soal {
  id_soal: string;
  id_modul: string;
  pertanyaan: string;
  pilihan: string[];
  jawaban_benar: number; // Indeks jawaban (0, 1, 2, atau 3)
  pembahasan: string;
}

export interface GameState {
  userHp: number;
  maxHp: number;
  enemyHp: number;
  maxEnemyHp: number;
  currentQuestionIndex: number;
  combo: number;
  isGameOver: boolean;
  isVictory: boolean;
}