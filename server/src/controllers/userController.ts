// server/src/controllers/userController.ts
import { Response } from "express";
import { AuthRequest } from "../middleware/auth.js";
import { db } from "../config/firebase.js";

/**
 * 1. GET /api/user/profile
 * Mengambil profil lengkap siswa beserta level yang terhitung, akurasi, dan status level.
 */
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

    const userData = userDoc.data() || {};
    const totalExp = Number(userData.total_exp || 0);
    const jumlahBenar = Number(userData.jumlah_benar || 0);
    const jumlahJawaban = Number(userData.jumlah_jawaban || 0);

    // Hitung Level (Setiap 100 EXP = 1 Level)
    const level = Math.floor(totalExp / 100) + 1;
    const expInLevel = totalExp % 100;
    const nextLevelExp = 100;

    // Hitung Akurasi %
    const akurasi = jumlahJawaban > 0 ? Math.round((jumlahBenar / jumlahJawaban) * 100) : 0;

    const computedProfile = {
      ...userData,
      total_exp: totalExp,
      level,
      exp_in_level: expInLevel,
      next_level_exp: nextLevelExp,
      akurasi,
      monster_dikalahkan: Number(userData.monster_dikalahkan || 0),
      boss_dikalahkan: Number(userData.boss_dikalahkan || 0),
      avatar: userData.avatar || "knight",
      audio_aktif: userData.audio_aktif !== false,
      volume_audio: typeof userData.volume_audio === "number" ? userData.volume_audio : 1.0,
    };

    res.status(200).json({
      status: "success",
      is_new_user: false,
      data: computedProfile,
    });
  } catch (error) {
    console.error("[USER CONTROLLER] Error getProfile:", error);
    res.status(500).json({ status: "error", message: "Gagal mengambil data profil" });
  }
};

/**
 * 2. POST /api/user/onboarding
 * Menyimpan data onboarding pertama kali bagi user baru.
 */
export const submitOnboarding = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const uid = req.user?.uid;
    if (!uid) {
      res.status(401).json({ status: "error", message: "User tidak terautentikasi" });
      return;
    }

    const email = req.user?.email || "";
    const { nama, username, kelas, avatar } = req.body;

    if (!nama || !username || !kelas) {
      res.status(400).json({ status: "error", message: "Nama, username, dan kelas wajib diisi" });
      return;
    }

    const userData = {
      id_user: uid,
      nama: String(nama).trim(),
      username: String(username).trim().toLowerCase(),
      email,
      kelas: String(kelas).trim(),
      avatar: avatar || "knight",
      total_exp: 0,
      jumlah_benar: 0,
      jumlah_jawaban: 0,
      monster_dikalahkan: 0,
      boss_dikalahkan: 0,
      audio_aktif: true,
      volume_audio: 1.0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
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

/**
 * 3. PUT /api/user/profile (EDIT PROFILE FITUR)
 * Memperbarui nama, kelas, dan pilihan avatar siswa.
 */
export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const uid = req.user?.uid;
    if (!uid) {
      res.status(401).json({ status: "error", message: "User tidak terautentikasi" });
      return;
    }

    const { nama, kelas, avatar } = req.body;

    if (!nama || String(nama).trim().length < 2) {
      res.status(400).json({ status: "error", message: "Nama minimal 2 karakter" });
      return;
    }

    const updateData: Record<string, any> = {
      nama: String(nama).trim(),
      updated_at: new Date().toISOString(),
    };

    if (kelas) {
      updateData.kelas = String(kelas).trim();
    }

    if (avatar) {
      updateData.avatar = String(avatar).trim();
    }

    await db.collection("tb_user").doc(uid).set(updateData, { merge: true });

    // Ambil data terbaru
    const updatedDoc = await db.collection("tb_user").doc(uid).get();

    res.status(200).json({
      status: "success",
      message: "Profil berhasil diperbarui",
      data: updatedDoc.data(),
    });
  } catch (error) {
    console.error("[USER CONTROLLER] Error updateProfile:", error);
    res.status(500).json({ status: "error", message: "Gagal memperbarui profil" });
  }
};

/**
 * 4. GET /api/user/leaderboard
 * Mengambil 10 besar siswa teratas berdasarkan total_exp.
 */
export const getLeaderboard = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const uid = req.user?.uid;

    const snapshot = await db
      .collection("tb_user")
      .orderBy("total_exp", "desc")
      .limit(10)
      .get();

    const leaderboard = snapshot.docs.map((doc, index) => {
      const data = doc.data();
      const exp = Number(data.total_exp || 0);
      return {
        rank: index + 1,
        id_user: doc.id,
        nama: data.nama || "Pahlawan",
        username: data.username || "hero",
        kelas: data.kelas || "X",
        avatar: data.avatar || "knight",
        total_exp: exp,
        level: Math.floor(exp / 100) + 1,
      };
    });

    // Cek apakah posisi user login masuk dalam top 10
    let userRank = leaderboard.findIndex((item) => item.id_user === uid) + 1;

    // Jika user di luar top 10, hitung peringkat aslinya
    if (userRank === 0 && uid) {
      const userDoc = await db.collection("tb_user").doc(uid).get();
      if (userDoc.exists) {
        const userExp = Number(userDoc.data()?.total_exp || 0);
        const higherCount = await db
          .collection("tb_user")
          .where("total_exp", ">", userExp)
          .count()
          .get();
        userRank = higherCount.data().count + 1;
      }
    }

    res.status(200).json({
      status: "success",
      data: {
        leaderboard,
        user_rank: userRank > 0 ? userRank : null,
      },
    });
  } catch (error) {
    console.error("[USER CONTROLLER] Error getLeaderboard:", error);
    res.status(500).json({ status: "error", message: "Gagal mengambil data leaderboard" });
  }
};

/**
 * 5. GET /api/user/badges
 * Mengambil katalog 15 badge dan status unlocked untuk user aktif.
 */
export const getUserBadges = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const uid = req.user?.uid;
    if (!uid) {
      res.status(401).json({ status: "error", message: "User tidak terautentikasi" });
      return;
    }

    // Ambil master badges
    const masterBadgesSnap = await db.collection("tb_badge").get();
    
    // Ambil badge yang sudah diraih user
    const userBadgesSnap = await db
      .collection("tb_badge_siswa")
      .where("id_user", "==", uid)
      .get();

    const userBadgeMap = new Map<string, string>();
    userBadgesSnap.docs.forEach((doc) => {
      const data = doc.data();
      userBadgeMap.set(data.id_badge, data.tgl_perolehan || new Date().toISOString());
    });

    const badges = masterBadgesSnap.docs.map((doc) => {
      const bData = doc.data();
      const unlocked = userBadgeMap.has(doc.id);
      return {
        id_badge: doc.id,
        kode: bData.kode || "",
        nama: bData.nama || "",
        deskripsi: bData.deskripsi || "",
        kategori: bData.kategori || "klasik",
        tier: bData.tier || "bronze",
        class_khusus: bData.class_khusus || null,
        icon_name: bData.icon_name || "TrophyIcon",
        unlocked,
        tgl_perolehan: userBadgeMap.get(doc.id) || null,
      };
    });

    res.status(200).json({
      status: "success",
      data: badges,
    });
  } catch (error) {
    console.error("[USER CONTROLLER] Error getUserBadges:", error);
    res.status(500).json({ status: "error", message: "Gagal mengambil data badge" });
  }
};

/**
 * 6. GET /api/user/card-collection
 * Mengambil koleksi 12 kartu power-up siswa.
 */
export const getUserCardCollection = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const uid = req.user?.uid;
    if (!uid) {
      res.status(401).json({ status: "error", message: "User tidak terautentikasi" });
      return;
    }

    // Ambil master 12 kartu
    const masterCardsSnap = await db.collection("tb_kartu_buff").get();

    // Ambil riwayat kartu siswa
    const userCardsSnap = await db
      .collection("tb_kartu_buff_siswa")
      .where("id_user", "==", uid)
      .get();

    const userCardMap = new Map<string, string>();
    userCardsSnap.docs.forEach((doc) => {
      const data = doc.data();
      userCardMap.set(data.id_kartu, data.tgl_didapat || new Date().toISOString());
    });

    const cards = masterCardsSnap.docs.map((doc) => {
      const cData = doc.data();
      const unlocked = userCardMap.has(doc.id);
      return {
        id_kartu: doc.id,
        kode_kartu: cData.kode_kartu || doc.id,
        nama_kartu: cData.nama_kartu || "",
        deskripsi: cData.deskripsi || "",
        class_kartu: cData.class_kartu || "Common",
        tipe_efek: cData.tipe_efek || "",
        unlocked,
        tgl_didapat: userCardMap.get(doc.id) || null,
      };
    });

    res.status(200).json({
      status: "success",
      data: cards,
    });
  } catch (error) {
    console.error("[USER CONTROLLER] Error getUserCardCollection:", error);
    res.status(500).json({ status: "error", message: "Gagal mengambil koleksi kartu" });
  }
};

/**
 * 7. PUT /api/user/settings (AUDIO & PREFERENCES)
 * Menyimpan preferensi audio siswa (toggle audio & volume).
 */
export const updateSettings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const uid = req.user?.uid;
    if (!uid) {
      res.status(401).json({ status: "error", message: "User tidak terautentikasi" });
      return;
    }

    const { audio_aktif, volume_audio } = req.body;

    const settingsData: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (typeof audio_aktif === "boolean") {
      settingsData.audio_aktif = audio_aktif;
    }

    if (typeof volume_audio === "number") {
      settingsData.volume_audio = Math.max(0, Math.min(1.0, volume_audio));
    }

    await db.collection("tb_user").doc(uid).set(settingsData, { merge: true });

    res.status(200).json({
      status: "success",
      message: "Pengaturan berhasil disimpan",
      data: settingsData,
    });
  } catch (error) {
    console.error("[USER CONTROLLER] Error updateSettings:", error);
    res.status(500).json({ status: "error", message: "Gagal menyimpan pengaturan" });
  }
};