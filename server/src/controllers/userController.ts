// server/src/controllers/userController.ts
import { Response } from "express";
import { AuthRequest } from "../middleware/auth.js";
import { db } from "../config/firebase.js";

export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const uid = req.user?.uid;
    if (!uid) {
      res.status(401).json({ status: "error", message: "User tidak terautentikasi" });
      return;
    }

    const userDoc = await db.collection("tb_user").doc(uid).get();

    if (!userDoc.exists) {
      res.status(200).json({
        status: "success",
        is_new_user: true,
        message: "Pengguna baru, silakan lengkapi biodata onboarding",
      });
      return;
    }

    res.status(200).json({
      status: "success",
      is_new_user: false,
      data: userDoc.data(),
    });
  } catch (error) {
    console.error("[USER CONTROLLER] Error getProfile:", error);
    res.status(500).json({ status: "error", message: "Gagal mengambil data profil" });
  }
};

export const submitOnboarding = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const uid = req.user?.uid;
    if (!uid) {
      res.status(401).json({ status: "error", message: "User tidak terautentikasi" });
      return;
    }

    const email = req.user?.email || "";
    const { nama, username, kelas } = req.body;

    if (!nama || !username || !kelas) {
      res.status(400).json({ status: "error", message: "Nama, username, dan kelas wajib diisi" });
      return;
    }

    const userData = {
      id_user: uid,
      nama,
      username,
      email,
      kelas,
      total_exp: 0,
      jumlah_benar: 0,
      jumlah_jawaban: 0,
      monster_dikalahkan: 0,
      boss_dikalahkan: 0,
      audio_aktif: true,
      volume_audio: 1.0,
      created_at: new Date().toISOString(),
    };

    await db.collection("tb_user").doc(uid).set(userData, { merge: true });

    res.status(200).json({
      status: "success",
      message: "Onboarding berhasil diselesaikan",
      data: userData,
    });
  } catch (error) {
    console.error("[USER CONTROLLER] Error submitOnboarding:", error);
    res.status(500).json({ status: "error", message: "Gagal menyimpan data onboarding" });
  }
};