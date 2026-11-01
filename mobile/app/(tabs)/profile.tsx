// mobile/app/(tabs)/profile.tsx
import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Alert,
  Modal,
  TouchableOpacity,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { profileService } from "../../services/profileService";
import { BadgeItem, CardCollectionItem, UserProfile } from "../../types/profile";
import { ProfileHeader } from "../../components/profile/ProfileHeader";
import { StatOverviewCard } from "../../components/profile/StatOverviewCard";
import { CardCollectionGrid } from "../../components/profile/CardCollectionGrid";
import { BadgeGallery } from "../../components/profile/BadgeGallery";
import { ProfileMenuActions } from "../../components/profile/ProfileMenuActions";
import { Icon, IconName } from "../../components/ui/Icon";

export default function ProfileScreen() {
  const router = useRouter();
  const { userProfile: authProfile, logoutUser, fetchProfile } = useAuth();

  const [profile, setProfile] = useState<UserProfile | null>(authProfile);
  const [badges, setBadges] = useState<BadgeItem[]>([]);
  const [cards, setCards] = useState<CardCollectionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Selected item modals
  const [selectedBadge, setSelectedBadge] = useState<BadgeItem | null>(null);
  const [selectedCard, setSelectedCard] = useState<CardCollectionItem | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [profileRes, badgesRes, cardsRes] = await Promise.allSettled([
        profileService.getProfile(),
        profileService.getUserBadges(),
        profileService.getUserCardCollection(),
      ]);

      if (profileRes.status === "fulfilled") {
        setProfile(profileRes.value);
      }
      if (badgesRes.status === "fulfilled") {
        setBadges(badgesRes.value);
      }
      if (cardsRes.status === "fulfilled") {
        setCards(cardsRes.value);
      }
    } catch (err) {
      console.error("[ProfileScreen] Error loading data:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchProfile();
    await loadData();
  }, [fetchProfile, loadData]);

  const handleLogout = () => {
    Alert.alert(
      "Konfirmasi Keluar",
      "Apakah kamu yakin ingin keluar dari akun Edungeon ini?",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Keluar",
          style: "destructive",
          onPress: async () => {
            try {
              await logoutUser();
            } catch (err: any) {
              Alert.alert("Gagal Keluar", err.message || "Terjadi kesalahan");
            }
          },
        },
      ]
    );
  };

  const hasIncomplete = !profile?.nama_panggilan || !profile?.no_hp;

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1 px-5 pt-12"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#3b82f6"
            colors={["#3b82f6"]}
          />
        }
      >
        {/* Page Title & Status */}
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-text font-black text-2xl tracking-tight">
            Profil Pahlawan
          </Text>
          {loading && !refreshing && (
            <ActivityIndicator size="small" color="#3b82f6" />
          )}
        </View>

        {/* 1. Header Profil (Avatar, Level, EXP) */}
        <ProfileHeader
          profile={profile}
          onPressSettings={() => router.push("/profile/settings" as any)}
          onPressEdit={() => router.push("/profile/edit" as any)}
        />

        {/* 2. Ringkasan Statistik (2x2 Grid) */}
        <StatOverviewCard
          monsterCount={profile?.monster_dikalahkan || 0}
          bossCount={profile?.boss_dikalahkan || 0}
          accuracy={profile?.akurasi || 0}
          highestStage={profile?.highest_stage || "Stage 1-1"}
        />

        {/* 3. Koleksi Kartu Buff (3 Preview Cards) */}
        <CardCollectionGrid
          cards={cards}
          onPressSeeAll={() => router.push("/profile/cards" as any)}
          onPressCard={(c) => setSelectedCard(c)}
        />

        {/* 4. Badge Prestasi (4 Preview Circles) */}
        <BadgeGallery
          badges={badges}
          onPressSeeAll={() => router.push("/profile/badges" as any)}
          onPressBadge={(b) => setSelectedBadge(b)}
        />

        {/* 5. Menu Tindakan & Navigasi */}
        <ProfileMenuActions
          hasIncompleteProfile={hasIncomplete}
          onPressEditProfile={() => router.push("/profile/edit" as any)}
          onPressLeaderboard={() => router.push("/profile/leaderboard" as any)}
          onPressSettings={() => router.push("/profile/settings" as any)}
          onPressLogout={handleLogout}
        />
      </ScrollView>

      {/* MODAL DETAIL BADGE */}
      <Modal
        visible={!!selectedBadge}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedBadge(null)}
      >
        <View className="flex-1 bg-black/80 justify-center items-center px-6">
          <View className="bg-surface border border-surface-light rounded-3xl p-6 w-full max-w-sm items-center shadow-2xl">
            <View className="w-20 h-20 rounded-full border-4 border-amber-400 bg-amber-500/20 items-center justify-center mb-4">
              <Icon
                name={
                  selectedBadge?.unlocked && selectedBadge.icon_name
                    ? (selectedBadge.icon_name as IconName)
                    : "LockClosedIcon"
                }
                variant="solid"
                size={36}
                color={selectedBadge?.unlocked ? "#f59e0b" : "#94a3b8"}
              />
            </View>

            <View className="bg-amber-500/20 px-3 py-1 rounded-full border border-amber-500/40 mb-2">
              <Text className="text-amber-400 font-extrabold text-xs uppercase tracking-wider">
                {selectedBadge?.tier} • {selectedBadge?.kategori}
              </Text>
            </View>

            <Text className="text-text font-black text-xl text-center mb-2">
              {selectedBadge?.nama}
            </Text>

            <Text className="text-subtext text-center text-sm leading-5 mb-5">
              {selectedBadge?.deskripsi}
            </Text>

            <View className="w-full bg-background/80 p-3 rounded-2xl border border-surface-light mb-5">
              <Text className="text-slate-400 text-xs font-semibold text-center">
                Status:{" "}
                <Text
                  className={`font-bold ${
                    selectedBadge?.unlocked ? "text-emerald-400" : "text-slate-500"
                  }`}
                >
                  {selectedBadge?.unlocked
                    ? `Terbuka (${selectedBadge.tgl_perolehan?.slice(0, 10) || "Tercapai"})`
                    : "Belum Tercapai"}
                </Text>
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => setSelectedBadge(null)}
              className="bg-primary w-full py-3.5 rounded-xl items-center"
            >
              <Text className="text-white font-bold text-base">Tutup</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL DETAIL KARTU BUFF */}
      <Modal
        visible={!!selectedCard}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedCard(null)}
      >
        <View className="flex-1 bg-black/80 justify-center items-center px-6">
          <View className="bg-surface border border-surface-light rounded-3xl p-6 w-full max-w-sm items-center shadow-2xl">
            <View className="w-16 h-16 rounded-2xl border-2 border-blue-400 bg-blue-500/20 items-center justify-center mb-4">
              <Icon
                name={selectedCard?.unlocked ? "BoltIcon" : "QuestionMarkCircleIcon"}
                variant="solid"
                size={32}
                color={selectedCard?.unlocked ? "#38bdf8" : "#94a3b8"}
              />
            </View>

            <View className="bg-blue-500/20 px-3 py-1 rounded-full border border-blue-500/40 mb-2">
              <Text className="text-blue-400 font-extrabold text-xs uppercase tracking-wider">
                {selectedCard?.class_kartu} • {selectedCard?.tipe_efek || "Buff"}
              </Text>
            </View>

            <Text className="text-text font-black text-xl text-center mb-2">
              {selectedCard?.nama_kartu}
            </Text>

            <Text className="text-subtext text-center text-sm leading-5 mb-5">
              {selectedCard?.deskripsi ||
                (selectedCard?.unlocked
                  ? "Kartu buff roguelike ini memberikan bonus kekuatan khusus saat pertempuran dungeon."
                  : "Selesaikan tantangan di dungeon untuk menemukan dan membuka kartu buff ini.")}
            </Text>

            <TouchableOpacity
              onPress={() => setSelectedCard(null)}
              className="bg-primary w-full py-3.5 rounded-xl items-center"
            >
              <Text className="text-white font-bold text-base">Tutup</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}