// mobile/hooks/useModules.ts
import { useState, useEffect, useCallback } from "react";
import { moduleService } from "../services/moduleService";
import { Modul, LastLearnedState } from "../types/module";
import { useAuth } from "../context/AuthContext";

export function useModules() {
  const { idToken, user, userProfile } = useAuth();
  const [modules, setModules] = useState<Modul[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchModules = useCallback(async (isRefresh = false) => {
    if (!idToken) return;
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const data = await moduleService.getModules(idToken);
      setModules(data || []);
    } catch (err: any) {
      console.error("[useModules] Error fetch modules:", err);
      setError(err.message || "Gagal memuat kurikulum pembelajaran");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [idToken]);

  useEffect(() => {
    fetchModules();
  }, [fetchModules]);

  // Kalkulasi agregat kurikulum
  const totalModules = modules.length;
  const completedCount = modules.filter(
    (m) => m.modul_tamat || m.status_progres === "selesai"
  ).length;
  const totalProgressPercentage =
    totalModules > 0 ? Math.round((completedCount / totalModules) * 100) : 0;

  // Mencari modul dan sub-bab yang sedang aktif dipelajari untuk kartu "Lanjutkan Belajar"
  const findLastLearned = (): LastLearnedState | null => {
    if (modules.length === 0) return null;

    // Cari modul pertama yang berstatus "mulai" (sedang terbuka)
    const activeModule =
      modules.find(
        (m) => m.status_progres === "mulai" && !m.modul_tamat
      ) || modules[0];

    if (!activeModule) return null;

    const subBabs = activeModule.sub_bab || [];
    const completedSubIds = activeModule.sub_bab_selesai || [];

    // Cari sub-bab pertama yang belum selesai
    let targetIndex = subBabs.findIndex(
      (sub) => !completedSubIds.includes(sub.id_sub_bab)
    );
    if (targetIndex === -1) targetIndex = 0;

    const targetSubBab = subBabs[targetIndex];
    if (!targetSubBab) return null;

    const progressPercent =
      subBabs.length > 0
        ? Math.round((completedSubIds.length / subBabs.length) * 100)
        : 0;

    return {
      moduleId: activeModule.id_modul || activeModule.id,
      moduleTitle: activeModule.nama_modul,
      subBabId: targetSubBab.id_sub_bab,
      subBabTitle: targetSubBab.judul,
      subBabIndex: targetIndex + 1,
      totalSubBab: subBabs.length,
      progressPercent,
    };
  };

  const lastLearned = findLastLearned();

  return {
    modules,
    loading,
    refreshing,
    error,
    completedCount,
    totalModules,
    totalProgressPercentage,
    lastLearned,
    user,
    userProfile,
    refreshModules: () => fetchModules(true),
    retry: () => fetchModules(false),
  };
}
