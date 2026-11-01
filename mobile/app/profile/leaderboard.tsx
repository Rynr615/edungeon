// mobile/app/profile/leaderboard.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import { profileService } from "../../services/profileService";
import { LeaderboardUser } from "../../types/profile";
import { useAuth } from "../../context/AuthContext";
import { Icon } from "../../components/ui/Icon";

export default function LeaderboardScreen() {
  const router = useRouter();
  const { userProfile } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLeaderboardData = async () => {
    try {
      setLoading(true);
      const res = await profileService.getLeaderboard();
      setLeaderboard(res.leaderboard);
      setUserRank(res.user_rank);
    } catch (err) {
      console.error("[Leaderboard] Error fetching data:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLeaderboardData();
  }, []);

  const top1 = leaderboard[0];
  const top2 = leaderboard[1];
  const top3 = leaderboard[2];
  const rest = leaderboard.slice(3);

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
        <Text className="text-text font-black text-lg">Papan Peringkat</Text>
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
              fetchLeaderboardData();
            }}
            tintColor="#3b82f6"
          />
        }
      >
        {loading && !refreshing ? (
          <View className="py-20 items-center justify-center">
            <ActivityIndicator size="large" color="#3b82f6" />
            <Text className="text-subtext text-xs mt-3">Memuat Papan Peringkat...</Text>
          </View>
        ) : (
          <>
            {/* Top 3 Podium */}
            <View className="flex-row justify-center items-end my-6 px-2">
              {/* Rank 2 (Silver) */}
              <View className="items-center flex-1">
                <View className="w-14 h-14 rounded-full border-2 border-slate-300 bg-slate-400/20 items-center justify-center mb-1">
                  <Icon name="ShieldCheckIcon" variant="solid" size={28} color="#cbd5e1" />
                </View>
                <View className="bg-slate-300 px-2 py-0.5 rounded-full mb-1">
                  <Text className="text-slate-900 font-black text-[10px]">#2</Text>
                </View>
                <Text className="text-text font-bold text-xs text-center" numberOfLines={1}>
                  {top2 ? top2.nama : "Kosong"}
                </Text>
                <Text className="text-amber-400 font-bold text-[11px]">
                  {top2 ? `${top2.total_exp} EXP` : "-"}
                </Text>
                <View className="w-full h-20 bg-slate-800/80 rounded-t-xl mt-2 border-t-2 border-slate-400" />
              </View>

              {/* Rank 1 (Gold) */}
              <View className="items-center flex-1 mx-2">
                <Icon name="TrophyIcon" variant="solid" size={24} color="#f59e0b" />
                <View className="w-18 h-18 rounded-full border-4 border-amber-400 bg-amber-500/20 items-center justify-center mb-1 shadow-lg shadow-amber-500/30">
                  <Icon name="SparklesIcon" variant="solid" size={36} color="#fbbf24" />
                </View>
                <View className="bg-amber-400 px-2.5 py-0.5 rounded-full mb-1">
                  <Text className="text-amber-950 font-black text-xs">JUARA 1</Text>
                </View>
                <Text className="text-text font-black text-sm text-center" numberOfLines={1}>
                  {top1 ? top1.nama : "Pahlawan Terhebat"}
                </Text>
                <Text className="text-amber-400 font-extrabold text-xs">
                  {top1 ? `${top1.total_exp} EXP` : "-"}
                </Text>
                <View className="w-full h-28 bg-amber-500/10 rounded-t-xl mt-2 border-t-4 border-amber-400" />
              </View>

              {/* Rank 3 (Bronze) */}
              <View className="items-center flex-1">
                <View className="w-14 h-14 rounded-full border-2 border-amber-700 bg-amber-800/20 items-center justify-center mb-1">
                  <Icon name="BoltIcon" variant="solid" size={28} color="#d97706" />
                </View>
                <View className="bg-amber-700 px-2 py-0.5 rounded-full mb-1">
                  <Text className="text-white font-black text-[10px]">#3</Text>
                </View>
                <Text className="text-text font-bold text-xs text-center" numberOfLines={1}>
                  {top3 ? top3.nama : "Kosong"}
                </Text>
                <Text className="text-amber-400 font-bold text-[11px]">
                  {top3 ? `${top3.total_exp} EXP` : "-"}
                </Text>
                <View className="w-full h-16 bg-slate-800/80 rounded-t-xl mt-2 border-t-2 border-amber-700" />
              </View>
            </View>

            {/* Rest of Leaderboard (Rank 4 - 10) */}
            <View className="bg-surface border border-surface-light rounded-3xl p-3 mb-24 shadow-md">
              <Text className="text-subtext font-bold text-xs px-2 mb-2 uppercase tracking-wider">
                Peringkat 4 - 10
              </Text>

              {rest.length === 0 && (
                <Text className="text-slate-500 text-xs text-center py-4">
                  Belum ada siswa lain di papan peringkat
                </Text>
              )}

              {rest.map((user) => {
                const isMe = user.id_user === userProfile?.id_user;
                return (
                  <View
                    key={user.id_user}
                    className={`flex-row items-center justify-between p-3 rounded-2xl mb-1.5 ${
                      isMe ? "bg-primary/20 border border-primary" : "bg-surface-light/30"
                    }`}
                  >
                    <View className="flex-row items-center flex-1">
                      <View className="w-7 h-7 rounded-full bg-slate-800 items-center justify-center mr-3">
                        <Text className="text-slate-300 font-extrabold text-xs">
                          #{user.rank}
                        </Text>
                      </View>
                      <View className="flex-1">
                        <Text
                          className={`font-bold text-sm ${isMe ? "text-blue-400" : "text-text"}`}
                          numberOfLines={1}
                        >
                          {user.nama} {isMe ? "(Kamu)" : ""}
                        </Text>
                        <Text className="text-subtext text-[11px]">
                          Level {user.level} • {user.kelas}
                        </Text>
                      </View>
                    </View>

                    <View className="items-end">
                      <Text className="text-amber-400 font-black text-sm">
                        {user.total_exp}
                      </Text>
                      <Text className="text-slate-500 font-semibold text-[10px]">EXP</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </>
        )}
      </ScrollView>

      {/* Floating User Rank Banner */}
      {userRank && (
        <View className="absolute bottom-5 left-5 right-5 bg-primary/95 border border-blue-400 p-4 rounded-2xl shadow-xl flex-row items-center justify-between">
          <View className="flex-row items-center">
            <View className="w-10 h-10 rounded-full bg-white/20 items-center justify-center mr-3">
              <Text className="text-white font-black text-base">#{userRank}</Text>
            </View>
            <View>
              <Text className="text-white font-black text-sm">Posisi Peringkat Kamu</Text>
              <Text className="text-blue-100 text-xs">
                Total {userProfile?.total_exp || 0} EXP terkumpul
              </Text>
            </View>
          </View>
          <View className="bg-white/20 px-3 py-1 rounded-full">
            <Text className="text-white font-bold text-xs">Top Performer</Text>
          </View>
        </View>
      )}
    </View>
  );
}
