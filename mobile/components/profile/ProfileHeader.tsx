// mobile/components/profile/ProfileHeader.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { UserProfile, ProfileStats } from "../../types/profile";
import { Icon } from "../ui/Icon";

interface ProfileHeaderProps {
  user: UserProfile | null;
  stats: ProfileStats | null;
  onEditPress: () => void;
  onSettingsPress: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  user,
  stats,
  onEditPress,
  onSettingsPress,
}) => {
  const level = stats?.level ?? Math.floor((user?.total_exp || 0) / 100) + 1;
  const expCurrent = stats?.exp_saat_ini ?? (user?.total_exp || 0) % 100;
  const expTarget = stats?.exp_target_level ?? 100;
  const progressPercent = Math.min(
    100,
    Math.max(0, stats?.persentase_level ?? Math.round((expCurrent / expTarget) * 100))
  );

  const getRoleIcon = () => {
    switch (user?.avatar_class) {
      case "knight":
        return <Icon name="ShieldCheckIcon" variant="solid" size={36} color="#3b82f6" />;
      case "mage":
        return <Icon name="SparklesIcon" variant="solid" size={36} color="#06b6d4" />;
      case "archer":
        return <Icon name="BoltIcon" variant="solid" size={36} color="#10b981" />;
      default:
        return <Icon name="UserIcon" variant="solid" size={36} color="#f59e0b" />;
    }
  };

  return (
    <View className="bg-surface border border-surface-light rounded-3xl p-5 mb-5 shadow-sm">
      {/* Top Action Buttons (Settings & Edit Profile) */}
      <View className="flex-row items-center justify-between mb-4">
        <View className="bg-surface-light/40 px-3 py-1 rounded-full border border-surface-light">
          <Text className="text-subtext text-xs font-semibold uppercase tracking-wider">
            Akun Siswa
          </Text>
        </View>

        <View className="flex-row items-center space-x-2">
          {/* Tombol Pengaturan Suara */}
          <TouchableOpacity
            onPress={onSettingsPress}
            activeOpacity={0.7}
            className="w-10 h-10 rounded-xl bg-surface-light/60 border border-surface-light items-center justify-center mr-2"
          >
            <Icon name="Cog6ToothIcon" variant="outline" size={20} color="#f8fafc" />
          </TouchableOpacity>

          {/* Tombol Edit Profil */}
          <TouchableOpacity
            onPress={onEditPress}
            activeOpacity={0.7}
            className="w-10 h-10 rounded-xl bg-surface-light/60 border border-surface-light items-center justify-center"
          >
            <Icon name="PencilSquareIcon" variant="outline" size={20} color="#f8fafc" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Identitas Pengguna & Avatar */}
      <View className="items-center mb-5">
        <View className="w-22 h-22 w-20 h-20 rounded-full bg-background border-2 border-exp/80 items-center justify-center mb-3 shadow-md">
          {getRoleIcon()}
        </View>

        <Text className="text-text font-bold text-xl text-center">
          {user?.nama || "Pahlawan Siswa"}
        </Text>
        <Text className="text-subtext text-xs mt-0.5">
          @{user?.username || "pahlawan"} • {user?.kelas || "Kelas X"}
        </Text>
        {user?.avatar_class ? (
          <View className="mt-2 bg-primary/20 px-3 py-0.5 rounded-full border border-primary/40">
            <Text className="text-primary text-[11px] font-bold uppercase">
              Role: {user.avatar_class}
            </Text>
          </View>
        ) : null}
      </View>

      {/* EXP & Level Bar Progress */}
      <View className="bg-background/80 border border-surface-light/50 p-3.5 rounded-2xl">
        <View className="flex-row justify-between items-center mb-1.5">
          <View className="flex-row items-center">
            <Icon name="SparklesIcon" variant="solid" size={14} color="#eab308" />
            <Text className="text-exp font-bold text-xs ml-1">Level {level}</Text>
          </View>
          <Text className="text-subtext text-xs font-medium">
            {expCurrent} / {expTarget} EXP
          </Text>
        </View>

        {/* Progress Bar Horizontal */}
        <View className="w-full bg-surface-light h-2.5 rounded-full overflow-hidden">
          <View
            className="bg-exp h-full rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </View>
      </View>
    </View>
  );
};
