import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { battleService } from "../../services/battleService";
import { Run } from "../../types/battle";
import { ChallengeHeader } from "../../components/challenge/ChallengeHeader";
import { Sprite } from "../../components/challenge/Sprite";
import { s } from "../../components/challenge/styles";
export default function GameOver() {
  const router = useRouter();
  const [run, setRun] = useState<Run | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    battleService
      .getState()
      .then((data) => {
        if (data.run && ["dead", "victory"].includes(data.run.status))
          setRun(data.run);
        else router.replace("/(tabs)/challenge");
      })
      .catch((e) => setError(e.message));
  }, [router]);
  return (
    <View style={s.screen}>
      <ChallengeHeader back />
      <ScrollView
        contentContainerStyle={[
          s.content,
          { alignItems: "center", paddingTop: 50 },
        ]}
      >
        {run ? (
          <>
            <Sprite hero={run.heroClass} size={100} />
            <Text style={s.label}>
              {run.status === "victory"
                ? "DUNGEON DITAKLUKKAN"
                : "PETUALANGAN BERAKHIR"}
            </Text>
            <Text style={s.title}>
              {run.status === "victory" ? "Kemenangan!" : "Hero tumbang."}
            </Text>
            <Text style={[s.muted, { textAlign: "center" }]}>
              {run.status === "victory"
                ? "Kamu menuntaskan seluruh 10 stage."
                : "Run berikutnya dimulai dari Stage 1. Buff kembali ke stat dasar."}
            </Text>
            <View style={[s.panel, { alignSelf: "stretch" }]}>
              <Text style={s.text}>Stage: {run.stage} / 10</Text>
              <Text style={s.text}>EXP run: {run.exp}</Text>
              <Text style={s.text}>
                Benar: {run.correct} / {run.answers}
              </Text>
              <Text style={s.text}>
                Monster: {run.kills} • Boss: {run.bosses}
              </Text>
            </View>
            <Pressable
              style={[s.button, { alignSelf: "stretch" }]}
              onPress={() =>
                router.replace({
                  pathname: "/game/select-class",
                  params: { moduleId: run.moduleId },
                })
              }
            >
              <Text style={s.buttonText}>Petualangan baru</Text>
            </Pressable>
            <Pressable onPress={() => router.replace("/(tabs)/challenge")}>
              <Text style={s.text}>Kembali ke peta</Text>
            </Pressable>
          </>
        ) : error ? (
          <Text style={s.error}>{error}</Text>
        ) : (
          <ActivityIndicator />
        )}
      </ScrollView>
    </View>
  );
}
