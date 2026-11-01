// mobile/components/profile/ProfileHeader.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { UserProfile, ProfileStats } from "../../types/profile";
import { Icon } from "../ui/Icon";

interface ProfileHeaderProps {
  user: UserProfile | null;
  stats: ProfileStats | null;
  onEditPress?: () => void;
  onSettingsPress: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  user,
  stats,
  onSettingsPress,
}) => {
  const level = stats?.level ?? user?.level ?? 15;
  const progressPercent = stats?.persentase_level ?? 30;

  return (
    <View className="mb-5">
      {/* Title Header Halaman */}
      <Text className="text-[#0f172a] text-2xl font-extrabold mb-4">Profile</Text>

      {/* Row Profil: Avatar, Nama & Level, dan Tombol Settings */}
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center flex-1 mr-2">
          {/* Avatar Lingkaran */}
          <View className="w-16 h-16 rounded-full bg-[#EBF0F5] items-center justify-center mr-3 shadow-xs">
            <Icon name="UserIcon" variant="solid" size={32} color="#0f172a" />
          </View>

          {/* Nama Siswa & Level */}
          <View className="flex-1">
            <Text className="text-[#0f172a] text-base font-bold" numberOfLines={1}>
              {user?.nama || "Ryan Yanuar Pradana"}
            </Text>
            <View className="flex-row items-center mt-1">
              <Icon name="StarIcon" variant="solid" size={16} color="#f59e0b" />
              <Text className="text-[#0f172a] text-sm ml-1 font-mono font-medium">
                Level {level}
              </Text>
            </View>
          </View>
        </View>

        {/* Tombol Pengaturan (Settings Cog) */}
        <TouchableOpacity
          onPress={onSettingsPress}
          activeOpacity={0.7}
          className="w-10 h-10 rounded-full border border-gray-300 bg-white items-center justify-center shadow-xs"
        >
          <Icon name="Cog6ToothIcon" variant="solid" size={20} color="#0f172a" />
        </TouchableOpacity>
      </View>

      {/* Progress Bar & Label Persentase */}
      <View className="mt-1">
        <Text className="text-[#38bdf8] text-sm font-bold mb-1">
          {progressPercent}%
        </Text>
        <View className="w-full h-3 rounded-full bg-[#CBD5E1] overflow-hidden">
          <View
            className="h-full rounded-full bg-[#38bdf8]"
            style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
          />
        </View>
      </View>
    </View>
  );
};
