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
import { LeaderboardTable } from "../../components/profile/LeaderboardTable";

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
          <LeaderboardTable
            leaderboard={leaderboard}
            userRank={userRank}
            currentUserId={userProfile?.id_user}
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              fetchLeaderboardData();
            }}
          />
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
