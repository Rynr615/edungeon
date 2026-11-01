// mobile/app/game/[stageId].tsx
import React, { useState } from "react";
import { View, Text, ScrollView, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Header } from "../../components/ui/Header";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { ProgressBar } from "../../components/ui/ProgressBar";
import { Soal, GameState } from "../../types/game";

const DUMMY_SOAL: Soal[] = [
  {
    id_soal: "S01",
    id_modul: "M01",
    pertanyaan: "Berapakah hasil dari 2^4 + 3 x 5?",
    pilihan: ["29", "31", "35", "41"],
    jawaban_benar: 1,
    pembahasan: "2^4 = 16. Kemudian 3 x 5 = 15. Maka 16 + 15 = 31.",
  },
  {
    id_soal: "S02",
    id_modul: "M01",
    pertanyaan: "Jika f(x) = 2x + 5, berapakah nilai dari f(3)?",
    pilihan: ["8", "10", "11", "13"],
    jawaban_benar: 2,
    pembahasan: "f(3) = 2(3) + 5 = 6 + 5 = 11.",
  },
];

export default function GameBattleScreen() {
  const router = useRouter(); // Perbaikan typo Router() -> useRouter()
  const { stageId } = useLocalSearchParams<{ stageId: string }>();

  const [gameState, setGameState] = useState<GameState>({
    userHp: 100,
    maxHp: 100,
    enemyHp: 100,
    maxEnemyHp: 100,
    currentQuestionIndex: 0,
    combo: 0,
    isGameOver: false,
    isVictory: false,
  });

  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const currentSoal = DUMMY_SOAL[gameState.currentQuestionIndex];

  const handleSelectOption = (index: number) => {
    setSelectedAnswer(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) {
      Alert.alert("Peringatan", "Pilih salah satu jawaban terlebih dahulu!");
      return;
    }

    const isCorrect = selectedAnswer === currentSoal.jawaban_benar;
    const damageToEnemy = isCorrect ? 50 + gameState.combo * 10 : 0;
    const damageToUser = isCorrect ? 0 : 25;

    const newEnemyHp = Math.max(0, gameState.enemyHp - damageToEnemy);
    const newUserHp = Math.max(0, gameState.userHp - damageToUser);
    const newCombo = isCorrect ? gameState.combo + 1 : 0;

    if (newEnemyHp <= 0) {
      setGameState((prev) => ({
        ...prev,
        enemyHp: 0,
        isVictory: true,
      }));
      Alert.alert("Kemenangan!", "Kamu berhasil mengalahkan musuh di Stage ini!", [
        { text: "Lanjut", onPress: () => router.replace("/(tabs)/challenge") },
      ]);
      return;
    }

    if (newUserHp <= 0) {
      setGameState((prev) => ({
        ...prev,
        userHp: 0,
        isGameOver: true,
      }));
      Alert.alert("Kekalahan!", "HP kamu telah habis. Coba lagi!", [
        { text: "Kembali", onPress: () => router.replace("/(tabs)/challenge") },
      ]);
      return;
    }

    const nextIndex = (gameState.currentQuestionIndex + 1) % DUMMY_SOAL.length;

    setGameState((prev) => ({
      ...prev,
      enemyHp: newEnemyHp,
      userHp: newUserHp,
      combo: newCombo,
      currentQuestionIndex: nextIndex,
    }));

    setSelectedAnswer(null);
  };

  return (
    <View className="flex-1 bg-slate-900">
      <Header title={`Stage ${stageId || "1-1"}`} showBackBtn />

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* Status HP Player & Enemy */}
        <Card className="mb-4">
          <View className="mb-3">
            <Text className="text-emerald-400 font-bold mb-1">
              HP Pahlawan ({gameState.userHp}/{gameState.maxHp})
            </Text>
            <ProgressBar progress={gameState.userHp / gameState.maxHp} />
          </View>

          <View>
            <Text className="text-rose-400 font-bold mb-1">
              HP Boss Stage ({gameState.enemyHp}/{gameState.maxEnemyHp})
            </Text>
            <ProgressBar progress={gameState.enemyHp / gameState.maxEnemyHp} />
          </View>
        </Card>

        {/* Info Combo */}
        {gameState.combo > 1 && (
          <View className="bg-amber-500/20 p-2 rounded-lg mb-4 align-center border border-amber-500/40">
            <Text className="text-amber-400 font-bold text-center">
              🔥 Combo Multiplier x{gameState.combo}!
            </Text>
          </View>
        )}

        {/* Kartu Soal */}
        <Card className="mb-4">
          <Text className="text-slate-400 text-xs mb-1">
            Soal Ke-{gameState.currentQuestionIndex + 1}
          </Text>
          <Text className="text-white text-lg font-semibold mb-4">
            {currentSoal.pertanyaan}
          </Text>

          {/* Pilihan Jawaban */}
          {currentSoal.pilihan.map((option, idx) => {
            const isSelected = selectedAnswer === idx;
            return (
              <Button
                key={idx}
                title={`${String.fromCharCode(65 + idx)}. ${option}`}
                variant={isSelected ? "primary" : "secondary"}
                onPress={() => handleSelectOption(idx)}
                className="mb-2 justify-start px-4"
              />
            );
          })}
        </Card>

        {/* Tombol Eksekusi Jawaban */}
        <Button
          title="Serang Musuh!"
          variant="danger"
          onPress={handleSubmitAnswer}
        />
      </ScrollView>
    </View>
  );
}