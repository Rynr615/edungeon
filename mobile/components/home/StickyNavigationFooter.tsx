// mobile/components/home/StickyNavigationFooter.tsx
import React from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Icon } from "../ui/Icon";
import { COPY } from "../../constants/copy";

interface StickyNavigationFooterProps {
  hasPrev: boolean;
  hasNext: boolean;
  isCompleted: boolean;
  onPrev: () => void;
  onNextOrComplete: () => void;
  loading?: boolean;
}

export const StickyNavigationFooter: React.FC<StickyNavigationFooterProps> = ({
  hasPrev,
  hasNext,
  isCompleted,
  onPrev,
  onNextOrComplete,
  loading = false,
}) => {
  return (
    <SafeAreaView edges={["bottom"]} className="bg-surface border-t border-border">
      <View className="flex-row items-center justify-between px-4 py-3 max-w-3xl w-full mx-auto">
        {/* Tombol Sub-Bab Sebelumnya */}
        {hasPrev ? (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Kembali ke sub-bab sebelumnya"
            onPress={onPrev}
            disabled={loading}
            className="flex-row items-center bg-surface-alt px-4 py-3.5 rounded-xl border border-border mr-2 min-h-[48px] active:opacity-75"
          >
            <Icon name="ArrowLeftIcon" size={16} color="#94a3b8" />
            <Text className="text-text-muted font-bold text-xs ml-1.5">
              {COPY.module.reader.prevSubBab}
            </Text>
          </TouchableOpacity>
        ) : (
          <View className="w-10" />
        )}

        {/* Tombol Aksi Utama (Tandai Selesai / Selanjutnya) */}
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={!hasNext ? "Tuntaskan seluruh materi bab ini" : isCompleted ? "Lanjut ke sub-bab berikutnya" : "Tandai sub-bab selesai dan lanjutkan"}
          onPress={onNextOrComplete}
          disabled={loading}
          className={`flex-1 flex-row items-center justify-center py-3.5 px-4 rounded-xl ml-2 shadow-sm min-h-[48px] active:opacity-80 ${
            !hasNext
              ? "bg-accent-gold"
              : isCompleted
              ? "bg-surface-alt border border-primary/50"
              : "bg-primary"
          }`}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#0b1120" />
          ) : (
            <>
              <Text
                className={`font-bold text-xs mr-1.5 ${
                  !hasNext
                    ? "text-background"
                    : isCompleted
                    ? "text-primary"
                    : "text-background"
                }`}
              >
                {!hasNext
                  ? "Tuntaskan Seluruh Materi"
                  : isCompleted
                  ? "Lanjut ke Sub-Bab Berikutnya"
                  : "Tandai Selesai & Lanjut"}
              </Text>
              <Icon
                name={!hasNext ? "SparklesIcon" : "ArrowRightIcon"}
                variant={!hasNext ? "solid" : "outline"}
                size={16}
                color={
                  !hasNext
                    ? "#0b1120"
                    : isCompleted
                    ? "#38bdf8"
                    : "#0b1120"
                }
              />
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
