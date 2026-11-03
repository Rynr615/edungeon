// mobile/app/module/[moduleId]/index.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Header } from "../../../components/ui/Header";
import { ModuleOverviewHeader } from "../../../components/home/ModuleOverviewHeader";
import { SubBabStatusIcon } from "../../../components/home/SubBabStatusIcon";
import { ErrorState } from "../../../components/home/ErrorState";
import { Icon } from "../../../components/ui/Icon";
import { COPY } from "../../../constants/copy";
import { GlossaryModal } from "../../../components/home/GlossaryModal";
import { useModuleProgress } from "../../../hooks/useModuleProgress";

export default function ModuleOverviewScreen() {
  const { moduleId } = useLocalSearchParams<{ moduleId: string }>();
  const router = useRouter();
  const [formulaModalVisible, setFormulaModalVisible] = useState(false);
  const [glossaryVisible, setGlossaryVisible] = useState(false);

  const {
    modul,
    loading,
    error,
    subBabList,
    subBabSelesai,
    isCompleted,
    progressPercentage,
    refetch,
  } = useModuleProgress(moduleId || "");

  if (loading) {
    return (
      <View className="flex-1 bg-background justify-center items-center">
        <ActivityIndicator size="large" color="#38bdf8" />
        <Text className="text-text-muted text-xs mt-3">
          Mempersiapkan silabus petualangan...
        </Text>
      </View>
    );
  }

  if (error || !modul) {
    return (
      <View className="flex-1 bg-background">
        <Header title="Detail Modul" showBackBtn={true} />
        <ErrorState message={error || "Modul tidak ditemukan"} onRetry={refetch} />
      </View>
    );
  }

  // Tentukan sub-bab pertama yang belum tuntas untuk aksi tombol utama
  let firstUnfinishedSub = subBabList.find(
    (s) => !subBabSelesai.includes(s.id_sub_bab)
  );
  if (!firstUnfinishedSub && subBabList.length > 0) {
    firstUnfinishedSub = subBabList[0];
  }

  const handleStartOrResume = () => {
    if (isCompleted) {
      // Jika semua sudah selesai, arahkan ke Challenge milik Anggota 2
      router.push("/(tabs)/challenge");
    } else if (firstUnfinishedSub) {
      router.push(`/module/${moduleId}/${firstUnfinishedSub.id_sub_bab}`);
    }
  };

  const handleSelectSubBab = (subBabId: string) => {
    router.push(`/module/${moduleId}/${subBabId}`);
  };

  return (
    <View className="flex-1 bg-background">
      <Header
        title={modul.nama_modul}
        showBackBtn={true}
      />

      <ScrollView
        className="flex-1 px-5 pt-3"
        contentContainerStyle={{ maxWidth: 768, width: "100%", alignSelf: "center" }}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner Overview Modul */}
        <ModuleOverviewHeader
          moduleTitle={modul.nama_modul}
          subject={modul.mata_pelajaran}
          subBabCount={subBabList.length}
          estimatedMinutes={modul.estimasi_menit || 35}
          progressPercent={progressPercentage}
          objectives={modul.tujuan_pembelajaran}
          ringkasanRumusCount={(modul.ringkasan_rumus || []).length}
          onOpenFormulaModal={() => setFormulaModalVisible(true)}
        />

        {/* Silabus Daftar Sub-Bab */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-text font-bold text-base">
              {COPY.module.overview.syllabusTitle}
            </Text>
            <Text className="text-text-muted text-xs">
              {subBabSelesai.length} dari {subBabList.length} Selesai
            </Text>
          </View>

          {subBabList.map((sub, idx) => {
            const isDone = subBabSelesai.includes(sub.id_sub_bab);
            const status = isDone ? "selesai" : "belum_dibaca";

            return (
              <TouchableOpacity
                key={sub.id_sub_bab || idx}
                activeOpacity={0.7}
                onPress={() => handleSelectSubBab(sub.id_sub_bab)}
                className={`p-4 rounded-2xl mb-3 flex-row items-center justify-between border ${
                  isDone
                    ? "bg-surface border-success/30"
                    : "bg-surface border-border"
                }`}
              >
                <View className="flex-row items-center flex-1 mr-3">
                  <SubBabStatusIcon status={status} indexNumber={idx + 1} />
                  <View className="ml-3 flex-1">
                    <Text className="text-text font-bold text-sm" numberOfLines={1}>
                      {sub.judul}
                    </Text>
                    <Text className="text-text-muted text-xs mt-0.5">
                      ~{sub.estimasi_menit || 8} Menit • {sub.tujuan_pembelajaran || "Konsep Inti"}
                    </Text>
                  </View>
                </View>

                <Icon name="ArrowRightIcon" size={16} color="#94a3b8" />
              </TouchableOpacity>
            );
          })}
        </View>

        <View className="h-24" />
      </ScrollView>

      {/* Bar Bawah Menempel (Sticky CTA) */}
      <View className="bg-surface border-t border-border p-4">
        <TouchableOpacity
          onPress={handleStartOrResume}
          className={`py-4 rounded-2xl items-center justify-center flex-row shadow-sm ${
            isCompleted ? "bg-accent-gold" : "bg-primary"
          }`}
        >
          <Text
            className={`font-bold text-sm mr-2 ${
              isCompleted ? "text-background" : "text-background"
            }`}
          >
            {isCompleted
              ? COPY.module.overview.challengeReadyButton
              : subBabSelesai.length === 0
              ? COPY.module.overview.startButton
              : COPY.module.overview.resumeButton}
          </Text>
          <Icon
            name={isCompleted ? "SparklesIcon" : "PlayIcon"}
            variant="solid"
            size={18}
            color="#0b1120"
          />
        </TouchableOpacity>
      </View>

      {/* Modal Kartu Rumus Kunci */}
      <Modal
        visible={formulaModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setFormulaModalVisible(false)}
      >
        <View className="flex-1 bg-black/75 justify-end">
          <View className="bg-surface border-t-2 border-border rounded-t-3xl p-5 max-h-[75%]">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-text font-bold text-base">
                📌 Kartu Rumus Kunci Bab
              </Text>
              <TouchableOpacity
                onPress={() => setFormulaModalVisible(false)}
                className="w-8 h-8 rounded-full bg-surface-alt items-center justify-center border border-border"
              >
                <Icon name="XMarkIcon" size={18} color="#94a3b8" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {(modul.ringkasan_rumus || []).map((rumus, rIdx) => (
                <View
                  key={rIdx}
                  className="bg-formula-bg border border-formula-border p-3.5 rounded-xl mb-2.5"
                >
                  <Text className="text-primary font-mono font-bold text-sm">
                    {rumus}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
      {/* Modal Glosarium Istilah */}
      <GlossaryModal
        visible={glossaryVisible}
        onClose={() => setGlossaryVisible(false)}
      />
    </View>
  );
}
