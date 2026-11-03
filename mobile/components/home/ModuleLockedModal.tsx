// mobile/components/home/ModuleLockedModal.tsx
import React from "react";
import { View, Text, Modal, TouchableOpacity } from "react-native";
import { Icon } from "../ui/Icon";
import { COPY } from "../../constants/copy";

interface ModuleLockedModalProps {
  visible: boolean;
  onClose: () => void;
  prerequisiteTitle?: string;
  moduleTitle?: string;
}

export const ModuleLockedModal: React.FC<ModuleLockedModalProps> = ({
  visible,
  onClose,
  prerequisiteTitle = "Modul Sebelumnya",
  moduleTitle = "Modul Ini",
}) => {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/75 justify-center items-center px-6">
        <View className="bg-surface border-2 border-border p-6 rounded-3xl w-full max-w-sm shadow-xl items-center">
          {/* Ikon Gembok Dungeon */}
          <View className="w-16 h-16 rounded-full bg-surface-alt border border-border items-center justify-center mb-4">
            <Icon name="LockClosedIcon" variant="solid" size={32} color="#f3c05b" />
          </View>

          <Text className="text-text font-bold text-lg text-center mb-2">
            {COPY.home.lockedModal.title}
          </Text>

          <Text className="text-primary font-bold text-sm text-center mb-3">
            {moduleTitle}
          </Text>

          <Text className="text-text-muted text-sm text-center leading-relaxed mb-6">
            {COPY.home.lockedModal.desc(prerequisiteTitle)}
          </Text>

          <TouchableOpacity
            onPress={onClose}
            className="w-full bg-primary py-3.5 rounded-xl items-center justify-center active:opacity-80"
          >
            <Text className="text-background font-bold text-sm">
              {COPY.home.lockedModal.actionButton}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
