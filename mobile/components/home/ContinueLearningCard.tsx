// mobile/components/home/ContinueLearningCard.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Icon } from "../ui/Icon";
import { COPY } from "../../constants/copy";
import { ModuleProgressBar } from "./ModuleProgressBar";
import { LastLearnedState } from "../../types/module";

interface ContinueLearningCardProps {
  lastLearned: LastLearnedState | null;
  onResume: (moduleId: string, subBabId: string) => void;
}

export const ContinueLearningCard: React.FC<ContinueLearningCardProps> = ({
  lastLearned,
  onResume,
}) => {
  if (!lastLearned) {
    return (
      <View className="bg-surface border border-border p-4 rounded-2xl mb-4">
        <Text className="text-text-muted text-xs leading-relaxed text-center">
          {COPY.home.continueCard.emptyState}
        </Text>
      </View>
    );
  }

  return (
    <View className="bg-surface border-2 border-primary/40 p-4 rounded-2xl mb-4 shadow-sm">
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-row items-center">
          <View className="w-2 h-2 rounded-full bg-primary mr-2" />
          <Text className="text-primary font-bold text-xs uppercase tracking-wider">
            {COPY.home.continueCard.tag}
          </Text>
        </View>
        <Text className="text-text-muted text-xs font-semibold">
          Sub-Bab {lastLearned.subBabIndex} dari {lastLearned.totalSubBab}
        </Text>
      </View>

      <Text className="text-text font-bold text-base mb-1" numberOfLines={1}>
        {lastLearned.moduleTitle}
      </Text>
      <Text className="text-text-muted text-xs mb-3" numberOfLines={1}>
        {lastLearned.subBabTitle}
      </Text>

      <ModuleProgressBar
        progress={lastLearned.progressPercent}
        label="Progres Pembelajaran"
        colorClass="bg-primary"
        height={6}
        className="mb-3"
      />

      <TouchableOpacity
        onPress={() => onResume(lastLearned.moduleId, lastLearned.subBabId)}
        className="bg-primary py-3 rounded-xl flex-row items-center justify-center active:opacity-80"
      >
        <Icon name="PlayIcon" variant="solid" size={16} color="#0b1120" />
        <Text className="text-background font-bold text-xs ml-2">
          {COPY.home.continueCard.actionButton}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
