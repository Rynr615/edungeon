// mobile/services/moduleService.ts
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://10.0.2.2:5000";

export const moduleService = {
  // Mengambil daftar seluruh modul beserta status progres siswa
  async getModules(idToken: string) {
    const response = await fetch(`${API_BASE_URL}/api/modules`, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });
    const result = await response.json();
    if (result.status !== "success") {
      throw new Error(result.message || "Gagal mengambil daftar modul");
    }
    return result.data;
  },

  // Mengambil detail konten materi modul berdasarkan ID
  async getModuleDetail(idToken: string, moduleId: string) {
    const response = await fetch(`${API_BASE_URL}/api/modules/${moduleId}`, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });
    const result = await response.json();
    if (result.status !== "success") {
      throw new Error(result.message || "Gagal mengambil detail modul");
    }
    return result.data;
  },

  // Konfirmasi materi/sub-bab selesai dibaca
  async completeLesson(idToken: string, moduleId: string, subBabId?: string) {
    const response = await fetch(`${API_BASE_URL}/api/modules/${moduleId}/complete-lesson`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      // Kirim sub_bab_id di dalam body request ke backend
      body: JSON.stringify({ sub_bab_id: subBabId }),
    });
    const result = await response.json();
    if (result.status !== "success") {
      throw new Error(result.message || "Gagal memperbarui status materi");
    }
    return result.data;
  },
};