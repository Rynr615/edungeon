import React from "react";
import { View } from "react-native";
import { Run } from "../../types/battle";
import { MonsterView } from "./MonsterView";
export function BattleArena({ run }: { run: Run }) {
  return (
    <View style={{ paddingVertical: 4 }}>
      <MonsterView stage={run.stage} hp={run.enemyHp} />
    </View>
  );
}
