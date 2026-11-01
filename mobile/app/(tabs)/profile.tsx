// mobile/app/(tabs)/profile.tsx
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import {
  UserProfile,
  ProfileStats,
  BadgeItem,
  CardCollectionItem,
  LeaderboardUser,
  EditProfilePayload,
  AudioSettingsPayload,
} from "../../types/profile";
import { profileService, calculateProfileStats } from "../../services/profileService";
import {
  ProfileHeader,
  StatOverviewCard,
  CardCollectionGrid,
  BadgeGallery,
  EditProfileModal,
  AudioSettingsModal,
  LeaderboardModal,
} from "../../components/profile";
import { Icon } from "../../components/ui/Icon";

export default function ProfileScreen() {
  const { userProfile, logoutUser, updateLocalProfile } = useAuth();

  // State Data Profil & Game
  const [activeUser, setActiveUser] = useState<UserProfile | null>(userProfile);
  const [stats, setStats] = useState<ProfileStats | null>(
    userProfile ? calculateProfileStats(userProfile) : null
  );
  const [badges, setBadges] = useState<BadgeItem[]>([]);
  const [cards, setCards] = useState<CardCollectionItem[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);

  // State Modal & Loading
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState<boolean>(false);
  const [isSettingsModalVisible, setIsSettingsModalVisible] = useState<boolean>(false);
  const [isLeaderboardModalVisible, setIsLeaderboardModalVisible] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState<boolean>(false);

  // Sinkronisasi jika context userProfile berubah
  useEffect(() => {
    if (userProfile) {
      setActiveUser(userProfile);
      setStats(calculateProfileStats(userProfile));
    }
  }, [userProfile]);

  // Load Data Profil Lengkap
  const loadProfileData = useCallback(async () => {
    try {
      const fullData = await profileService.getFullProfileData();
      setActiveUser(fullData.user);
      setStats(fullData.stats);
      setBadges(fullData.badges);
      setCards(fullData.cards);
    } catch (error) {
      console.warn("[ProfileScreen] Menggunakan fallback data profil lokal:", error);
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

  // Pull-to-refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadProfileData();
  }, [loadProfileData]);

  // Buka Modal Leaderboard & Fetch Data
  const handleOpenLeaderboard = async () => {
    setIsLeaderboardModalVisible(true);
    setLoadingLeaderboard(true);
    try {
      const res = await profileService.getLeaderboard();
      setLeaderboard(res.leaderboard);
    } catch (err: any) {
      console.error("[ProfileScreen] Error load leaderboard:", err);
      Alert.alert("Info", "Gagal memuat papan peringkat terbaru. Periksa koneksi internet.");
    } finally {
      setLoadingLeaderboard(false);
    }
  };

  // Simpan Edit Profil
  const handleSaveProfile = async (payload: EditProfilePayload) => {
    setIsSaving(true);
    try {
      const updated = await profileService.updateProfile(payload);
      setActiveUser(updated);
      setStats(calculateProfileStats(updated));
      updateLocalProfile(updated);
      Alert.alert("Berhasil", "Profil siswa berhasil diperbarui!");
    } catch (err: any) {
      console.error("[ProfileScreen] Gagal update profil:", err);
      Alert.alert("Gagal", err.message || "Gagal memperbarui profil siswa.");
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  // Simpan Pengaturan Suara
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
      Alert.alert("Berhasil", "Pengaturan suara berhasil disimpan!");
    } catch (err: any) {
      console.error("[ProfileScreen] Gagal simpan pengaturan suara:", err);
      Alert.alert("Gagal", err.message || "Gagal menyimpan pengaturan suara.");
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  // Konfirmasi Logout
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
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color="#eab308" />
        <Text className="text-subtext text-xs mt-3">Memuat Profil Siswa...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1 px-4 pt-12"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#eab308"
            colors={["#eab308"]}
          />
        }
      >
        {/* 1. Header Profil (Avatar, EXP Bar, Edit & Settings Action) */}
        <ProfileHeader
          user={activeUser}
          stats={stats}
          onEditPress={() => setIsEditModalVisible(true)}
          onSettingsPress={() => setIsSettingsModalVisible(true)}
        />

        {/* 2. Grid 2x2 Statistik Game (Total EXP, Monster Kalah, Akurasi, Boss Kalah) */}
        <StatOverviewCard stats={stats} />

        {/* 3. Tombol Buka Papan Peringkat (Leaderboard) */}
        <TouchableOpacity
          onPress={handleOpenLeaderboard}
          activeOpacity={0.8}
          className="bg-amber-500/15 border border-amber-500/40 p-4 rounded-2xl flex-row items-center justify-between mb-6 shadow-sm"
        >
          <View className="flex-row items-center">
            <View className="w-10 h-10 rounded-xl bg-amber-500/20 items-center justify-center mr-3">
              <Icon name="TrophyIcon" variant="solid" size={22} color="#eab308" />
            </View>
            <View>
              <Text className="text-text font-bold text-base">Papan Peringkat Siswa</Text>
              <Text className="text-subtext text-xs">Lihat 10 Besar Jawara Se-Sekolah</Text>
            </View>
          </View>
          <Icon name="ChevronRightIcon" variant="outline" size={20} color="#eab308" />
        </TouchableOpacity>

        {/* 4. Koleksi 12 Kartu Power-Up (K01 - K12) */}
        <CardCollectionGrid cards={cards} />

        {/* 5. Galeri 15 Lencana Prestasi (B01 - B15) */}
        <BadgeGallery badges={badges} />

        {/* 6. Tombol Keluar / Log Out */}
        <TouchableOpacity
          onPress={handleLogoutPress}
          activeOpacity={0.8}
          className="bg-red-500/10 border border-red-500/30 p-4 rounded-2xl flex-row items-center justify-center mb-16"
        >
          <Icon name="ArrowRightOnRectangleIcon" variant="outline" size={20} color="#ef4444" />
          <Text className="text-red-400 font-bold text-base ml-2">Keluar Akun</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* MODAL 1: Edit Profil */}
      <EditProfileModal
        visible={isEditModalVisible}
        user={activeUser}
        onClose={() => setIsEditModalVisible(false)}
        onSave={handleSaveProfile}
        loading={isSaving}
      />

      {/* MODAL 2: Pengaturan Suara */}
      <AudioSettingsModal
        visible={isSettingsModalVisible}
        audioAktif={activeUser?.audio_aktif ?? true}
        volumeAudio={activeUser?.volume_audio ?? 1.0}
        onClose={() => setIsSettingsModalVisible(false)}
        onSave={handleSaveSettings}
        loading={isSaving}
      />

      {/* MODAL 3: Leaderboard */}
      <LeaderboardModal
        visible={isLeaderboardModalVisible}
        onClose={() => setIsLeaderboardModalVisible(false)}
        leaderboardData={leaderboard}
        currentUser={activeUser}
        loading={loadingLeaderboard}
      />
    </View>
  );
}