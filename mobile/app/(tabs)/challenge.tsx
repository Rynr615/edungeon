// mobile/app/(tabs)/challenge.tsx
import React from "react";
import { View, Text, ScrollView } from "react-native";
import { Header } from "../../components/ui/Header";
import { Card } from "../../components/ui/Card";
import { Icon } from "../../components/ui/Icon";

export default function ChallengeScreen() {
  return (
    <View className="flex-1 bg-background">
      <Header />
      <ScrollView className="flex-1 px-6 pt-4">
        <Card className="mb-6 bg-surface border-primary/30">
          <View className="flex-row items-center">
            <Icon name="TrophyIcon" variant="solid" size={28} color="#eab308" />
            <View className="ml-3 flex-1">
              <Text className="text-text font-bold text-lg">Arena Dungeon</Text>
              <Text className="text-subtext text-xs">Modul 1: Eksponen dan Logaritma</Text>
            </View>
          </View>
        </Card>

        <View className="items-center py-8">
          <Icon name="MapIcon" variant="outline" size={64} color="#94a3b8" />
          <Text className="text-subtext text-center mt-3">
            Peta Stage 1-10 siap diintegrasikan.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}