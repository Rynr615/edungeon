// mobile/components/profile/CardCollectionGrid.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { CardCollectionItem } from "../../types/profile";
import { Icon } from "../ui/Icon";

interface CardCollectionGridProps {
  cards: CardCollectionItem[];
  onPressSeeAll?: () => void;
  onPressCard?: (card: CardCollectionItem) => void;
}

export const CardCollectionGrid: React.FC<CardCollectionGridProps> = ({
  cards,
  onPressSeeAll,
  onPressCard,
}) => {
  // Show first 3 cards for preview
  const previewCards = cards.slice(0, 3);
  const unlockedCount = cards.filter((c) => c.unlocked).length;

  const getRarityBadge = (cardClass: string) => {
    switch (cardClass?.toLowerCase()) {
      case "epic":
        return { label: "EPIC", color: "text-purple-400", bg: "bg-purple-500/20", border: "border-purple-500/40" };
      case "rare":
        return { label: "RARE", color: "text-blue-400", bg: "bg-blue-500/20", border: "border-blue-500/40" };
      default:
        return { label: "COMMON", color: "text-slate-300", bg: "bg-slate-500/20", border: "border-slate-500/40" };
    }
  };

  return (
    <View className="bg-surface border border-surface-light rounded-3xl p-4 mb-4">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-3.5">
        <View className="flex-row items-center">
          <View className="w-7 h-7 rounded-lg bg-primary/20 items-center justify-center mr-2">
            <Icon name="Square3Stack3DIcon" variant="solid" size={16} color="#3b82f6" />
          </View>
          <View>
            <Text className="text-text font-bold text-sm">Koleksi Kartu Buff</Text>
            <Text className="text-subtext text-[11px] font-medium">
              {unlockedCount}/{cards.length > 0 ? cards.length : 12} Kartu Didapat
            </Text>
          </View>
        </View>

        {onPressSeeAll && (
          <TouchableOpacity
            onPress={onPressSeeAll}
            className="flex-row items-center bg-surface-light/40 px-2.5 py-1 rounded-full border border-slate-700"
          >
            <Text className="text-blue-400 font-bold text-xs mr-0.5">Lihat Semua</Text>
            <Icon name="ChevronRightIcon" variant="outline" size={13} color="#60a5fa" />
          </TouchableOpacity>
        )}
      </View>

      {/* Cards 3 Columns */}
      <View className="flex-row justify-between">
        {previewCards.map((card, idx) => {
          const rarity = getRarityBadge(card.class_kartu);
          const isUnlocked = card.unlocked;

          return (
            <TouchableOpacity
              key={card.id_kartu || `card-${idx}`}
              onPress={() => onPressCard && onPressCard(card)}
              disabled={!onPressCard}
              activeOpacity={0.8}
              className={`w-[31%] h-36 rounded-2xl p-2.5 flex-col justify-between border ${
                isUnlocked
                  ? "bg-slate-800/80 border-slate-700 shadow-sm shadow-blue-500/10"
                  : "bg-slate-900/60 border-slate-800/80 opacity-60"
              }`}
            >
              {/* Card top: Rarity badge */}
              <View className="flex-row justify-between items-center">
                <View className={`px-1.5 py-0.5 rounded ${rarity.bg} border ${rarity.border}`}>
                  <Text className={`font-black text-[9px] ${rarity.color}`}>
                    {rarity.label}
                  </Text>
                </View>
                {isUnlocked ? (
                  <Icon name="SparklesIcon" variant="solid" size={10} color="#fbbf24" />
                ) : (
                  <Icon name="LockClosedIcon" variant="solid" size={10} color="#64748b" />
                )}
              </View>

              {/* Card center: Illustration / Icon */}
              <View className="items-center justify-center my-1">
                <View
                  className={`w-11 h-11 rounded-xl items-center justify-center ${
                    isUnlocked ? "bg-primary/20 border border-primary/30" : "bg-slate-800"
                  }`}
                >
                  <Icon
                    name={isUnlocked ? "BoltIcon" : "QuestionMarkCircleIcon"}
                    variant="solid"
                    size={22}
                    color={isUnlocked ? "#38bdf8" : "#64748b"}
                  />
                </View>
              </View>

              {/* Card bottom: Name */}
              <View>
                <Text
                  className={`font-bold text-[11px] text-center ${
                    isUnlocked ? "text-slate-100" : "text-slate-500"
                  }`}
                  numberOfLines={2}
                >
                  {isUnlocked ? card.nama_kartu : "Terkunci"}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}

        {/* Fallback if cards array has fewer than 3 */}
        {previewCards.length < 3 &&
          Array.from({ length: 3 - previewCards.length }).map((_, i) => (
            <View
              key={`empty-${i}`}
              className="w-[31%] h-36 rounded-2xl p-2.5 bg-slate-900/40 border border-slate-800/60 items-center justify-center"
            >
              <Icon name="LockClosedIcon" variant="outline" size={20} color="#475569" />
              <Text className="text-slate-600 font-semibold text-[10px] mt-2">
                Belum Terbuka
              </Text>
            </View>
          ))}
      </View>
    </View>
  );
};
