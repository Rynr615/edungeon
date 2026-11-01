// mobile/components/profile/StatOverviewCard.tsx
import React from "react";
import { View, Text } from "react-native";
import Svg, { Path, Circle } from "react-native-svg";
import { Icon } from "../ui/Icon";

interface StatOverviewProps {
  monsterCount?: number;
  bossCount?: number;
  accuracy?: number;
  highestStage?: string;
}

export const StatOverviewCard: React.FC<StatOverviewProps> = ({
  monsterCount = 0,
  bossCount = 0,
  accuracy = 0,
  highestStage = "1-1",
}) => {
  return (
    <View className="mb-2">
      <Text className="font-bold text-lg text-gray-900 mb-3">Statistik</Text>

      <View className="flex-row flex-wrap justify-between">
        {/* 1. Monster dikalahkan */}
        <View className="w-[48%] bg-[#dde3ea] p-4 rounded-2xl mb-3.5">
          {/* Monster Ghost Icon */}
          <Svg width="22" height="22" viewBox="0 0 24 24" fill="#111827">
            <Path d="M12 2C7.58 2 4 5.58 4 10v10c0 .55.45 1 1 1 .32 0 .63-.16.8-.43L7 18.5l1.2 2.07c.35.58 1.15.68 1.63.2L11 19.5l1.17 1.27c.48.48 1.28.38 1.63-.2L15 18.5l1.2 2.07c.17.27.48.43.8.43.55 0 1-.45 1-1V10c0-4.42-3.58-8-8-8zm-3 9c-.83 0-1.5-.67-1.5-1.5S8.17 8 9 8s1.5.67 1.5 1.5S9.83 11 9 11zm6 0c-.83 0-1.5-.67-1.5-1.5S14.17 8 15 8s1.5.67 1.5 1.5S15.83 11 15 11z" />
          </Svg>
          <Text className="font-mono font-bold text-2xl text-gray-900 mt-1">
            {monsterCount}
          </Text>
          <Text className="font-mono text-xs text-gray-800 mt-0.5">
            Monster dikalahkan
          </Text>
        </View>

        {/* 2. Boss dikalahkan */}
        <View className="w-[48%] bg-[#dde3ea] p-4 rounded-2xl mb-3.5">
          {/* Skull Icon */}
          <Svg width="22" height="22" viewBox="0 0 24 24" fill="#111827">
            <Path d="M12 2c-4.42 0-8 3.58-8 8 0 2.96 1.61 5.54 4 6.92V19c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.08c2.39-1.38 4-3.96 4-6.92 0-4.42-3.58-8-8-8zm-3 9.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm6 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
          </Svg>
          <Text className="font-mono font-bold text-2xl text-gray-900 mt-1">
            {bossCount}
          </Text>
          <Text className="font-mono text-xs text-gray-800 mt-0.5">
            Boss dikalahkan
          </Text>
        </View>

        {/* 3. Akurasi jawaban */}
        <View className="w-[48%] bg-[#dde3ea] p-4 rounded-2xl mb-3.5">
          {/* Bullseye / Target Icon */}
          <Svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <Circle cx="12" cy="12" r="9" stroke="#111827" strokeWidth="2.5" />
            <Circle cx="12" cy="12" r="5" stroke="#111827" strokeWidth="2.5" />
            <Circle cx="12" cy="12" r="2" fill="#111827" />
          </Svg>
          <Text className="font-mono font-bold text-2xl text-gray-900 mt-1">
            {accuracy}%
          </Text>
          <Text className="font-mono text-xs text-gray-800 mt-0.5">
            Akurasi jawaban
          </Text>
        </View>

        {/* 4. Stage Selesai */}
        <View className="w-[48%] bg-[#dde3ea] p-4 rounded-2xl mb-3.5">
          {/* Flag Icon */}
          <Icon name="FlagIcon" variant="solid" size={22} color="#111827" />
          <Text className="font-mono font-bold text-2xl text-gray-900 mt-1">
            {highestStage}
          </Text>
          <Text className="font-mono text-xs text-gray-800 mt-0.5">
            Stage Selesai
          </Text>
        </View>
      </View>
    </View>
  );
};
