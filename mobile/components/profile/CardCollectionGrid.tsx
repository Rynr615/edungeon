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
        return { label: "EPIC", color: "text-purple-700", bg: "bg-purple-50", border: "border-purple-200" };
      case "rare":
        return { label: "RARE", color: "text-blue-700", bg: "bg-blue-50", border: "border-blue-200" };
      default:
        return { label: "COMMON", color: "text-gray-700", bg: "bg-gray-100", border: "border-gray-300" };
    }
  };

  return (
    <View className="bg-[#dde3ea] rounded-2xl p-4 mb-4">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-3.5">
        <View className="flex-row items-center">
          <View className="w-7 h-7 rounded-lg bg-sky-100 items-center justify-center mr-2 border border-sky-200">
            <Icon name="Square3Stack3DIcon" variant="solid" size={16} color="#0284c7" />
          </View>
          <View>
            <Text className="text-gray-900 font-bold text-sm">Koleksi Kartu Buff</Text>
            <Text className="font-mono text-gray-700 text-[11px] font-medium">
              {unlockedCount}/{cards.length > 0 ? cards.length : 12} Kartu Didapat
            </Text>
          </View>
        </View>

        {onPressSeeAll && (
          <TouchableOpacity
            onPress={onPressSeeAll}
            className="flex-row items-center bg-white px-2.5 py-1 rounded-full border border-gray-300 shadow-xs"
          >
            <Text className="text-sky-700 font-bold text-xs mr-0.5">Lihat Semua</Text>
            <Icon name="ChevronRightIcon" variant="outline" size={13} color="#0369a1" />
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
              className={`w-[31%] h-36 rounded-xl p-2.5 flex-col justify-between border ${
                isUnlocked
                  ? "bg-white border-gray-200 shadow-xs"
                  : "bg-white/60 border-gray-300 opacity-60"
              }`}
            >
              {/* Card top: Rarity badge */}
              <View className="flex-row justify-between items-center">
                <View className={`px-1.5 py-0.5 rounded ${rarity.bg} border ${rarity.border}`}>
                  <Text className={`font-mono font-bold text-[9px] ${rarity.color}`}>
                    {rarity.label}
                  </Text>
                </View>
                {isUnlocked ? (
                  <Icon name="SparklesIcon" variant="solid" size={11} color="#eab308" />
                ) : (
                  <Icon name="LockClosedIcon" variant="solid" size={11} color="#9ca3af" />
                )}
              </View>

              {/* Card center: Illustration / Icon */}
              <View className="items-center justify-center my-1">
                <View
                  className={`w-11 h-11 rounded-xl items-center justify-center ${
                    isUnlocked ? "bg-sky-50 border border-sky-100" : "bg-gray-100"
                  }`}
                >
                  <Icon
                    name={isUnlocked ? "BoltIcon" : "QuestionMarkCircleIcon"}
                    variant="solid"
                    size={22}
                    color={isUnlocked ? "#0284c7" : "#9ca3af"}
                  />
                </View>
              </View>

              {/* Card bottom: Name */}
              <View>
                <Text
                  className={`font-mono font-bold text-[11px] text-center ${
                    isUnlocked ? "text-gray-900" : "text-gray-400"
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
              className="w-[31%] h-36 rounded-xl p-2.5 bg-white/40 border border-gray-300 items-center justify-center"
            >
              <Icon name="LockClosedIcon" variant="outline" size={20} color="#9ca3af" />
              <Text className="text-gray-400 font-mono font-semibold text-[10px] mt-2">
                Belum Terbuka
              </Text>
            </View>
          ))}
      </View>
    </View>
  );
};
