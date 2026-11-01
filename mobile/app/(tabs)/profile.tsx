// mobile/app/(tabs)/profile.tsx
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  ScrollView,
  RefreshControl,
  Alert,
  ActivityIndicator,
  Text,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import {
  UserProfile,
  ProfileStats,
  EditProfilePayload,
  AudioSettingsPayload,
} from "../../types/profile";
import { profileService, calculateProfileStats } from "../../services/profileService";
import {
  ProfileHeader,
  StatOverviewCard,
  KoleksiCard,
  ProfileMenuList,
  EditProfileView,
  AudioSettingsModal,
} from "../../components/profile";

export default function ProfileScreen() {
  const { userProfile, logoutUser, updateLocalProfile } = useAuth();

  // Navigation view: "main" (Image 2) vs "edit_profile" (Image 1)
  const [currentView, setCurrentView] = useState<"main" | "edit_profile">("main");

  // State Data Profil
  const [activeUser, setActiveUser] = useState<UserProfile | null>(userProfile);
  const [stats, setStats] = useState<ProfileStats | null>(
    userProfile ? calculateProfileStats(userProfile) : null
  );

  // Modal & Loading States
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [isSettingsModalVisible, setIsSettingsModalVisible] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Sinkronisasi data saat userProfile context berubah
  useEffect(() => {
    if (userProfile) {
      setActiveUser(userProfile);
      setStats(calculateProfileStats(userProfile));
    }
  }, [userProfile]);

  // Load Data Profil dari Server
  const loadProfileData = useCallback(async () => {
    try {
      const fullData = await profileService.getFullProfileData();
      setActiveUser(fullData.user);
      setStats(fullData.stats);
    } catch (error) {
      console.warn("[ProfileScreen] Fallback data lokal:", error);
      if (userProfile) {
        setActiveUser(userProfile);
        setStats(calculateProfileStats(userProfile));
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [userProfile]);

  useEffect(() => {
    loadProfileData();
  }, [loadProfileData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadProfileData();
  }, [loadProfileData]);

  // Handler Simpan Data Edit Profil
  const handleSaveProfile = async (payload: EditProfilePayload) => {
    setIsSaving(true);
    try {
      const updated = await profileService.updateProfile(payload);
      setActiveUser(updated);
      setStats(calculateProfileStats(updated));
      updateLocalProfile(updated);
      Alert.alert("Sukses", "Informasi profil berhasil diperbarui!");
    } catch (err: any) {
      console.error("[ProfileScreen] Error update profile:", err);
      Alert.alert("Gagal", err.message || "Gagal memperbarui profil.");
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  // Handler Simpan Pengaturan Suara
  const handleSaveSettings = async (payload: AudioSettingsPayload) => {
    setIsSaving(true);
    try {
      await profileService.updateSettings(payload);
      if (activeUser) {
        const updated = {
          ...activeUser,
          audio_aktif: payload.audio_aktif,
          volume_audio: payload.volume_audio,
        };
        setActiveUser(updated);
        updateLocalProfile(updated);
      }
      Alert.alert("Sukses", "Pengaturan suara berhasil disimpan!");
    } catch (err: any) {
      console.error("[ProfileScreen] Error update settings:", err);
      Alert.alert("Gagal", err.message || "Gagal menyimpan pengaturan suara.");
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  // Handler Konfirmasi Logout
  const handleLogoutPress = () => {
    Alert.alert(
      "Konfirmasi Keluar",
      "Apakah kamu yakin ingin keluar dari akun Edungeon?",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Keluar",
          style: "destructive",
          onPress: async () => {
            try {
              await logoutUser();
            } catch (err: any) {
              Alert.alert("Error", "Gagal melakukan logout.");
            }
          },
        },
      ]
    );
  };

  if (loading && !activeUser) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#0f172a" />
        <Text className="text-gray-500 text-xs mt-3 font-mono">Memuat Profil...</Text>
      </View>
    );
  }

  // JIKA TAMPILAN: EDIT PROFILE (IMAGE 1)
  if (currentView === "edit_profile") {
    return (
      <View className="flex-1 bg-white">
        <EditProfileView
          user={activeUser}
          onBack={() => setCurrentView("main")}
          onSave={handleSaveProfile}
          loading={isSaving}
        />
      </View>
    );
  }

  // TAMPILAN UTAMA: PROFILE WIREFRAME (IMAGE 2)
  return (
    <View className="flex-1 bg-white">
      <ScrollView
        className="flex-1 px-5 pt-8"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#0f172a"
            colors={["#0f172a"]}
          />
        }
      >
        {/* 1. Header Profil (Title "Profile", Avatar, Nama, ⭐ Level 15, Cog Button, 30% Progress Bar) */}
        <ProfileHeader
          user={activeUser}
          stats={stats}
          onSettingsPress={() => setIsSettingsModalVisible(true)}
        />

        {/* 2. Section "Statistik" (2x2 Grid: 24 Monster, 2 Boss, 85% Akurasi, 3-1 Stage) */}
        <StatOverviewCard stats={stats} />

        {/* 3. Section "Koleksi" (3 Buff Cards: ATK+2, HP+15, DEF+4 + 4 Badges Bulat) */}
        <KoleksiCard />

        {/* 4. Menu List (Edit Profile dengan ⚠️, Settings, Log out) */}
        <ProfileMenuList
          onEditProfilePress={() => setCurrentView("edit_profile")}
          onSettingsPress={() => setIsSettingsModalVisible(true)}
          onLogoutPress={handleLogoutPress}
        />
      </ScrollView>

      {/* Modal Pengaturan Suara (Clean White Wireframe) */}
      <AudioSettingsModal
        visible={isSettingsModalVisible}
        audioAktif={activeUser?.audio_aktif ?? true}
        volumeAudio={activeUser?.volume_audio ?? 1.0}
        onClose={() => setIsSettingsModalVisible(false)}
        onSave={handleSaveSettings}
        loading={isSaving}
      />
    </View>
  );
}