// mobile/types/profile.ts

export type BadgeCategory = "klasik" | "boss" | "streak" | "spesialis";
export type BadgeTier = "bronze" | "silver" | "gold" | "platinum";

export interface UserProfile {
  id_user: string;
  nama: string;
  nama_panggilan?: string;
  username: string;
  email: string;
  kelas: string;
  no_hp?: string;
  avatar: string;
  total_exp: number;
  level: number;
  exp_in_level: number;
  next_level_exp: number;
  akurasi: number;
  monster_dikalahkan: number;
  boss_dikalahkan: number;
  highest_stage?: string;
  audio_aktif: boolean;
  volume_audio: number;
  created_at?: string;
  updated_at?: string;
}

export interface UpdateProfileDTO {
  nama: string;
  nama_panggilan?: string;
  kelas?: string;
  no_hp?: string;
  avatar?: string;
}

export interface BadgeItem {
  id_badge: string;
  kode: string;
  nama: string;
  deskripsi: string;
  kategori: BadgeCategory;
  tier: BadgeTier;
  class_khusus: string | null;
  icon_name: string;
  unlocked: boolean;
  tgl_perolehan: string | null;
}

export interface CardCollectionItem {
  id_kartu: string;
  kode_kartu: string;
  nama_kartu: string;
  deskripsi: string;
  class_kartu: string;
  tipe_efek: string;
  unlocked: boolean;
  tgl_didapat: string | null;
}

export interface LeaderboardUser {
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
  leaderboard: LeaderboardUser[];
  user_rank: number | null;
}

export interface AudioSettingsDTO {
  audio_aktif?: boolean;
  volume_audio?: number;
}
