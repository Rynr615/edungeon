// mobile/components/profile/StatOverviewCard.tsx
import React from "react";
import { View, Text } from "react-native";
import { Icon, IconName } from "../ui/Icon";

interface StatItem {
  id: string;
  label: string;
  value: string | number;
  icon: IconName;
  color: string;
  bgColor: string;
  borderColor: string;
}

interface StatOverviewProps {
  monsterCount: number;
  bossCount: number;
  accuracy: number;
  highestStage?: string;
}

export const StatOverviewCard: React.FC<StatOverviewProps> = ({
  monsterCount = 0,
  bossCount = 0,
  accuracy = 0,
  highestStage = "Stage 1-1",
}) => {
  const stats: StatItem[] = [
    {
      id: "monster",
      label: "Monster Dikalahkan",
      value: monsterCount,
      icon: "FireIcon",
      color: "#ef4444",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/30",
    },
    {
      id: "boss",
      label: "Boss Ditaklukkan",
      value: bossCount,
      icon: "TrophyIcon",
      color: "#a855f7",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/30",
    },
    {
      id: "accuracy",
      label: "Akurasi Jawaban",
      value: `${accuracy}%`,
      icon: "AcademicCapIcon",
      color: "#22c55e",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/30",
    },
    {
      id: "stage",
      label: "Stage Selesai",
      value: highestStage,
      icon: "FlagIcon",
      color: "#3b82f6",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/30",
    },
  ];

  return (
    <View className="mb-4">
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-text font-bold text-base tracking-tight">
          Ringkasan Statistik
        </Text>
        <Text className="text-subtext text-xs">Performa Petualangan</Text>
      </View>

      <View className="flex-row flex-wrap justify-between">
        {stats.map((item) => (
          <View
            key={item.id}
            className={`w-[48%] bg-surface border ${item.borderColor} p-3.5 rounded-2xl mb-3 shadow-sm`}
          >
            <View className="flex-row items-center justify-between mb-2">
              <View
                className={`w-9 h-9 rounded-xl ${item.bgColor} items-center justify-center`}
              >
                <Icon name={item.icon} variant="solid" size={20} color={item.color} />
              </View>
            </View>

            <Text className="text-text font-black text-2xl tracking-tight">
              {item.value}
            </Text>
            <Text className="text-subtext font-medium text-[11px] mt-0.5" numberOfLines={1}>
              {item.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};
