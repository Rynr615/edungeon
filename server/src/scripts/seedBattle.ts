import { db } from "../config/firebase.js";
import { CARDS } from "../game/cards.js";
import { OPTIONS } from "../game/constants.js";

// Each entry: question, correct answer, three distractors, learning hint.
const exponent = [
  ["Nilai 2³ adalah …", "8", "6", "9", "12", "Kalikan 2 sebanyak tiga kali."],
  [
    "Nilai 3² + 4² adalah …",
    "25",
    "14",
    "12",
    "49",
    "Hitung kedua pangkat sebelum menjumlahkan.",
  ],
  [
    "Nilai 5⁰ adalah …",
    "1",
    "0",
    "5",
    "25",
    "Bilangan bukan nol berpangkat nol bernilai satu.",
  ],
  [
    "Bentuk sederhana (a²)³ adalah …",
    "a⁶",
    "a⁵",
    "a⁸",
    "a⁹",
    "Pangkat dari pangkat: kalikan eksponennya.",
  ],
  [
    "Nilai log₂ 8 adalah …",
    "3",
    "2",
    "4",
    "8",
    "Carilah pangkat 2 yang menghasilkan 8.",
  ],
  [
    "Jika 3ˣ = 27, nilai x adalah …",
    "3",
    "2",
    "4",
    "9",
    "Tuliskan 27 sebagai perkalian faktor 3.",
  ],
  [
    "Nilai log₁₀ 100 adalah …",
    "2",
    "1",
    "10",
    "100",
    "10 dipangkatkan berapa menghasilkan 100?",
  ],
  [
    "Bentuk rasional 1/√2 adalah …",
    "√2/2",
    "√2",
    "2√2",
    "1/4",
    "Kalikan pembilang dan penyebut dengan √2.",
  ],
  [
    "Nilai log₃ 9 + log₃ 3 adalah …",
    "3",
    "2",
    "4",
    "5",
    "Hitung setiap logaritma lalu jumlahkan.",
  ],
  [
    "Nilai 4^(3/2) adalah …",
    "8",
    "6",
    "12",
    "16",
    "Akar kuadrat dari 4, lalu pangkatkan tiga.",
  ],
  [
    "Nilai log₂ 4 + log₂ 16 adalah …",
    "6",
    "5",
    "7",
    "8",
    "Nyatakan 4 dan 16 sebagai pangkat 2.",
  ],
  [
    "Jika logₓ 64 = 3, nilai x adalah …",
    "4",
    "3",
    "8",
    "16",
    "Persamaan setaranya x³ = 64.",
  ],
  [
    "Bentuk sederhana a⁵ × a⁻² adalah …",
    "a³",
    "a⁻¹⁰",
    "a⁷",
    "a¹⁰",
    "Perkalian dengan basis sama: jumlahkan pangkat.",
  ],
];
const quadratic = [
  [
    "Akar x² − 5x + 6 = 0 adalah …",
    "2 dan 3",
    "1 dan 6",
    "−2 dan −3",
    "0 dan 5",
    "Faktorkan menjadi dua bentuk linear.",
  ],
  ["Diskriminan x² + 2x + 1 adalah …", "0", "1", "4", "8", "Gunakan b² − 4ac."],
  [
    "Koefisien a dalam 2x² − 3x + 1 = 0 adalah …",
    "2",
    "−3",
    "1",
    "0",
    "a adalah koefisien suku kuadrat.",
  ],
  [
    "Jumlah akar x² − 7x + 10 = 0 adalah …",
    "7",
    "10",
    "−7",
    "−10",
    "Jumlah akar = −b/a.",
  ],
  [
    "Hasil kali akar x² − 7x + 10 = 0 adalah …",
    "10",
    "7",
    "−10",
    "−7",
    "Hasil kali akar = c/a.",
  ],
  [
    "Akar x² − 9 = 0 adalah …",
    "−3 dan 3",
    "0 dan 9",
    "−9 dan 9",
    "3 dan 3",
    "Gunakan selisih dua kuadrat.",
  ],
  [
    "Sumbu simetri y = x² − 4x + 3 adalah …",
    "x = 2",
    "x = 4",
    "x = −2",
    "x = 3",
    "Gunakan x = −b/(2a).",
  ],
  [
    "Nilai minimum y = x² − 4x + 3 adalah …",
    "−1",
    "1",
    "2",
    "3",
    "Substitusikan x = 2.",
  ],
  [
    "Grafik y = −x² terbuka ke …",
    "bawah",
    "atas",
    "kanan",
    "kiri",
    "Periksa tanda koefisien x².",
  ],
  [
    "Jika diskriminan negatif, akar real berjumlah …",
    "0",
    "1",
    "2",
    "3",
    "Akar kuadrat bilangan negatif bukan bilangan real.",
  ],
  [
    "Akar x² − 4x + 4 = 0 adalah …",
    "2 (kembar)",
    "−2 (kembar)",
    "0 dan 4",
    "−4 dan 4",
    "Faktorkan sebagai kuadrat sempurna.",
  ],
  [
    "Persamaan berakar 1 dan 4 adalah …",
    "x² − 5x + 4 = 0",
    "x² + 5x + 4 = 0",
    "x² − 4x + 5 = 0",
    "x² + x − 4 = 0",
    "Kalikan (x − 1)(x − 4).",
  ],
  [
    "Diskriminan 2x² − 3x + 1 = 0 adalah …",
    "1",
    "−1",
    "9",
    "17",
    "Gunakan (−3)² − 4(2)(1).",
  ],
];
const computing = [
  [
    "Memecah masalah besar menjadi bagian kecil disebut …",
    "dekomposisi",
    "enkripsi",
    "kompilasi",
    "iterasi",
    "Pikirkan pembagian masalah menjadi submasalah.",
  ],
  [
    "Mencari kemiripan pada beberapa masalah disebut …",
    "pengenalan pola",
    "penghapusan data",
    "debugging",
    "kompresi",
    "Temukan ciri yang berulang.",
  ],
  [
    "Mengabaikan detail yang tidak relevan disebut …",
    "abstraksi",
    "dekripsi",
    "duplikasi",
    "instalasi",
    "Fokus pada informasi penting saja.",
  ],
  [
    "Urutan langkah logis penyelesaian masalah disebut …",
    "algoritma",
    "perangkat keras",
    "basis data",
    "jaringan",
    "Langkah harus jelas dan terurut.",
  ],
  [
    "Hasil 7 mod 3 adalah …",
    "1",
    "2",
    "3",
    "4",
    "Mod menghasilkan sisa pembagian.",
  ],
  [
    "Jika x = 3 lalu x = x + 2, nilai akhir x adalah …",
    "5",
    "3",
    "2",
    "6",
    "Gunakan nilai x sebelumnya di ruas kanan.",
  ],
  [
    "Percabangan digunakan untuk …",
    "memilih aksi berdasarkan kondisi",
    "mengulang tanpa syarat",
    "menyimpan gambar",
    "menghapus program",
    "Perhatikan struktur if dan else.",
  ],
  [
    "Loop sebanyak 4 kali yang menambah 2 dari nilai 0 menghasilkan …",
    "8",
    "4",
    "6",
    "10",
    "Tambahkan 2 empat kali.",
  ],
  [
    "Nilai logika true AND false adalah …",
    "false",
    "true",
    "2",
    "null",
    "AND benar hanya jika keduanya benar.",
  ],
  [
    "Pencarian linear memeriksa data secara …",
    "berurutan",
    "acak saja",
    "selalu membagi dua",
    "tanpa membaca data",
    "Elemen diperiksa satu per satu.",
  ],
  [
    "Pengurutan menaik [3,1,2] menghasilkan …",
    "[1,2,3]",
    "[3,2,1]",
    "[2,1,3]",
    "[1,3,2]",
    "Susun dari nilai terkecil.",
  ],
  [
    "Algoritma yang baik harus berakhir setelah langkah …",
    "berhingga",
    "tak terbatas",
    "acak",
    "kosong",
    "Algoritma memiliki sifat terminasi.",
  ],
  [
    "Menguji langkah algoritma secara manual disebut …",
    "dry run",
    "download",
    "rendering",
    "backup",
    "Telusuri nilai variabel langkah demi langkah.",
  ],
];
export async function seedBattle() {
  const modules = await db.collection("tb_modul").get();
  if (modules.empty)
    throw new Error(
      "Modul belum disiapkan Anggota 1. Seed battle tidak membuat modul.",
    );
  const batch = db.batch();
  for (const hero of ["knight", "mage", "archer"])
    batch.set(db.collection("tb_karakter").doc(hero), {
      id_karakter: hero,
      nama_karakter: hero,
      hp_awal: 3,
      atk_awal: 10,
    });
  for (const card of CARDS)
    batch.set(db.collection("tb_kartu_buff").doc(card.id), {
      ...card,
      id_kartu_buff: card.id,
      nama_kartu: card.name,
      class_kartu: card.heroClass,
      deskripsi_efek: card.description,
    });
  for (const module of modules.docs) {
    const data = module.data();
    const name = String(data.nama_modul).toLowerCase();
    const bank = name.includes("kuadrat")
      ? quadratic
      : String(data.mata_pelajaran).toLowerCase().includes("informatika")
        ? computing
        : exponent;
    const stages = [1, 2, 3, 4, 5, 5, 6, 7, 8, 9, 10, 10, 10];
    bank.forEach(([pertanyaan, correct, ...rest], index) => {
      const hint = rest.pop()!;
      const answers = [correct, ...rest];
      const offset = index % 4;
      const options = answers.map((_, i) => answers[(i - offset + 4) % 4]);
      const stage = stages[index];
      const order = index === 5 ? 2 : index >= 10 ? index - 9 : 1;
      batch.set(
        db.collection("tb_soal").doc(`battle_${module.id}_${index + 1}`),
        {
          id_soal: `battle_${module.id}_${index + 1}`,
          id_modul: module.id,
          stage,
          nomor_stage: stage,
          urutan_soal: order,
          pertanyaan,
          opsi_a: options[0],
          opsi_b: options[1],
          opsi_c: options[2],
          opsi_d: options[3],
          kunci_jawaban: OPTIONS[offset],
          petunjuk: hint,
          exp_hadiah: stage === 10 ? 50 : stage === 5 ? 25 : 10,
        },
      );
    });
  }
  await batch.commit();
  console.log(
    `Battle seed: 3 Classes, 12 kartu, ${modules.size * 13} soal. Modul/profil/badge tidak diubah.`,
  );
}
if (require.main === module)
  seedBattle()
    .then(() => process.exit(0))
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
