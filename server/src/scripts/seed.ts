// server/src/scripts/seed.ts
import { db } from "../config/firebase.js";

async function seedDatabase() {
  console.log("[SEED] Memulai seeding data ke Firestore...");

  try {
    // 1. Seed Karakter
    const karakterData = [
      {
        id_karakter: "knight",
        nama_karakter: "Knight",
        hp_awal: 3,
        atk_awal: 10,
        nama_skill: "Shield",
        deskripsi_skill: "Menyerap 1 serangan balik sepenuhnya. Pulih 1 charge di awal stage (kapasitas 1).",
        skill_params: { shield_cap: 1, mg_charges: 0 },
      },
      {
        id_karakter: "mage",
        nama_karakter: "Mage",
        hp_awal: 3,
        atk_awal: 10,
        nama_skill: "Magnifying Glass",
        deskripsi_skill: "Menghapus 2 opsi salah pada 1 soal. Mulai dengan 3 charge, restock 1 charge per 2 stage.",
        skill_params: { shield_cap: 0, mg_charges: 3, mg_max: 3 },
      },
      {
        id_karakter: "archer",
        nama_karakter: "Archer",
        hp_awal: 3,
        atk_awal: 10,
        nama_skill: "Dodge",
        deskripsi_skill: "Peluang menghindari serangan balik (Stage 1-2: 30%, 3-4: 40%, 5-6: 50%, 7-8: 60%, 9-10: 70%).",
        skill_params: { dodge_rates: [0.3, 0.3, 0.4, 0.4, 0.5, 0.5, 0.6, 0.6, 0.7, 0.7] },
      },
    ];

    for (const k of karakterData) {
      await db.collection("tb_karakter").doc(k.id_karakter).set(k);
    }
    console.log("[SEED] tb_karakter berhasil diisi.");

    // 2. Seed 12 Kartu Buff
    const kartuData = [
      { id_kartu_buff: "K01", kode_kartu: "K01", nama_kartu: "Vitalitas Tempur", class_kartu: "Knight", tipe_efek: "stat_buff", deskripsi_efek: "+1 Max HP dan +1 HP saat dipilih.", efek_params: { max_hp_add: 1, heal: 1 } },
      { id_kartu_buff: "K02", kode_kartu: "K02", nama_kartu: "Magnifying Glass Cadangan", class_kartu: "Mage", tipe_efek: "skill_upgrade", deskripsi_efek: "+1 charge Magnifying Glass, kapasitas max 4.", efek_params: { mg_cap_add: 1, mg_charge_add: 1 } },
      { id_kartu_buff: "K03", kode_kartu: "K03", nama_kartu: "Langkah Lincah", class_kartu: "Archer", tipe_efek: "dodge_buff", deskripsi_efek: "+10% Dodge rate (hard cap 70%).", efek_params: { dodge_add: 0.1 } },
      { id_kartu_buff: "K04", kode_kartu: "K04", nama_kartu: "Ramuan Pemulihan", class_kartu: "Common", tipe_efek: "heal_or_buffer", deskripsi_efek: "Pulihkan 1 HP. Jika HP penuh, dapat buffer 1 serangan.", efek_params: { heal: 1, buffer: 1 } },
      { id_kartu_buff: "K05", kode_kartu: "K05", nama_kartu: "Charge Perisai Tambahan", class_kartu: "Knight", tipe_efek: "shield_upgrade", deskripsi_efek: "+1 kapasitas Shield (max 2). Pulih 1 charge per stage.", efek_params: { shield_cap_add: 1 } },
      { id_kartu_buff: "K06", kode_kartu: "K06", nama_kartu: "Fokus Mantra", class_kartu: "Mage", tipe_efek: "speed_damage", deskripsi_efek: "ATK +2 (Damage 12) jika jawaban benar < 10 detik.", efek_params: { time_threshold: 10, bonus_atk: 2 } },
      { id_kartu_buff: "K07", kode_kartu: "K07", nama_kartu: "Critical Strike", class_kartu: "Archer", tipe_efek: "crit_chance", deskripsi_efek: "25% peluang serangan benar memberi 20 damage.", efek_params: { crit_chance: 0.25, crit_damage: 20 } },
      { id_kartu_buff: "K08", kode_kartu: "K08", nama_kartu: "Kesempatan Belajar", class_kartu: "Common", tipe_efek: "single_retry", deskripsi_efek: "Satu kali jawab ulang soal yang sama tanpa serangan balik pertama.", efek_params: { single_use: true } },
      { id_kartu_buff: "K09", kode_kartu: "K09", nama_kartu: "Waktu Tambahan", class_kartu: "Common", tipe_efek: "timer_extend", deskripsi_efek: "Batas waktu +10 detik (total 30 detik per soal).", efek_params: { extra_time: 10 } },
      { id_kartu_buff: "K10", kode_kartu: "K10", nama_kartu: "Serangan Balasan", class_kartu: "Knight", tipe_efek: "counter_atk", deskripsi_efek: "30% peluang memberi 5 damage ke musuh saat salah jawab.", efek_params: { counter_chance: 0.3, counter_damage: 5 } },
      { id_kartu_buff: "K11", kode_kartu: "K11", nama_kartu: "Ingatan Arcane", class_kartu: "Mage", tipe_efek: "single_mark_wrong", deskripsi_efek: "Sekali per modul tandai 1 opsi salah.", efek_params: { single_use: true } },
      { id_kartu_buff: "K12", kode_kartu: "K12", nama_kartu: "Bidikan Terarah", class_kartu: "Archer", tipe_efek: "single_remove_option", deskripsi_efek: "Sekali per modul hapus 1 opsi salah.", efek_params: { single_use: true } },
    ];

    for (const kt of kartuData) {
      await db.collection("tb_kartu_buff").doc(kt.id_kartu_buff).set(kt);
    }
    console.log("[SEED] tb_kartu_buff berhasil diisi.");

    // 3. Seed 15 Badge
    const badgeData = [
      { id_badge: "B01", nama_badge: "The Journey Begins", deskripsi: "Selesaikan Stage 1-1 untuk pertama kali.", class_khusus: null },
      { id_badge: "B02", nama_badge: "Monster Slayer", deskripsi: "Kalahkan total 10 monster biasa.", class_khusus: null },
      { id_badge: "B03", nama_badge: "Mid-Boss Crusher", deskripsi: "Kalahkan Mid-Boss Stage 5 untuk pertama kali.", class_khusus: null },
      { id_badge: "B04", nama_badge: "Math Grandmaster", deskripsi: "Kalahkan Last Boss Stage 10 dan selesaikan Stage 1-10 dalam 1 run.", class_khusus: null },
      { id_badge: "B05", nama_badge: "Sharpshooter", deskripsi: "Jawab 10 pertanyaan berturut-turut dengan benar dalam 1 run.", class_khusus: null },
      { id_badge: "B06", nama_badge: "Deck Collector", deskripsi: "Pilih 5 ID kartu berbeda secara kumulatif.", class_khusus: null },
      { id_badge: "B07", nama_badge: "Lightning Mind", deskripsi: "Jawab benar pada Boss dengan waktu terpakai < 5 detik.", class_khusus: null },
      { id_badge: "B08", nama_badge: "Untouchable", deskripsi: "Kalahkan Mid-Boss atau Last Boss tanpa jawaban salah.", class_khusus: null },
      { id_badge: "B09", nama_badge: "True Scholar", deskripsi: "Buka dan selesaikan seluruh Modul Materi di Home.", class_khusus: null },
      { id_badge: "B10", nama_badge: "Living on the Edge", deskripsi: "Saat Boss dikalahkan, HP utama tepat 1.", class_khusus: null },
      { id_badge: "B11", nama_badge: "Benteng Baja", deskripsi: "Shield Knight menyerap 3 serangan balik dalam 1 run.", class_khusus: "Knight" },
      { id_badge: "B12", nama_badge: "Arkanis Terampil", deskripsi: "Gunakan skill Mage/K11 lalu kalahkan Last Boss.", class_khusus: "Mage" },
      { id_badge: "B13", nama_badge: "Jejak Hening", deskripsi: "Dodge Archer berhasil hindari 3 serangan balik lalu kalahkan Boss.", class_khusus: "Archer" },
      { id_badge: "B14", nama_badge: "Kolektor Serbabisa", deskripsi: "Pilih minimal 1 kartu Class dan 1 kartu Common.", class_khusus: null },
      { id_badge: "B15", nama_badge: "Tanpa Pergantian", deskripsi: "Selesaikan 5 modul menggunakan Class yang sama.", class_khusus: null },
    ];

    for (const b of badgeData) {
      await db.collection("tb_badge").doc(b.id_badge).set(b);
    }
    console.log("[SEED] tb_badge berhasil diisi.");

    // 4. Seed Modul
    const modulData = [
      {
        id_modul: "modul_1",
        nama_modul: "Eksponen dan Logaritma",
        mata_pelajaran: "Matematika",
        teks_catatan: "Eksponen adalah bentuk perkalian berulang dari suatu bilangan yang sama. Logaritma adalah kebalikan dari eksponen.",
        url_youtube: "https://www.youtube.com/watch?v=sample1",
        id_modul_prasyarat: "",
      },
      {
        id_modul: "modul_2",
        nama_modul: "Algoritma dan Pemrograman",
        mata_pelajaran: "Informatika",
        teks_catatan: "Algoritma adalah urutan langkah logis untuk menyelesaikan masalah. Pemrograman menerjemahkan algoritma ke bahasa komputer.",
        url_youtube: "https://www.youtube.com/watch?v=sample2",
        id_modul_prasyarat: "modul_1",
      },
    ];

    for (const m of modulData) {
      await db.collection("tb_modul").doc(m.id_modul).set(m);
    }
    console.log("[SEED] tb_modul berhasil diisi.");

    // 5. Seed Soal Modul 1 (13 Soal: Stage 1-4, Stage 5 [2 soal], Stage 6-9, Stage 10 [3 soal])
    const soalModul1 = [
      { id_modul: "modul_1", nomor_stage: 1, urutan_soal: 1, pertanyaan: "Berapa hasil dari 2^3?", opsi_a: "6", opsi_b: "8", opsi_c: "9", opsi_d: "12", kunci_jawaban: "B", petunjuk: "2 x 2 x 2", nama_monster: "Goblin Eksponen", exp_hadiah: 10 },
      { id_modul: "modul_1", nomor_stage: 2, urutan_soal: 1, pertanyaan: "Berapa hasil dari 3^2 + 4^2?", opsi_a: "14", opsi_b: "25", opsi_c: "12", opsi_d: "49", kunci_jawaban: "B", petunjuk: "9 + 16", nama_monster: "Orc Perkalian", exp_hadiah: 10 },
      { id_modul: "modul_1", nomor_stage: 3, urutan_soal: 1, pertanyaan: "Nilai dari 5^0 adalah...", opsi_a: "0", opsi_b: "1", opsi_c: "5", opsi_d: "undefined", kunci_jawaban: "B", petunjuk: "Semua bilangan pangkat 0 adalah 1", nama_monster: "Slime Nol", exp_hadiah: 10 },
      { id_modul: "modul_1", nomor_stage: 4, urutan_soal: 1, pertanyaan: "Bentuk sederhana dari (a^2)^3 adalah...", opsi_a: "a^5", opsi_b: "a^6", opsi_c: "a^8", opsi_d: "a^9", kunci_jawaban: "B", petunjuk: "Kalikan pangkatnya: 2 x 3", nama_monster: "Skeleton Pangkat", exp_hadiah: 10 },
      
      // Stage 5 (Mid-Boss 20 HP - 2 Soal)
      { id_modul: "modul_1", nomor_stage: 5, urutan_soal: 1, pertanyaan: "[Mid-Boss 1/2] Nilai dari ^2log 8 adalah...", opsi_a: "2", opsi_b: "3", opsi_c: "4", opsi_d: "8", kunci_jawaban: "B", petunjuk: "2 pangkat berapa yang menghasilkan 8?", nama_monster: "Minotaur Logaritma", exp_hadiah: 20 },
      { id_modul: "modul_1", nomor_stage: 5, urutan_soal: 2, pertanyaan: "[Mid-Boss 2/2] Jika 3^x = 27, berapa nilai x?", opsi_a: "2", opsi_b: "3", opsi_c: "4", opsi_d: "9", kunci_jawaban: "B", petunjuk: "3 x 3 x 3 = 27", nama_monster: "Minotaur Logaritma", exp_hadiah: 20 },
      
      { id_modul: "modul_1", nomor_stage: 6, urutan_soal: 1, pertanyaan: "Berapa nilai ^10log 100?", opsi_a: "1", opsi_b: "2", opsi_c: "10", opsi_d: "100", kunci_jawaban: "B", petunjuk: "10^2 = 100", nama_monster: "Harpy Log", exp_hadiah: 10 },
      { id_modul: "modul_1", nomor_stage: 7, urutan_soal: 1, pertanyaan: "Bentuk rasional dari 1 / sqrt(2) adalah...", opsi_a: "sqrt(2)", opsi_b: "1/2 sqrt(2)", opsi_c: "2 sqrt(2)", opsi_d: "1/4", kunci_jawaban: "B", petunjuk: "Kalikan dengan sqrt(2)/sqrt(2)", nama_monster: "Golem Akar", exp_hadiah: 10 },
      { id_modul: "modul_1", nomor_stage: 8, urutan_soal: 1, pertanyaan: "Nilai dari ^3log 9 + ^3log 3 adalah...", opsi_a: "2", opsi_b: "3", opsi_c: "4", opsi_d: "5", kunci_jawaban: "B", petunjuk: "2 + 1 = 3", nama_monster: "Drake Penjumlahan", exp_hadiah: 10 },
      { id_modul: "modul_1", nomor_stage: 9, urutan_soal: 1, pertanyaan: "Berapa 4^(3/2)?", opsi_a: "6", opsi_b: "8", opsi_c: "12", opsi_d: "16", kunci_jawaban: "B", petunjuk: "(sqrt(4))^3 = 2^3", nama_monster: "Demon Pecahan", exp_hadiah: 10 },
      
      // Stage 10 (Last Boss 30 HP - 3 Soal)
      { id_modul: "modul_1", nomor_stage: 10, urutan_soal: 1, pertanyaan: "[Last Boss 1/3] Nilai dari ^2log 4 + ^2log 16 adalah...", opsi_a: "5", opsi_b: "6", opsi_c: "7", opsi_d: "8", kunci_jawaban: "B", petunjuk: "2 + 4 = 6", nama_monster: "Dragon Lord Logarithm", exp_hadiah: 30 },
      { id_modul: "modul_1", nomor_stage: 10, urutan_soal: 2, pertanyaan: "[Last Boss 2/3] Jika ^xlog 64 = 3, maka x adalah...", opsi_a: "3", opsi_b: "4", opsi_c: "8", opsi_d: "16", kunci_jawaban: "B", petunjuk: "x^3 = 64 -> 4^3 = 64", nama_monster: "Dragon Lord Logarithm", exp_hadiah: 30 },
      { id_modul: "modul_1", nomor_stage: 10, urutan_soal: 3, pertanyaan: "[Last Boss 3/3] Bentuk sederhana dari a^5 * a^-2 adalah...", opsi_a: "a^-10", opsi_b: "a^3", opsi_c: "a^7", opsi_d: "a^10", kunci_jawaban: "B", petunjuk: "5 + (-2) = 3", nama_monster: "Dragon Lord Logarithm", exp_hadiah: 30 },
    ];

    for (const s of soalModul1) {
      await db.collection("tb_soal").add(s);
    }
    console.log("[SEED] tb_soal Modul 1 berhasil diisi (13 soal).");

    console.log("[SEED] Proses seeding database SELESAI dengan sukses!");
    process.exit(0);
  } catch (error) {
    console.error("[SEED] Error saat melakukan seeding:", error);
    process.exit(1);
  }
}

seedDatabase();