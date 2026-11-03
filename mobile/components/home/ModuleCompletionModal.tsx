// mobile/components/home/ModuleCompletionModal.tsx
import React from "react";
import { View, Text, Modal, TouchableOpacity } from "react-native";
import { Icon } from "../ui/Icon";
import { COPY } from "../../constants/copy";

interface ModuleCompletionModalProps {
  visible: boolean;
  moduleTitle: string;
  totalSubBab: number;
  onGoToChallenge: () => void;
  onBackToHome: () => void;
}

export const ModuleCompletionModal: React.FC<ModuleCompletionModalProps> = ({
  visible,
  moduleTitle,
  totalSubBab,
  onGoToChallenge,
  onBackToHome,
}) => {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onBackToHome}
    >
      <View className="flex-1 bg-black/85 justify-center items-center px-6">
        <View className="bg-surface border-2 border-accent-gold/60 p-6 rounded-3xl w-full max-w-sm shadow-2xl items-center">
          {/* Ikon Segel Sihir Kemenangan Emas */}
          <View className="w-20 h-20 rounded-full bg-accent-gold/20 border-2 border-accent-gold items-center justify-center mb-4 shadow-lg shadow-accent-gold/30">
            <Icon name="SparklesIcon" variant="solid" size={36} color="#f3c05b" />
          </View>

          <Text className="text-accent-gold font-bold text-xs uppercase tracking-widest mb-1">
            ✨ PETUALANGAN TEORI TUNTAS ✨
          </Text>

          <Text className="text-text font-bold text-xl text-center mb-2">
            {COPY.module.completion.title}
          </Text>

          <Text className="text-primary font-bold text-sm text-center mb-4">
            {moduleTitle}
          </Text>

          {/* Kotak Ringkasan Pencapaian */}
          <View className="w-full bg-surface-alt/70 border border-border p-3.5 rounded-2xl mb-4 space-y-2">
            <View className="flex-row items-center justify-between">
              <Text className="text-text-muted text-xs">Sub-Bab Dikuasai:</Text>
              <Text className="text-success font-bold text-xs">
                {totalSubBab} dari {totalSubBab} Tuntas
              </Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-text-muted text-xs">Hadiah Teori:</Text>
              <Text className="text-accent-gold font-bold text-xs">
                +50 EXP Diperoleh
              </Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-text-muted text-xs">Status Gerbang:</Text>
              <Text className="text-primary font-bold text-xs">
                Arena Kuis Terbuka!
              </Text>
            </View>
          </View>

          <Text className="text-text-muted text-xs text-center leading-relaxed mb-6">
            {COPY.module.completion.challengeAlert}
          </Text>

          {/* Tombol Utama: Masuk ke Challenge */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onGoToChallenge}
            className="w-full bg-accent-gold py-4 rounded-xl flex-row items-center justify-center shadow-lg active:opacity-90 mb-3"
          >
            <Text className="text-background font-bold text-sm mr-2">
              {COPY.module.completion.goToChallengeBtn}
            </Text>
            <Icon name="ArrowRightIcon" size={18} color="#0b1120" />
          </TouchableOpacity>

          {/* Tombol Sekunder: Kembali ke Beranda */}
          <TouchableOpacity
            onPress={onBackToHome}
            className="py-2.5 px-4 rounded-lg active:opacity-70"
          >
            <Text className="text-text-muted font-semibold text-xs">
              {COPY.module.completion.backToHomeBtn}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
