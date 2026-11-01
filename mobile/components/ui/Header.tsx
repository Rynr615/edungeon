// mobile/components/ui/Header.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

interface HeaderProps {
  title?: string; // Tanda ? membuat prop title bersifat opsional
  showBackBtn?: boolean;
  rightElement?: React.ReactNode;
}

export function Header({ title = "Edungeon", showBackBtn = false, rightElement }: HeaderProps) {
  const router = useRouter();

  return (
    <View className="flex-row items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800">
      <View className="flex-row items-center space-x-3">
        {showBackBtn && (
          <TouchableOpacity
            onPress={() => router.back()}
            className="p-1 px-2 rounded-lg bg-slate-800 border border-slate-700 mr-2"
          >
            <Text className="text-slate-400 font-bold text-base">←</Text>
          </TouchableOpacity>
        )}
        <Text className="text-white text-lg font-bold">{title}</Text>
      </View>

      {rightElement && <View>{rightElement}</View>}
    </View>
  );
}