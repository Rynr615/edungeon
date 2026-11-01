// mobile/components/profile/BadgeGallery.tsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import { Icon, IconName } from "../ui/Icon";
import { THEME_COLORS } from "../../constants/theme";
import { BadgeItem } from "../../types/profile";

interface BadgeGalleryProps {
  badges: BadgeItem[];
}

export const BadgeGallery: React.FC<BadgeGalleryProps> = ({ badges }) => {
  const [selectedBadge, setSelectedBadge] = useState<BadgeItem | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "klasik" | "usulan_baru">("all");

  const unlockedCount = badges.filter((b) => b.unlocked).length;
  const totalCount = badges.length || 15;

  const filteredBadges = badges.filter((b) => {
    if (activeTab === "klasik") return b.kategori === "klasik";
    if (activeTab === "usulan_baru") return b.kategori === "usulan_baru";
    return true;
  });

  const getTierColor = (tier: string) => {
    switch (tier.toLowerCase()) {
      case "ruby":
        return THEME_COLORS.badgeRuby;
      case "gold":
        return THEME_COLORS.badgeGold;
      case "silver":
        return THEME_COLORS.badgeSilver;
      case "bronze":
      default:
        return THEME_COLORS.badgeBronze;
    }
  };

  const formatDate = (isoString: string | null) => {
    if (!isoString) return "-";
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "-";
    }
  };

  return (
    <View className="mb-6">
      {/* Header Galeri Badge */}
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-text font-bold text-base tracking-wide">
          Pencapaian & Badge
        </Text>
        <View className="bg-surface-card border border-border-gold/50 px-2.5 py-1 rounded-full">
          <Text className="text-gold font-bold text-xs">
            {unlockedCount}/{totalCount} Terbuka
          </Text>
        </View>
      </View>

      {/* Tab Filter Kategori */}
      <View className="flex-row mb-4 bg-surface-card border border-border-gold/40 p-1 rounded-xl">
        <TouchableOpacity
          onPress={() => setActiveTab("all")}
          className={`flex-1 py-1.5 rounded-lg items-center ${
            activeTab === "all" ? "bg-primary" : "bg-transparent"
          }`}
        >
          <Text
            className={`font-bold text-xs ${
              activeTab === "all" ? "text-surface" : "text-subtext"
            }`}
          >
            Semua ({badges.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab("klasik")}
          className={`flex-1 py-1.5 rounded-lg items-center ${
            activeTab === "klasik" ? "bg-primary" : "bg-transparent"
          }`}
        >
          <Text
            className={`font-bold text-xs ${
              activeTab === "klasik" ? "text-surface" : "text-subtext"
            }`}
          >
            Klasik (10)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab("usulan_baru")}
          className={`flex-1 py-1.5 rounded-lg items-center ${
            activeTab === "usulan_baru" ? "bg-primary" : "bg-transparent"
          }`}
        >
          <Text
            className={`font-bold text-xs ${
              activeTab === "usulan_baru" ? "text-surface" : "text-subtext"
            }`}
          >
            Spesial Hero (5)
          </Text>
        </TouchableOpacity>
      </View>

      {/* Grid Badges */}
      <View className="flex-row flex-wrap justify-between">
        {filteredBadges.map((badge) => {
          const tierColor = getTierColor(badge.tier);
          const isUnlocked = badge.unlocked;

          return (
            <TouchableOpacity
              key={badge.id_badge}
              activeOpacity={0.8}
              onPress={() => setSelectedBadge(badge)}
              className={`w-[31%] mb-3 p-3 rounded-2xl items-center border ${
                isUnlocked
                  ? "bg-surface-card border-border-gold shadow-sm"
                  : "bg-surface/50 border-border/40 opacity-50"
              }`}
            >
              {/* Icon Container with Tier Ring */}
              <View
                className="w-12 h-12 rounded-full items-center justify-center mb-2 border-2"
                style={{
                  borderColor: isUnlocked ? tierColor : THEME_COLORS.border,
                  backgroundColor: isUnlocked ? `${tierColor}1A` : "transparent",
                }}
              >
                <Icon
                  name={
                    isUnlocked
                      ? (badge.icon_name as IconName) || "TrophyIcon"
                      : "LockClosedIcon"
                  }
                  variant="solid"
                  size={22}
                  color={isUnlocked ? tierColor : THEME_COLORS.textMuted}
                />
              </View>

              <Text
                numberOfLines={1}
                className={`font-bold text-xs text-center ${
                  isUnlocked ? "text-text" : "text-subtext"
                }`}
              >
                {badge.nama}
              </Text>

              <Text
                className="text-[10px] font-extrabold uppercase mt-0.5 tracking-wider"
                style={{ color: tierColor }}
              >
                {badge.tier}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Modal Detail Badge */}
      <Modal
        visible={!!selectedBadge}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedBadge(null)}
      >
        <View className="flex-1 bg-black/80 justify-center items-center px-6">
          <View className="w-full bg-surface border-2 border-gold rounded-3xl p-6 shadow-2xl">
            <View className="items-center mb-4">
              <View
                className="w-20 h-20 rounded-full items-center justify-center border-2 mb-3"
                style={{
                  borderColor: selectedBadge
                    ? getTierColor(selectedBadge.tier)
                    : THEME_COLORS.gold,
                  backgroundColor: selectedBadge?.unlocked
                    ? `${getTierColor(selectedBadge.tier)}20`
                    : "rgba(255,255,255,0.05)",
                }}
              >
                <Icon
                  name={
                    selectedBadge?.unlocked
                      ? (selectedBadge.icon_name as IconName) || "TrophyIcon"
                      : "LockClosedIcon"
                  }
                  variant="solid"
                  size={36}
                  color={
                    selectedBadge?.unlocked
                      ? getTierColor(selectedBadge.tier)
                      : THEME_COLORS.textMuted
                  }
                />
              </View>

              <View
                className="px-3 py-0.5 rounded-full mb-1"
                style={{
                  backgroundColor: `${getTierColor(
                    selectedBadge?.tier || "bronze"
                  )}30`,
                }}
              >
                <Text
                  className="font-extrabold text-xs uppercase"
                  style={{
                    color: getTierColor(selectedBadge?.tier || "bronze"),
                  }}
                >
                  TIER {selectedBadge?.tier} • {selectedBadge?.kode}
                </Text>
              </View>

              <Text className="text-text font-extrabold text-xl text-center">
                {selectedBadge?.nama}
              </Text>
              {selectedBadge?.class_khusus && (
                <Text className="text-gold text-xs font-semibold mt-0.5">
                  Khusus Class: {selectedBadge.class_khusus}
                </Text>
              )}
            </View>

            <View className="bg-surface-card border border-border/50 rounded-2xl p-4 mb-5">
              <Text className="text-subtext text-xs font-semibold mb-1">
                PERSYARATAN:
              </Text>
              <Text className="text-text text-sm leading-5">
                {selectedBadge?.deskripsi}
              </Text>

              <View className="h-[1px] bg-border/40 my-3" />

              <View className="flex-row justify-between items-center">
                <Text className="text-subtext text-xs">Status:</Text>
                <Text
                  className={`text-xs font-bold ${
                    selectedBadge?.unlocked ? "text-success" : "text-danger"
                  }`}
                >
                  {selectedBadge?.unlocked
                    ? `Diraih (${formatDate(selectedBadge.tgl_perolehan)})`
                    : "Belum Terbuka"}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => setSelectedBadge(null)}
              className="bg-primary py-3.5 rounded-xl items-center shadow-md shadow-primary/20"
            >
              <Text className="text-surface font-extrabold text-sm">
                Tutup
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};
