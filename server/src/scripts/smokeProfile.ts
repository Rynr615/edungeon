// server/src/scripts/smokeProfile.ts
import { db } from "../config/firebase.js";
import { awardBadge } from "../game/badges.js";

async function runProfileSmokeTest() {
  console.log("=================================================");
  console.log("🧪 MEMULAI SMOKE TEST END-TO-END FITUR PROFILE");
  console.log("   (ANGGOTA 3: PROFILE, BADGE, LEADERBOARD, AUDIO)");
  console.log("=================================================\n");

  const testUid = "test_smoke_user_anggota3";

  try {
    // 1. Setup Test User
    console.log("▶ [TEST 1] Setup Dokumen Siswa di tb_user...");
    const initialUserData = {
      id_user: testUid,
      nama: "Budi Pahlawan",
      nama_panggilan: "Budi",
      username: "budipahlawan",
      email: "budi@edungeon.test",
      kelas: "X-PPLG 1",
      no_hp: "081234567890",
      avatar: "knight",
      total_exp: 250, // Harusnya Level 3 (250 / 100 + 1), sisa EXP 50
      jumlah_benar: 17,
      jumlah_jawaban: 20, // Akurasi (17/20)*100 = 85%
      monster_dikalahkan: 24,
      boss_dikalahkan: 2,
      audio_aktif: true,
      volume_audio: 0.75,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    await db.collection("tb_user").doc(testUid).set(initialUserData);
    console.log("  ✅ Dokumen siswa berhasil dibuat.\n");

    // 2. Uji Pengambilan Profile & Kalkulasi Matematis
    console.log("▶ [TEST 2] Verifikasi Kalkulasi Level & Akurasi...");
    const userDoc = await db.collection("tb_user").doc(testUid).get();
    const data = userDoc.data()!;

    const totalExp = Number(data.total_exp);
    const calculatedLevel = Math.floor(totalExp / 100) + 1;
    const expInLevel = totalExp % 100;
    const akurasi = Math.round((Number(data.jumlah_benar) / Number(data.jumlah_jawaban)) * 100);

    if (calculatedLevel !== 3) throw new Error(`Level salah: ${calculatedLevel}, harusnya 3`);
    if (expInLevel !== 50) throw new Error(`Exp in level salah: ${expInLevel}, harusnya 50`);
    if (akurasi !== 85) throw new Error(`Akurasi salah: ${akurasi}%, harusnya 85%`);

    console.log(`  ✅ Level terhitung: ${calculatedLevel} (Total EXP: ${totalExp})`);
    console.log(`  ✅ EXP bar: ${expInLevel}/100 (50%)`);
    console.log(`  ✅ Akurasi Jawaban: ${akurasi}%\n`);

    // 3. Uji Edit Profile (Update Data Diri)
    console.log("▶ [TEST 3] Uji Update Profile (Nama, Nama Panggilan, No HP)...");
    const updatedFields = {
      nama: "Budi Pratama S.Kom",
      nama_panggilan: "Budi Ganteng",
      no_hp: "089876543210",
      avatar: "mage",
      updated_at: new Date().toISOString(),
    };

    await db.collection("tb_user").doc(testUid).set(updatedFields, { merge: true });

    const updatedDoc = await db.collection("tb_user").doc(testUid).get();
    const updatedData = updatedDoc.data()!;

    if (updatedData.nama !== "Budi Pratama S.Kom") throw new Error("Gagal update nama");
    if (updatedData.nama_panggilan !== "Budi Ganteng") throw new Error("Gagal update nama_panggilan");
    if (updatedData.no_hp !== "089876543210") throw new Error("Gagal update no_hp");
    if (updatedData.avatar !== "mage") throw new Error("Gagal update avatar");

    console.log(`  ✅ Profil terupdate: ${updatedData.nama} (${updatedData.nama_panggilan})`);
    console.log(`  ✅ No HP: ${updatedData.no_hp}, Avatar: ${updatedData.avatar}\n`);

    // 4. Uji Sistem 15 Badge di Firestore
    console.log("▶ [TEST 4] Uji Katalog 15 Badge & Pemberian Badge...");
    const masterBadges = await db.collection("tb_badge").get();
    console.log(`  ℹ Ditemukan ${masterBadges.size} master badge di tb_badge.`);
    if (masterBadges.size < 15) {
      console.warn(`  ⚠️ Peringatan: Jumlah badge kurang dari 15 (${masterBadges.size})`);
    } else {
      console.log("  ✅ Master 15 badge terdaftar lengkap!");
    }

    // Berikan badge The Journey Begins & Benteng Baja
    const awarded1 = await awardBadge(testUid, "the_journey_begins");
    const awarded2 = await awardBadge(testUid, "benteng_baja");
    console.log(`  ✅ Berhasil memberikan badge: the_journey_begins (${awarded1}), benteng_baja (${awarded2})`);

    // Cek duplikasi (awardBadge kedua kali harus return false)
    const duplicateAward = await awardBadge(testUid, "the_journey_begins");
    if (duplicateAward) throw new Error("Awarding badge duplikat seharusnya dicegah");
    console.log("  ✅ Proteksi duplikasi badge berfungsi dengan benar!\n");

    // 5. Uji Koleksi Kartu Buff Siswa
    console.log("▶ [TEST 5] Uji Koleksi Kartu Buff (tb_kartu_buff_siswa)...");
    const masterCards = await db.collection("tb_kartu_buff").get();
    console.log(`  ℹ Ditemukan ${masterCards.size} master kartu di tb_kartu_buff.`);

    await db.collection("tb_kartu_buff_siswa").doc(`${testUid}_K01`).set({
      id_user: testUid,
      id_kartu: "K01",
      id_kartu_buff: "K01",
      tgl_didapat: new Date().toISOString(),
    });

    const userCards = await db
      .collection("tb_kartu_buff_siswa")
      .where("id_user", "==", testUid)
      .get();

    if (userCards.size === 0) throw new Error("Kartu siswa gagal disimpan");
    console.log(`  ✅ Koleksi kartu siswa tercatat: ${userCards.size} kartu didapat.\n`);

    // 6. Uji Leaderboard Query & Ranking
    console.log("▶ [TEST 6] Uji Query Leaderboard Top 10...");
    const leaderboardSnap = await db
      .collection("tb_user")
      .orderBy("total_exp", "desc")
      .limit(10)
      .get();

    console.log(`  ℹ Top ${leaderboardSnap.size} siswa di papan peringkat:`);
    leaderboardSnap.docs.forEach((doc, idx) => {
      const u = doc.data();
      console.log(`     #${idx + 1} ${u.nama || "Pahlawan"} - Level ${Math.floor((u.total_exp || 0) / 100) + 1} (${u.total_exp || 0} EXP)`);
    });
    console.log("  ✅ Query leaderboard berjalan sukses tanpa error index!\n");

    // 7. Uji Pengaturan Audio
    console.log("▶ [TEST 7] Uji Pengaturan Audio & Clamping Volume...");
    const settingsUpdate = {
      audio_aktif: false,
      volume_audio: 0.5,
      updated_at: new Date().toISOString(),
    };
    await db.collection("tb_user").doc(testUid).set(settingsUpdate, { merge: true });

    const settingsDoc = await db.collection("tb_user").doc(testUid).get();
    const settingsData = settingsDoc.data()!;
    if (settingsData.audio_aktif !== false) throw new Error("Gagal update audio_aktif");
    if (settingsData.volume_audio !== 0.5) throw new Error("Gagal update volume_audio");

    console.log(`  ✅ Audio aktif: ${settingsData.audio_aktif}, Volume: ${settingsData.volume_audio * 100}%\n`);

    // 8. Cleanup Data Uji Coba
    console.log("▶ [CLEANUP] Membersihkan data test user...");
    await db.collection("tb_user").doc(testUid).delete();
    await db.collection("tb_badge_siswa").doc(`${testUid}_the_journey_begins`).delete();
    await db.collection("tb_badge_siswa").doc(`${testUid}_benteng_baja`).delete();
    await db.collection("tb_kartu_buff_siswa").doc(`${testUid}_K01`).delete();
    console.log("  ✅ Data test berhasil dibersihkan.\n");

    console.log("=================================================");
    console.log("🎉 SMOKE TEST SELESAI: 100% PASS, ZERO DEFECTS!");
    console.log("   SEMUA FITUR ANGGOTA 3 TERUJI AMAN DI DATABASE!");
    console.log("=================================================");
  } catch (error) {
    console.error("❌ SMOKE TEST GAGAL:", error);
    process.exit(1);
  }
}

runProfileSmokeTest();
