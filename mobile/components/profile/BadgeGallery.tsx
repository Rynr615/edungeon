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
        border: "border-slate-800",
        bg: "bg-slate-900/50",
        color: "#64748b",
        glow: "",
      };
    }
    switch (tier?.toLowerCase()) {
      case "platinum":
        return {
          border: "border-cyan-400",
          bg: "bg-cyan-500/20",
          color: "#22d3ee",
          glow: "shadow-sm shadow-cyan-400/30",
        };
      case "gold":
        return {
          border: "border-amber-400",
          bg: "bg-amber-500/20",
          color: "#f59e0b",
          glow: "shadow-sm shadow-amber-400/30",
        };
      case "silver":
        return {
          border: "border-slate-300",
          bg: "bg-slate-300/20",
          color: "#cbd5e1",
          glow: "shadow-sm shadow-slate-300/30",
        };
      case "bronze":
      default:
        return {
          border: "border-amber-700",
          bg: "bg-amber-800/20",
          color: "#d97706",
          glow: "shadow-sm shadow-amber-700/30",
        };
    }
  };

  return (
    <View className="bg-surface border border-surface-light rounded-3xl p-4 mb-4">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-3.5">
        <View className="flex-row items-center">
          <View className="w-7 h-7 rounded-lg bg-amber-500/20 items-center justify-center mr-2">
            <Icon name="TrophyIcon" variant="solid" size={16} color="#f59e0b" />
          </View>
          <View>
            <Text className="text-text font-bold text-sm">Badge Prestasi</Text>
            <Text className="text-subtext text-[11px] font-medium">
              {unlockedCount}/{badges.length > 0 ? badges.length : 15} Lencana Diraih
            </Text>
          </View>
        </View>

        {onPressSeeAll && (
          <TouchableOpacity
            onPress={onPressSeeAll}
            className="flex-row items-center bg-surface-light/40 px-2.5 py-1 rounded-full border border-slate-700"
          >
            <Text className="text-blue-400 font-bold text-xs mr-0.5">Semua Badge</Text>
            <Icon name="ChevronRightIcon" variant="outline" size={13} color="#60a5fa" />
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
                className={`w-14 h-14 rounded-full border-2 ${style.border} ${style.bg} ${style.glow} items-center justify-center mb-1.5`}
              >
                <Icon
                  name={iconName}
                  variant="solid"
                  size={24}
                  color={style.color}
                />
              </View>

              <Text
                className={`font-semibold text-[10px] text-center ${
                  badge.unlocked ? "text-slate-200" : "text-slate-500"
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
              <View className="w-14 h-14 rounded-full border-2 border-slate-800 bg-slate-900/40 items-center justify-center mb-1.5">
                <Icon name="LockClosedIcon" variant="outline" size={20} color="#475569" />
              </View>
              <Text className="text-slate-600 font-semibold text-[10px]">Terkunci</Text>
            </View>
          ))}
      </View>
    </View>
  );
};
