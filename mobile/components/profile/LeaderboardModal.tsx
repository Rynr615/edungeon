// mobile/components/profile/LeaderboardModal.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Icon } from "../ui/Icon";
import { THEME_COLORS } from "../../constants/theme";
import { LeaderboardEntry } from "../../types/profile";
import { profileService } from "../../services/profileService";

interface LeaderboardModalProps {
  visible: boolean;
  currentUserId?: string;
  onClose: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  visible,
  currentUserId,
  onClose,
}) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      loadLeaderboard();
    }
  }, [visible]);

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      const res = await profileService.getLeaderboard();
      setLeaderboard(res.leaderboard || []);
      setUserRank(res.user_rank);
    } catch (err) {
      console.error("[LeaderboardModal] Error loadLeaderboard:", err);
    } finally {
      setLoading(false);
    }
  };

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return { color: THEME_COLORS.badgeGold, icon: "TrophyIcon" as const, label: "#1" };
      case 2:
        return { color: THEME_COLORS.badgeSilver, icon: "TrophyIcon" as const, label: "#2" };
      case 3:
        return { color: THEME_COLORS.badgeBronze, icon: "TrophyIcon" as const, label: "#3" };
      default:
        return { color: THEME_COLORS.subtext, icon: null, label: `#${rank}` };
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/85 justify-end">
        <View className="bg-surface border-t-2 border-gold rounded-t-3xl p-6 h-[85%] shadow-2xl">
          {/* Header Modal */}
          <View className="flex-row justify-between items-center mb-4">
            <View className="flex-row items-center">
              <Icon name="TrophyIcon" variant="solid" size={24} color={THEME_COLORS.badgeGold} />
              <View className="ml-2.5">
                <Text className="text-text font-bold text-lg">Papan Peringkat</Text>
                <Text className="text-subtext text-xs">Top 10 Pahlawan Edungeon</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} className="p-1">
              <Icon name="XMarkIcon" variant="outline" size={24} color={THEME_COLORS.subtext} />
            </TouchableOpacity>
          </View>

          {/* User Rank Card */}
          {userRank !== null && (
            <View className="bg-surface-card border-2 border-gold/70 rounded-2xl p-3.5 mb-4 flex-row items-center justify-between shadow-sm shadow-gold/20">
              <View className="flex-row items-center">
                <View className="w-10 h-10 rounded-full bg-gold/20 border border-gold items-center justify-center mr-3">
                  <Text className="text-gold font-extrabold text-sm">#{userRank}</Text>
                </View>
                <View>
                  <Text className="text-text font-bold text-sm">Peringkat Anda</Text>
                  <Text className="text-subtext text-xs">Terus selesaikan dungeon untuk naik peringkat!</Text>
                </View>
              </View>
            </View>
          )}

          {/* List Leaderboard */}
          {loading ? (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator color={THEME_COLORS.gold} size="large" />
              <Text className="text-subtext text-xs mt-3">Mengambil data peringkat...</Text>
            </View>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
              {leaderboard.length === 0 ? (
                <View className="items-center justify-center py-12">
                  <Icon name="TrophyIcon" variant="outline" size={40} color={THEME_COLORS.textMuted} />
                  <Text className="text-subtext text-sm mt-3">Belum ada data pahlawan.</Text>
                </View>
              ) : (
                leaderboard.map((item) => {
                  const badge = getRankBadge(item.rank);
                  const isCurrentUser = item.id_user === currentUserId;

                  return (
                    <View
                      key={item.id_user}
                      className={`flex-row items-center justify-between p-3.5 mb-2.5 rounded-2xl border ${
                        isCurrentUser
                          ? "bg-surface-card border-gold shadow-sm shadow-gold/30"
                          : "bg-surface-card/60 border-border/50"
                      }`}
                    >
                      <View className="flex-row items-center flex-1 mr-2">
                        {/* Rank Badge */}
                        <View
                          className="w-9 h-9 rounded-full items-center justify-center mr-3 border"
                          style={{
                            borderColor: badge.color,
                            backgroundColor: `${badge.color}20`,
                          }}
                        >
                          <Text
                            className="font-extrabold text-xs"
                            style={{ color: badge.color }}
                          >
                            {badge.label}
                          </Text>
                        </View>

                        {/* Info Siswa */}
                        <View className="flex-1">
                          <View className="flex-row items-center">
                            <Text
                              numberOfLines={1}
                              className={`font-bold text-sm mr-2 ${
                                isCurrentUser ? "text-gold" : "text-text"
                              }`}
                            >
                              {item.nama}
                            </Text>
                            {isCurrentUser && (
                              <View className="bg-gold px-1.5 py-0.2 rounded">
                                <Text className="text-surface font-extrabold text-[9px]">KAMU</Text>
                              </View>
                            )}
                          </View>
                          <Text className="text-subtext text-xs mt-0.5">
                            Level {item.level} • {item.kelas || "Kelas X"}
                          </Text>
                        </View>
                      </View>

                      {/* Total EXP */}
                      <View className="items-end">
                        <Text className="text-gold font-extrabold text-sm">
                          {item.total_exp.toLocaleString()}
                        </Text>
                        <Text className="text-subtext text-[10px]">EXP</Text>
                      </View>
                    </View>
                  );
                })
              )}
            </ScrollView>
          )}

          {/* Tombol Tutup */}
          <TouchableOpacity
            onPress={onClose}
            className="bg-primary py-3.5 rounded-xl items-center mt-3 shadow-md shadow-primary/20"
          >
            <Text className="text-surface font-extrabold text-sm">Tutup Leaderboard</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
