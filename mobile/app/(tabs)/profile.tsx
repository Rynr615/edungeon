// mobile/app/(tabs)/profile.tsx
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import { Icon } from "../../components/ui/Icon";
import { THEME_COLORS } from "../../constants/theme";
import { UserProfileData, BadgeItem, CardItem } from "../../types/profile";
import { profileService } from "../../services/profileService";

import { ProfileHeader } from "../../components/profile/ProfileHeader";
import { LevelProgressBar } from "../../components/profile/LevelProgressBar";
import { StatOverviewCard } from "../../components/profile/StatOverviewCard";
import { CardCollectionGrid } from "../../components/profile/CardCollectionGrid";
import { BadgeGallery } from "../../components/profile/BadgeGallery";
import { EditProfileModal } from "../../components/profile/EditProfileModal";
import { AudioSettingsModal } from "../../components/profile/AudioSettingsModal";
import { LeaderboardModal } from "../../components/profile/LeaderboardModal";

export default function ProfileScreen() {
  const { user, userProfile, logoutUser, fetchProfile } = useAuth();

  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [cards, setCards] = useState<CardItem[]>([]);
  const [badges, setBadges] = useState<BadgeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Modal States
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [leaderboardModalVisible, setLeaderboardModalVisible] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [profileData, badgesData, cardsData] = await Promise.all([
        profileService.getProfile(),
        profileService.getUserBadges().catch(() => []),
        profileService.getUserCardCollection().catch(() => []),
      ]);

      setProfile(profileData);
      setBadges(badgesData);
      setCards(cardsData);
    } catch (err: any) {
      console.error("[ProfileScreen] Error loadData:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadData(), fetchProfile()]);
  };

  const handleProfileUpdated = (updated: UserProfileData) => {
    setProfile((prev) => (prev ? { ...prev, ...updated } : updated));
    fetchProfile(); // sinkronisasi dengan AuthContext
  };

  const handleSettingsUpdated = (audioAktif: boolean, volume: number) => {
    setProfile((prev) =>
      prev
        ? {
            ...prev,
            audio_aktif: audioAktif,
            volume_audio: volume,
          }
        : null
    );
  };

  const handleConfirmLogout = () => {
    Alert.alert(
      "Konfirmasi Keluar",
      "Apakah Anda yakin ingin keluar dari petualangan Edungeon?",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Keluar",
          style: "destructive",
          onPress: async () => {
            try {
              await logoutUser();
            } catch (err: any) {
              Alert.alert("Gagal Keluar", err.message || "Terjadi kesalahan saat logout.");
            }
          },
        },
      ]
    );
  };

  if (loading && !profile) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color={THEME_COLORS.gold} />
        <Text className="text-gold font-bold text-sm mt-3">
          Memuat Data Pahlawan...
        </Text>
      </View>
    );
  }

  // Fallback data jika backend belum terhubung sempurna
  const displayProfile: UserProfileData = profile || {
    id_user: user?.uid || "",
    nama: userProfile?.nama || "Pahlawan Edungeon",
    username: userProfile?.username || "hero",
    email: user?.email || "",
    kelas: userProfile?.kelas || "Kelas X",
    avatar: userProfile?.avatar || "knight",
    total_exp: userProfile?.total_exp || 0,
    level: userProfile?.level || 1,
    exp_in_level: userProfile?.exp_in_level || 0,
    next_level_exp: userProfile?.next_level_exp || 100,
    akurasi: userProfile?.akurasi || 0,
    monster_dikalahkan: userProfile?.monster_dikalahkan || 0,
    boss_dikalahkan: userProfile?.boss_dikalahkan || 0,
    audio_aktif: true,
    volume_audio: 1.0,
  };

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1 px-5 pt-12"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={THEME_COLORS.gold}
            colors={[THEME_COLORS.gold]}
          />
        }
      >
        {/* Header Profil (Avatar Golden Ring, Nama, Class, Action Buttons) */}
        <ProfileHeader
          profile={displayProfile}
          onOpenEdit={() => setEditModalVisible(true)}
          onOpenSettings={() => setSettingsModalVisible(true)}
          onOpenLeaderboard={() => setLeaderboardModalVisible(true)}
        />

        {/* Bar Kemajuan Level & EXP */}
        <LevelProgressBar
          level={displayProfile.level}
          expInLevel={displayProfile.exp_in_level}
          nextLevelExp={displayProfile.next_level_exp}
        />

        {/* Ringkasan Statistik 2x2 (Total EXP, Monster, Akurasi %, Boss) */}
        <StatOverviewCard
          totalExp={displayProfile.total_exp}
          monsterDikalahkan={displayProfile.monster_dikalahkan}
          akurasi={displayProfile.akurasi}
          bossDikalahkan={displayProfile.boss_dikalahkan}
        />

        {/* Galeri 15 Badge */}
        <BadgeGallery badges={badges} />

        {/* Koleksi 12 Kartu Buff */}
        <CardCollectionGrid cards={cards} />

        {/* Tombol Logout Game */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleConfirmLogout}
          className="bg-danger/15 border border-danger/60 p-4 rounded-2xl flex-row items-center justify-center mb-16 shadow-sm"
        >
          <Icon
            name="ArrowRightOnRectangleIcon"
            variant="outline"
            size={20}
            color={THEME_COLORS.danger}
          />
          <Text className="text-danger font-bold text-sm ml-2">
            Keluar dari Petualangan
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modals Terintegrasi */}
      <EditProfileModal
        visible={editModalVisible}
        profile={displayProfile}
        onClose={() => setEditModalVisible(false)}
        onSuccess={handleProfileUpdated}
      />

      <AudioSettingsModal
        visible={settingsModalVisible}
        profile={displayProfile}
        onClose={() => setSettingsModalVisible(false)}
        onSuccess={handleSettingsUpdated}
      />

      <LeaderboardModal
        visible={leaderboardModalVisible}
        currentUserId={user?.uid}
        onClose={() => setLeaderboardModalVisible(false)}
      />
    </View>
  );
}