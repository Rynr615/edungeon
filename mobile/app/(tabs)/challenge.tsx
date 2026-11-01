import React, { useCallback, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { battleService } from "../../services/battleService";
import { BattleModule, Run } from "../../types/battle";
import { ChallengeHeader } from "../../components/challenge/ChallengeHeader";
import { StageMap } from "../../components/challenge/StageMap";
import { CharacterView } from "../../components/challenge/CharacterView";
import { s } from "../../components/challenge/styles";
export default function ChallengeScreen() {
  const router = useRouter();
  const [modules, setModules] = useState<BattleModule[]>([]);
  const [selected, setSelected] = useState("");
  const [run, setRun] = useState<Run | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const scroll = useRef<ScrollView>(null);
  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const state = await battleService.getState();
      setModules(state.modules);
      setRun(state.run);
      setSelected(
        (current) =>
          current ||
          state.run?.moduleId ||
          state.modules.find((m) => m.ready)?.id ||
          state.modules[0]?.id ||
          "",
      );
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);
  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );
  const module = modules.find((m) => m.id === selected);
  const active = run?.moduleId === selected ? run : null;
  const open = () => {
    if (active && ["active", "draft"].includes(active.status))
      router.push(`/game/${active.stage}`);
    else
      router.push({
        pathname: "/game/select-class",
        params: { moduleId: selected },
      });
  };
  return (
    <View style={s.screen}>
      <ChallengeHeader />
      <View style={{ paddingHorizontal: 24, gap: 12, paddingBottom: 12 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8 }}
        >
          {modules.map((m) => (
            <Pressable
              key={m.id}
              onPress={() => setSelected(m.id)}
              style={[
                s.pill,
                { backgroundColor: selected === m.id ? "#1b1410" : "#dde1e6" },
              ]}
            >
              <Text
                style={[
                  s.label,
                  { color: selected === m.id ? "white" : "#1b1410" },
                ]}
              >
                {m.name}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
        {module && (
          <View style={[s.panel, s.row]}>
            <View style={{ flex: 1 }}>
              <Text style={s.text}>Stage {active?.stage || 1} Section:</Text>
              <Text style={s.text}>{module.name}</Text>
            </View>
            <View style={s.pill}>
              <Text style={{ color: "white", fontFamily: "monospace" }}>
                {active?.status === "victory"
                  ? 100
                  : ((active?.stage || 1) - 1) * 10}
                %
              </Text>
            </View>
          </View>
        )}
      </View>
      <ScrollView
        ref={scroll}
        contentContainerStyle={s.content}
        onContentSizeChange={() =>
          scroll.current?.scrollToEnd({ animated: false })
        }
      >
        {loading && <ActivityIndicator color="#1b1410" />}
        {!!error && (
          <View style={s.panel}>
            <Text style={s.error}>{error}</Text>
            <Pressable onPress={load}>
              <Text style={s.text}>Coba lagi →</Text>
            </Pressable>
          </View>
        )}
        {module && (
          <>
            <StageMap
              stage={active?.stage || 1}
              ready={module.ready}
              victory={active?.status === "victory"}
              onPress={open}
            />
            {active && <CharacterView run={active} />}
            {!module.ready ? (
              <Text style={s.muted}>{module.reason}</Text>
            ) : (
              <Pressable style={s.button} onPress={open}>
                <Text style={s.buttonText}>
                  {active && ["active", "draft"].includes(active.status)
                    ? "Lanjutkan petualangan"
                    : "Mulai petualangan"}
                </Text>
              </Pressable>
            )}
            {active && ["active", "draft"].includes(active.status) && (
              <Pressable
                onPress={() =>
                  Alert.alert(
                    "Mulai ulang?",
                    "Mulai dari Stage 1 tanpa buff.",
                    [
                      { text: "Batal", style: "cancel" },
                      {
                        text: "Pilih Class",
                        onPress: () =>
                          router.push({
                            pathname: "/game/select-class",
                            params: { moduleId: selected, restart: "true" },
                          }),
                      },
                    ],
                  )
                }
              >
                <Text style={[s.muted, { textAlign: "center" }]}>
                  Mulai ulang dari Stage 1
                </Text>
              </Pressable>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}
