// mobile/components/ui/ProgressBar.tsx
import React from "react";
import { View, Text } from "react-native";

interface ProgressBarProps {
  progress: number;
  label?: string;
  colorClass?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  label,
  colorClass = "bg-primary",
}) => {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <View className="w-full">
      {label && (
        <View className="flex-row justify-between mb-1">
          <Text className="text-subtext text-xs font-semibold">{label}</Text>
          <Text className="text-subtext text-xs font-semibold">{clampedProgress}%</Text>
        </View>
      )}
      <View className="h-3 w-full bg-surface-light rounded-full overflow-hidden">
        <View
          className={`h-full ${colorClass} rounded-full`}
          style={{ width: `${clampedProgress}%` }}
        />
      </View>
    </View>
  );
};