import React from "react";
import { View, Text } from "react-native";
import { BuffCard } from "../../types/battle";
import { s } from "./styles";
export function ActiveBuffBar({ card }: { card: BuffCard | null }) {
  if (!card) return null;
  return (
    <View style={[s.panel, { backgroundColor: "#fff4ca", padding: 12 }]}>
      <Text style={[s.text, { fontWeight: "700" }]}>
        {card.id} · {card.name}
      </Text>
      <Text style={s.muted}>{card.description}</Text>
    </View>
  );
}
