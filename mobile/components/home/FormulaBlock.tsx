// mobile/components/home/FormulaBlock.tsx
import React from "react";
import { View, Text, ScrollView } from "react-native";
import { Icon } from "../ui/Icon";

interface FormulaBlockProps {
  formula: string;
  title?: string;
  note?: string;
  className?: string;
}

export const FormulaBlock: React.FC<FormulaBlockProps> = ({
  formula,
  title = "Rumus Kunci",
  note,
  className = "",
}) => {
  return (
    <View
      className={`bg-formula-bg border border-formula-border rounded-2xl p-4 mb-4 shadow-sm ${className}`}
    >
      {/* Header Rumus */}
      <View className="flex-row items-center justify-between mb-2 pb-2 border-b border-formula-border/60">
        <View className="flex-row items-center">
          <View className="w-2 h-2 rounded-full bg-primary mr-2" />
          <Text className="text-primary font-bold text-xs uppercase tracking-wider">
            {title}
          </Text>
        </View>
        <Icon name="DocumentTextIcon" size={14} color="#38bdf8" />
      </View>

      {/* Kontainer Rumus dengan Scroll Horizontal Mandiri */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        nestedScrollEnabled={true}
        className="py-2"
      >
        <Text
          selectable
          className="text-text font-mono font-bold text-base tracking-wide"
        >
          {formula}
        </Text>
      </ScrollView>

      {/* Catatan / Keterangan Variabel */}
      {note && (
        <View className="mt-2 pt-2 border-t border-formula-border/40">
          <Text className="text-text-muted text-xs italic leading-relaxed">
            {note}
          </Text>
        </View>
      )}
    </View>
  );
};
