// mobile/components/home/UserGreetingBar.tsx
import React from "react";
import { View, Text } from "react-native";
import { COPY } from "../../constants/copy";
import { ModuleProgressBar } from "./ModuleProgressBar";

interface UserGreetingBarProps {
  name?: string;
  studentClass?: string;
  level?: number;
  totalExp?: number;
}

export const UserGreetingBar: React.FC<UserGreetingBarProps> = ({
  name = "Petualang",
  studentClass = "X-MIPA",
  level = 1,
  totalExp = 0,
}) => {
  // Hitung EXP menuju level berikutnya (tiap level = 100 EXP)
  const currentLevelExp = totalExp % 100;
  const maxLevelExp = 100;
  const expPercentage = Math.round((currentLevelExp / maxLevelExp) * 100);

  return (
    <View className="bg-surface border border-border p-4 rounded-2xl mb-4 shadow-sm">
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-1 mr-3">
          <Text className="text-text-muted text-xs font-medium">
            {COPY.home.greetingPrefix},
          </Text>
          <Text className="text-text font-bold text-lg" numberOfLines={1}>
            {name}
          </Text>
        </View>
        <View className="bg-surface-alt px-3 py-1.5 rounded-xl border border-border">
          <Text className="text-primary font-bold text-xs">{studentClass}</Text>
        </View>
      </View>

      {/* Baris Level & EXP Bar */}
      <View className="pt-2 border-t border-border/60">
        <View className="flex-row items-center justify-between mb-1.5">
          <View className="flex-row items-center">
            <View className="bg-accent-gold/20 px-2 py-0.5 rounded-md mr-2">
              <Text className="text-accent-gold font-bold text-xs">
                {COPY.home.levelPrefix} {level}
              </Text>
            </View>
            <Text className="text-text-muted text-xs">Petualang Dungeon</Text>
          </View>
          <Text className="text-accent-gold font-bold text-xs">
            {currentLevelExp} / {maxLevelExp} EXP
          </Text>
        </View>
        <ModuleProgressBar
          progress={expPercentage}
          showPercentText={false}
          colorClass="bg-accent-gold"
          height={6}
        />
      </View>
    </View>
  );
};
