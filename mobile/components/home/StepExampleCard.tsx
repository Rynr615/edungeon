// mobile/components/home/StepExampleCard.tsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { ContohSoal } from "../../types/module";
import { Icon } from "../ui/Icon";

interface StepExampleCardProps {
  example: ContohSoal;
  index: number;
}

export const StepExampleCard: React.FC<StepExampleCardProps> = ({
  example,
  index,
}) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <View className="bg-surface border border-border rounded-2xl p-4 mb-4 shadow-sm">
      {/* Header Contoh Soal */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => setExpanded(!expanded)}
        className="flex-row items-center justify-between pb-3 border-b border-border/70"
      >
        <View className="flex-row items-center flex-1 mr-2">
          <View className="bg-primary/20 px-2 py-0.5 rounded-md mr-2 border border-primary/30">
            <Text className="text-primary font-bold text-xs">
              Contoh #{index + 1}
            </Text>
          </View>
          <Text className="text-text font-bold text-sm" numberOfLines={1}>
            Contoh Soal & Pembahasan
          </Text>
        </View>

        <Icon
          name={expanded ? "ChevronUpIcon" : "ChevronDownIcon"}
          size={18}
          color="#94a3b8"
        />
      </TouchableOpacity>

      {/* Pertanyaan Soal */}
      <View className="py-3">
        <Text className="text-text font-semibold text-sm leading-relaxed">
          {example.soal}
        </Text>
      </View>

      {/* Langkah-Langkah Penyelesaian (Expandable) */}
      {expanded && (
        <View className="pt-2 border-t border-border/50">
          <Text className="text-primary font-bold text-xs uppercase tracking-wider mb-2.5">
            Langkah Penyelesaian:
          </Text>

          {example.langkah_penyelesaian.map((langkah, lIdx) => (
            <View key={lIdx} className="flex-row items-start mb-2.5">
              <View className="w-5 h-5 rounded-full bg-surface-alt border border-border items-center justify-center mr-2.5 mt-0.5">
                <Text className="text-text-muted font-bold text-xs">
                  {lIdx + 1}
                </Text>
              </View>
              <Text className="text-text/90 text-xs flex-1 leading-relaxed">
                {langkah}
              </Text>
            </View>
          ))}

          {/* Hasil Akhir yang Ditegaskan */}
          <View className="mt-2 bg-primary/10 border border-primary/30 p-3 rounded-xl flex-row items-center justify-between">
            <Text className="text-text-muted text-xs font-semibold">
              Hasil Akhir:
            </Text>
            <Text className="text-primary font-mono font-bold text-sm">
              {example.hasil_akhir}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};
