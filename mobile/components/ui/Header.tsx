// mobile/components/ui/Header.tsx
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context"; // Gunakan ini agar aman dari notch/kamera
import { useRouter } from "expo-router";

interface HeaderProps {
  title?: string;
  showBackBtn?: boolean;
  rightElement?: React.ReactNode;
}

export function Header({ title = "Edungeon", showBackBtn = false, rightElement }: HeaderProps) {
  const router = useRouter();

  return (
    <SafeAreaView edges={['top']} className="bg-slate-900 border-b border-slate-800">
      <View className="flex-row items-center justify-between px-4 py-3">
        <View className="flex-row items-center flex-1 mr-2">
          {showBackBtn && (
            <TouchableOpacity
              onPress={() => router.back()}
              className="p-1 px-2 rounded-lg bg-slate-800 border border-slate-700 mr-3"
            >
              <Text className="text-slate-400 font-bold text-base">←</Text>
            </TouchableOpacity>
          )}
          <Text className="text-white text-lg font-bold" numberOfLines={1}>
            {title}
          </Text>
        </View>

        {rightElement && <View>{rightElement}</View>}
      </View>
    </SafeAreaView>
  );
}