// mobile/types/module.ts

export type ModuleStatus = "terkunci" | "mulai" | "selesai" | "sedang_dipelajari";

export interface ContohSoal {
  soal: string;
  langkah_penyelesaian: string[];
  hasil_akhir: string;
}

export interface LatihanFormatif {
  id_latihan: string;
  pertanyaan: string;
  opsi: string[];
  kunci: string;
  pembahasan: string;
}

export interface SubBab {
  id_sub_bab: string;
  judul: string;
  tujuan_pembelajaran?: string;
  teks_penjelasan: string;
  estimasi_menit?: number;
  contoh_soal?: ContohSoal[];
  video_id?: string;
  video_url?: string;
  latihan_formatif?: LatihanFormatif[];
}

export interface Modul {
  id: string;
  id_modul: string;
  nama_modul: string;
  mata_pelajaran: string;
  urutan: number;
  deskripsi?: string;
  tujuan_pembelajaran?: string[];
  estimasi_menit?: number;
  id_modul_prasyarat: string;
  nama_modul_prasyarat?: string;
  ringkasan_rumus: string[];
  sub_bab: SubBab[];
  status_progres?: ModuleStatus;
  materi_selesai?: boolean;
  modul_tamat?: boolean;
  sub_bab_selesai?: string[];
  progres_siswa?: {
    materi_selesai: boolean;
    modul_tamat: boolean;
    sub_bab_selesai: string[];
  };
}

export interface LastLearnedState {
  moduleId: string;
  moduleTitle: string;
  subBabId: string;
  subBabTitle: string;
  subBabIndex: number;
  totalSubBab: number;
  progressPercent: number;
}
