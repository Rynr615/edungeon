// mobile/components/home/ModuleCard.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Icon } from "../ui/Icon";
import { ModuleStatus } from "../../types/module";
import { COPY } from "../../constants/copy";
import { ModuleProgressBar } from "./ModuleProgressBar";

interface ModuleCardProps {
  index: number;
  title: string;
  subject: string;
  subBabCount: number;
  estimatedMinutes?: number;
  status: ModuleStatus;
  progressPercent: number;
  onPress: () => void;
  onLockedPress: () => void;
  prerequisiteTitle?: string;
}

export const ModuleCard: React.FC<ModuleCardProps> = ({
  index,
  title,
  subject,
  subBabCount,
  estimatedMinutes = 30,
  status,
  progressPercent,
  onPress,
  onLockedPress,
  prerequisiteTitle,
}) => {
  const isLocked = status === "terkunci";
  const isCompleted = status === "selesai";
  const isInProgress = status === "sedang_dipelajari" || (status === "mulai" && progressPercent > 0);

  const handleCardPress = () => {
    if (isLocked) {
      onLockedPress();
    } else {
      onPress();
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`Modul ${index + 1}: ${title}. Status: ${status}. Terdiri dari ${subBabCount} sub-bab, estimasi waktu ${estimatedMinutes} menit.`}
      accessibilityHint={isLocked ? "Modul ini terkunci. Ketuk untuk melihat prasyarat." : "Ketuk untuk membuka silabus dan materi modul."}
      onPress={handleCardPress}
      className={`p-4 rounded-2xl mb-3 border ${
        isLocked
          ? "bg-surface/50 border-border opacity-70"
          : isCompleted
          ? "bg-surface border-success/40"
          : isInProgress
          ? "bg-surface border-primary/60 shadow-sm"
          : "bg-surface border-border"
      }`}
    >
      {/* Header Kartu: Kategori & Status Badge */}
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-primary font-bold text-xs uppercase tracking-wide">
          Modul {index + 1} • {subject}
        </Text>

        {isLocked ? (
          <View className="bg-surface-alt px-2.5 py-1 rounded-lg flex-row items-center border border-border">
            <Icon name="LockClosedIcon" variant="solid" size={12} color="#9cb0c9" />
            <Text className="text-text-muted text-xs font-bold ml-1">
              {COPY.home.status.locked}
            </Text>
          </View>
        ) : isCompleted ? (
          <View className="bg-success/15 px-2.5 py-1 rounded-lg flex-row items-center border border-success/30">
            <Icon name="CheckCircleIcon" variant="solid" size={12} color="#34d399" />
            <Text className="text-success text-xs font-bold ml-1">
              {COPY.home.status.completed}
            </Text>
          </View>
        ) : isInProgress ? (
          <View className="bg-primary/15 px-2.5 py-1 rounded-lg flex-row items-center border border-primary/30">
            <View className="w-1.5 h-1.5 rounded-full bg-primary mr-1" />
            <Text className="text-primary text-xs font-bold">
              {COPY.home.status.inProgress}
            </Text>
          </View>
        ) : (
          <View className="bg-primary px-3 py-1 rounded-lg flex-row items-center">
            <Icon name="PlayIcon" variant="solid" size={12} color="#0d131d" />
            <Text className="text-background text-xs font-bold ml-1">
              {COPY.home.status.available}
            </Text>
          </View>
        )}
      </View>

      {/* Judul Modul */}
      <Text className="text-text font-bold text-base mb-1.5" numberOfLines={2}>
        {title}
      </Text>

      {/* Info Durasi & Jumlah Sub-bab */}
      <View className="flex-row items-center text-text-muted mb-3 space-x-3">
        <View className="flex-row items-center mr-3">
          <Icon name="DocumentTextIcon" size={13} color="#9cb0c9" />
          <Text className="text-text-muted text-xs ml-1 font-medium">
            {subBabCount} Sub-Bab
          </Text>
        </View>
        <View className="flex-row items-center">
          <Icon name="ClockIcon" size={13} color="#9cb0c9" />
          <Text className="text-text-muted text-xs ml-1 font-medium">
            ~{estimatedMinutes} Menit
          </Text>
        </View>
      </View>

      {/* Progress Bar (Jika tidak terkunci) */}
      {!isLocked && (
        <ModuleProgressBar
          progress={progressPercent}
          showPercentText={false}
          colorClass={isCompleted ? "bg-success" : "bg-primary"}
          height={5}
        />
      )}

      {/* Catatan Prasyarat jika Terkunci */}
      {isLocked && prerequisiteTitle && (
        <View className="pt-2 border-t border-border/40 mt-1 flex-row items-center">
          <Icon name="InformationCircleIcon" size={12} color="#94a3b8" />
          <Text className="text-text-muted text-xs ml-1 italic" numberOfLines={1}>
            Prasyarat: Tamatkan {prerequisiteTitle}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};
