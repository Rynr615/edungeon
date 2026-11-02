// mobile/app/profile/leaderboard.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
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
          Papan Peringkat
        </Text>
        <View className="w-8" />
      </View>

      {loading && !refreshing ? (
        <View className="flex-1 py-20 items-center justify-center">
          <ActivityIndicator size="large" color="#0284c7" />
          <Text className="text-gray-500 font-mono text-xs mt-3">
            Memuat Papan Peringkat...
          </Text>
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

      {/* Floating User Rank Banner */}
      {userRank && (
        <View className="absolute bottom-5 left-5 right-5 bg-gray-900 border border-gray-800 p-4 rounded-2xl shadow-xl flex-row items-center justify-between">
          <View className="flex-row items-center">
            <View className="w-10 h-10 rounded-full bg-white/20 items-center justify-center mr-3 border border-white/30">
              <Text className="text-white font-mono font-bold text-base">#{userRank}</Text>
            </View>
            <View>
              <Text className="text-white font-bold text-sm">Posisi Peringkat Kamu</Text>
              <Text className="text-gray-300 font-mono text-xs">
                Total {userProfile?.total_exp || 0} EXP terkumpul
              </Text>
            </View>
          </View>
          <View className="bg-amber-400 px-3 py-1 rounded-full">
            <Text className="text-amber-950 font-bold text-xs">Top Siswa</Text>
          </View>
        </View>
      )}
    </View>
  );
}
