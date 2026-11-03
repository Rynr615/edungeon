// server/src/controllers/moduleController.ts
import { Response } from "express";
import { AuthRequest } from "../middleware/auth.js";
import { db } from "../config/firebase.js";

// 1. Mendapatkan daftar seluruh modul beserta status progres siswa (Lock & Key)
export const getModulesList = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const uid = req.user?.uid;
    if (!uid) {
      res.status(401).json({ status: "error", message: "Unauthorized" });
      return;
    }

    // Ambil semua modul diurutkan berdasarkan field 'urutan' secara aman
    const modulesSnapshot = await db.collection("tb_modul").orderBy("urutan", "asc").get();
    let modules = modulesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[];

    // Urutkan ulang di memori sebagai pengaman jika urutan kosong
    modules.sort((a, b) => (a.urutan || 0) - (b.urutan || 0));

    // Ambil progres siswa
    const progressSnapshot = await db.collection("tb_progres_siswa")
      .where("id_user", "==", uid)
      .get();
    
    const progressMap: Record<string, any> = {};
    progressSnapshot.docs.forEach(doc => {
      const data = doc.data();
      progressMap[data.id_modul] = data;
    });

    // Evaluasi status modul berdasarkan prasyarat linear
    const evaluatedModules = modules.map((modul, index) => {
      const progress = progressMap[modul.id_modul];
      let status = "terkunci";
      let modulTamat = progress?.modul_tamat || false;
      let materiSelesai = progress?.materi_selesai || false;
      let subBabSelesai = progress?.sub_bab_selesai || [];

      if (index === 0) {
        status = modulTamat ? "selesai" : "mulai";
      } else {
        const prevModulId = modules[index - 1].id_modul;
        const prevProgress = progressMap[prevModulId];
        
        if (prevProgress && prevProgress.modul_tamat) {
          status = modulTamat ? "selesai" : "mulai";
        } else {
          status = "terkunci";
        }
      }

      return {
        ...modul,
        status_progres: status,
        materi_selesai: materiSelesai,
        modul_tamat: modulTamat,
        sub_bab_selesai: subBabSelesai,
      };
    });

    res.status(200).json({ status: "success", data: evaluatedModules });
  } catch (error) {
    console.error("[ModuleController] Error getModulesList:", error);
    res.status(500).json({ status: "error", message: "Gagal memuat daftar modul" });
  }
};

// 2. Mendapatkan detail konten materi modul spesifik (termasuk sub-bab)
export const getModuleDetail = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    if (!id) {
      res.status(400).json({ status: "error", message: "ID Modul tidak valid" });
      return;
    }

    const docRef = await db.collection("tb_modul").doc(id).get();
    if (!docRef.exists) {
      res.status(404).json({ status: "error", message: "Modul tidak ditemukan" });
      return;
    }

    const uid = req.user?.uid;
    let progressData = null;
    if (uid) {
      const progressDoc = await db.collection("tb_progres_siswa").doc(`${uid}_${id}`).get();
      if (progressDoc.exists) {
        progressData = progressDoc.data();
      }
    }

    res.status(200).json({
      status: "success",
      data: {
        id: docRef.id,
        ...docRef.data(),
        progres_siswa: progressData || { materi_selesai: false, modul_tamat: false, sub_bab_selesai: [] }
      }
    });
  } catch (error) {
    console.error("[ModuleController] Error getModuleDetail:", error);
    res.status(500).json({ status: "error", message: "Gagal memuat detail modul" });
  }
};

// 3. Konfirmasi penyelesaian sub-bab atau materi modul secara keseluruhan
// server/src/controllers/moduleController.ts
export const completeModuleLesson = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const uid = req.user?.uid;
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { sub_bab_id } = req.body;

    if (!uid || !id) {
      res.status(400).json({ status: "error", message: "Data autentikasi atau ID modul tidak lengkap" });
      return;
    }

    const progressId = `${uid}_${id}`;
    const progressRef = db.collection("tb_progres_siswa").doc(progressId);
    const progressDoc = await progressRef.get();

    let currentSubBabSelesai: string[] = [];
    if (progressDoc.exists) {
      currentSubBabSelesai = progressDoc.data()?.sub_bab_selesai || [];
    }

    if (sub_bab_id && !currentSubBabSelesai.includes(sub_bab_id)) {
      currentSubBabSelesai.push(sub_bab_id);
    }

    // Untuk kebutuhan testing mandiri Anggota 1:
    // Menandai materi selesai juga langsung menamatkan modul agar modul berikutnya terbuka
    const materiSelesai = true;
    const modulTamat = true; // <--- Langsung set true agar modul berikutnya terbuka

    if (!progressDoc.exists) {
      await progressRef.set({
        id_progres: progressId,
        id_user: uid,
        id_modul: id,
        id_karakter: "knight",
        materi_selesai: materiSelesai,
        modul_tamat: modulTamat, // <--- Simpan status tamat
        sub_bab_selesai: currentSubBabSelesai,
        stage_aktif: 1,
        hp_sisa: 3,
        updated_at: new Date().toISOString(),
      });
    } else {
      await progressRef.update({
        materi_selesai: materiSelesai,
        modul_tamat: modulTamat, // <--- Perbarui status tamat
        sub_bab_selesai: currentSubBabSelesai,
        updated_at: new Date().toISOString(),
      });
    }

    res.status(200).json({
      status: "success",
      message: "Progres materi dan modul berhasil diselesaikan",
      data: { materi_selesai: true, modul_tamat: true, sub_bab_selesai: currentSubBabSelesai }
    });
  } catch (error) {
    console.error("[ModuleController] Error completeModuleLesson:", error);
    res.status(500).json({ status: "error", message: "Gagal memperbarui status materi" });
  }
};