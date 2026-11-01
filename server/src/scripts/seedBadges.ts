// server/src/scripts/seedBadges.ts
import { db } from "../config/firebase.js";

export interface BadgeSeedData {
  id_badge: string;
  kode: string;
  nama: string;
  deskripsi: string;
  kategori: "klasik" | "usulan_baru";
  tier: "bronze" | "silver" | "gold" | "ruby";
  class_khusus?: "Knight" | "Mage" | "Archer" | null;
  icon_name: string;
}

export const BADGES_DATA: BadgeSeedData[] = [
  // 10 Badge Klasik
  {
    id_badge: "the_journey_begins",
    kode: "B01",
    nama: "The Journey Begins",
    deskripsi: "Selesaikan Stage 1-1 untuk pertama kali pada modul mana pun.",
    kategori: "klasik",
    tier: "bronze",
    class_khusus: null,
    icon_name: "FlagIcon",
  },
  {
    id_badge: "monster_slayer",
    kode: "B02",
    nama: "Monster Slayer",
    deskripsi: "Kalahkan total 10 monster biasa (Mid-Boss dan Last Boss tidak dihitung).",
    kategori: "klasik",
    tier: "silver",
    class_khusus: null,
    icon_name: "FireIcon",
  },
  {
    id_badge: "mid_boss_crusher",
    kode: "B03",
    nama: "Mid-Boss Crusher",
    deskripsi: "Kalahkan Mid-Boss Stage 5 untuk pertama kali pada modul mana pun.",
    kategori: "klasik",
    tier: "silver",
    class_khusus: null,
    icon_name: "ShieldExclamationIcon",
  },
  {
    id_badge: "math_grandmaster",
    kode: "B04",
    nama: "Math Grandmaster",
    deskripsi: "Kalahkan Last Boss Stage 10 dan selesaikan semua Stage 1-10 dalam satu run.",
    kategori: "klasik",
    tier: "ruby",
    class_khusus: null,
    icon_name: "TrophyIcon",
  },
  {
    id_badge: "sharpshooter",
    kode: "B05",
    nama: "Sharpshooter",
    deskripsi: "Jawab 10 pertanyaan berturut-turut dengan benar dalam satu run.",
    kategori: "klasik",
    tier: "gold",
    class_khusus: null,
    icon_name: "CheckBadgeIcon",
  },
  {
    id_badge: "deck_collector",
    kode: "B06",
    nama: "Deck Collector",
    deskripsi: "Pilih lima ID kartu buff berbeda secara kumulatif lintas modul.",
    kategori: "klasik",
    tier: "gold",
    class_khusus: null,
    icon_name: "Square3Stack3DIcon",
  },
  {
    id_badge: "lightning_mind",
    kode: "B07",
    nama: "Lightning Mind",
    deskripsi: "Jawab benar pada pertanyaan Mid-Boss atau Last Boss dengan waktu terpakai <5 detik.",
    kategori: "klasik",
    tier: "gold",
    class_khusus: null,
    icon_name: "BoltIcon",
  },
  {
    id_badge: "untouchable",
    kode: "B08",
    nama: "Untouchable",
    deskripsi: "Kalahkan Mid-Boss atau Last Boss tanpa jawaban salah selama encounter Boss.",
    kategori: "klasik",
    tier: "ruby",
    class_khusus: null,
    icon_name: "SparklesIcon",
  },
  {
    id_badge: "true_scholar",
    kode: "B09",
    nama: "True Scholar",
    deskripsi: "Buka dan selesaikan seluruh Modul Materi yang tersedia di Halaman Home.",
    kategori: "klasik",
    tier: "ruby",
    class_khusus: null,
    icon_name: "AcademicCapIcon",
  },
  {
    id_badge: "living_on_the_edge",
    kode: "B10",
    nama: "Living on the Edge",
    deskripsi: "Kalahkan Boss saat HP utama tersisa tepat 1 hati.",
    kategori: "klasik",
    tier: "gold",
    class_khusus: null,
    icon_name: "HeartIcon",
  },

  // 5 Badge Usulan Baru
  {
    id_badge: "benteng_baja",
    kode: "B11",
    nama: "Benteng Baja",
    deskripsi: "Shield menyerap 3 serangan balik dalam satu run.",
    kategori: "usulan_baru",
    tier: "silver",
    class_khusus: "Knight",
    icon_name: "ShieldCheckIcon",
  },
  {
    id_badge: "arkanis_terampil",
    kode: "B12",
    nama: "Arkanis Terampil",
    deskripsi: "Gunakan skill Magnifying Glass atau Ingatan Arcane minimal sekali lalu kalahkan Last Boss.",
    kategori: "usulan_baru",
    tier: "silver",
    class_khusus: "Mage",
    icon_name: "MagnifyingGlassIcon",
  },
  {
    id_badge: "jejak_hening",
    kode: "B13",
    nama: "Jejak Hening",
    deskripsi: "Dodge berhasil menghindari 3 serangan balik dalam satu run, lalu kalahkan Boss.",
    kategori: "usulan_baru",
    tier: "silver",
    class_khusus: "Archer",
    icon_name: "EyeSlashIcon",
  },
  {
    id_badge: "kolektor_serbabisa",
    kode: "B14",
    nama: "Kolektor Serbabisa",
    deskripsi: "Lintas modul, pilih minimal 1 kartu Class dan minimal 1 kartu Common.",
    kategori: "usulan_baru",
    tier: "silver",
    class_khusus: null,
    icon_name: "RectangleStackIcon",
  },
  {
    id_badge: "tanpa_pergantian",
    kode: "B15",
    nama: "Tanpa Pergantian",
    deskripsi: "Selesaikan modul menggunakan Class yang sama tanpa mengganti Class.",
    kategori: "usulan_baru",
    tier: "gold",
    class_khusus: null,
    icon_name: "LockClosedIcon",
  },
];

export async function seedBadges(): Promise<void> {
  console.log("[SEED BADGES] Memulai inisialisasi 15 badge ke Firestore...");
  const batch = db.batch();

  for (const badge of BADGES_DATA) {
    const docRef = db.collection("tb_badge").doc(badge.id_badge);
    batch.set(docRef, badge, { merge: true });
  }

  await batch.commit();
  console.log(`[SEED BADGES] Berhasil mendaftarkan ${BADGES_DATA.length} badge ke koleksi tb_badge!`);
}

// Eksekusi jika dijalankan langsung via tsx
if (process.argv[1]?.includes("seedBadges")) {
  seedBadges()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("[SEED BADGES] Error:", err);
      process.exit(1);
    });
}
