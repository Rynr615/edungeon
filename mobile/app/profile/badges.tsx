// mobile/app/profile/badges.tsx
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
import { BadgeItem } from "../../types/profile";
import { Icon, IconName } from "../../components/ui/Icon";

export default function BadgesScreen() {
  const router = useRouter();
  const [badges, setBadges] = useState<BadgeItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("semua");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeModalBadge, setActiveModalBadge] = useState<BadgeItem | null>(null);

  const fetchBadges = async () => {
    try {
      setLoading(true);
      const data = await profileService.getUserBadges();
      setBadges(data);
    } catch (err) {
      console.error("[BadgesScreen] Error fetching badges:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBadges();
  }, []);

  const categories = [
    { id: "semua", label: "Semua" },
    { id: "klasik", label: "Klasik" },
    { id: "boss", label: "Boss" },
    { id: "streak", label: "Streak" },
    { id: "spesialis", label: "Spesialis" },
  ];

  const filteredBadges =
    selectedCategory === "semua"
      ? badges
      : badges.filter((b) => b.kategori?.toLowerCase() === selectedCategory);

  const unlockedCount = badges.filter((b) => b.unlocked).length;
  const progressPercent =
    badges.length > 0 ? Math.round((unlockedCount / badges.length) * 100) : 0;

  const getTierStyles = (tier: string) => {
    switch (tier?.toLowerCase()) {
      case "platinum":
      case "ruby":
        return { text: "text-rose-700", border: "border-rose-300", bg: "bg-rose-50", iconColor: "#e11d48" };
      case "gold":
        return { text: "text-amber-800", border: "border-amber-300", bg: "bg-amber-50", iconColor: "#d97706" };
      case "silver":
        return { text: "text-slate-700", border: "border-slate-300", bg: "bg-slate-100", iconColor: "#64748b" };
      case "bronze":
      default:
        return { text: "text-amber-900", border: "border-amber-700/40", bg: "bg-amber-100/50", iconColor: "#b45309" };
    }
  };

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
          Katalog 15 Badge
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
              fetchBadges();
            }}
            tintColor="#0284c7"
          />
        }
      >
        {/* Progress Card (Matching Mockup #dde3ea) */}
        <View className="bg-[#dde3ea] rounded-2xl p-4 mb-4">
          <View className="flex-row items-center justify-between mb-2.5">
            <View>
              <Text className="text-gray-900 font-bold text-base">Prestasi Terkumpul</Text>
              <Text className="font-mono text-gray-700 text-xs">
                {unlockedCount} dari {badges.length || 15} Lencana Berhasil Diraih
              </Text>
            </View>
            <View className="bg-white px-2.5 py-1 rounded-full border border-gray-300 shadow-xs">
              <Text className="text-amber-600 font-mono font-bold text-xs">
                {progressPercent}%
              </Text>
            </View>
          </View>

          <View className="h-2.5 w-full bg-white/70 rounded-full overflow-hidden border border-gray-300">
            <View
              className="h-full bg-amber-400 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </View>
        </View>

        {/* Category Filter Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="flex-row mb-4 pb-1"
        >
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                onPress={() => setSelectedCategory(cat.id)}
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
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Badge List */}
        {loading && !refreshing ? (
          <View className="py-20 items-center justify-center">
            <ActivityIndicator size="large" color="#0284c7" />
            <Text className="text-gray-500 font-mono text-xs mt-3">
              Memuat Daftar Badge...
            </Text>
          </View>
        ) : (
          <View className="space-y-3 mb-16">
            {filteredBadges.map((badge) => {
              const tierStyle = getTierStyles(badge.tier);
              const isUnlocked = badge.unlocked;

              return (
                <TouchableOpacity
                  key={badge.id_badge}
                  onPress={() => setActiveModalBadge(badge)}
                  activeOpacity={0.7}
                  className={`border rounded-2xl p-3.5 flex-row items-center justify-between mb-3 ${
                    isUnlocked
                      ? "bg-white border-gray-200 shadow-xs"
                      : "bg-gray-50 border-gray-200 opacity-60"
                  }`}
                >
                  <View className="flex-row items-center flex-1 mr-3">
                    <View
                      className={`w-13 h-13 rounded-2xl border ${
                        isUnlocked ? tierStyle.border : "border-gray-300"
                      } ${
                        isUnlocked ? tierStyle.bg : "bg-gray-200"
                      } items-center justify-center mr-3`}
                    >
                      <Icon
                        name={
                          isUnlocked && badge.icon_name
                            ? (badge.icon_name as IconName)
                            : "LockClosedIcon"
                        }
                        variant="solid"
                        size={24}
                        color={isUnlocked ? tierStyle.iconColor : "#9ca3af"}
                      />
                    </View>

                    <View className="flex-1">
                      <View className="flex-row items-center mb-0.5">
                        <Text
                          className={`font-mono font-bold text-sm mr-2 ${
                            isUnlocked ? "text-gray-900" : "text-gray-400"
                          }`}
                          numberOfLines={1}
                        >
                          {badge.nama}
                        </Text>
                        <View
                          className={`px-1.5 py-0.5 rounded ${tierStyle.bg} border ${tierStyle.border}`}
                        >
                          <Text className={`font-mono font-bold text-[9px] uppercase ${tierStyle.text}`}>
                            {badge.tier}
                          </Text>
                        </View>
                      </View>

                      <Text className="font-mono text-gray-500 text-xs leading-4" numberOfLines={2}>
                        {badge.deskripsi}
                      </Text>
                    </View>
                  </View>

                  <View className="items-end">
                    <Text
                      className={`text-[11px] font-mono font-bold ${
                        isUnlocked ? "text-emerald-600" : "text-gray-400"
                      }`}
                    >
                      {isUnlocked ? "Terbuka" : "Terkunci"}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* Modal Badge Detail */}
      <Modal
        visible={!!activeModalBadge}
        transparent
        animationType="fade"
        onRequestClose={() => setActiveModalBadge(null)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center px-6">
          <View className="bg-white border border-gray-200 rounded-3xl p-6 w-full max-w-sm items-center shadow-2xl">
            <View className="w-20 h-20 rounded-full border-4 border-amber-300 bg-amber-50 items-center justify-center mb-4">
              <Icon
                name={
                  activeModalBadge?.unlocked && activeModalBadge.icon_name
                    ? (activeModalBadge.icon_name as IconName)
                    : "LockClosedIcon"
                }
                variant="solid"
                size={38}
                color={activeModalBadge?.unlocked ? "#d97706" : "#9ca3af"}
              />
            </View>

            <View className="bg-amber-50 px-3 py-1 rounded-full border border-amber-200 mb-2">
              <Text className="text-amber-800 font-mono font-bold text-xs uppercase tracking-wider">
                {activeModalBadge?.tier} • {activeModalBadge?.kategori}
              </Text>
            </View>

            <Text className="text-gray-900 font-bold text-xl text-center mb-2">
              {activeModalBadge?.nama}
            </Text>

            <Text className="font-mono text-gray-600 text-center text-xs leading-5 mb-5">
              {activeModalBadge?.deskripsi}
            </Text>

            <View className="w-full bg-slate-50 p-3 rounded-2xl border border-gray-200 mb-5">
              <Text className="text-gray-600 font-mono text-xs text-center">
                Status:{" "}
                <Text
                  className={`font-bold ${
                    activeModalBadge?.unlocked ? "text-emerald-600" : "text-gray-400"
                  }`}
                >
                  {activeModalBadge?.unlocked
                    ? `Terbuka (${activeModalBadge.tgl_perolehan?.slice(0, 10) || "Tercapai"})`
                    : "Tantangan Belum Selesai"}
                </Text>
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => setActiveModalBadge(null)}
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
