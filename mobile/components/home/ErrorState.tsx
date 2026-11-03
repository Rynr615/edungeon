// mobile/components/home/ErrorState.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Icon } from "../ui/Icon";
import { COPY } from "../../constants/copy";

interface ErrorStateProps {
  message?: string;
  onRetry: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message = COPY.home.errorDesc,
  onRetry,
}) => {
  return (
    <View className="py-12 px-6 items-center justify-center">
      <View className="w-16 h-16 rounded-full bg-danger/10 border border-danger/30 items-center justify-center mb-4">
        <Icon name="ExclamationTriangleIcon" variant="solid" size={32} color="#f43f5e" />
      </View>
      <Text className="text-text font-bold text-base text-center mb-2">
        {COPY.home.errorTitle}
      </Text>
      <Text className="text-text-muted text-sm text-center leading-relaxed mb-6">
        {message}
      </Text>
      <TouchableOpacity
        onPress={onRetry}
        className="bg-primary px-6 py-3 rounded-xl flex-row items-center justify-center"
      >
        <Icon name="ArrowPathIcon" size={18} color="#0b1120" />
        <Text className="text-background font-bold text-sm ml-2">
          {COPY.home.retryButton}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
