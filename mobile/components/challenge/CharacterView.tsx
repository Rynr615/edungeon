import React from "react";
import { View, Text } from "react-native";
import { Run } from "../../types/battle";
import { Sprite } from "./Sprite";
import { HpIndicator } from "./HpIndicator";
import { s } from "./styles";
export function CharacterView({ run }: { run: Run }) {
  return (
    <View style={[s.panel, s.row]}>
      <View>
        <Text
          style={[s.text, { fontWeight: "700", textTransform: "capitalize" }]}
        >
          {run.heroClass}
        </Text>
        <Text style={s.label}>Atk: 10</Text>
      </View>
      <Sprite hero={run.heroClass} size={56} />
      <View style={{ gap: 5 }}>
        <HpIndicator hp={run.hp} maxHp={run.maxHp} buffer={run.buffer} />
        <Text style={s.label}>
          {run.heroClass === "knight"
            ? `Shield ${run.shield}/${run.shieldCap}`
            : run.heroClass === "mage"
              ? `Kaca ${run.mage}/${run.mageCap}`
              : `Dodge ${Math.round(Math.min(0.7, 0.3 + Math.floor((run.stage - 1) / 2) * 0.1 + (run.card === "K03" ? 0.1 : 0)) * 100)}%`}
        </Text>
      </View>
    </View>
  );
}
