// mobile/components/profile/LeaderboardModal.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { LeaderboardUser, UserProfile } from "../../types/profile";
import { Icon } from "../ui/Icon";

interface LeaderboardModalProps {
  visible: boolean;
  onClose: () => void;
  leaderboardData: LeaderboardUser[];
  currentUser?: UserProfile | null;
  loading?: boolean;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  visible,
  onClose,
  leaderboardData = [],
  currentUser,
  loading = false,
}) => {
  const [filterKelas, setFilterKelas] = useState<"semua" | "kelas">("semua");

  const filteredList =
    filterKelas === "kelas" && currentUser?.kelas
      ? leaderboardData.filter((item) => item.kelas === currentUser.kelas)
      : leaderboardData;

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <View className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500 items-center justify-center">
            <Icon name="TrophyIcon" variant="solid" size={16} color="#eab308" />
          </View>
        );
      case 2:
        return (
          <View className="w-8 h-8 rounded-full bg-slate-400/20 border border-slate-400 items-center justify-center">
            <Text className="text-slate-300 font-extrabold text-xs">#2</Text>
          </View>
        );
      case 3:
        return (
          <View className="w-8 h-8 rounded-full bg-amber-700/20 border border-amber-600 items-center justify-center">
            <Text className="text-amber-500 font-extrabold text-xs">#3</Text>
          </View>
        );
      default:
        return (
          <View className="w-8 h-8 rounded-full bg-surface-light/40 items-center justify-center">
            <Text className="text-subtext font-bold text-xs">#{rank}</Text>
          </View>
        );
    }
  };

  const getRoleIcon = (role?: string) => {
    switch (role) {
      case "knight":
        return <Icon name="ShieldCheckIcon" variant="solid" size={16} color="#3b82f6" />;
      case "mage":
        return <Icon name="SparklesIcon" variant="solid" size={16} color="#06b6d4" />;
      case "archer":
        return <Icon name="BoltIcon" variant="solid" size={16} color="#10b981" />;
      default:
        return <Icon name="UserIcon" variant="solid" size={16} color="#f59e0b" />;
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/80 justify-end">
        <View className="bg-surface border-t border-surface-light rounded-t-3xl max-h-[88%] p-6 shadow-2xl">
          {/* Header */}
          <View className="flex-row items-center justify-between pb-4 border-b border-surface-light/60">
            <View className="flex-row items-center">
              <View className="w-10 h-10 rounded-xl bg-amber-500/20 items-center justify-center mr-3">
                <Icon name="TrophyIcon" variant="solid" size={22} color="#eab308" />
              </View>
              <View>
                <Text className="text-text font-bold text-xl">Papan Peringkat</Text>
                <Text className="text-subtext text-xs">Top Jawara Petualang SMA</Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={onClose}
              className="w-9 h-9 rounded-full bg-surface-light/60 items-center justify-center"
            >
              <Icon name="XMarkIcon" variant="outline" size={20} color="#94a3b8" />
            </TouchableOpacity>
          </View>

          {/* Filter Tab: Semua Kelas vs Kelas Sendiri */}
          <View className="flex-row bg-background/80 p-1 rounded-2xl border border-surface-light/50 my-4">
            <TouchableOpacity
              onPress={() => setFilterKelas("semua")}
              className={`flex-1 py-2 rounded-xl items-center ${
                filterKelas === "semua" ? "bg-primary shadow" : ""
              }`}
            >
              <Text
                className={`text-xs font-bold ${
                  filterKelas === "semua" ? "text-white" : "text-subtext"
                }`}
              >
                Seluruh Sekolah
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setFilterKelas("kelas")}
              className={`flex-1 py-2 rounded-xl items-center ${
                filterKelas === "kelas" ? "bg-primary shadow" : ""
              }`}
            >
              <Text
                className={`text-xs font-bold ${
                  filterKelas === "kelas" ? "text-white" : "text-subtext"
                }`}
              >
                Kelas {currentUser?.kelas || "Saya"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* List Leaderboard */}
          {loading ? (
            <View className="py-12 items-center justify-center">
              <ActivityIndicator color="#eab308" size="large" />
              <Text className="text-subtext text-xs mt-3">Memuat Papan Peringkat...</Text>
            </View>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false} className="max-h-96">
              {filteredList.length === 0 ? (
                <View className="py-12 items-center">
                  <Icon name="InformationCircleIcon" variant="outline" size={32} color="#64748b" />
                  <Text className="text-subtext text-xs mt-2">
                    Belum ada data peringkat untuk kategori ini.
                  </Text>
                </View>
              ) : (
                filteredList.map((item, idx) => {
                  const rank = idx + 1;
                  const isCurrent =
                    item.is_current_user ||
                    (currentUser && item.id_user === currentUser.id_user);

                  return (
                    <View
                      key={item.id_user || `${item.username}-${idx}`}
                      className={`flex-row items-center justify-between p-3.5 rounded-2xl mb-2.5 border ${
                        isCurrent
                          ? "bg-primary/15 border-primary/60 shadow-sm"
                          : "bg-background/80 border-surface-light/40"
                      }`}
                    >
                      {/* Peringkat & Avatar Siswa */}
                      <View className="flex-row items-center flex-1 mr-2">
                        {getRankBadge(rank)}
                        <View className="w-8 h-8 rounded-full bg-surface-light/40 items-center justify-center ml-2 mr-2.5">
                          {getRoleIcon(item.avatar_class)}
                        </View>
                        <View className="flex-1">
                          <View className="flex-row items-center">
                            <Text
                              className={`font-bold text-sm ${
                                isCurrent ? "text-white" : "text-text"
                              }`}
                              numberOfLines={1}
                            >
                              {item.nama}
                            </Text>
                            {isCurrent && (
                              <View className="ml-1.5 bg-primary/40 px-1.5 py-0.2 rounded">
                                <Text className="text-blue-300 text-[9px] font-bold">KAMU</Text>
                              </View>
                            )}
                          </View>
                          <Text className="text-subtext text-xs">
                            @{item.username} • {item.kelas}
                          </Text>
                        </View>
                      </View>

                      {/* EXP & Level */}
                      <View className="items-end">
                        <View className="flex-row items-center">
                          <Icon name="SparklesIcon" variant="solid" size={12} color="#eab308" />
                          <Text className="text-exp font-extrabold text-sm ml-1">
                            {item.total_exp.toLocaleString("id-ID")}
                          </Text>
                        </View>
                        <Text className="text-subtext text-[11px] font-semibold">
                          Lvl {item.level || Math.floor(item.total_exp / 100) + 1}
                        </Text>
                      </View>
                    </View>
                  );
                })
              )}
            </ScrollView>
          )}

          {/* Footer Tombol Tutup */}
          <TouchableOpacity
            onPress={onClose}
            className="w-full bg-surface-light/70 py-3.5 rounded-xl items-center mt-4 border border-surface-light"
            activeOpacity={0.8}
          >
            <Text className="text-text font-bold text-base">Tutup</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
