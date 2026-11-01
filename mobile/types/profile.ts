// mobile/types/profile.ts
/**
 * Definisi Type Data untuk Modul Halaman Profile, Edit Profile,
 * Pengaturan Audio, 15 Badge Pencapaian, dan Leaderboard
 * Sesuai Acuan Wireframe dan Dokumen Spesifikasi Edungeon (Anggota 3).
 */

export type HeroClass = "knight" | "mage" | "archer";

/**
 * Data Entitas Siswa Lengkap dari tb_user
 */
export interface UserProfile {
  id_user: string;
  nama: string;
  username: string;
  email: string;
  kelas: string;
  total_exp: number;
  level: number;
  jumlah_benar: number;
  jumlah_jawaban: number;
  monster_dikalahkan: number;
  boss_dikalahkan: number;
  audio_aktif: boolean;
  volume_audio: number; // Skala 0.0 - 1.0 (0% - 100%)
  avatar_class?: HeroClass | string;
  created_at?: string;
}

/**
 * Statistik Game & Akademik Siswa untuk Grid 2x2 di Halaman Profile
 */
export interface ProfileStats {
  total_exp: number;
  level: number;
  exp_saat_ini: number; // Sisa EXP di level berjalan (misal 156)
  exp_target_level: number; // Target EXP level berikutnya (misal 200)
  persentase_level: number; // 0 - 100% untuk progress bar
  monster_dikalahkan: number;
  boss_dikalahkan: number;
  akurasi: number; // (jumlah_benar / jumlah_jawaban) * 100% (0 jika belum ada jawaban)
  jumlah_benar: number;
  jumlah_jawaban: number;
}

/**
 * Payload untuk Formulir Edit Profil (EditProfileModal)
 */
export interface EditProfilePayload {
  nama: string;
  kelas: string;
  avatar_class?: HeroClass | string;
}

/**
 * Payload untuk Formulir Pengaturan Suara (AudioSettingsModal)
 */
export interface AudioSettingsPayload {
  audio_aktif: boolean;
  volume_audio: number; // Nilai desimal 0.0 - 1.0
}

/**
 * Format Entitas Badge Prestasi (15 Badge Katalog)
 */
export interface BadgeItem {
  id_badge: string; // misal 'B01' s/d 'B15'
  nama_badge: string;
  deskripsi: string;
  kategori: "universal" | "knight" | "mage" | "archer";
  icon_name: string; // Nama icon Heroicons yang dipetakan
  terbuka: boolean; // true jika sudah diraih siswa
  tgl_perolehan?: string | null;
}

/**
 * Format Entitas Kartu Power-Up Koleksi (12 Kartu K01 - K12)
 */
export interface CardCollectionItem {
  id_kartu: string; // 'K01' s/d 'K12'
  nama_kartu: string;
  class_kartu: "knight" | "mage" | "archer" | "common";
  deskripsi: string;
  terbuka: boolean; // true jika pernah dipilih siswa sepanjang petualangan
  tgl_didapat?: string | null;
}

/**
 * Format Data Baris Siswa pada Tabel Leaderboard
 */
export interface LeaderboardUser {
  rank: number; // Peringkat #1 - #10
  id_user: string;
  nama: string;
  username: string;
  kelas: string;
  total_exp: number;
  level: number;
  avatar_class?: HeroClass | string;
  is_current_user: boolean; // Penanda untuk baris akun siswa yang sedang aktif
}

/**
 * Response Lengkap dari Endpoint Profile Backend
 */
export interface ProfileDataResponse {
  user: UserProfile;
  stats: ProfileStats;
  badges: BadgeItem[];
  cards: CardCollectionItem[];
}
