import { auth } from "./firebase";
import {
  Run,
  HeroClass,
  Option,
  QuestionResponse,
  BattleResult,
  BattleModule,
} from "../types/battle";
const base =
  (process.env.EXPO_PUBLIC_API_URL || "http://10.0.2.2:5000") + "/api/battle";
async function request<T>(path: string, body?: object): Promise<T> {
  if (!auth.currentUser) throw new Error("Silakan login kembali.");
  const token = await auth.currentUser.getIdToken();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(base + path, {
      method: body ? "POST" : "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
    const result = await response.json();
    if (!response.ok)
      throw new Error(result.message || "Server tidak tersedia.");
    return result.data;
  } catch (e) {
    if (e instanceof Error && e.name === "AbortError")
      throw new Error("Koneksi terputus. Coba lagi; progres tersimpan.");
    throw e;
  } finally {
    clearTimeout(timeout);
  }
}
export const battleService = {
  getState: () =>
    request<{ modules: BattleModule[]; run: Run | null }>("/state"),
  startRun: (moduleId: string, heroClass: HeroClass, restart = false) =>
    request<Run>("/start", { moduleId, heroClass, restart }),
  getStageQuestion: (runId: string) =>
    request<QuestionResponse>(`/question?runId=${encodeURIComponent(runId)}`),
  submitAnswer: (runId: string, nonce: string, answer: Option | null) =>
    request<{ run: Run; result: BattleResult }>("/answer", {
      runId,
      nonce,
      answer,
    }),
  useSkill: (runId: string, nonce: string, skill: "mage" | "arcane" | "aim") =>
    request<Run>("/use-skill", { runId, nonce, skill }),
  selectBuffCard: (runId: string, cardId: string) =>
    request<Run>("/draft-card", { runId, cardId }),
};
