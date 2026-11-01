// mobile/components/profile/StatOverviewCard.tsx
import React from "react";
import { View, Text } from "react-native";
import { ProfileStats } from "../../types/profile";
import { Icon } from "../ui/Icon";

interface StatOverviewCardProps {
  stats: ProfileStats | null;
}

export const StatOverviewCard: React.FC<StatOverviewCardProps> = ({ stats }) => {
  const totalExp = stats?.total_exp ?? 0;
  const monsterKalah = stats?.monster_dikalahkan ?? 0;
  const bossKalah = stats?.boss_dikalahkan ?? 0;
  const akurasi = stats?.akurasi ?? 0;
  const jumlahBenar = stats?.jumlah_benar ?? 0;
  const totalSoal = stats?.jumlah_jawaban ?? 0;

  const statItems = [
    {
      id: "exp",
      title: "Total EXP",
      value: totalExp.toLocaleString("id-ID"),
      subtitle: `Level ${stats?.level ?? 1}`,
      icon: "SparklesIcon" as const,
      iconColor: "#eab308", // Gold / EXP
      bgIcon: "bg-amber-500/10",
      borderColor: "border-amber-500/20",
    },
    {
      id: "monster",
      title: "Monster Kalah",
      value: monsterKalah.toLocaleString("id-ID"),
      subtitle: "Musuh Biasa",
      icon: "ShieldExclamationIcon" as const,
      iconColor: "#ef4444", // Red / HP
      bgIcon: "bg-red-500/10",
      borderColor: "border-red-500/20",
    },
    {
      id: "akurasi",
      title: "Akurasi Soal",
      value: `${akurasi}%`,
      subtitle: `${jumlahBenar}/${totalSoal} Soal Benar`,
      icon: "AcademicCapIcon" as const,
      iconColor: "#22c55e", // Green / Success
      bgIcon: "bg-green-500/10",
      borderColor: "border-green-500/20",
    },
    {
      id: "boss",
      title: "Boss Ditaklukkan",
      value: bossKalah.toLocaleString("id-ID"),
      subtitle: "Penguasa Lantai",
      icon: "TrophyIcon" as const,
      iconColor: "#a855f7", // Purple / Boss
      bgIcon: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
    },
  ];

  return (
    <View className="mb-6">
      <View className="flex-row items-center justify-between mb-3 px-1">
        <Text className="text-text font-bold text-lg">Statistik Petualangan</Text>
        <Text className="text-subtext text-xs">Pencapaian Belajar</Text>
      </View>

      {/* 2x2 Grid Layout */}
      <View className="flex-row flex-wrap justify-between">
        {statItems.map((item) => (
          <View
            key={item.id}
            className={`w-[48%] bg-surface border ${item.borderColor} p-4 rounded-2xl mb-3.5 shadow-sm`}
          >
            <View className="flex-row items-center justify-between mb-2">
              <View className={`w-9 h-9 rounded-xl ${item.bgIcon} items-center justify-center`}>
                <Icon name={item.icon} variant="solid" size={20} color={item.iconColor} />
              </View>
              <Text className="text-subtext text-[11px] font-medium">{item.title}</Text>
            </View>

            <Text className="text-text font-extrabold text-2xl tracking-tight">
              {item.value}
            </Text>

            <Text className="text-subtext text-xs mt-1" numberOfLines={1}>
              {item.subtitle}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};
