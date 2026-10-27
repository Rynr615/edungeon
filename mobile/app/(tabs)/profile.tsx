// mobile/app/(tabs)/profile.tsx
import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { Card } from "../../components/ui/Card";
import { Icon } from "../../components/ui/Icon";

export default function ProfileScreen() {
  const { userProfile, logoutUser } = useAuth();

  return (
    <View className="flex-1 bg-background">
      <ScrollView className="flex-1 px-6 pt-12">
        <View className="items-center mb-6">
          <View className="w-20 h-20 rounded-full bg-primary/20 items-center justify-center border-2 border-primary mb-3">
            <Icon name="UserIcon" variant="solid" size={40} color="#2563eb" />
          </View>
          <Text className="text-text font-bold text-xl">{userProfile?.nama || "Pahlawan"}</Text>
          <Text className="text-subtext text-sm">@{userProfile?.username || "pahlawan"}</Text>
          <Text className="text-primary font-semibold text-xs mt-1">{userProfile?.kelas || "Kelas X"}</Text>
        </View>

        <Text className="text-text font-bold text-base mb-3">Statistik Permainan</Text>
        <View className="flex-row flex-wrap justify-between mb-6">
          <Card className="w-[48%] mb-3 items-center">
            <Icon name="ShieldExclamationIcon" variant="solid" size={24} color="#ef4444" />
            <Text className="text-text font-bold text-lg mt-1">0</Text>
            <Text className="text-subtext text-xs">Monster Dikalahkan</Text>
          </Card>
          <Card className="w-[48%] mb-3 items-center">
            <Icon name="TrophyIcon" variant="solid" size={24} color="#a855f7" />
            <Text className="text-text font-bold text-lg mt-1">0</Text>
            <Text className="text-subtext text-xs">Boss Dikalahkan</Text>
          </Card>
          <Card className="w-[48%] items-center">
            <Icon name="AcademicCapIcon" variant="solid" size={24} color="#22c55e" />
            <Text className="text-text font-bold text-lg mt-1">0%</Text>
            <Text className="text-subtext text-xs">Akurasi Jawaban</Text>
          </Card>
          <Card className="w-[48%] items-center">
            <Icon name="StarIcon" variant="solid" size={24} color="#eab308" />
            <Text className="text-text font-bold text-lg mt-1">{userProfile?.total_exp || 0}</Text>
            <Text className="text-subtext text-xs">Total EXP</Text>
          </Card>
        </View>

        <TouchableOpacity
          className="bg-danger/20 border border-danger p-4 rounded-xl flex-row items-center justify-center mb-12"
          onPress={logoutUser}
        >
          <Icon name="ArrowRightOnRectangleIcon" variant="outline" size={20} color="#ef4444" />
          <Text className="text-danger font-bold text-base ml-2">Keluar / Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}