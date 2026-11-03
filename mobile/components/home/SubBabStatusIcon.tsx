// mobile/components/home/SubBabStatusIcon.tsx
import React from "react";
import { View, Text } from "react-native";
import { Icon } from "../ui/Icon";

interface SubBabStatusIconProps {
  status: "selesai" | "aktif" | "belum_dibaca";
  indexNumber: number;
}

export const SubBabStatusIcon: React.FC<SubBabStatusIconProps> = ({
  status,
  indexNumber,
}) => {
  if (status === "selesai") {
    return (
      <View className="w-8 h-8 rounded-full bg-success/20 border border-success items-center justify-center">
        <Icon name="CheckCircleIcon" variant="solid" size={18} color="#34d399" />
      </View>
    );
  }

  if (status === "aktif") {
    return (
      <View className="w-8 h-8 rounded-full bg-primary/20 border-2 border-primary items-center justify-center">
        <Text className="text-primary font-bold text-xs">{indexNumber}</Text>
      </View>
    );
  }

  return (
    <View className="w-8 h-8 rounded-full bg-surface-alt border border-border items-center justify-center">
      <Text className="text-text-muted font-medium text-xs">{indexNumber}</Text>
    </View>
  );
};
