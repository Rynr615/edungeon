// mobile/components/ui/Header.tsx
import React from "react";
import { View, Text } from "react-native";
import { useAuth } from "../../context/AuthContext";

export const Header: React.FC = () => {
  const { userProfile } = useAuth();
  const exp = userProfile?.total_exp || 0;
  const level = Math.floor(exp / 100) + 1;

  return (
    <View className="flex-row justify-between items-center px-6 pt-12 pb-4 bg-surface border-b border-surface-light">
      <View>
        <Text className="text-text font-bold text-lg">
          Hello, {userProfile?.nama || "Pahlawan"}
        </Text>
        <Text className="text-subtext text-xs">{userProfile?.kelas || "Kelas X"}</Text>
      </View>
      <View className="bg-background px-3 py-1.5 rounded-full border border-surface-light flex-row items-center">
        <Text className="text-exp font-bold text-xs">Lvl {level}</Text>
      </View>
    </View>
  );
};