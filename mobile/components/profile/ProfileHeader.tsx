// mobile/components/profile/ProfileHeader.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { UserProfile } from "../../types/profile";
import { Icon } from "../ui/Icon";

interface ProfileHeaderProps {
  profile: UserProfile | null;
  onPressSettings?: () => void;
  onPressEdit?: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profile,
  onPressSettings,
  onPressEdit,
}) => {
  const level = profile?.level || 1;
  const expInLevel = profile?.exp_in_level ?? (profile?.total_exp ? profile.total_exp % 100 : 0);
  const nextLevelExp = profile?.next_level_exp || 100;
  const expPercentage = Math.min(Math.round((expInLevel / nextLevelExp) * 100), 100);

  // Avatar icon based on selection
  const getAvatarIcon = (avatarName?: string) => {
    switch (avatarName) {
      case "mage":
        return { name: "SparklesIcon" as const, color: "#06b6d4", bg: "bg-cyan-500/20", border: "border-cyan-500" };
      case "archer":
        return { name: "BoltIcon" as const, color: "#10b981", bg: "bg-emerald-500/20", border: "border-emerald-500" };
      case "knight":
      default:
        return { name: "ShieldCheckIcon" as const, color: "#3b82f6", bg: "bg-blue-500/20", border: "border-blue-500" };
    }
  };

  const avatarInfo = getAvatarIcon(profile?.avatar);

  return (
    <View className="bg-surface border border-surface-light rounded-3xl p-5 mb-4 shadow-lg shadow-black/40">
      {/* Top action row: Level pill & Settings gear */}
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center bg-amber-500/20 border border-amber-500/50 px-3 py-1 rounded-full">
          <Icon name="StarIcon" variant="solid" size={14} color="#f59e0b" />
          <Text className="text-amber-400 font-extrabold text-xs ml-1.5 tracking-wider">
            LEVEL {level}
          </Text>
        </View>

        <View className="flex-row items-center space-x-2">
          {onPressEdit && (
            <TouchableOpacity
              onPress={onPressEdit}
              className="w-9 h-9 rounded-full bg-surface-light/60 items-center justify-center border border-slate-600 active:bg-surface-light"
              accessibilityLabel="Edit Profile"
            >
              <Icon name="PencilSquareIcon" variant="outline" size={18} color="#94a3b8" />
            </TouchableOpacity>
          )}

          {onPressSettings && (
            <TouchableOpacity
              onPress={onPressSettings}
              className="w-9 h-9 rounded-full bg-surface-light/60 items-center justify-center border border-slate-600 active:bg-surface-light"
              accessibilityLabel="Pengaturan"
            >
              <Icon name="Cog6ToothIcon" variant="outline" size={18} color="#94a3b8" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Avatar & User Details */}
      <View className="flex-row items-center mb-5">
        <View className={`w-20 h-20 rounded-2xl ${avatarInfo.bg} border-2 ${avatarInfo.border} items-center justify-center shadow-md shadow-blue-500/20`}>
          <Icon name={avatarInfo.name} variant="solid" size={42} color={avatarInfo.color} />
        </View>

        <View className="ml-4 flex-1">
          <View className="flex-row items-center">
            <Text className="text-text font-black text-xl tracking-tight" numberOfLines={1}>
              {profile?.nama || "Pahlawan Edungeon"}
            </Text>
          </View>

          <Text className="text-subtext font-medium text-xs mt-0.5">
            @{profile?.username || "pahlawan"}
            {profile?.nama_panggilan ? ` (${profile.nama_panggilan})` : ""}
          </Text>

          <View className="flex-row items-center mt-1.5">
            <View className="bg-primary/20 px-2.5 py-0.5 rounded-md border border-primary/40 mr-2">
              <Text className="text-blue-400 font-bold text-[11px]">
                {profile?.kelas || "Kelas X"}
              </Text>
            </View>
            <Text className="text-subtext/70 text-[11px] font-semibold">
              Total {profile?.total_exp || 0} EXP
            </Text>
          </View>
        </View>
      </View>

      {/* EXP Progress Bar */}
      <View className="bg-background/80 rounded-2xl p-3 border border-surface-light/70">
        <View className="flex-row justify-between items-center mb-1.5">
          <View className="flex-row items-center">
            <Icon name="SparklesIcon" variant="solid" size={13} color="#fbbf24" />
            <Text className="text-slate-300 font-bold text-xs ml-1">
              EXP Menuju Level {level + 1}
            </Text>
          </View>
          <Text className="text-amber-400 font-extrabold text-xs">
            {expInLevel}/{nextLevelExp} ({expPercentage}%)
          </Text>
        </View>

        {/* Progress track */}
        <View className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700/60">
          <View
            className="h-full bg-amber-400 rounded-full"
            style={{ width: `${expPercentage}%` }}
          />
        </View>
      </View>
    </View>
  );
};
