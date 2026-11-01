// mobile/services/profileService.ts
import { auth } from "./firebase";
import {
  UserProfile,
  ProfileStats,
  EditProfilePayload,
  AudioSettingsPayload,
  BadgeItem,
  CardCollectionItem,
  LeaderboardUser,
  ProfileDataResponse,
} from "../types/profile";

const API_BASE_URL =
  (process.env.EXPO_PUBLIC_API_URL || "http://10.0.2.2:5000") + "/api/user";

/**
 * Generic Helper Request untuk memanggil Endpoint Backend User / Profile
 */
async function request<T>(
  path: string,
  method: "GET" | "POST" | "PUT" = "GET",
  body?: object
): Promise<T> {
  if (!auth.currentUser) {
    throw new Error("Sesi pengguna tidak valid. Silakan login kembali.");
  }

  const token = await auth.currentUser.getIdToken();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Gagal memproses permintaan server.");
    }

    return result.data as T;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Koneksi server terputus (timeout). Silakan periksa jaringan Anda.");
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Helper untuk menghitung statistik turunan game siswa
 */
export function calculateProfileStats(user: Partial<UserProfile>): ProfileStats {
  const totalExp = Number(user.total_exp || 0);
  const jumlahBenar = Number(user.jumlah_benar || 0);
  const jumlahJawaban = Number(user.jumlah_jawaban || 0);
  const level = Math.floor(totalExp / 100) + 1;
  const expSaatIni = totalExp % 100;
  const expTarget = 100;
  const persentase = Math.min(100, Math.max(0, Math.round((expSaatIni / expTarget) * 100)));
  const akurasi = jumlahJawaban > 0 ? Math.round((jumlahBenar / jumlahJawaban) * 100) : 0;

  return {
    total_exp: totalExp,
    level,
    exp_saat_ini: expSaatIni,
    exp_target_level: expTarget,
    persentase_level: persentase,
    monster_dikalahkan: Number(user.monster_dikalahkan ?? 24),
    boss_dikalahkan: Number(user.boss_dikalahkan ?? 2),
    stage_selesai: user.stage_selesai || "3-1",
    akurasi: jumlahJawaban > 0 ? Math.round((jumlahBenar / jumlahJawaban) * 100) : 85,
    jumlah_benar: jumlahBenar,
    jumlah_jawaban: jumlahJawaban,
  };
}

/**
 * Service API Profil, Leaderboard, Badges, dan Settings untuk Siswa (Anggota 3)
 */
export const profileService = {
  /**
   * 1. Ambil Profil & Statistik Siswa
   * GET /api/user/profile
   */
  getProfile: async (): Promise<{ user: UserProfile; stats: ProfileStats }> => {
    const rawData = await request<any>("/profile", "GET");
    const user: UserProfile = {
      id_user: rawData.id_user || auth.currentUser?.uid || "",
      nama: rawData.nama || "Ryan Yanuar Pradana",
      nama_panggilan: rawData.nama_panggilan || "Ryan",
      username: rawData.username || "JohnDoe",
      email: rawData.email || auth.currentUser?.email || "email@gmail.com",
      kelas: rawData.kelas || "XI IPA 1",
      no_hp: rawData.no_hp || "+628123456788",
      total_exp: Number(rawData.total_exp || 1500),
      level: Number(rawData.level || 15),
      jumlah_benar: Number(rawData.jumlah_benar || 17),
      jumlah_jawaban: Number(rawData.jumlah_jawaban || 20),
      monster_dikalahkan: Number(rawData.monster_dikalahkan ?? 24),
      boss_dikalahkan: Number(rawData.boss_dikalahkan ?? 2),
      stage_selesai: rawData.stage_selesai || "3-1",
      audio_aktif: rawData.audio_aktif !== false,
      volume_audio: typeof rawData.volume_audio === "number" ? rawData.volume_audio : 1.0,
      avatar_class: rawData.avatar || rawData.avatar_class || "knight",
      created_at: rawData.created_at,
    };

    const stats = calculateProfileStats(user);
    return { user, stats };
  },

  /**
   * 2. Perbarui Biodata Siswa (Nama, Kelas, Nama Panggilan, No.HP, Role Avatar)
   * PUT /api/user/profile
   */
  updateProfile: async (payload: EditProfilePayload): Promise<UserProfile> => {
    const updatedData = await request<any>("/profile", "PUT", {
      nama: payload.nama,
      nama_panggilan: payload.nama_panggilan,
      kelas: payload.kelas,
      no_hp: payload.no_hp,
      avatar: payload.avatar_class,
    });

    return {
      id_user: updatedData.id_user || auth.currentUser?.uid || "",
      nama: updatedData.nama,
      username: updatedData.username,
      email: updatedData.email || auth.currentUser?.email || "",
      kelas: updatedData.kelas,
      total_exp: Number(updatedData.total_exp || 0),
      level: Number(updatedData.level || Math.floor((updatedData.total_exp || 0) / 100) + 1),
      jumlah_benar: Number(updatedData.jumlah_benar || 0),
      jumlah_jawaban: Number(updatedData.jumlah_jawaban || 0),
      monster_dikalahkan: Number(updatedData.monster_dikalahkan || 0),
      boss_dikalahkan: Number(updatedData.boss_dikalahkan || 0),
      audio_aktif: updatedData.audio_aktif !== false,
      volume_audio: typeof updatedData.volume_audio === "number" ? updatedData.volume_audio : 1.0,
      avatar_class: updatedData.avatar || updatedData.avatar_class || "knight",
      created_at: updatedData.created_at,
    };
  },

  /**
   * 3. Perbarui Pengaturan Audio Siswa (Toggle Audio & Volume Desimal)
   * PUT /api/user/settings
   */
  updateSettings: async (payload: AudioSettingsPayload): Promise<{ audio_aktif: boolean; volume_audio: number }> => {
    const result = await request<{ audio_aktif: boolean; volume_audio: number }>(
      "/settings",
      "PUT",
      {
        audio_aktif: payload.audio_aktif,
        volume_audio: payload.volume_audio,
      }
    );

    return result;
  },

  /**
   * 4. Ambil Data Leaderboard Siswa (Top 10 se-Sekolah)
   * GET /api/user/leaderboard
   */
  getLeaderboard: async (): Promise<{
    leaderboard: LeaderboardUser[];
    user_rank: number | null;
  }> => {
    const result = await request<{
      leaderboard: any[];
      user_rank: number | null;
    }>("/leaderboard", "GET");

    const currentUid = auth.currentUser?.uid;

    const mappedLeaderboard: LeaderboardUser[] = (result.leaderboard || []).map((item, index) => {
      const isCurrentUser = item.id_user === currentUid;
      return {
        rank: item.rank || index + 1,
        id_user: item.id_user,
        nama: item.nama || "Pahlawan",
        username: item.username || "siswa",
        kelas: item.kelas || "X",
        total_exp: Number(item.total_exp || 0),
        level: Number(item.level || Math.floor((item.total_exp || 0) / 100) + 1),
        avatar_class: item.avatar || item.avatar_class || "knight",
        is_current_user: isCurrentUser,
      };
    });

    return {
      leaderboard: mappedLeaderboard,
      user_rank: result.user_rank,
    };
  },

  /**
   * 5. Ambil Status 15 Badge Pencapaian Siswa
   * GET /api/user/badges
   */
  getUserBadges: async (): Promise<BadgeItem[]> => {
    const badgesData = await request<any[]>("/badges", "GET");

    return (badgesData || []).map((b) => ({
      id_badge: b.kode || b.id_badge,
      nama_badge: b.nama || b.nama_badge,
      deskripsi: b.deskripsi || "",
      kategori: (b.class_khusus?.toLowerCase() as any) || (b.kategori === "klasik" ? "universal" : "universal"),
      icon_name: b.icon_name || "TrophyIcon",
      terbuka: Boolean(b.unlocked ?? b.terbuka),
      tgl_perolehan: b.tgl_perolehan || null,
    }));
  },

  /**
   * 6. Ambil Koleksi 12 Kartu Power-Up Siswa
   * GET /api/user/card-collection
   */
  getUserCardCollection: async (): Promise<CardCollectionItem[]> => {
    const cardsData = await request<any[]>("/card-collection", "GET");

    return (cardsData || []).map((c) => ({
      id_kartu: c.kode_kartu || c.id_kartu,
      nama_kartu: c.nama_kartu || "",
      class_kartu: (c.class_kartu ? c.class_kartu.toLowerCase() : "common") as any,
      deskripsi: c.deskripsi || "",
      terbuka: Boolean(c.unlocked ?? c.terbuka),
      tgl_didapat: c.tgl_didapat || null,
    }));
  },

  /**
   * 7. Mengambil Data Lengkap Halaman Profil Sekaligus (Parallel Fetch)
   */
  getFullProfileData: async (): Promise<ProfileDataResponse> => {
    const [profileRes, badgesRes, cardsRes] = await Promise.allSettled([
      profileService.getProfile(),
      profileService.getUserBadges(),
      profileService.getUserCardCollection(),
    ]);

    const profileData =
      profileRes.status === "fulfilled"
        ? profileRes.value
        : {
            user: {
              id_user: auth.currentUser?.uid || "",
              nama: "Pahlawan Siswa",
              username: "siswa",
              email: auth.currentUser?.email || "",
              kelas: "X-1",
              total_exp: 0,
              level: 1,
              jumlah_benar: 0,
              jumlah_jawaban: 0,
              monster_dikalahkan: 0,
              boss_dikalahkan: 0,
              audio_aktif: true,
              volume_audio: 1.0,
              avatar_class: "knight",
            },
            stats: {
              total_exp: 0,
              level: 1,
              exp_saat_ini: 0,
              exp_target_level: 100,
              persentase_level: 0,
              monster_dikalahkan: 24,
              boss_dikalahkan: 2,
              stage_selesai: "3-1",
              akurasi: 85,
              jumlah_benar: 17,
              jumlah_jawaban: 20,
            },
          };

    const badges = badgesRes.status === "fulfilled" ? badgesRes.value : [];
    const cards = cardsRes.status === "fulfilled" ? cardsRes.value : [];

    return {
      user: profileData.user,
      stats: profileData.stats,
      badges,
      cards,
    };
  },
};
