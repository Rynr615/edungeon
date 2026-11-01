// mobile/components/profile/CardCollectionGrid.tsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, ScrollView } from "react-native";
import { Icon } from "../ui/Icon";
import { THEME_COLORS } from "../../constants/theme";
import { CardItem } from "../../types/profile";

interface CardCollectionGridProps {
  cards: CardItem[];
  loading?: boolean;
}

export const CardCollectionGrid: React.FC<CardCollectionGridProps> = ({
  cards,
  loading = false,
}) => {
  const [selectedCard, setSelectedCard] = useState<CardItem | null>(null);

  const unlockedCount = cards.filter((c) => c.unlocked).length;
  const totalCount = cards.length || 12;

  // Format tanggal perolehan
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
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-text font-bold text-base tracking-wide">
          Koleksi Kartu Buff
        </Text>
        <View className="bg-surface-card border border-border-gold/50 px-2.5 py-1 rounded-full">
          <Text className="text-gold font-bold text-xs">
            {unlockedCount}/{totalCount} Terkumpul
          </Text>
        </View>
      </View>

      {/* Grid Kartu Buff */}
      <View className="flex-row flex-wrap justify-between">
        {cards.map((card) => {
          const isUnlocked = card.unlocked;

          return (
            <TouchableOpacity
              key={card.id_kartu}
              activeOpacity={0.8}
              onPress={() => setSelectedCard(card)}
              className={`w-[48%] mb-3 p-3.5 rounded-2xl border ${
                isUnlocked
                  ? "bg-surface-card border-border-gold/70 shadow-sm shadow-gold/10"
                  : "bg-surface/50 border-border/40 opacity-60"
              }`}
            >
              <View className="flex-row items-center justify-between mb-2">
                <View
                  className={`px-2 py-0.5 rounded-md ${
                    isUnlocked ? "bg-gold/20" : "bg-surface-light"
                  }`}
                >
                  <Text
                    className={`font-bold text-[10px] ${
                      isUnlocked ? "text-gold" : "text-subtext"
                    }`}
                  >
                    {card.class_kartu || "Common"}
                  </Text>
                </View>

                {isUnlocked ? (
                  <Icon
                    name="SparklesIcon"
                    variant="solid"
                    size={16}
                    color={THEME_COLORS.gold}
                  />
                ) : (
                  <Icon
                    name="LockClosedIcon"
                    variant="solid"
                    size={16}
                    color={THEME_COLORS.textMuted}
                  />
                )}
              </View>

              <Text
                numberOfLines={1}
                className={`font-bold text-sm ${
                  isUnlocked ? "text-text" : "text-subtext"
                }`}
              >
                {card.nama_kartu}
              </Text>

              <Text
                numberOfLines={2}
                className="text-subtext text-xs mt-1 leading-4"
              >
                {isUnlocked ? card.deskripsi : "Pilih kartu ini saat menyelesaikan Stage 5 atau 10 untuk membukanya."}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Modal Detail Kartu */}
      <Modal
        visible={!!selectedCard}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedCard(null)}
      >
        <View className="flex-1 bg-black/80 justify-center items-center px-6">
          <View className="w-full bg-surface border-2 border-gold rounded-3xl p-6 shadow-2xl">
            <View className="items-center mb-4">
              <View
                className={`w-16 h-16 rounded-2xl items-center justify-center border mb-3 ${
                  selectedCard?.unlocked
                    ? "bg-gold/20 border-gold"
                    : "bg-surface-light border-border/50"
                }`}
              >
                <Icon
                  name={selectedCard?.unlocked ? "SparklesIcon" : "LockClosedIcon"}
                  variant="solid"
                  size={32}
                  color={
                    selectedCard?.unlocked
                      ? THEME_COLORS.gold
                      : THEME_COLORS.textMuted
                  }
                />
              </View>

              <View className="bg-surface-card border border-border-gold/40 px-3 py-1 rounded-full mb-1">
                <Text className="text-gold font-bold text-xs">
                  {selectedCard?.class_kartu || "Common"}
                </Text>
              </View>

              <Text className="text-text font-extrabold text-xl text-center">
                {selectedCard?.nama_kartu}
              </Text>
            </View>

            <View className="bg-surface-card border border-border/50 rounded-2xl p-4 mb-5">
              <Text className="text-subtext text-xs font-semibold mb-1">
                EFEK KARTU:
              </Text>
              <Text className="text-text text-sm leading-5">
                {selectedCard?.deskripsi}
              </Text>

              <View className="h-[1px] bg-border/40 my-3" />

              <View className="flex-row justify-between items-center">
                <Text className="text-subtext text-xs">Status Perolehan:</Text>
                <Text
                  className={`text-xs font-bold ${
                    selectedCard?.unlocked ? "text-success" : "text-danger"
                  }`}
                >
                  {selectedCard?.unlocked
                    ? `Terbuka (${formatDate(selectedCard.tgl_didapat)})`
                    : "Belum Terkumpul"}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => setSelectedCard(null)}
              className="bg-primary py-3.5 rounded-xl items-center shadow-md shadow-primary/20"
            >
              <Text className="text-surface font-extrabold text-sm">
                Tutup Kartu
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};
