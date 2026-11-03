// server/src/data/modul/modul1_eksponen_logaritma.ts

export const modul1Data = {
  id_modul: "modul_1",
  nama_modul: "Eksponen dan Logaritma",
  mata_pelajaran: "Matematika",
  urutan: 1,
  id_modul_prasyarat: "",
  ringkasan_rumus: [
    "a^m \\times a^n = a^{m+n}",
    "\\frac{a^m}{a^n} = a^{m-n}",
    "(a^m)^n = a^{m \\times n}",
    "a^{-n} = \\frac{1}{a^n}",
    "a^0 = 1",
    "\\sqrt[n]{a^m} = a^{\\frac{m}{n}}",
    "^a\\log b = c \\rightarrow a^c = b"
  ],
  sub_bab: [
    {
      id_sub_bab: "sub_1_1",
      judul: "Bilangan Berpangkat Bulat & Sifat Eksponen",
      tujuan_pembelajaran: "Peserta didik dapat memahami konsep perkalian berulang sebagai eksponen dan menerapkan sifat-sifat operasionalnya dengan benar.",
      teks_penjelasan: "Eksponen (bilangan berpangkat) adalah bentuk matematika yang digunakan untuk menuliskan perkalian berulang dari suatu bilangan yang sama. Jika a adalah bilangan real dan n adalah bilangan bulat positif, maka a^n ditulis sebagai a dikalikan dengan dirinya sendiri sebanyak n kali.\n\nContoh sederhana: 2^3 artinya 2 × 2 × 2 = 8. Di sini, angka 2 disebut sebagai basis (bilangan pokok), dan angka 3 disebut sebagai eksponen (pangkat).",
      contoh_soal: [
        {
          soal: "Sederhanakan bentuk perkalian eksponen berikut: 3^2 × 3^4",
          langkah_penyelesaian: [
            "Identifikasi bahwa kedua bilangan memiliki basis yang sama, yaitu 3.",
            "Gunakan sifat penjumlahan pangkat: a^m × a^n = a^(m+n).",
            "Jumlahkan pangkatnya: 3^(2+4) = 3^6.",
            "Hitung nilai akhir jika diperlukan: 3^6 = 729."
          ],
          hasil_akhir: "3^6 (atau 729)"
        },
        {
          soal: "Tentukan hasil dari pembagian eksponen: 5^5 / 5^3",
          langkah_penyelesaian: [
            "Perhatikan bahwa basisnya sama yaitu 5.",
            "Gunakan sifat pengurangan pangkat pada pembagian: (a^m) / (a^n) = a^(m-n).",
            "Kurangkan pangkatnya: 5^(5-3) = 5^2.",
            "Hitung hasil akhirnya: 5 × 5 = 25."
          ],
          hasil_akhir: "25"
        }
      ],
      video_id: "TODO_VIDEO_ID_EKSPONEN_1",
      latihan_formatif: [
        {
          id_latihan: "lat_1_1_1",
          pertanyaan: "Berapa hasil dari 2^3 × 2^2?",
          opsi: ["8", "16", "32", "64"],
          kunci: "32",
          pembahasan: "2^(3+2) = 2^5 = 32."
        },
        {
          id_latihan: "lat_1_1_2",
          pertanyaan: "Bentuk sederhana dari (2^2)^3 adalah...",
          opsi: ["2^5", "2^6", "2^8", "4^3"],
          kunci: "2^6",
          pembahasan: "Gunakan sifat perpangkatan (a^m)^n = a^(m×n), sehingga 2^(2×3) = 2^6."
        }
      ]
    },
    {
      id_sub_bab: "sub_1_2",
      judul: "Bentuk Akar dan Pangkat Pecahan",
      tujuan_pembelajaran: "Peserta didik dapat mengubah bentuk akar menjadi pangkat pecahan (rasional) serta merasionalkan penyebut pecahan bentuk akar.",
      teks_penjelasan: "Tidak semua pangkat harus berupa bilangan bulat. Pangkat juga bisa berupa pecahan, yang erat kaitannya dengan bentuk akar. Secara umum, akar pangkat n dari a ditulis sebagai a^(1/n). Merasionalkan penyebut berarti mengubah pecahan yang penyebutnya berbentuk akar menjadi bentuk rasional.",
      contoh_soal: [
        {
          soal: "Ubahlah bentuk akar berikut ke dalam bentuk pangkat pecahan: akar pangkat 3 dari (8^2)",
          langkah_penyelesaian: [
            "Gunakan sifat umum hubungan akar dan pangkat pecahan: akar(n) dari (a^m) = a^(m/n).",
            "Masukkan nilai a = 8, m = 2, dan n = 3.",
            "Hasil akhirnya adalah 8^(2/3)."
          ],
          hasil_akhir: "8^(2/3)"
        },
        {
          soal: "Rasionalkan bentuk pecahan berikut: 6 / (akar(3))",
          langkah_penyelesaian: [
            "Kalikan pembilang dan penyebut dengan sekawan penyebutnya, yaitu akar(3).",
            "Bentuk perkalian: (6 × akar(3)) / (akar(3) × akar(3)).",
            "Sederhanakan penyebut: akar(3) × akar(3) = 3.",
            "Bagikan angka di luar akar: (6/3)akar(3) = 2akar(3)."
          ],
          hasil_akhir: "2\\sqrt{3}"
        }
      ],
      video_id: "TODO_VIDEO_ID_AKAR_2",
      latihan_formatif: [
        {
          id_latihan: "lat_1_2_1",
          pertanyaan: "Bentuk pangkat pecahan dari akar kuadrat 32 (akar(32)) adalah...",
          opsi: ["32^(1/2)", "32^(1/3)", "16^(1/2)", "2^(1/5)"],
          kunci: "32^(1/2)",
          pembahasan: "Akar kuadrat memiliki indeks 2 di luar akar, sehingga akar(a) = a^(1/2)."
        }
      ]
    },
    {
      id_sub_bab: "sub_1_3",
      judul: "Konsep Dasar & Sifat Logaritma",
      tujuan_pembelajaran: "Peserta didik dapat memahami logaritma sebagai kebalikan (invers) dari eksponen dan menghitung nilai logaritma sederhana.",
      teks_penjelasan: "Logaritma adalah operasi invers atau kebalikan dari pemangkatan. Jika kita memiliki bentuk perpangkatan a^c = b, maka bentuk tersebut dapat ditulis dalam bentuk logaritma ^a\\log b = c. Membaca bentuk ini: 'Logaritma berbasis a dari b adalah c'. Syarat penting dalam logaritma adalah basis a > 0 dan a ≠ 1, serta b > 0.",
      contoh_soal: [
        {
          soal: "Tentukan nilai dari ^2\\log 8",
          langkah_penyelesaian: [
            "Ubah bentuk logaritma ke dalam bentuk perpangkatan: ^2\\log 8 = x berarti 2^x = 8.",
            "Cari nilai x dengan menyamakan basis: 2^x = 2^3.",
            "Karena basis sudah sama, maka x = 3."
          ],
          hasil_akhir: "3"
        },
        {
          soal: "Sederhanakan operasi logaritma berikut: ^3\\log 9 + ^3\\log 3",
          langkah_penyelesaian: [
            "Gunakan sifat penjumlahan logaritma: ^a\\log b + ^a\\log c = ^a\\log(b \\times c).",
            "Kalikan numerusnya: 9 × 3 = 27.",
            "Hitung nilai dari ^3\\log 27, yaitu ^3\\log(3^3) = 3."
          ],
          hasil_akhir: "3"
        }
      ],
      video_id: "TODO_VIDEO_ID_LOGARITMA_3",
      latihan_formatif: [
        {
          id_latihan: "lat_1_3_1",
          pertanyaan: "Berapa nilai dari ^5\\log 125?",
          opsi: ["2", "3", "4", "5"],
          kunci: "3",
          pembahasan: "5 pangkat berapa yang hasilnya 125? 5^3 = 125, maka jawabannya 3."
        }
      ]
    },
    {
      id_sub_bab: "sub_1_4",
      judul: "Persamaan Eksponen & Logaritma Sederhana",
      tujuan_pembelajaran: "Peserta didik dapat menyelesaikan persamaan matematika sederhana yang memuat variabel pada eksponen atau bentuk logaritmanya.",
      teks_penjelasan: "Persamaan eksponen adalah persamaan di mana bilangan pokok atau pangkatnya memuat variabel x. Cara menyelesaikannya adalah dengan menyamakan basis di ruas kiri dan kanan. Jika a^(f(x)) = a^(g(x)), maka f(x) = g(x). Prinsip serupa juga berlaku pada persamaan logaritma.",
      contoh_soal: [
        {
          soal: "Tentukan himpunan penyelesaian dari persamaan 3^(x-1) = 27",
          langkah_penyelesaian: [
            "Ubah angka 27 di ruas kanan menjadi bentuk berpangkat dengan basis 3, yaitu 3^3.",
            "Tulis ulang persamaan: 3^(x-1) = 3^3.",
            "Samakan pangkatnya karena basis sudah sama: x - 1 = 3.",
            "Selesaikan nilai x: x = 3 + 1 = 4."
          ],
          hasil_akhir: "x = 4"
        }
      ],
      video_id: "TODO_VIDEO_ID_PERSAMAAN_4",
      latihan_formatif: [
        {
          id_latihan: "lat_1_4_1",
          pertanyaan: "Jika 2^(x+2) = 32, berapakah nilai x?",
          opsi: ["1", "2", "3", "5"],
          kunci: "3",
          pembahasan: "32 adalah 2^5. Maka x + 2 = 5, sehingga x = 3."
        }
      ]
    }
  ]
};