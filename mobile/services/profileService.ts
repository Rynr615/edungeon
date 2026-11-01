// mobile/services/profileService.ts
import { auth } from "./firebase";
import {
  UserProfileData,
  LeaderboardResponse,
  BadgeItem,
  CardItem,
  UpdateProfilePayload,
  UpdateSettingsPayload,
} from "../types/profile";

const API_BASE =
  (process.env.EXPO_PUBLIC_API_URL || "http://10.0.2.2:5000") + "/api/user";

async function authenticatedRequest<T>(
  path: string,
  options: { method?: "GET" | "POST" | "PUT" | "DELETE"; body?: object } = {}
): Promise<T> {
  if (!auth.currentUser) {
    throw new Error("Silakan masuk (login) terlebih dahulu.");
  }

  const token = await auth.currentUser.getIdToken();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);

  try {
    const response = await fetch(`${API_BASE}${path}`, {
      method: options.method || (options.body ? "POST" : "GET"),
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
      signal: controller.signal,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Gagal memproses data server.");
    }

    return result.data as T;
  } catch (error: any) {
    if (error?.name === "AbortError") {
      throw new Error("Koneksi timeout. Periksa koneksi Wi-Fi Anda.");
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

export const profileService = {
  getProfile: (): Promise<UserProfileData> =>
    authenticatedRequest<UserProfileData>("/profile", { method: "GET" }),

  updateProfile: (payload: UpdateProfilePayload): Promise<UserProfileData> =>
    authenticatedRequest<UserProfileData>("/profile", {
      method: "PUT",
      body: payload,
    }),

  getLeaderboard: (): Promise<LeaderboardResponse> =>
    authenticatedRequest<LeaderboardResponse>("/leaderboard", { method: "GET" }),

  getUserBadges: (): Promise<BadgeItem[]> =>
    authenticatedRequest<BadgeItem[]>("/badges", { method: "GET" }),

  getUserCardCollection: (): Promise<CardItem[]> =>
    authenticatedRequest<CardItem[]>("/card-collection", { method: "GET" }),

  updateSettings: (
    payload: UpdateSettingsPayload
  ): Promise<{ audio_aktif?: boolean; volume_audio?: number }> =>
    authenticatedRequest<{ audio_aktif?: boolean; volume_audio?: number }>(
      "/settings",
      {
        method: "PUT",
        body: payload,
      }
    ),
};
