import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || "./serviceAccountKey.json";
const resolvedPath = path.resolve(process.cwd(), serviceAccountPath);

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