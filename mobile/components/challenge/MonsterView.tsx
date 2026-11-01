import React from "react";
import { View, Text } from "react-native";
import { Sprite } from "./Sprite";
import { s, colors } from "./styles";
export function MonsterView({ stage, hp }: { stage: number; hp: number }) {
  const max = stage === 10 ? 30 : stage === 5 ? 20 : 10;
  return (
    <View style={{ alignItems: "center", gap: 7 }}>
      <Text
        style={[
          s.label,
          {
            fontWeight: "700",
            color: stage % 5 === 0 ? "#9b6514" : colors.muted,
          },
        ]}
      >
        {stage === 10
          ? "LAST BOSS"
          : stage === 5
            ? "MID-BOSS"
            : stage > 5
              ? "MONSTER ELIT"
              : "MONSTER DUNGEON"}
      </Text>
      <Sprite monster size={120} />
      <View
        accessibilityLabel={`HP musuh ${hp} dari ${max}`}
        style={{
          height: 7,
          width: 150,
          backgroundColor: colors.panel,
          borderRadius: 9,
          overflow: "hidden",
        }}
      >
        <View
          style={{
            height: 7,
            width: `${(hp / max) * 100}%`,
            backgroundColor: colors.red,
          }}
        />
      </View>
      <Text style={s.label}>
        {hp} / {max} HP
      </Text>
    </View>
  );
}
