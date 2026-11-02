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
    { id: "warrior", label: "Knight" },
    { id: "mage", label: "Mage" },
    { id: "archer", label: "Archer" },
    { id: "common", label: "Umum" },
  ];

  const filteredCards =
    selectedClass === "semua"
      ? cards
      : cards.filter(
          (c) =>
            c.class_kartu?.toLowerCase() === selectedClass ||
            (selectedClass === "warrior" && c.class_kartu?.toLowerCase() === "knight")
        );

  const unlockedCount = cards.filter((c) => c.unlocked).length;

  return (
    <View className="flex-1 bg-white">
      {/* Top Header Bar */}
      <View className="pt-12 pb-3 px-6 flex-row items-center justify-between border-b border-gray-100 bg-white">
        <TouchableOpacity
          onPress={() => router.back()}
          className="p-1.5 rounded-full bg-slate-100 border border-gray-200"
          accessibilityLabel="Kembali"
        >
          <Icon name="ChevronLeftIcon" variant="outline" size={20} color="#111827" />
        </TouchableOpacity>
        <Text className="text-gray-900 font-bold text-xl tracking-tight">
          Koleksi Kartu Buff
        </Text>
        <View className="w-8" />
      </View>

      <ScrollView
        className="flex-1 px-6 pt-4"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              fetchCards();
            }}
            tintColor="#0284c7"
          />
        }
      >
        {/* Banner Summary (Matching Mockup style #dde3ea) */}
        <View className="bg-[#dde3ea] rounded-2xl p-4 mb-4">
          <Text className="text-gray-900 font-bold text-base mb-0.5">
            Katalog 12 Kartu Roguelike
          </Text>
          <Text className="font-mono text-gray-700 text-xs">
            {unlockedCount} dari {cards.length || 12} Kartu Buff Terbuka untuk Pertarungan
          </Text>
        </View>

        {/* Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="flex-row mb-4 pb-1"
        >
          {classFilters.map((f) => {
            const isSelected = selectedClass === f.id;
            return (
              <TouchableOpacity
                key={f.id}
                onPress={() => setSelectedClass(f.id)}
                className={`px-3.5 py-1.5 rounded-xl mr-2 border ${
                  isSelected
                    ? "bg-gray-900 border-gray-900"
                    : "bg-[#dde1e6] border-transparent"
                }`}
              >
                <Text
                  className={`font-mono text-xs font-semibold ${
                    isSelected ? "text-white" : "text-gray-800"
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
            <ActivityIndicator size="large" color="#0284c7" />
            <Text className="text-gray-500 font-mono text-xs mt-3">
              Memuat Koleksi Kartu...
            </Text>
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
                  className={`w-[48%] h-48 rounded-2xl p-3.5 mb-3 flex-col justify-between border ${
                    isUnlocked
                      ? "bg-white border-gray-200 shadow-xs"
                      : "bg-gray-100 border-gray-200 opacity-60"
                  }`}
                >
                  <View className="flex-row justify-between items-center">
                    <View className="bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                      <Text className="text-sky-700 font-mono font-bold text-[10px] uppercase">
                        {card.class_kartu}
                      </Text>
                    </View>
                    <Icon
                      name={isUnlocked ? "SparklesIcon" : "LockClosedIcon"}
                      variant="solid"
                      size={13}
                      color={isUnlocked ? "#eab308" : "#9ca3af"}
                    />
                  </View>

                  <View className="items-center justify-center my-2">
                    <View
                      className={`w-14 h-14 rounded-2xl items-center justify-center ${
                        isUnlocked
                          ? "bg-sky-50 border border-sky-200"
                          : "bg-gray-200"
                      }`}
                    >
                      <Icon
                        name={isUnlocked ? "BoltIcon" : "QuestionMarkCircleIcon"}
                        variant="solid"
                        size={28}
                        color={isUnlocked ? "#0284c7" : "#9ca3af"}
                      />
                    </View>
                  </View>

                  <View>
                    <Text
                      className={`font-mono font-bold text-xs text-center mb-0.5 ${
                        isUnlocked ? "text-gray-900" : "text-gray-400"
                      }`}
                      numberOfLines={1}
                    >
                      {isUnlocked ? card.nama_kartu : "Terkunci"}
                    </Text>
                    <Text
                      className="font-mono text-gray-500 text-[10px] text-center"
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
        <View className="flex-1 bg-black/50 justify-center items-center px-6">
          <View className="bg-white border border-gray-200 rounded-3xl p-6 w-full max-w-sm items-center shadow-2xl">
            <View className="w-18 h-18 rounded-2xl border-2 border-sky-200 bg-sky-50 items-center justify-center mb-4">
              <Icon
                name={activeModalCard?.unlocked ? "BoltIcon" : "QuestionMarkCircleIcon"}
                variant="solid"
                size={34}
                color={activeModalCard?.unlocked ? "#0284c7" : "#9ca3af"}
              />
            </View>

            <View className="bg-sky-50 px-3 py-1 rounded-full border border-sky-200 mb-2">
              <Text className="text-sky-700 font-mono font-bold text-xs uppercase tracking-wider">
                {activeModalCard?.class_kartu} • {activeModalCard?.tipe_efek || "Buff"}
              </Text>
            </View>

            <Text className="text-gray-900 font-bold text-xl text-center mb-2">
              {activeModalCard?.nama_kartu}
            </Text>

            <Text className="font-mono text-gray-600 text-center text-xs leading-5 mb-5">
              {activeModalCard?.deskripsi ||
                (activeModalCard?.unlocked
                  ? "Kartu buff ini memperkuat karakter Anda selama ekspedisi dungeon."
                  : "Buka kartu ini dengan mengalahkan musuh di stage dungeon.")}
            </Text>

            <TouchableOpacity
              onPress={() => setActiveModalCard(null)}
              className="bg-gray-900 w-full py-3.5 rounded-xl items-center shadow-sm"
            >
              <Text className="text-white font-bold text-base">Tutup</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
