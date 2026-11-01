import React from "react";
import { View } from "react-native";
import { StageNode } from "./StageNode";
export function StageMap({
  stage = 1,
  ready = false,
  victory = false,
  onPress,
}: {
  stage?: number;
  ready?: boolean;
  victory?: boolean;
  onPress: () => void;
}) {
  const offsets = [0, -45, -85, -45, 7, 42, 80, 40, 0, -35];
  return (
    <View style={{ gap: 29, alignItems: "center", paddingVertical: 12 }}>
      {Array.from({ length: 10 }, (_, i) => 10 - i).map((n) => (
        <View key={n} style={{ transform: [{ translateX: offsets[n - 1] }] }}>
          <StageNode
            stage={n}
            current={n === stage && !victory}
            completed={victory || n < stage}
            locked={!ready || n !== stage || victory}
            onPress={onPress}
          />
        </View>
      ))}
    </View>
  );
}
