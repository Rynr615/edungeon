// mobile/components/profile/BadgeGallery.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { BadgeItem } from "../../types/profile";
import { Icon, IconName } from "../ui/Icon";

interface BadgeGalleryProps {
  badges: BadgeItem[];
  onPressSeeAll?: () => void;
  onPressBadge?: (badge: BadgeItem) => void;
}

export const BadgeGallery: React.FC<BadgeGalleryProps> = ({
  badges,
  onPressSeeAll,
  onPressBadge,
}) => {
  const previewBadges = badges.slice(0, 4);
  const unlockedCount = badges.filter((b) => b.unlocked).length;

  const getTierStyles = (tier: string, unlocked: boolean) => {
    if (!unlocked) {
      return {
        border: "border-gray-300",
        bg: "bg-white/60",
        color: "#9ca3af",
      };
    }
    switch (tier?.toLowerCase()) {
      case "platinum":
      case "ruby":
        return {
          border: "border-rose-400",
          bg: "bg-rose-50",
          color: "#e11d48",
        };
      case "gold":
        return {
          border: "border-amber-400",
          bg: "bg-amber-50",
          color: "#d97706",
        };
      case "silver":
        return {
          border: "border-slate-300",
          bg: "bg-slate-100",
          color: "#64748b",
        };
      case "bronze":
      default:
        return {
          border: "border-amber-700/50",
          bg: "bg-amber-100/60",
          color: "#b45309",
        };
    }
  };

  return (
    <View className="bg-[#dde3ea] rounded-2xl p-4 mb-4">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-3.5">
        <View className="flex-row items-center">
          <View className="w-7 h-7 rounded-lg bg-amber-100 items-center justify-center mr-2 border border-amber-200">
            <Icon name="TrophyIcon" variant="solid" size={16} color="#d97706" />
          </View>
          <View>
            <Text className="text-gray-900 font-bold text-sm">Badge Prestasi</Text>
            <Text className="font-mono text-gray-700 text-[11px] font-medium">
              {unlockedCount}/{badges.length > 0 ? badges.length : 15} Lencana Diraih
            </Text>
          </View>
        </View>

        {onPressSeeAll && (
          <TouchableOpacity
            onPress={onPressSeeAll}
            className="flex-row items-center bg-white px-2.5 py-1 rounded-full border border-gray-300 shadow-xs"
          >
            <Text className="text-amber-800 font-bold text-xs mr-0.5">Semua Badge</Text>
            <Icon name="ChevronRightIcon" variant="outline" size={13} color="#92400e" />
          </TouchableOpacity>
        )}
      </View>

      {/* 4 Badges Circular Row */}
      <View className="flex-row justify-between items-center">
        {previewBadges.map((badge, idx) => {
          const style = getTierStyles(badge.tier, badge.unlocked);
          const iconName = (badge.unlocked && badge.icon_name
            ? (badge.icon_name as IconName)
            : "LockClosedIcon") as IconName;

          return (
            <TouchableOpacity
              key={badge.id_badge || `badge-${idx}`}
              onPress={() => onPressBadge && onPressBadge(badge)}
              disabled={!onPressBadge}
              activeOpacity={0.8}
              className="items-center w-[22%]"
            >
              <View
                className={`w-14 h-14 rounded-full border-2 ${style.border} ${style.bg} items-center justify-center mb-1.5 shadow-xs`}
              >
                <Icon
                  name={iconName}
                  variant="solid"
                  size={24}
                  color={style.color}
                />
              </View>

              <Text
                className={`font-mono font-semibold text-[10px] text-center ${
                  badge.unlocked ? "text-gray-900" : "text-gray-400"
                }`}
                numberOfLines={1}
              >
                {badge.unlocked ? badge.nama : "Terkunci"}
              </Text>
            </TouchableOpacity>
          );
        })}

        {/* Fallback if badges array has fewer than 4 */}
        {previewBadges.length < 4 &&
          Array.from({ length: 4 - previewBadges.length }).map((_, i) => (
            <View key={`empty-badge-${i}`} className="items-center w-[22%]">
              <View className="w-14 h-14 rounded-full border border-gray-300 bg-white/40 items-center justify-center mb-1.5">
                <Icon name="LockClosedIcon" variant="outline" size={20} color="#9ca3af" />
              </View>
              <Text className="text-gray-400 font-mono font-semibold text-[10px]">Terkunci</Text>
            </View>
          ))}
      </View>
    </View>
  );
};
