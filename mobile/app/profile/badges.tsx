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

  const getTierColor = (tier: string) => {
    switch (tier?.toLowerCase()) {
      case "platinum":
        return { text: "text-cyan-400", border: "border-cyan-400", bg: "bg-cyan-500/20" };
      case "gold":
        return { text: "text-amber-400", border: "border-amber-400", bg: "bg-amber-500/20" };
      case "silver":
        return { text: "text-slate-300", border: "border-slate-300", bg: "bg-slate-400/20" };
      case "bronze":
      default:
        return { text: "text-amber-700", border: "border-amber-700", bg: "bg-amber-800/20" };
    }
  };

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
        <Text className="text-text font-black text-lg">Katalog Badge</Text>
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
              fetchBadges();
            }}
            tintColor="#3b82f6"
          />
        }
      >
        {/* Progress Card */}
        <View className="bg-surface border border-surface-light rounded-3xl p-5 mb-5 shadow-sm">
          <View className="flex-row items-center justify-between mb-3">
            <View>
              <Text className="text-text font-black text-lg">Prestasi Terkumpul</Text>
              <Text className="text-subtext text-xs">
                {unlockedCount} dari {badges.length || 15} Lencana Berhasil Diraih
              </Text>
            </View>
            <View className="bg-amber-500/20 px-3 py-1 rounded-full border border-amber-500/40">
              <Text className="text-amber-400 font-extrabold text-sm">
                {progressPercent}%
              </Text>
            </View>
          </View>

          <View className="h-3 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700">
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
          className="flex-row mb-5 pb-1"
        >
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                onPress={() => setSelectedCategory(cat.id)}
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
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Badge List */}
        {loading && !refreshing ? (
          <View className="py-20 items-center justify-center">
            <ActivityIndicator size="large" color="#3b82f6" />
            <Text className="text-subtext text-xs mt-3">Memuat Daftar Badge...</Text>
          </View>
        ) : (
          <View className="space-y-3 mb-16">
            {filteredBadges.map((badge) => {
              const tierColor = getTierColor(badge.tier);
              const isUnlocked = badge.unlocked;

              return (
                <TouchableOpacity
                  key={badge.id_badge}
                  onPress={() => setActiveModalBadge(badge)}
                  activeOpacity={0.7}
                  className={`bg-surface border ${
                    isUnlocked ? "border-surface-light" : "border-slate-800/80 opacity-60"
                  } p-4 rounded-3xl flex-row items-center justify-between mb-3 shadow-sm`}
                >
                  <View className="flex-row items-center flex-1 mr-3">
                    <View
                      className={`w-14 h-14 rounded-2xl border-2 ${
                        isUnlocked ? tierColor.border : "border-slate-700"
                      } ${
                        isUnlocked ? tierColor.bg : "bg-slate-800/60"
                      } items-center justify-center mr-3`}
                    >
                      <Icon
                        name={
                          isUnlocked && badge.icon_name
                            ? (badge.icon_name as IconName)
                            : "LockClosedIcon"
                        }
                        variant="solid"
                        size={26}
                        color={isUnlocked ? (badge.tier === "platinum" ? "#22d3ee" : "#f59e0b") : "#64748b"}
                      />
                    </View>

                    <View className="flex-1">
                      <View className="flex-row items-center mb-1">
                        <Text
                          className={`font-black text-sm mr-2 ${
                            isUnlocked ? "text-text" : "text-slate-400"
                          }`}
                          numberOfLines={1}
                        >
                          {badge.nama}
                        </Text>
                        <View
                          className={`px-2 py-0.5 rounded-md ${tierColor.bg} border ${tierColor.border}`}
                        >
                          <Text className={`font-extrabold text-[9px] uppercase ${tierColor.text}`}>
                            {badge.tier}
                          </Text>
                        </View>
                      </View>

                      <Text className="text-subtext text-xs leading-4" numberOfLines={2}>
                        {badge.deskripsi}
                      </Text>
                    </View>
                  </View>

                  <View className="items-end">
                    <Text
                      className={`text-[11px] font-bold ${
                        isUnlocked ? "text-emerald-400" : "text-slate-500"
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
        <View className="flex-1 bg-black/80 justify-center items-center px-6">
          <View className="bg-surface border border-surface-light rounded-3xl p-6 w-full max-w-sm items-center shadow-2xl">
            <View className="w-20 h-20 rounded-full border-4 border-amber-400 bg-amber-500/20 items-center justify-center mb-4">
              <Icon
                name={
                  activeModalBadge?.unlocked && activeModalBadge.icon_name
                    ? (activeModalBadge.icon_name as IconName)
                    : "LockClosedIcon"
                }
                variant="solid"
                size={38}
                color={activeModalBadge?.unlocked ? "#f59e0b" : "#94a3b8"}
              />
            </View>

            <View className="bg-amber-500/20 px-3 py-1 rounded-full border border-amber-500/40 mb-2">
              <Text className="text-amber-400 font-extrabold text-xs uppercase tracking-wider">
                {activeModalBadge?.tier} • {activeModalBadge?.kategori}
              </Text>
            </View>

            <Text className="text-text font-black text-xl text-center mb-2">
              {activeModalBadge?.nama}
            </Text>

            <Text className="text-subtext text-center text-sm leading-5 mb-5">
              {activeModalBadge?.deskripsi}
            </Text>

            <View className="w-full bg-background/80 p-3 rounded-2xl border border-surface-light mb-5">
              <Text className="text-slate-400 text-xs font-semibold text-center">
                Status:{" "}
                <Text
                  className={`font-bold ${
                    activeModalBadge?.unlocked ? "text-emerald-400" : "text-slate-500"
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
