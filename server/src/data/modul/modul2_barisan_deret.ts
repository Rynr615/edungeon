// server/src/data/modul/modul2_barisan_deret.ts

export const modul2Data = {
  id_modul: "modul_2",
  nama_modul: "Barisan dan Deret",
  mata_pelajaran: "Matematika",
  urutan: 2,
  id_modul_prasyarat: "modul_1",
  ringkasan_rumus: [
    "U_n = a + (n - 1)b \\quad \\text{(Aritmetika)}",
    "S_n = \\frac{n}{2}(2a + (n - 1)b) \\text{ atau } S_n = \\frac{n}{2}(a + U_n)",
    "U_n = a \\cdot r^{n - 1} \\quad \\text{(Geometri)}",
    "S_n = \\frac{a(r^n - 1)}{r - 1} \\text{ (untuk } r > 1 \\text{)}"
  ],
  sub_bab: [
    {
      id_sub_bab: "sub_2_1",
      judul: "Pola Bilangan & Konsep Dasar Barisan",
      tujuan_pembelajaran: "Peserta didik dapat mengidentifikasi keteraturan pola bilangan serta membedakan antara barisan aritmetika dan barisan geometri.",
      teks_penjelasan: "Barisan bilangan adalah sekumpulan angka yang disusun berurutan menurut suatu aturan atau pola tertentu. Setiap angka dalam barisan disebut sebagai suku (disimbolkan dengan U). Jika selisih antara dua suku berurutan selalu tetap, maka disebut barisan aritmetika. Jika perbandingan (rasio) antara dua suku berurutan selalu tetap, maka disebut barisan geometri.",
      contoh_soal: [
        {
          soal: "Tentukan dua suku berikutnya dari pola bilangan berikut: 3, 7, 11, 15, ...",
          langkah_penyelesaian: [
            "Perhatikan selisih antar suku berurutan: 7 - 3 = 4, 11 - 7 = 4, 15 - 11 = 4.",
            "Karena selisihnya selalu tetap (4), ini adalah barisan aritmetika dengan beda (b) = 4.",
            "Untuk mencari suku ke-5, tambahkan 4 ke suku ke-4: 15 + 4 = 19.",
            "Untuk mencari suku ke-6, tambahkan 4 ke suku ke-5: 19 + 4 = 23."
          ],
          hasil_akhir: "19 dan 23"
        }
      ],
      video_id: "TODO_VIDEO_ID_POLA_BILANGAN_1",
      latihan_formatif: [
        {
          id_latihan: "lat_2_1_1",
          pertanyaan: "Tentukan suku berikutnya dari barisan: 2, 4, 8, 16, ...",
          opsi: ["18", "20", "32", "64"],
          kunci: "32",
          pembahasan: "Barisan ini dikali 2 setiap suku berikutnya (rasio = 2). Suku ke-5 adalah 16 × 2 = 32."
        }
      ]
    },
    {
      id_sub_bab: "sub_2_2",
      judul: "Barisan dan Deret Aritmetika",
      tujuan_pembelajaran: "Peserta didik dapat menentukan suku ke-n serta menghitung jumlah n suku pertama (deret) dari suatu barisan aritmetika.",
      teks_penjelasan: "Barisan aritmetika memiliki beda (b) yang konstan antar sukunya. Rumus untuk mencari suku ke-n adalah Un = a + (n - 1)b, di mana a adalah suku pertama (U1) dan b adalah beda. Jika kita menjumlahkan suku-suku barisan tersebut hingga suku ke-n, itu dinamakan deret aritmetika dengan rumus Sn = n/2 (2a + (n - 1)b).",
      contoh_soal: [
        {
          soal: "Diketahui barisan aritmetika: 5, 8, 11, 14, ... Tentukan suku ke-20 (U_20) dari barisan tersebut.",
          langkah_penyelesaian: [
            "Tentukan suku pertama (a) = 5.",
            "Tentukan beda (b) = suku ke-2 dikurangi suku pertama = 8 - 5 = 3.",
            "Gunakan rumus suku ke-n: U_n = a + (n - 1)b.",
            "Masukkan nilai n = 20: U_20 = 5 + (20 - 1) × 3.",
            "Hitung nilai di dalam kurung dan perkalian: 5 + (19 × 3) = 5 + 57 = 62."
          ],
          hasil_akhir: "62"
        }
      ],
      video_id: "TODO_VIDEO_ID_ARITMETIKA_2",
      latihan_formatif: [
        {
          id_latihan: "lat_2_2_1",
          pertanyaan: "Dari barisan aritmetika 3, 7, 11, ... tentukan suku ke-10 (U_10).",
          opsi: ["37", "39", "41", "43"],
          kunci: "39",
          pembahasan: "a = 3, b = 4. U_10 = 3 + (10 - 1)×4 = 3 + 36 = 39."
        }
      ]
    },
    {
      id_sub_bab: "sub_2_3",
      judul: "Barisan dan Deret Geometri",
      tujuan_pembelajaran: "Peserta didik dapat menentukan suku ke-n dan jumlah deret pada barisan geometri.",
      teks_penjelasan: "Barisan geometri adalah barisan bilangan yang perbandingan (rasio) antara dua suku berurutan selalu tetap. Rumus suku ke-n barisan geometri adalah U_n = a * r^(n - 1), di mana r adalah rasio (U_n / U_(n-1)). Sedangkan rumus jumlah n suku pertamanya adalah S_n = a(r^n - 1) / (r - 1) untuk r > 1.",
      contoh_soal: [
        {
          soal: "Diketahui barisan geometri: 2, 6, 18, 54, ... Tentukan suku ke-6 (U_6) barisan tersebut.",
          langkah_penyelesaian: [
            "Tentukan suku pertama (a) = 2.",
            "Tentukan rasio (r) = suku ke-2 dibagi suku pertama = 6 / 2 = 3.",
            "Gunakan rumus U_n = a × r^(n - 1).",
            "Masukkan nilai n = 6: U_6 = 2 × 3^(6 - 1) = 2 × 3^5.",
            "Hitung perpangkatan: 3^5 = 243, lalu kalikan 2: 2 × 243 = 486."
          ],
          hasil_akhir: "486"
        }
      ],
      video_id: "TODO_VIDEO_ID_GEOMETRI_3",
      latihan_formatif: [
        {
          id_latihan: "lat_2_3_1",
          pertanyaan: "Tentukan suku ke-5 dari barisan geometri: 3, 6, 12, 24, ...",
          opsi: ["36", "48", "96", "192"],
          kunci: "48",
          pembahasan: "a = 3, r = 2. U_5 = 3 × 2^(5-1) = 3 × 16 = 48."
        }
      ]
    },
    {
      id_sub_bab: "sub_2_4",
      judul: "Penerapan Kontekstual Barisan & Deret",
      tujuan_pembelajaran: "Peserta didik dapat memecahkan masalah sehari-hari yang berkaitan dengan pertumbuhan, peluruhan, atau bunga majemuk menggunakan konsep barisan/deret.",
      teks_penjelasan: "Konsep barisan dan deret sangat berguna dalam kehidupan nyata, seperti perhitungan pertumbuhan penduduk, peluruhan zat radioaktif, atau perhitungan tabungan dengan sistem bunga majemuk yang menggunakan prinsip barisan geometri.",
      contoh_soal: [
        {
          soal: "Sebuah pabrik memproduksi 1.000 unit barang pada bulan pertama. Setiap bulan berikutnya, produksi meningkat secara tetap sebanyak 150 unit. Berapa total produksi barang selama 1 tahun (12 bulan) pertama?",
          langkah_penyelesaian: [
            "Identifikasi masalah sebagai deret aritmetika karena penambahan tetap (beda).",
            "Diketahui: a = 1000, b = 150, dan n = 12.",
            "Gunakan rumus jumlah deret aritmetika: S_n = n/2 × [2a + (n - 1)b].",
            "Masukkan angka: S_12 = 12/2 × [2(1000) + (12 - 1) × 150].",
            "Sederhanakan: 6 × [2000 + (11 × 150)] = 6 × [2000 + 1650] = 6 × 3650 = 21.900."
          ],
          hasil_akhir: "21.900 unit"
        }
      ],
      video_id: "TODO_VIDEO_ID_APLIKASI_4",
      latihan_formatif: [
        {
          id_latihan: "lat_2_4_1",
          pertanyaan: "Keuntungan sebuah toko setiap bulan bertambah Rp50.000,00 dari bulan sebelumnya. Jika keuntungan bulan pertama Rp200.000,00, total keuntungan selama 6 bulan pertama adalah...",
          opsi: ["Rp1.500.000", "Rp1.950.000", "Rp2.250.000", "Rp2.500.000"],
          kunci: "Rp1.950.000",
          pembahasan: "a = 200.000, b = 50.000, n = 6. S_6 = 6/2 × [2(200.000) + 5(50.000)] = 3 × [400.000 + 250.000] = 3 × 650.000 = 1.950.000."
        }
      ]
    }
  ]
};