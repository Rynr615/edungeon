// mobile/components/home/ModuleOverviewHeader.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Icon } from "../ui/Icon";
import { ModuleProgressBar } from "./ModuleProgressBar";

interface ModuleOverviewHeaderProps {
  moduleTitle: string;
  subject: string;
  subBabCount: number;
  estimatedMinutes?: number;
  progressPercent: number;
  objectives?: string[];
  ringkasanRumusCount?: number;
  onOpenFormulaModal?: () => void;
}

export const ModuleOverviewHeader: React.FC<ModuleOverviewHeaderProps> = ({
  moduleTitle,
  subject,
  subBabCount,
  estimatedMinutes = 35,
  progressPercent,
  objectives,
  ringkasanRumusCount = 0,
  onOpenFormulaModal,
}) => {
  return (
    <View className="mb-6">
      {/* Kartu Header Utama */}
      <View className="bg-surface border border-border p-5 rounded-3xl mb-4 shadow-sm">
        <View className="flex-row items-center justify-between mb-2">
          <View className="bg-primary/20 px-2.5 py-1 rounded-lg border border-primary/30">
            <Text className="text-primary font-bold text-xs uppercase tracking-wider">
              {subject} • Kelas X
            </Text>
          </View>
          <View className="flex-row items-center">
            <Icon name="ClockIcon" size={13} color="#94a3b8" />
            <Text className="text-text-muted text-xs font-semibold ml-1">
              ~{estimatedMinutes} Menit
            </Text>
          </View>
        </View>

        <Text className="text-text font-bold text-2xl mb-3">{moduleTitle}</Text>

        <View className="pt-3 border-t border-border/60">
          <View className="flex-row items-center justify-between mb-1.5">
            <Text className="text-text-muted text-xs">
              Status Penyelesaian Materi
            </Text>
            <Text className="text-accent-gold font-bold text-xs">
              {progressPercent}% Selesai
            </Text>
          </View>
          <ModuleProgressBar
            progress={progressPercent}
            showPercentText={false}
            colorClass="bg-accent-gold"
            height={7}
          />
        </View>
      </View>

      {/* Tujuan Pembelajaran */}
      {objectives && objectives.length > 0 && (
        <View className="bg-surface border border-border p-4 rounded-2xl mb-4">
          <View className="flex-row items-center mb-2">
            <Icon name="AcademicCapIcon" size={18} color="#38bdf8" />
            <Text className="text-text font-bold text-sm ml-2">
              Tujuan Petualangan Belajar
            </Text>
          </View>
          {objectives.map((obj, i) => (
            <View key={i} className="flex-row items-start mt-1.5">
              <Text className="text-primary font-bold text-xs mr-2">•</Text>
              <Text className="text-text-muted text-xs flex-1 leading-relaxed">
                {obj}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Tombol Cepat Kartu Rumus */}
      {ringkasanRumusCount > 0 && onOpenFormulaModal && (
        <TouchableOpacity
          onPress={onOpenFormulaModal}
          className="bg-surface-alt/70 border border-primary/40 p-3.5 rounded-2xl flex-row items-center justify-between mb-4 active:opacity-80"
        >
          <View className="flex-row items-center flex-1 mr-3">
            <View className="w-8 h-8 rounded-xl bg-primary/10 items-center justify-center mr-3 border border-primary/20">
              <Icon name="DocumentTextIcon" size={16} color="#38bdf8" />
            </View>
            <View className="flex-1">
              <Text className="text-text font-bold text-xs">
                Kartu Rumus Kunci (Cheat Sheet)
              </Text>
              <Text className="text-text-muted text-xs">
                Tersedia {ringkasanRumusCount} formula penting bab ini
              </Text>
            </View>
          </View>
          <Icon name="ArrowRightIcon" size={16} color="#38bdf8" />
        </TouchableOpacity>
      )}
    </View>
  );
};
