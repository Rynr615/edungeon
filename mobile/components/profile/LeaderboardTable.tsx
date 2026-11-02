// mobile/components/profile/LeaderboardTable.tsx
import React from "react";
import { View, Text, ScrollView, RefreshControl } from "react-native";
import { LeaderboardUser } from "../../types/profile";
import { Icon } from "../ui/Icon";

interface LeaderboardTableProps {
  leaderboard: LeaderboardUser[];
  userRank: number | null;
  currentUserId?: string;
  refreshing?: boolean;
  onRefresh?: () => void;
}

export const LeaderboardTable: React.FC<LeaderboardTableProps> = ({
  leaderboard,
  userRank,
  currentUserId,
  refreshing = false,
  onRefresh,
}) => {
  const top1 = leaderboard[0];
  const top2 = leaderboard[1];
  const top3 = leaderboard[2];
  const rest = leaderboard.slice(3);

  return (
    <ScrollView
      className="flex-1 px-5 pt-2"
      showsVerticalScrollIndicator={false}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#0284c7"
          />
        ) : undefined
      }
    >
      {/* Top 3 Podium */}
      <View className="flex-row justify-center items-end my-5 px-1">
        {/* Rank 2 (Silver) */}
        <View className="items-center flex-1">
          <View className="w-13 h-13 rounded-full border-2 border-slate-300 bg-slate-100 items-center justify-center mb-1 shadow-xs">
            <Icon name="ShieldCheckIcon" variant="solid" size={24} color="#64748b" />
          </View>
          <View className="bg-slate-200 px-2 py-0.5 rounded-full mb-1 border border-slate-300">
            <Text className="text-slate-800 font-mono font-bold text-[10px]">#2</Text>
          </View>
          <Text className="text-gray-900 font-mono font-bold text-xs text-center" numberOfLines={1}>
            {top2 ? top2.nama : "Kosong"}
          </Text>
          <Text className="text-amber-700 font-mono font-bold text-[11px]">
            {top2 ? `${top2.total_exp} EXP` : "-"}
          </Text>
          <View className="w-full h-18 bg-slate-100 rounded-t-xl mt-2 border-t-2 border-slate-300 border-x border-slate-200" />
        </View>

        {/* Rank 1 (Gold) */}
        <View className="items-center flex-1 mx-2">
          <Icon name="TrophyIcon" variant="solid" size={24} color="#d97706" />
          <View className="w-16 h-16 rounded-full border-3 border-amber-400 bg-amber-50 items-center justify-center mb-1 shadow-sm">
            <Icon name="SparklesIcon" variant="solid" size={32} color="#eab308" />
          </View>
          <View className="bg-amber-400 px-2.5 py-0.5 rounded-full mb-1 shadow-xs">
            <Text className="text-amber-950 font-mono font-bold text-xs">JUARA 1</Text>
          </View>
          <Text className="text-gray-900 font-mono font-bold text-xs text-center" numberOfLines={1}>
            {top1 ? top1.nama : "Pahlawan Terhebat"}
          </Text>
          <Text className="text-amber-700 font-mono font-bold text-xs">
            {top1 ? `${top1.total_exp} EXP` : "-"}
          </Text>
          <View className="w-full h-26 bg-amber-50 rounded-t-xl mt-2 border-t-4 border-amber-400 border-x border-amber-200" />
        </View>

        {/* Rank 3 (Bronze) */}
        <View className="items-center flex-1">
          <View className="w-13 h-13 rounded-full border-2 border-amber-700/40 bg-amber-100/50 items-center justify-center mb-1 shadow-xs">
            <Icon name="BoltIcon" variant="solid" size={24} color="#b45309" />
          </View>
          <View className="bg-amber-200 px-2 py-0.5 rounded-full mb-1 border border-amber-300">
            <Text className="text-amber-900 font-mono font-bold text-[10px]">#3</Text>
          </View>
          <Text className="text-gray-900 font-mono font-bold text-xs text-center" numberOfLines={1}>
            {top3 ? top3.nama : "Kosong"}
          </Text>
          <Text className="text-amber-700 font-mono font-bold text-[11px]">
            {top3 ? `${top3.total_exp} EXP` : "-"}
          </Text>
          <View className="w-full h-14 bg-amber-50/60 rounded-t-xl mt-2 border-t-2 border-amber-700/50 border-x border-amber-200" />
        </View>
      </View>

      {/* Rest of Leaderboard (Rank 4 - 10) in Clean Panel */}
      <View className="bg-[#dde3ea] rounded-2xl p-4 mb-24">
        <Text className="text-gray-800 font-mono font-bold text-xs mb-3 uppercase tracking-wider">
          Peringkat 4 - 10
        </Text>

        {rest.length === 0 && (
          <Text className="text-gray-600 font-mono text-xs text-center py-4">
            Belum ada siswa lain di papan peringkat
          </Text>
        )}

        {rest.map((user) => {
          const isMe = user.id_user === currentUserId;
          return (
            <View
              key={user.id_user}
              className={`flex-row items-center justify-between p-3 rounded-xl mb-2 ${
                isMe
                  ? "bg-white border-2 border-sky-400 shadow-xs"
                  : "bg-white border border-gray-200 shadow-xs"
              }`}
            >
              <View className="flex-row items-center flex-1 mr-2">
                <View className="w-7 h-7 rounded-full bg-slate-100 items-center justify-center mr-2.5 border border-gray-300">
                  <Text className="text-gray-700 font-mono font-bold text-xs">
                    #{user.rank}
                  </Text>
                </View>
                <View className="flex-1">
                  <Text
                    className={`font-mono font-bold text-xs ${
                      isMe ? "text-sky-700" : "text-gray-900"
                    }`}
                    numberOfLines={1}
                  >
                    {user.nama} {isMe ? "(Kamu)" : ""}
                  </Text>
                  <Text className="font-mono text-gray-500 text-[10px]">
                    Level {user.level} • {user.kelas}
                  </Text>
                </View>
              </View>

              <View className="items-end">
                <Text className="text-amber-700 font-mono font-bold text-xs">
                  {user.total_exp}
                </Text>
                <Text className="text-gray-400 font-mono font-semibold text-[9px]">EXP</Text>
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
};
