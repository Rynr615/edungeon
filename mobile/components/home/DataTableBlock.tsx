// mobile/components/home/DataTableBlock.tsx
import React from "react";
import { View, Text, ScrollView } from "react-native";

interface DataTableBlockProps {
  title?: string;
  headers: string[];
  rows: string[][];
  className?: string;
}

export const DataTableBlock: React.FC<DataTableBlockProps> = ({
  title,
  headers,
  rows,
  className = "",
}) => {
  return (
    <View
      className={`bg-surface border border-border rounded-2xl p-4 mb-4 shadow-sm ${className}`}
    >
      {title && (
        <Text className="text-text font-bold text-sm mb-3">{title}</Text>
      )}

      {/* Kontainer Tabel dengan Scroll Horizontal Mandiri */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        nestedScrollEnabled={true}
      >
        <View className="rounded-xl overflow-hidden border border-border">
          {/* Header Baris */}
          <View className="flex-row bg-surface-alt py-2.5 px-3 border-b border-border">
            {headers.map((header, idx) => (
              <View key={idx} className="min-w-[100px] px-2">
                <Text className="text-primary font-bold text-xs">
                  {header}
                </Text>
              </View>
            ))}
          </View>

          {/* Baris Data */}
          {rows.map((row, rIdx) => (
            <View
              key={rIdx}
              className={`flex-row py-2.5 px-3 border-b border-border/50 ${
                rIdx % 2 === 1 ? "bg-surface-alt/30" : "bg-surface"
              }`}
            >
              {row.map((cell, cIdx) => (
                <View key={cIdx} className="min-w-[100px] px-2">
                  <Text className="text-text/90 text-xs font-mono">{cell}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};
