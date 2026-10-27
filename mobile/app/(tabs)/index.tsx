// mobile/app/(tabs)/index.tsx
import React from "react";
import { View, Text, ScrollView } from "react-native";
import { Header } from "../../components/ui/Header";
import { Card } from "../../components/ui/Card";
import { ProgressBar } from "../../components/ui/ProgressBar";
import { Icon } from "../../components/ui/Icon";

export default function HomeScreen() {
  return (
    <View className="flex-1 bg-background">
      <Header />
      <ScrollView className="flex-1 px-6 pt-4">
        <Card className="mb-6">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-text font-bold text-base">Main Progress</Text>
            <Text className="text-primary font-bold text-xs">Modul 1/5</Text>
          </View>
          <ProgressBar progress={20} label="Progres Keseluruhan" />
        </Card>

        <Text className="text-text font-bold text-lg mb-3">Modul Pembelajaran</Text>

        <Card className="mb-4 flex-row items-center justify-between">
          <View className="flex-1 mr-3">
            <Text className="text-text font-bold text-base">Modul 1</Text>
            <Text className="text-subtext text-xs mt-0.5">Eksponen dan Logaritma</Text>
          </View>
          <View className="bg-primary px-3 py-1.5 rounded-lg flex-row items-center">
            <Icon name="PlayIcon" variant="solid" size={16} color="#ffffff" />
            <Text className="text-text text-xs font-bold ml-1">Mulai</Text>
          </View>
        </Card>

        <Card className="mb-4 flex-row items-center justify-between opacity-60">
          <View className="flex-1 mr-3">
            <Text className="text-text font-bold text-base">Modul 2</Text>
            <Text className="text-subtext text-xs mt-0.5">Algoritma dan Pemrograman</Text>
          </View>
          <View className="bg-surface-light px-3 py-1.5 rounded-lg flex-row items-center">
            <Icon name="LockClosedIcon" variant="solid" size={16} color="#94a3b8" />
            <Text className="text-subtext text-xs font-bold ml-1">Terkunci</Text>
          </View>
        </Card>
      </ScrollView>
    </View>
  );
}