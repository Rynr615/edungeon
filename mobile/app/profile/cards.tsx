// mobile/app/profile/cards.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import { profileService } from "../../services/profileService";
import { CardCollectionItem } from "../../types/profile";
import { Icon } from "../../components/ui/Icon";

export default function CardsCatalogScreen() {
  const router = useRouter();
  const [cards, setCards] = useState<CardCollectionItem[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>("semua");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeModalCard, setActiveModalCard] = useState<CardCollectionItem | null>(null);

  const fetchCards = async () => {
    try {
      setLoading(true);
      const data = await profileService.getUserCardCollection();
      setCards(data);
    } catch (err) {
      console.error("[CardsCatalogScreen] Error fetching cards:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const classFilters = [
    { id: "semua", label: "Semua" },
    { id: "warrior", label: "Warrior" },
    { id: "mage", label: "Mage" },
    { id: "archer", label: "Archer" },
    { id: "common", label: "Umum" },
  ];

  const filteredCards =
    selectedClass === "semua"
      ? cards
      : cards.filter((c) => c.class_kartu?.toLowerCase() === selectedClass);

  const unlockedCount = cards.filter((c) => c.unlocked).length;

  return (
    <View className="flex-1 bg-background">
      {/* Top App Bar */}
      <View className="pt-12 pb-4 px-5 flex-row items-center justify-between border-b border-surface-light bg-surface/80">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full bg-surface-light/60 items-center justify-center border border-slate-700"
        >
          <Icon name="ChevronLeftIcon" variant="outline" size={20} color="#f8fafc" />
        </TouchableOpacity>
        <Text className="text-text font-black text-lg">Koleksi Kartu Buff</Text>
        <View className="w-10" />
      </View>

      <ScrollView
        className="flex-1 px-5 pt-4"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              fetchCards();
            }}
            tintColor="#3b82f6"
          />
        }
      >
        {/* Banner Summary */}
        <View className="bg-surface border border-surface-light rounded-3xl p-5 mb-5 shadow-sm">
          <Text className="text-text font-black text-lg">Kartu Roguelike</Text>
          <Text className="text-subtext text-xs mt-0.5">
            {unlockedCount} dari {cards.length || 12} Kartu Buff Terbuka untuk Pertarungan
          </Text>
        </View>

        {/* Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="flex-row mb-5 pb-1"
        >
          {classFilters.map((f) => {
            const isSelected = selectedClass === f.id;
            return (
              <TouchableOpacity
                key={f.id}
                onPress={() => setSelectedClass(f.id)}
                className={`px-4 py-2 rounded-2xl mr-2.5 border ${
                  isSelected
                    ? "bg-primary border-primary shadow-sm shadow-blue-500/30"
                    : "bg-surface border-surface-light"
                }`}
              >
                <Text
                  className={`font-bold text-xs ${
                    isSelected ? "text-white" : "text-subtext"
                  }`}
                >
                  {f.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* 2-Column Grid */}
        {loading && !refreshing ? (
          <View className="py-20 items-center justify-center">
            <ActivityIndicator size="large" color="#3b82f6" />
            <Text className="text-subtext text-xs mt-3">Memuat Koleksi Kartu...</Text>
          </View>
        ) : (
          <View className="flex-row flex-wrap justify-between mb-16">
            {filteredCards.map((card) => {
              const isUnlocked = card.unlocked;

              return (
                <TouchableOpacity
                  key={card.id_kartu}
                  onPress={() => setActiveModalCard(card)}
                  activeOpacity={0.8}
                  className={`w-[48%] h-48 rounded-3xl p-3.5 mb-3 flex-col justify-between border ${
                    isUnlocked
                      ? "bg-surface border-surface-light shadow-sm"
                      : "bg-slate-900/60 border-slate-800/80 opacity-60"
                  }`}
                >
                  <View className="flex-row justify-between items-center">
                    <View className="bg-primary/20 px-2 py-0.5 rounded-md border border-primary/40">
                      <Text className="text-blue-400 font-extrabold text-[10px] uppercase">
                        {card.class_kartu}
                      </Text>
                    </View>
                    <Icon
                      name={isUnlocked ? "SparklesIcon" : "LockClosedIcon"}
                      variant="solid"
                      size={12}
                      color={isUnlocked ? "#fbbf24" : "#64748b"}
                    />
                  </View>

                  <View className="items-center justify-center my-2">
                    <View
                      className={`w-14 h-14 rounded-2xl items-center justify-center ${
                        isUnlocked
                          ? "bg-blue-500/10 border border-blue-500/30"
                          : "bg-slate-800"
                      }`}
                    >
                      <Icon
                        name={isUnlocked ? "BoltIcon" : "QuestionMarkCircleIcon"}
                        variant="solid"
                        size={28}
                        color={isUnlocked ? "#38bdf8" : "#64748b"}
                      />
                    </View>
                  </View>

                  <View>
                    <Text
                      className={`font-black text-xs text-center mb-0.5 ${
                        isUnlocked ? "text-text" : "text-slate-500"
                      }`}
                      numberOfLines={1}
                    >
                      {isUnlocked ? card.nama_kartu : "Terkunci"}
                    </Text>
                    <Text
                      className="text-subtext text-[10px] text-center"
                      numberOfLines={1}
                    >
                      {card.tipe_efek || "Buff Roguelike"}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* Modal Detail Kartu */}
      <Modal
        visible={!!activeModalCard}
        transparent
        animationType="fade"
        onRequestClose={() => setActiveModalCard(null)}
      >
        <View className="flex-1 bg-black/80 justify-center items-center px-6">
          <View className="bg-surface border border-surface-light rounded-3xl p-6 w-full max-w-sm items-center shadow-2xl">
            <View className="w-18 h-18 rounded-2xl border-2 border-blue-400 bg-blue-500/20 items-center justify-center mb-4">
              <Icon
                name={activeModalCard?.unlocked ? "BoltIcon" : "QuestionMarkCircleIcon"}
                variant="solid"
                size={34}
                color={activeModalCard?.unlocked ? "#38bdf8" : "#94a3b8"}
              />
            </View>

            <View className="bg-blue-500/20 px-3 py-1 rounded-full border border-blue-500/40 mb-2">
              <Text className="text-blue-400 font-extrabold text-xs uppercase tracking-wider">
                {activeModalCard?.class_kartu} • {activeModalCard?.tipe_efek || "Buff"}
              </Text>
            </View>

            <Text className="text-text font-black text-xl text-center mb-2">
              {activeModalCard?.nama_kartu}
            </Text>

            <Text className="text-subtext text-center text-sm leading-5 mb-5">
              {activeModalCard?.deskripsi ||
                (activeModalCard?.unlocked
                  ? "Kartu buff ini memperkuat karakter Anda selama ekspedisi dungeon."
                  : "Buka kartu ini dengan mengalahkan musuh di stage dungeon.")}
            </Text>

            <TouchableOpacity
              onPress={() => setActiveModalCard(null)}
              className="bg-primary w-full py-3.5 rounded-xl items-center"
            >
              <Text className="text-white font-bold text-base">Tutup</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
