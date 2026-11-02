// mobile/components/profile/ProfileHeader.tsx
import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
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
  const level = profile?.level ?? 1;
  const expInLevel = profile?.exp_in_level ?? (profile?.total_exp ? profile.total_exp % 100 : 0);
  const nextLevelExp = profile?.next_level_exp || 100;
  const expPercentage = Math.min(Math.round((expInLevel / nextLevelExp) * 100), 100);

  const hasCustomPhoto =
    profile?.avatar &&
    (profile.avatar.startsWith("http") ||
      profile.avatar.startsWith("data:") ||
      profile.avatar.startsWith("file:"));

  return (
    <View className="mb-4">
      {/* Top Row: Avatar, Name & Level, Settings Gear */}
      <View className="flex-row items-center justify-between mb-4">
        {/* Left: Avatar & Identity */}
        <View className="flex-row items-center flex-1">
          {/* Avatar Circle */}
          <TouchableOpacity
            onPress={onPressEdit}
            activeOpacity={0.8}
            className="w-16 h-16 rounded-full bg-slate-100 items-center justify-center mr-4 overflow-hidden border border-gray-200 shadow-xs"
          >
            {hasCustomPhoto ? (
              <Image
                source={{ uri: profile!.avatar }}
                className="w-full h-full rounded-full"
                resizeMode="cover"
              />
            ) : (
              <Icon name="UserIcon" variant="solid" size={34} color="#1e293b" />
            )}
          </TouchableOpacity>

          {/* Name & Level */}
          <View className="flex-1">
            <Text className="font-mono text-gray-900 font-semibold text-sm" numberOfLines={1}>
              {profile?.nama || "Pahlawan Edungeon"}
            </Text>
            <View className="flex-row items-center mt-1">
              <Icon name="StarIcon" variant="outline" size={15} color="#eab308" />
              <Text className="font-mono text-gray-900 font-semibold text-xs ml-1.5">
                Level {level}
              </Text>
            </View>
          </View>
        </View>

        {/* Right: Settings Gear Button */}
        {onPressSettings && (
          <TouchableOpacity
            onPress={onPressSettings}
            activeOpacity={0.7}
            className="w-10 h-10 rounded-full border border-gray-300 bg-white items-center justify-center shadow-xs ml-2"
            accessibilityLabel="Settings"
          >
            <Icon name="Cog6ToothIcon" variant="solid" size={20} color="#111827" />
          </TouchableOpacity>
        )}
      </View>

      {/* EXP Percentage & Progress Bar */}
      <View className="w-full">
        <Text className="font-mono font-bold text-sky-500 text-xs ml-4 mb-1">
          {expPercentage}%
        </Text>
        <View className="h-3 w-full bg-blue-100 rounded-full overflow-hidden">
          <View
            className="h-full bg-sky-400 rounded-full"
            style={{ width: `${expPercentage}%` }}
          />
        </View>
      </View>
    </View>
  );
};
