// mobile/components/profile/ProfileHeader.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Icon } from "../ui/Icon";
import { THEME_COLORS } from "../../constants/theme";
import { UserProfileData } from "../../types/profile";

interface ProfileHeaderProps {
  profile: UserProfileData | null;
  onOpenEdit: () => void;
  onOpenSettings: () => void;
  onOpenLeaderboard: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profile,
  onOpenEdit,
  onOpenSettings,
  onOpenLeaderboard,
}) => {
  const avatarName = (profile?.avatar || "knight").toLowerCase();

  // Memilih icon dan warna berdasarkan avatar class
  const getAvatarConfig = () => {
    switch (avatarName) {
      case "mage":
        return { icon: "SparklesIcon" as const, color: "#A855F7", label: "Mage" };
      case "archer":
        return { icon: "BoltIcon" as const, color: "#10B981", label: "Archer" };
      case "knight":
      default:
        return { icon: "ShieldCheckIcon" as const, color: THEME_COLORS.gold, label: "Knight" };
    }
  };

  const avatarConfig = getAvatarConfig();
  const level = profile?.level || 1;
  const kelas = profile?.kelas || "Kelas X";

  return (
    <View className="mb-5">
      {/* Tombol Aksi Atas (Leaderboard, Edit, Settings) */}
      <View className="flex-row justify-between items-center mb-4">
        <TouchableOpacity
          onPress={onOpenLeaderboard}
          activeOpacity={0.8}
          className="flex-row items-center bg-surface-card border border-border-gold/60 px-3 py-2 rounded-xl"
        >
          <Icon name="TrophyIcon" variant="solid" size={18} color="#FFD700" />
          <Text className="text-gold font-bold text-xs ml-1.5">Leaderboard</Text>
        </TouchableOpacity>

        <View className="flex-row items-center gap-2">
          <TouchableOpacity
            onPress={onOpenEdit}
            activeOpacity={0.8}
            className="w-10 h-10 rounded-xl bg-surface-card border border-border-gold/60 items-center justify-center"
          >
            <Icon name="PencilSquareIcon" variant="outline" size={20} color={THEME_COLORS.text} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onOpenSettings}
            activeOpacity={0.8}
            className="w-10 h-10 rounded-xl bg-surface-card border border-border-gold/60 items-center justify-center"
          >
            <Icon name="Cog6ToothIcon" variant="outline" size={20} color={THEME_COLORS.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Identitas Hero (Avatar dengan Golden Ring & Nama) */}
      <View className="items-center">
        <View className="relative mb-3">
          {/* Cincin Emas Avatar */}
          <View className="w-24 h-24 rounded-full bg-surface-card items-center justify-center border-2 border-gold shadow-lg shadow-black/60">
            <View className="w-20 h-20 rounded-full bg-surface-light items-center justify-center border border-border-gold/40">
              <Icon
                name={avatarConfig.icon}
                variant="solid"
                size={44}
                color={avatarConfig.color}
              />
            </View>
          </View>

          {/* Badge Level Lingkaran Kecil di Pojok Bawah */}
          <View className="absolute bottom-0 right-0 bg-primary border-2 border-surface px-2 py-0.5 rounded-full items-center justify-center shadow-md">
            <Text className="text-surface font-extrabold text-[10px]">
              LV.{level}
            </Text>
          </View>
        </View>

        <Text className="text-text font-bold text-2xl text-center tracking-wide">
          {profile?.nama || "Pahlawan Edungeon"}
        </Text>
        <Text className="text-subtext text-xs text-center mt-0.5">
          @{profile?.username || "hero"}
        </Text>

        {/* Kapsul Status Class & Level */}
        <View className="flex-row items-center mt-3 bg-surface-card border border-border-gold/40 px-3.5 py-1.5 rounded-full">
          <View className="w-2 h-2 rounded-full bg-gold mr-2" />
          <Text className="text-gold font-semibold text-xs">
            Lvl {level} • {avatarConfig.label}
          </Text>
          <Text className="text-subtext text-xs mx-1.5">•</Text>
          <Text className="text-text font-medium text-xs">
            {kelas}
          </Text>
        </View>
      </View>
    </View>
  );
};
