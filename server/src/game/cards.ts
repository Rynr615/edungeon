import { HeroClass } from "./constants.js";
export const CARDS = [
  ["K01", "Vitalitas Tempur", "knight", "+1 HP maksimum dan pulihkan 1 HP."],
  [
    "K02",
    "Kaca Pembesar Cadangan",
    "mage",
    "+1 charge dan kapasitas Kaca Pembesar menjadi 4.",
  ],
  ["K03", "Langkah Lincah", "archer", "+10% Dodge, maksimum 70%."],
  [
    "K04",
    "Ramuan Pemulihan",
    "common",
    "Pulihkan 1 HP; jika penuh, dapatkan 1 buffer.",
  ],
  [
    "K05",
    "Charge Perisai Tambahan",
    "knight",
    "Kapasitas Shield menjadi 2; pulih +1 tiap stage.",
  ],
  ["K06", "Fokus Mantra", "mage", "Benar <10 detik: 12 damage dan +15 EXP."],
  ["K07", "Critical Strike", "archer", "25% peluang menghasilkan 20 damage."],
  [
    "K08",
    "Kesempatan Belajar",
    "common",
    "Sekali per run: ulangi jawaban salah tanpa damage, dengan petunjuk.",
  ],
  ["K09", "Waktu Tambahan", "common", "Waktu tiap soal menjadi 30 detik."],
  [
    "K10",
    "Serangan Balasan",
    "knight",
    "30% peluang membalas 5 damage saat salah.",
  ],
  ["K11", "Ingatan Arcane", "mage", "Sekali per run: tandai satu opsi salah."],
  [
    "K12",
    "Bidikan Terarah",
    "archer",
    "Sekali per run: hapus satu opsi salah.",
  ],
].map(([id, name, heroClass, description]) => ({
  id,
  name,
  heroClass,
  description,
}));
export function draftCards(hero: HeroClass, random = Math.random): string[] {
  const shuffle = <T>(items: T[]) => {
    const out = [...items];
    for (let i = out.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
  };
  return shuffle([
    shuffle(CARDS.filter((c) => c.heroClass === hero))[0],
    ...shuffle(CARDS.filter((c) => c.heroClass === "common")).slice(0, 2),
  ]).map((c) => c.id);
}
