// mobile/app/(tabs)/profile.tsx
import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { profileService } from "../../services/profileService";
import { UserProfile } from "../../types/profile";
import { ProfileHeader } from "../../components/profile/ProfileHeader";
import { StatOverviewCard } from "../../components/profile/StatOverviewCard";
import { KoleksiCard } from "../../components/profile/KoleksiCard";
import { ProfileMenuActions } from "../../components/profile/ProfileMenuActions";

export default function ProfileScreen() {
  const router = useRouter();
  const { userProfile: authProfile, logoutUser, fetchProfile } = useAuth();

  const [profile, setProfile] = useState<UserProfile | null>(authProfile);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await profileService.getProfile();
      setProfile(res);
    } catch (err) {
      console.warn("[ProfileScreen] Could not refresh profile from server:", err);
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
      "Log out",
      "Are you sure you want to log out of your account?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Log out",
          style: "destructive",
          onPress: async () => {
            try {
              await logoutUser();
            } catch (err: any) {
              Alert.alert("Error", err.message || "Failed to log out");
            }
          },
        },
      ]
    );
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        className="flex-1 px-6 pt-12"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#38bdf8"
            colors={["#38bdf8"]}
          />
        }
      >
        {/* Screen Title: Profile */}
        <View className="flex-row items-center justify-between mb-5">
          <Text className="font-bold text-2xl text-gray-900 tracking-tight">
            Profile
          </Text>
          {loading && !refreshing && (
            <ActivityIndicator size="small" color="#38bdf8" />
          )}
        </View>

        {/* 1. Header: Avatar, Name, Level, Gear & 30% Progress Bar */}
        <ProfileHeader
          profile={profile}
          onPressSettings={() => router.push("/profile/settings" as any)}
          onPressEdit={() => router.push("/profile/edit" as any)}
        />

        {/* 2. Statistik: 2x2 Grid */}
        <StatOverviewCard
          monsterCount={profile?.monster_dikalahkan || 24}
          bossCount={profile?.boss_dikalahkan || 2}
          accuracy={profile?.akurasi || 85}
          highestStage={profile?.highest_stage || "3-1"}
        />

        {/* 3. Koleksi Card: 3 Cards (ATK+2, HP+15, DEF+4) & 4 Badge Circles */}
        <KoleksiCard
          onPressCard={(c) => router.push("/profile/cards" as any)}
          onPressBadge={(b) => router.push("/profile/badges" as any)}
        />

        {/* 4. Action List: Edit Profile, Settings, Log out */}
        <ProfileMenuActions
          onPressEditProfile={() => router.push("/profile/edit" as any)}
          onPressSettings={() => router.push("/profile/settings" as any)}
          onPressLogout={handleLogout}
        />
      </ScrollView>
    </View>
  );
}