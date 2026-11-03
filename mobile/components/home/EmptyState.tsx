// mobile/components/home/EmptyState.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Icon } from "../ui/Icon";
import { COPY } from "../../constants/copy";

interface EmptyStateProps {
  message?: string;
  onAction?: () => void;
  actionTitle?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  message = COPY.home.emptyCurriculum,
  onAction,
  actionTitle = "Muat Ulang",
}) => {
  return (
    <View className="py-12 px-6 items-center justify-center">
      <View className="w-16 h-16 rounded-full bg-surface-alt border border-border items-center justify-center mb-4">
        <Icon name="InboxIcon" size={32} color="#94a3b8" />
      </View>
      <Text className="text-text font-bold text-base text-center mb-2">
        Perpustakaan Belum Terisi
      </Text>
      <Text className="text-text-muted text-sm text-center leading-relaxed mb-6">
        {message}
      </Text>
      {onAction && (
        <TouchableOpacity
          onPress={onAction}
          className="bg-primary/20 border border-primary px-6 py-2.5 rounded-xl"
        >
          <Text className="text-primary font-bold text-sm">{actionTitle}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
