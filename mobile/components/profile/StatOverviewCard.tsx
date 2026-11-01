// mobile/components/profile/StatOverviewCard.tsx
import React from "react";
import { View, Text } from "react-native";
import { Icon, IconName } from "../ui/Icon";
import { THEME_COLORS } from "../../constants/theme";

interface StatOverviewCardProps {
  totalExp: number;
  monsterDikalahkan: number;
  akurasi: number;
  bossDikalahkan: number;
}

interface StatItem {
  id: string;
  label: string;
  value: string | number;
  icon: IconName;
  color: string;
  bgColor: string;
}

export const StatOverviewCard: React.FC<StatOverviewCardProps> = ({
  totalExp,
  monsterDikalahkan,
  akurasi,
  bossDikalahkan,
}) => {
  const stats: StatItem[] = [
    {
      id: "exp",
      label: "Total EXP",
      value: totalExp.toLocaleString(),
      icon: "StarIcon",
      color: "#FFD700",
      bgColor: "rgba(255, 215, 0, 0.12)",
    },
    {
      id: "monster",
      label: "Monster Gugur",
      value: monsterDikalahkan,
      icon: "FireIcon",
      color: "#F97316",
      bgColor: "rgba(249, 115, 22, 0.12)",
    },
    {
      id: "akurasi",
      label: "Akurasi Jawaban",
      value: `${akurasi}%`,
      icon: "AcademicCapIcon",
      color: "#22C55E",
      bgColor: "rgba(34, 197, 94, 0.12)",
    },
    {
      id: "boss",
      label: "Boss Ditaklukkan",
      value: bossDikalahkan,
      icon: "TrophyIcon",
      color: "#A855F7",
      bgColor: "rgba(168, 85, 247, 0.12)",
    },
  ];

  return (
    <View className="mb-6">
      <Text className="text-text font-bold text-base mb-3 tracking-wide">
        Statistik Petualangan
      </Text>

      <View className="flex-row flex-wrap justify-between">
        {stats.map((stat) => (
          <View
            key={stat.id}
            className="w-[48%] mb-3 bg-surface-card border border-border-gold/50 rounded-2xl p-4 shadow-sm"
          >
            <View className="flex-row items-center justify-between mb-2">
              <View
                className="w-10 h-10 rounded-xl items-center justify-center border border-border-gold/30"
                style={{ backgroundColor: stat.bgColor }}
              >
                <Icon name={stat.icon} variant="solid" size={22} color={stat.color} />
              </View>
            </View>

            <Text className="text-text font-extrabold text-xl tracking-tight">
              {stat.value}
            </Text>
            <Text className="text-subtext font-medium text-xs mt-0.5">
              {stat.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};
