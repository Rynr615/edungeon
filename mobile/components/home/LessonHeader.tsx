// mobile/components/home/LessonHeader.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Icon } from "../ui/Icon";
import { ModuleProgressBar } from "./ModuleProgressBar";

interface LessonHeaderProps {
  title: string;
  subTitle?: string;
  progressPercent: number;
  onBack: () => void;
  onOpenTOC: () => void;
}

export const LessonHeader: React.FC<LessonHeaderProps> = ({
  title,
  subTitle,
  progressPercent,
  onBack,
  onOpenTOC,
}) => {
  return (
    <SafeAreaView edges={["top"]} className="bg-surface border-b border-border">
      <View className="flex-row items-center justify-between px-4 py-2.5 max-w-3xl w-full mx-auto">
        {/* Tombol Back */}
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Kembali ke Ringkasan Modul"
          onPress={onBack}
          className="w-10 h-10 rounded-xl bg-surface-alt border border-border items-center justify-center mr-2 active:opacity-75"
        >
          <Icon name="ArrowLeftIcon" size={18} color="#f8fafc" />
        </TouchableOpacity>

        {/* Info Judul Sub-Bab */}
        <View className="flex-1 mr-2">
          {subTitle && (
            <Text className="text-primary font-bold text-xs" numberOfLines={1}>
              {subTitle}
            </Text>
          )}
          <Text className="text-text font-bold text-sm" numberOfLines={1}>
            {title}
          </Text>
        </View>

        {/* Tombol Daftar Isi (Table of Contents) */}
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Buka Daftar Isi Sub-Bab"
          onPress={onOpenTOC}
          className="bg-surface-alt px-3.5 py-2 rounded-xl border border-border flex-row items-center active:opacity-75 min-h-[44px]"
        >
          <Icon name="QueueListIcon" size={16} color="#38bdf8" />
          <Text className="text-primary font-bold text-xs ml-1.5">Daftar Isi</Text>
        </TouchableOpacity>
      </View>

      {/* Progress Bar Tipis di Bawah Header */}
      <View className="w-full">
        <ModuleProgressBar
          progress={progressPercent}
          showPercentText={false}
          colorClass="bg-primary"
          height={3}
        />
      </View>
    </SafeAreaView>
  );
};
