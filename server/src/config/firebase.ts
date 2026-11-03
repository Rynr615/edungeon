// server/src/config/firebase.ts
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import path from "path";
import dotenv from "dotenv";

// 1. Muat file .env secara eksplisit dari folder server (naik 2 tingkat dari src/config)
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

// 2. Ambil path dari .env, default ke "serviceAccountKey.json" jika kosong
const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || "serviceAccountKey.json";

// 3. Resolusikan path secara mutlak dari folder server (tempat file json berada)
// __dirname berada di server/src/config, naik 2 tingkat (../../) membawa kita ke folder server/
const resolvedPath = path.resolve(__dirname, "../../", serviceAccountPath);

if (!getApps().length) {
  try {
    initializeApp({
      credential: cert(resolvedPath),
    });
    console.log("[FIREBASE] Admin SDK berhasil diinisialisasi");
  } catch (error) {
    console.error("[FIREBASE] Gagal menginisialisasi Admin SDK:", error);
  }
}

export const db = getFirestore();
export const auth = getAuth();