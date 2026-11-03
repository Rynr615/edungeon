// mobile/components/home/FontSizeAdjuster.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Icon } from "../ui/Icon";

export type FontSizeLevel = "normal" | "medium" | "large";

interface FontSizeAdjusterProps {
  fontSizeLevel: FontSizeLevel;
  onChangeFontSize: (level: FontSizeLevel) => void;
}

export const FontSizeAdjuster: React.FC<FontSizeAdjusterProps> = ({
  fontSizeLevel,
  onChangeFontSize,
}) => {
  return (
    <View className="bg-surface border border-border p-2.5 rounded-xl flex-row items-center justify-between mb-4 shadow-sm">
      <View className="flex-row items-center ml-1">
        <Icon name="AdjustmentsHorizontalIcon" size={16} color="#94a3b8" />
        <Text className="text-text-muted text-xs font-semibold ml-1.5">
          Ukuran Teks Bacaan:
        </Text>
      </View>

      <View className="flex-row bg-surface-alt p-1 rounded-lg border border-border">
        <TouchableOpacity
          onPress={() => onChangeFontSize("normal")}
          className={`px-3 py-1 rounded-md ${
            fontSizeLevel === "normal" ? "bg-primary" : "bg-transparent"
          }`}
        >
          <Text
            className={`text-xs font-bold ${
              fontSizeLevel === "normal" ? "text-background" : "text-text-muted"
            }`}
          >
            A
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onChangeFontSize("medium")}
          className={`px-3 py-1 rounded-md ${
            fontSizeLevel === "medium" ? "bg-primary" : "bg-transparent"
          }`}
        >
          <Text
            className={`text-sm font-bold ${
              fontSizeLevel === "medium" ? "text-background" : "text-text-muted"
            }`}
          >
            A+
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onChangeFontSize("large")}
          className={`px-3 py-1 rounded-md ${
            fontSizeLevel === "large" ? "bg-primary" : "bg-transparent"
          }`}
        >
          <Text
            className={`text-base font-bold ${
              fontSizeLevel === "large" ? "text-background" : "text-text-muted"
            }`}
          >
            A++
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
