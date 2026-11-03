// server/src/scripts/seedModules.ts
import { db } from "../config/firebase";
import { modul1Data } from "../data/modul/modul1_eksponen_logaritma";
import { modul2Data } from "../data/modul/modul2_barisan_deret";

const modul3Data = {
  id_modul: "modul_3",
  nama_modul: "Vektor",
  mata_pelajaran: "Matematika",
  urutan: 3,
  id_modul_prasyarat: "modul_2",
  ringkasan_rumus: ["\\vec{a} = \\begin{pmatrix} x \\\\ y \\end{pmatrix}", "|\\vec{a}| = \\sqrt{x^2 + y^2}"],
  sub_bab: [
    {
      id_sub_bab: "sub_3_1",
      judul: "Pengertian Skalar dan Vektor",
      tujuan_pembelajaran: "Memahami besaran vektor dan skalar dalam geometri.",
      teks_penjelasan: "Vektor adalah besaran yang memiliki besar dan arah...",
      contoh_soal: [],
      video_id: "TODO_VIDEO_ID_VEKTOR_1",
      latihan_formatif: []
    }
  ]
};

const modul4Data = {
  id_modul: "modul_4",
  nama_modul: "Trigonometri",
  mata_pelajaran: "Matematika",
  urutan: 4,
  id_modul_prasyarat: "modul_3",
  ringkasan_rumus: ["\\sin \\alpha = \\frac{\\text{depan}}{\\text{miring}}"],
  sub_bab: [
    {
      id_sub_bab: "sub_4_1",
      judul: "Perbandingan Trigonometri Segitiga Siku-Siku",
      tujuan_pembelajaran: "Memahami rasio sin, cos, tan.",
      teks_penjelasan: "Trigonometri mempelajari hubungan sudut dan sisi segitiga...",
      contoh_soal: [],
      video_id: "TODO_VIDEO_ID_TRIGONOMETRI_1",
      latihan_formatif: []
    }
  ]
};

const modul5Data = {
  id_modul: "modul_5",
  nama_modul: "Sistem Persamaan dan Pertidaksamaan Linear",
  mata_pelajaran: "Matematika",
  urutan: 5,
  id_modul_prasyarat: "modul_4",
  ringkasan_rumus: ["a_1x + b_1y = c_1"],
  sub_bab: [
    {
      id_sub_bab: "sub_5_1",
      judul: "Pemodelan Matematika & SPLDV",
      tujuan_pembelajaran: "Menyelesaikan sistem persamaan linear dua variabel.",
      teks_penjelasan: "SPLDV dapat diselesaikan dengan metode eliminasi dan substitusi...",
      contoh_soal: [],
      video_id: "TODO_VIDEO_ID_SPLDV_1",
      latihan_formatif: []
    }
  ]
};

async function seedModules() {
  console.log("[SEED MODULES] Memulai penyusunan 5 Modul Matematika secara idempoten...");
  try {
    const modules = [modul1Data, modul2Data, modul3Data, modul4Data, modul5Data];

    for (const m of modules) {
      await db.collection("tb_modul").doc(m.id_modul).set(m, { merge: true });
      console.log(`[SEED MODULES] Modul ${m.id_modul} (${m.nama_modul}) berhasil di-seed.`);
    }

    console.log("[SEED MODULES] Semua 5 modul berhasil diperbarui dengan aman!");
    process.exit(0);
  } catch (error) {
    console.error("[SEED MODULES] Gagal melakukan seeding modul:", error);
    process.exit(1);
  }
}

seedModules();