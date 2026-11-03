// mobile/components/home/ModuleProgressBar.tsx
import React from "react";
import { View, Text } from "react-native";

interface ModuleProgressBarProps {
  progress: number; // 0 - 100
  label?: string;
  showPercentText?: boolean;
  colorClass?: string;
  height?: number;
  className?: string;
}

export const ModuleProgressBar: React.FC<ModuleProgressBarProps> = ({
  progress,
  label,
  showPercentText = true,
  colorClass = "bg-primary",
  height = 8,
  className = "",
}) => {
  const clamped = Math.min(Math.max(progress, 0), 100);

  return (
    <View className={`w-full ${className}`}>
      {(label || showPercentText) && (
        <View className="flex-row items-center justify-between mb-1.5">
          {label ? (
            <Text className="text-text-muted text-xs font-medium">{label}</Text>
          ) : (
            <View />
          )}
          {showPercentText && (
            <Text className="text-text font-bold text-xs">{clamped}%</Text>
          )}
        </View>
      )}
      <View
        style={{ height }}
        className="w-full bg-surface-alt rounded-full overflow-hidden border border-border"
      >
        <View
          style={{ width: `${clamped}%`, height }}
          className={`${colorClass} rounded-full`}
        />
      </View>
    </View>
  );
};
