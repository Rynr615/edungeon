import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  AppState,
} from "react-native";
import { useRouter } from "expo-router";
import { battleService } from "../../services/battleService";
import { Run, Question, Option, BattleResult } from "../../types/battle";
import { ChallengeHeader } from "../../components/challenge/ChallengeHeader";
import { BattleArena } from "../../components/challenge/BattleArena";
import { CharacterView } from "../../components/challenge/CharacterView";
import { QuestionBox } from "../../components/challenge/QuestionBox";
import { OptionButtons } from "../../components/challenge/OptionButtons";
import { SkillActionPanel } from "../../components/challenge/SkillActionPanel";
import { CardDraftModal } from "../../components/challenge/CardDraftModal";
import { ActiveBuffBar } from "../../components/challenge/ActiveBuffBar";
import { s } from "../../components/challenge/styles";
import { Sprite } from "../../components/challenge/Sprite";
export default function BattleScreen() {
  const router = useRouter();
  const [run, setRun] = useState<Run | null>(null);
  const [question, setQuestion] = useState<Question | null>(null);
  const [selected, setSelected] = useState<Option | null>(null);
  const [result, setResult] = useState<BattleResult | null>(null);
  const [seconds, setSeconds] = useState(20);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const gate = useRef(false);
  const offset = useRef(0);
  const mounted = useRef(true);
  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const state = await battleService.getState();
      if (!state.run) {
        router.replace("/(tabs)/challenge");
        return;
      }
      if (["dead", "victory"].includes(state.run.status)) {
        router.replace("/game/game-over");
        return;
      }
      const start = Date.now();
      const data = await battleService.getStageQuestion(state.run.id);
      if (!mounted.current) return;
      offset.current = data.serverNow - (start + Date.now()) / 2;
      setRun(data.run);
      setQuestion(data.question);
      setSeconds(
        data.question
          ? Math.max(
              0,
              Math.ceil(
                (data.question.deadline - Date.now() - offset.current) / 1000,
              ),
            )
          : 0,
      );
      setSelected(null);
      setResult(null);
    } catch (e) {
      if (mounted.current) setError((e as Error).message);
    } finally {
      if (mounted.current) setLoading(false);
    }
  }, [router]);
  useEffect(() => {
    mounted.current = true;
    void Promise.resolve().then(load);
    return () => {
      mounted.current = false;
    };
  }, [load]);
  const submit = useCallback(
    async (answer: Option | null) => {
      if (gate.current || !run || !question || result || loading) return;
      gate.current = true;
      setBusy(true);
      setError("");
      try {
        const data = await battleService.submitAnswer(
          run.id,
          question.nonce,
          answer,
        );
        if (mounted.current) {
          setRun(data.run);
          setResult(data.result);
        }
      } catch (e) {
        if (mounted.current) setError((e as Error).message);
      } finally {
        gate.current = false;
        if (mounted.current) setBusy(false);
      }
    },
    [run, question, result, loading],
  );
  useEffect(() => {
    if (!question || result || loading) return;
    const tick = () =>
      setSeconds(
        Math.max(
          0,
          Math.ceil((question.deadline - Date.now() - offset.current) / 1000),
        ),
      );
    tick();
    const interval = setInterval(tick, 200);
    return () => clearInterval(interval);
  }, [question, result, loading]);
  useEffect(() => {
    if (seconds === 0 && question && !result && !loading && !error)
      void Promise.resolve().then(() => submit(null));
  }, [seconds, question, result, loading, error, submit]);
  useEffect(() => {
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active" && !gate.current) void load();
    });
    return () => sub.remove();
  }, [load]);
  async function skill(id: "mage" | "arcane" | "aim") {
    if (gate.current || !run || !question) return;
    gate.current = true;
    setBusy(true);
    setError("");
    try {
      const next = await battleService.useSkill(run.id, question.nonce, id);
      setRun(next);
      setQuestion({
        ...question,
        hidden: next.question?.hidden || [],
        marked: next.question?.marked || [],
      });
      if (selected && next.question?.hidden.includes(selected))
        setSelected(null);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      gate.current = false;
      setBusy(false);
    }
  }
  async function draft(id: string) {
    if (gate.current || !run) return;
    gate.current = true;
    setBusy(true);
    setError("");
    try {
      await battleService.selectBuffCard(run.id, id);
      await load();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      gate.current = false;
      setBusy(false);
    }
  }
  function next() {
    if (run && ["dead", "victory"].includes(run.status))
      router.replace("/game/game-over");
    else void load();
  }
  return (
    <View style={s.screen}>
      <ChallengeHeader back />
      <ScrollView contentContainerStyle={s.content}>
        {loading && <ActivityIndicator color="#1b1410" />}
        {run && (
          <>
            <View style={[s.panel, s.row]}>
              <View>
                <Text style={s.text}>Stage {run.stage} / 10</Text>
                <Text style={s.label}>
                  {run.heroClass.toUpperCase()} • {run.exp} EXP
                </Text>
              </View>
              <Text style={s.text}>{run.streak} streak</Text>
            </View>
            <ActiveBuffBar card={run.activeCard} />
            {question && (
              <>
                <QuestionBox text={question.text} seconds={seconds} />
                <BattleArena run={run} />
                <OptionButtons
                  question={question}
                  selected={selected}
                  result={result}
                  disabled={busy || !!result || seconds === 0 || loading}
                  onSelect={setSelected}
                />
                <SkillActionPanel
                  run={run}
                  disabled={busy || !!result || seconds === 0 || loading}
                  onSkill={skill}
                />
              </>
            )}
            {result ? (
              <View
                style={[
                  s.panel,
                  { backgroundColor: result.correct ? "#d5efdf" : "#ffebed" },
                ]}
              >
                <Text accessibilityLiveRegion="polite" style={s.text}>
                  {result.message}
                </Text>
                {result.hint && (
                  <Text style={s.text}>Petunjuk: {result.hint}</Text>
                )}
                <Pressable disabled={busy} onPress={next} style={s.button}>
                  <Text style={s.buttonText}>
                    {["dead", "victory"].includes(run.status)
                      ? "Lihat hasil"
                      : result.retry
                        ? "Coba lagi"
                        : "Lanjut →"}
                  </Text>
                </Pressable>
              </View>
            ) : (
              question && (
                <Pressable
                  disabled={
                    busy || selected === null || seconds === 0 || loading
                  }
                  onPress={() => submit(selected)}
                  style={[
                    s.button,
                    { opacity: busy || selected === null ? 0.5 : 1 },
                  ]}
                >
                  <Text style={s.buttonText}>
                    {busy ? "Memproses…" : "Serang musuh"}
                  </Text>
                </Pressable>
              )
            )}
            <View style={{ alignItems: "center" }}>
              <Sprite hero={run.heroClass} size={112} />
            </View>
            <CharacterView run={run} />
            <CardDraftModal
              cards={run.status === "draft" ? run.offers : []}
              busy={busy}
              error={error}
              onSelect={draft}
            />
          </>
        )}
        {!!error && (
          <View style={s.panel}>
            <Text style={s.error}>{error}</Text>
            <Pressable disabled={busy} onPress={() => void load()}>
              <Text style={s.text}>Muat ulang soal →</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
