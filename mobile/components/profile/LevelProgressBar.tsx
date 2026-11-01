// mobile/components/profile/LevelProgressBar.tsx
import React from "react";
import { View, Text } from "react-native";
import { THEME_COLORS } from "../../constants/theme";

interface LevelProgressBarProps {
  level: number;
  expInLevel: number;
  nextLevelExp: number;
}

export const LevelProgressBar: React.FC<LevelProgressBarProps> = ({
  level,
  expInLevel,
  nextLevelExp,
}) => {
  const percentage = Math.min(
    Math.max(Math.round((expInLevel / (nextLevelExp || 100)) * 100), 0),
    100
  );

  return (
    <View className="bg-surface-card border border-border-gold/50 rounded-2xl p-4 mb-5 shadow-sm">
      <View className="flex-row justify-between items-center mb-2">
        <View className="flex-row items-center">
          <Text className="text-text font-bold text-sm">Kemajuan Level</Text>
          <View className="ml-2 bg-gold/20 px-2 py-0.5 rounded-md border border-gold/40">
            <Text className="text-gold font-extrabold text-[11px]">Level {level}</Text>
          </View>
        </View>

        <Text className="text-subtext font-semibold text-xs">
          <Text className="text-gold font-bold">{expInLevel}</Text> / {nextLevelExp} EXP
        </Text>
      </View>

      {/* Bar Track */}
      <View className="h-3.5 w-full bg-surface-light rounded-full overflow-hidden border border-border-gold/30">
        <View
          className="h-full bg-gold rounded-full"
          style={{
            width: `${percentage}%`,
            backgroundColor: THEME_COLORS.gold,
          }}
        />
      </View>

      <View className="flex-row justify-between items-center mt-1.5">
        <Text className="text-textMuted text-[10px]">
          {100 - expInLevel} EXP lagi menuju Level {level + 1}
        </Text>
        <Text className="text-gold font-bold text-[10px]">{percentage}%</Text>
      </View>
    </View>
  );
};
