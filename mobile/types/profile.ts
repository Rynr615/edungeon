// mobile/types/profile.ts

export interface UserProfileData {
  id_user: string;
  nama: string;
  username: string;
  email: string;
  kelas: string;
  avatar: string;
  total_exp: number;
  level: number;
  exp_in_level: number;
  next_level_exp: number;
  akurasi: number;
  monster_dikalahkan: number;
  boss_dikalahkan: number;
  audio_aktif: boolean;
  volume_audio: number;
  created_at?: string;
  updated_at?: string;
}

export interface LeaderboardEntry {
  rank: number;
  id_user: string;
  nama: string;
  username: string;
  kelas: string;
  avatar: string;
  total_exp: number;
  level: number;
}

export interface LeaderboardResponse {
  leaderboard: LeaderboardEntry[];
  user_rank: number | null;
}

export interface BadgeItem {
  id_badge: string;
  kode: string;
  nama: string;
  deskripsi: string;
  kategori: "klasik" | "usulan_baru";
  tier: "bronze" | "silver" | "gold" | "ruby";
  class_khusus?: "Knight" | "Mage" | "Archer" | null;
  icon_name: string;
  unlocked: boolean;
  tgl_perolehan: string | null;
}

export interface CardItem {
  id_kartu: string;
  kode_kartu: string;
  nama_kartu: string;
  deskripsi: string;
  class_kartu: string;
  tipe_efek: string;
  unlocked: boolean;
  tgl_didapat: string | null;
}

export interface UpdateProfilePayload {
  nama: string;
  kelas?: string;
  avatar?: string;
}

export interface UpdateSettingsPayload {
  audio_aktif?: boolean;
  volume_audio?: number;
}
