// mobile/app/module/[moduleId]/[subBabId].tsx
import React, { useState } from "react";
import { View, ScrollView, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { LessonHeader } from "../../../components/home/LessonHeader";
import { TableOfContentsSheet } from "../../../components/home/TableOfContentsSheet";
import { StickyNavigationFooter } from "../../../components/home/StickyNavigationFooter";
import { LessonContentView } from "../../../components/home/LessonContentView";
import { FontSizeAdjuster, FontSizeLevel } from "../../../components/home/FontSizeAdjuster";
import { GlossaryModal } from "../../../components/home/GlossaryModal";
import { ModuleCompletionModal } from "../../../components/home/ModuleCompletionModal";
import { ErrorState } from "../../../components/home/ErrorState";
import { useModuleProgress } from "../../../hooks/useModuleProgress";

export default function SubBabReaderScreen() {
  const { moduleId, subBabId } = useLocalSearchParams<{
    moduleId: string;
    subBabId: string;
  }>();
  const router = useRouter();

  const [tocVisible, setTocVisible] = useState(false);
  const [glossaryVisible, setGlossaryVisible] = useState(false);
  const [completionModalVisible, setCompletionModalVisible] = useState(false);
  const [fontSizeLevel, setFontSizeLevel] = useState<FontSizeLevel>("normal");

  const {
    modul,
    loading,
    submitting,
    error,
    subBabList,
    currentSubBab,
    prevSubBab,
    nextSubBab,
    currentIndex,
    totalSubBab,
    subBabSelesai,
    progressPercentage,
    completeSubBab,
    completeAllLesson,
    refetch,
  } = useModuleProgress(moduleId || "", subBabId);

  if (loading) {
    return (
      <View className="flex-1 bg-background justify-center items-center">
        <ActivityIndicator size="large" color="#38bdf8" />
      </View>
    );
  }

  if (error || !modul || !currentSubBab) {
    return (
      <View className="flex-1 bg-background">
        <LessonHeader
          title="Reader Materi"
          progressPercent={0}
          onBack={() => router.back()}
          onOpenTOC={() => {}}
        />
        <ErrorState
          message={error || "Konten sub-bab tidak ditemukan"}
          onRetry={refetch}
        />
      </View>
    );
  }

  const isCurrentDone = subBabSelesai.includes(currentSubBab.id_sub_bab);

  const handlePrev = () => {
    if (prevSubBab) {
      router.replace(`/module/${moduleId}/${prevSubBab.id_sub_bab}`);
    }
  };

  const handleNextOrComplete = async () => {
    try {
      if (!isCurrentDone) {
        await completeSubBab(currentSubBab.id_sub_bab);
      }

      if (nextSubBab) {
        router.replace(`/module/${moduleId}/${nextSubBab.id_sub_bab}`);
      } else {
        // Tuntas seluruh sub-bab: Catat selesai di backend dan tampilkan modal perayaan
        await completeAllLesson();
        setCompletionModalVisible(true);
      }
    } catch (err: any) {
      console.error("[Reader] Error complete:", err);
    }
  };

  const handleSelectFromTOC = (targetSubBabId: string) => {
    router.replace(`/module/${moduleId}/${targetSubBabId}`);
  };

  return (
    <View className="flex-1 bg-background">
      {/* 1. Header Reader Sub-Bab */}
      <LessonHeader
        title={currentSubBab.judul}
        subTitle={`Sub-Bab ${currentIndex + 1} dari ${totalSubBab}`}
        progressPercent={progressPercentage}
        onBack={() => router.replace(`/module/${moduleId}`)}
        onOpenTOC={() => setTocVisible(true)}
      />

      {/* 2. Konten Membaca Scrollable */}
      <ScrollView
        className="flex-1 px-5 pt-3"
        contentContainerStyle={{ maxWidth: 768, width: "100%", alignSelf: "center" }}
        showsVerticalScrollIndicator={false}
      >
        {/* Kontrol Aksesibilitas: Pengatur Ukuran Huruf */}
        <FontSizeAdjuster
          fontSizeLevel={fontSizeLevel}
          onChangeFontSize={setFontSizeLevel}
        />

        {/* Blok Konten Pembelajaran Lengkap */}
        <LessonContentView
          subBabList={[currentSubBab]}
          ringkasanRumus={[]}
          onCompleteSubBab={completeSubBab}
          subBabSelesai={subBabSelesai}
        />

        <View className="h-14" />
      </ScrollView>

      {/* 3. Bar Navigasi Bawah Menempel */}
      <StickyNavigationFooter
        hasPrev={!!prevSubBab}
        hasNext={!!nextSubBab}
        isCompleted={isCurrentDone}
        onPrev={handlePrev}
        onNextOrComplete={handleNextOrComplete}
        loading={submitting}
      />

      {/* 4. Bottom Sheet Daftar Isi Sub-Bab */}
      <TableOfContentsSheet
        visible={tocVisible}
        onClose={() => setTocVisible(false)}
        moduleTitle={modul.nama_modul}
        subBabs={subBabList}
        activeSubBabId={currentSubBab.id_sub_bab}
        completedSubBabIds={subBabSelesai}
        onSelectSubBab={handleSelectFromTOC}
        onOpenFormulaCheatSheet={() => setGlossaryVisible(true)}
      />

      {/* 5. Modal Glosarium Istilah Matematika */}
      <GlossaryModal
        visible={glossaryVisible}
        onClose={() => setGlossaryVisible(false)}
      />

      {/* 6. Modal Perayaan Kemenangan & Gerbang Challenge */}
      <ModuleCompletionModal
        visible={completionModalVisible}
        moduleTitle={modul.nama_modul}
        totalSubBab={totalSubBab}
        onGoToChallenge={() => {
          setCompletionModalVisible(false);
          router.push("/(tabs)/challenge");
        }}
        onBackToHome={() => {
          setCompletionModalVisible(false);
          router.replace("/(tabs)");
        }}
      />
    </View>
  );
}
