// mobile/services/profileService.ts
import { auth } from "./firebase";
import {
  UserProfile,
  UpdateProfileDTO,
  BadgeItem,
  CardCollectionItem,
  LeaderboardResponse,
  AudioSettingsDTO,
} from "../types/profile";

const BASE_URL =
  (process.env.EXPO_PUBLIC_API_URL || "http://10.0.2.2:5000") + "/api/user";

interface ApiOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: object;
}

async function request<T>(path: string, options: ApiOptions = {}): Promise<T> {
  if (!auth.currentUser) {
    throw new Error("Silakan masuk kembali untuk mengakses data profil.");
  }

  const token = await auth.currentUser.getIdToken();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  const { method = "GET", body } = options;

  try {
    const response = await fetch(`${BASE_URL}${path}`, {
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
      throw new Error(result.message || "Gagal memproses permintaan profil.");
    }

    return result.data as T;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Koneksi internet bermasalah. Silakan coba sesaat lagi.");
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

export const profileService = {
  /**
   * Mengambil data profil siswa beserta kalkulasi level, exp, dan akurasi
   */
  getProfile: (): Promise<UserProfile> => {
    return request<UserProfile>("/profile");
  },

  /**
   * Memperbarui informasi profil (nama, nama panggilan, kelas, no_hp, avatar)
   */
  updateProfile: (dto: UpdateProfileDTO): Promise<UserProfile> => {
    return request<UserProfile>("/profile", {
      method: "PUT",
      body: dto,
    });
  },

  /**
   * Mengambil peringkat 10 besar siswa dan posisi peringkat siswa aktif
   */
  getLeaderboard: (): Promise<LeaderboardResponse> => {
    return request<LeaderboardResponse>("/leaderboard");
  },

  /**
   * Mengambil daftar 15 badge (master badge + status pencapaian user)
   */
  getUserBadges: (): Promise<BadgeItem[]> => {
    return request<BadgeItem[]>("/badges");
  },

  /**
   * Mengambil katalog 12 kartu buff roguelike dan status kepemilikannya
   */
  getUserCardCollection: (): Promise<CardCollectionItem[]> => {
    return request<CardCollectionItem[]>("/card-collection");
  },

  /**
   * Mengubah preferensi audio (suara aktif & volume 0.0 - 1.0)
   */
  updateSettings: (dto: AudioSettingsDTO): Promise<{ audio_aktif?: boolean; volume_audio?: number }> => {
    return request<{ audio_aktif?: boolean; volume_audio?: number }>("/settings", {
      method: "PUT",
      body: dto,
    });
  },
};
