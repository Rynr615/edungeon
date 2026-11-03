// mobile/constants/copy.ts
/**
 * PUSAT TEKS & COPYWRITING EDUNGEON (HOME & MODUL BELAJAR)
 * Dikelompokkan di satu tempat agar konsisten, suportif, dan mudah disesuaikan.
 */

export const COPY = {
  home: {
    greetingPrefix: "Halo, Petualang",
    levelPrefix: "Level",
    expLabel: "EXP Petualang",
    curriculumTitle: "Jalur Petualangan Belajar",
    curriculumSubtitle: "Kuasai materi matematika untuk menaklukkan monster dungeon",
    summaryTitle: "Progres Kurikulum",
    summaryCount: (completed: number, total: number) => `${completed} dari ${total} Modul Selesai`,
    continueCard: {
      tag: "LANJUTKAN BELAJAR",
      actionButton: "Lanjutkan Membaca",
      emptyState: "Pilih salah satu modul di bawah untuk memulai perjalananmu!",
    },
    status: {
      completed: "Selesai",
      inProgress: "Sedang Dipelajari",
      available: "Mulai",
      locked: "Terkunci",
      comingSoon: "Segera Hadir",
    },
    lockedModal: {
      title: "Pintu Gerbang Terkunci!",
      desc: (prereqTitle: string) =>
        `Kamu harus menaklukkan tantangan kuis "${prereqTitle}" di tab Challenge terlebih dahulu untuk membuka modul ini.`,
      actionButton: "Saya Mengerti",
    },
    emptyCurriculum: "Belum ada kurikulum yang tersedia di perkemahan saat ini.",
    errorTitle: "Gagal Mengambil Data Kurikulum",
    errorDesc: "Koneksi ke perpustakaan sihir terputus. Pastikan server aktif dan coba lagi.",
    retryButton: "Coba Lagi",
  },
  module: {
    overview: {
      subjectPrefix: "Mata Pelajaran",
      durationPrefix: "Estimasi Durasi",
      subBabCountPrefix: "Sub-Bab",
      objectivesTitle: "Tujuan Petualangan Belajar",
      objectivesSubtitle: "Setelah menyelesaikan bab ini, kamu akan mampu:",
      syllabusTitle: "Daftar Isi Sub-Bab",
      quickFormulaButton: "Lihat Kartu Rumus Kunci",
      startButton: "Mulai Petualangan",
      resumeButton: "Lanjutkan Belajar",
      challengeReadyButton: "⚔ Menuju Gerbang Challenge",
    },
    reader: {
      backButton: "Kembali ke Overview",
      tocButton: "Daftar Isi",
      prevSubBab: "Sebelumnya",
      nextSubBab: "Selanjutnya",
      markSubBabDone: "Tandai Sub-Bab Selesai",
      subBabDoneBadge: "Tuntas Dipelajari",
      formulaTitle: "Intisari Rumus Penting",
      stepExampleTitle: "Contoh Soal Berlangkah",
      tipTitle: "Tips Cerdas",
      warningTitle: "Hati-Hati (Kesalahan Umum)",
      infoTitle: "Konsep Kunci",
      practiceTitle: "Latihan Formatif Mandiri",
      practiceNote: "Latihan ini bebas stres, tidak ada penalti HP!",
      showExplanation: "Lihat Pembahasan Lengkap",
      hideExplanation: "Sembunyikan Pembahasan",
      correctFeedback: "Jawabanmu tepat sekali! Pemahaman konsepmu semakin tajam.",
      incorrectFeedback: "Belum tepat, coba telaah kembali langkah-langkah di atas ya!",
      youtubeTitle: "Video Edukasi Pendukung",
      youtubeButton: "Tonton Pembahasan di YouTube",
    },
    completion: {
      title: "Selamat, Petualang!",
      subtitle: "Kamu telah menuntaskan seluruh sub-bab materi ini.",
      rewardExp: "Hadiah Teori: +50 EXP Diperoleh",
      challengeAlert: "Gerbang dungeon telah terbuka! Monster tantangan telah menunggumu.",
      goToChallengeBtn: "Masuk ke Arena Challenge",
      backToHomeBtn: "Kembali ke Beranda",
    },
  },
};
