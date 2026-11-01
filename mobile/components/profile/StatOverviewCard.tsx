// mobile/components/profile/StatOverviewCard.tsx
import React from "react";
import { View, Text } from "react-native";
import { ProfileStats } from "../../types/profile";
import { GhostIcon, SkullIcon, TargetIcon } from "./WireframeIcons";
import { Icon } from "../ui/Icon";

interface StatOverviewCardProps {
  stats: ProfileStats | null;
}

export const StatOverviewCard: React.FC<StatOverviewCardProps> = ({ stats }) => {
  const monsterKalah = stats?.monster_dikalahkan ?? 24;
  const bossKalah = stats?.boss_dikalahkan ?? 2;
  const akurasi = stats?.akurasi ?? 85;
  const stageSelesai = stats?.stage_selesai || "3-1";

  return (
    <View className="mb-4">
      {/* Title Section */}
      <Text className="text-[#0f172a] text-lg font-bold mb-3">Statistik</Text>

      {/* Grid 2x2 Light Blue-Gray Cards */}
      <View className="flex-row flex-wrap justify-between">
        {/* 1. Monster dikalahkan */}
        <View className="w-[48%] bg-[#DBE4EC] p-3.5 rounded-2xl mb-3">
          <GhostIcon size={24} color="#0f172a" />
          <Text className="text-[#0f172a] text-2xl font-bold mt-1.5 font-mono">
            {monsterKalah}
          </Text>
          <Text className="text-[#0f172a] text-xs font-mono mt-0.5">
            Monster dikalahkan
          </Text>
        </View>

        {/* 2. Boss dikalahkan */}
        <View className="w-[48%] bg-[#DBE4EC] p-3.5 rounded-2xl mb-3">
          <SkullIcon size={24} color="#0f172a" />
          <Text className="text-[#0f172a] text-2xl font-bold mt-1.5 font-mono">
            {bossKalah}
          </Text>
          <Text className="text-[#0f172a] text-xs font-mono mt-0.5">
            Boss dikalahkan
          </Text>
        </View>

        {/* 3. Akurasi jawaban */}
        <View className="w-[48%] bg-[#DBE4EC] p-3.5 rounded-2xl">
          <TargetIcon size={24} color="#0f172a" />
          <Text className="text-[#0f172a] text-2xl font-bold mt-1.5 font-mono">
            {akurasi}%
          </Text>
          <Text className="text-[#0f172a] text-xs font-mono mt-0.5">
            Akurasi jawaban
          </Text>
        </View>

        {/* 4. Stage Selesai */}
        <View className="w-[48%] bg-[#DBE4EC] p-3.5 rounded-2xl">
          <Icon name="FlagIcon" variant="solid" size={24} color="#0f172a" />
          <Text className="text-[#0f172a] text-2xl font-bold mt-1.5 font-mono">
            {stageSelesai}
          </Text>
          <Text className="text-[#0f172a] text-xs font-mono mt-0.5">
            Stage Selesai
          </Text>
        </View>
      </View>
    </View>
  );
};
