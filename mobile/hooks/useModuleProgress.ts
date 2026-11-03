// mobile/hooks/useModuleProgress.ts
import { useState, useEffect, useCallback } from "react";
import { moduleService } from "../services/moduleService";
import { Modul, SubBab } from "../types/module";
import { useAuth } from "../context/AuthContext";

export function useModuleProgress(moduleId: string, activeSubBabId?: string) {
  const { idToken } = useAuth();
  const [modul, setModul] = useState<Modul | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [subBabSelesai, setSubBabSelesai] = useState<string[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDetail = useCallback(async () => {
    if (!idToken || !moduleId) return;
    try {
      setLoading(true);
      setError(null);
      const data = await moduleService.getModuleDetail(idToken, moduleId);
      setModul(data);

      if (data.progres_siswa) {
        setSubBabSelesai(data.progres_siswa.sub_bab_selesai || []);
        setIsCompleted(data.progres_siswa.materi_selesai || false);
      }
    } catch (err: any) {
      console.error("[useModuleProgress] Error:", err);
      setError(err.message || "Gagal memuat detail modul");
    } finally {
      setLoading(false);
    }
  }, [idToken, moduleId]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  // Fungsi menandai satu sub-bab selesai dengan pembaruan optimistis
  const completeSubBab = async (subBabId: string) => {
    if (!idToken || !moduleId) return;
    try {
      // Optimistic update
      if (!subBabSelesai.includes(subBabId)) {
        setSubBabSelesai((prev) => [...prev, subBabId]);
      }

      await moduleService.completeLesson(idToken, moduleId, subBabId);
    } catch (err: any) {
      console.error("[useModuleProgress] completeSubBab error:", err);
      // Revert jika gagal
      fetchDetail();
      throw err;
    }
  };

  // Fungsi menandai seluruh modul materi selesai dibaca
  const completeAllLesson = async () => {
    if (!idToken || !moduleId) return;
    try {
      setSubmitting(true);
      await moduleService.completeLesson(idToken, moduleId);
      setIsCompleted(true);
    } catch (err: any) {
      console.error("[useModuleProgress] completeAllLesson error:", err);
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  // Navigasi sub-bab aktif, sebelumnya, dan berikutnya
  const subBabList: SubBab[] = modul?.sub_bab || [];
  const currentIndex = activeSubBabId
    ? subBabList.findIndex((s) => s.id_sub_bab === activeSubBabId)
    : 0;

  const currentSubBab = subBabList[currentIndex >= 0 ? currentIndex : 0] || null;
  const prevSubBab = currentIndex > 0 ? subBabList[currentIndex - 1] : null;
  const nextSubBab =
    currentIndex < subBabList.length - 1 ? subBabList[currentIndex + 1] : null;

  const totalSubBab = subBabList.length;
  const completedSubBabCount = subBabSelesai.length;
  const progressPercentage =
    totalSubBab > 0
      ? Math.round((completedSubBabCount / totalSubBab) * 100)
      : 0;

  return {
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
    isCompleted,
    progressPercentage,
    completeSubBab,
    completeAllLesson,
    refetch: fetchDetail,
  };
}
