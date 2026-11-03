// mobile/components/home/CurriculumSummaryCard.tsx
import React from "react";
import { View, Text } from "react-native";
import { COPY } from "../../constants/copy";
import { ModuleProgressBar } from "./ModuleProgressBar";

interface CurriculumSummaryCardProps {
  completedCount: number;
  totalModules: number;
  progressPercentage: number;
}

export const CurriculumSummaryCard: React.FC<CurriculumSummaryCardProps> = ({
  completedCount,
  totalModules,
  progressPercentage,
}) => {
  return (
    <View className="bg-surface border border-border p-4 rounded-2xl mb-5 shadow-sm">
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-text font-bold text-sm">
          {COPY.home.summaryTitle}
        </Text>
        <Text className="text-accent-gold font-bold text-xs">
          {COPY.home.summaryCount(completedCount, totalModules)}
        </Text>
      </View>
      <ModuleProgressBar
        progress={progressPercentage}
        colorClass="bg-accent-gold"
        height={8}
      />
    </View>
  );
};
