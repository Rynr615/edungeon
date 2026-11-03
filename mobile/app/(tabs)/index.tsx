// mobile/app/(tabs)/index.tsx
import React from "react";
import { View, ScrollView, RefreshControl } from "react-native";
import { useRouter } from "expo-router";
import { Header } from "../../components/ui/Header";
import { UserGreetingBar } from "../../components/home/UserGreetingBar";
import { ContinueLearningCard } from "../../components/home/ContinueLearningCard";
import { CurriculumSummaryCard } from "../../components/home/CurriculumSummaryCard";
import { ModuleList } from "../../components/home/ModuleList";
import { ScreenSkeleton } from "../../components/home/ScreenSkeleton";
import { ErrorState } from "../../components/home/ErrorState";
import { EmptyState } from "../../components/home/EmptyState";
import { useModules } from "../../hooks/useModules";

export default function HomeScreen() {
  const router = useRouter();
  const {
    modules,
    loading,
    refreshing,
    error,
    completedCount,
    totalModules,
    totalProgressPercentage,
    lastLearned,
    userProfile,
    refreshModules,
    retry,
  } = useModules();

  const handleSelectModule = (moduleId: string) => {
    router.push(`/module/${moduleId}`);
  };

  const handleResumeLearning = (moduleId: string, subBabId: string) => {
    router.push(`/module/${moduleId}?subBabId=${subBabId}`);
  };

  return (
    <View className="flex-1 bg-background">
      <Header title="Edungeon" />

      {loading ? (
        <ScreenSkeleton />
      ) : error ? (
        <ScrollView
          className="flex-1"
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refreshModules}
              tintColor="#38bdf8"
            />
          }
        >
          <ErrorState message={error} onRetry={retry} />
        </ScrollView>
      ) : (
        <ScrollView
          className="flex-1 px-5 pt-3"
          contentContainerStyle={{ maxWidth: 768, width: "100%", alignSelf: "center" }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refreshModules}
              tintColor="#38bdf8"
            />
          }
        >
          {/* 1. Bar Sapaan & Status Gamifikasi Siswa */}
          <UserGreetingBar
            name={userProfile?.nama || "Petualang"}
            studentClass={userProfile?.kelas || "Kelas X"}
            level={Math.floor((userProfile?.total_exp || 0) / 100) + 1}
            totalExp={userProfile?.total_exp || 0}
          />

          {/* 2. Kartu Aksi Utama: Lanjutkan Petualangan Belajar */}
          <ContinueLearningCard
            lastLearned={lastLearned}
            onResume={handleResumeLearning}
          />

          {/* 3. Ringkasan Progres Kurikulum */}
          <CurriculumSummaryCard
            completedCount={completedCount}
            totalModules={totalModules}
            progressPercentage={totalProgressPercentage}
          />

          {/* 4. Daftar Kurikulum Modul (Roadmap Spine) */}
          {modules.length === 0 ? (
            <EmptyState onAction={refreshModules} />
          ) : (
            <ModuleList
              modules={modules}
              onSelectModule={handleSelectModule}
            />
          )}
        </ScrollView>
      )}
    </View>
  );
}
