// mobile/services/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeAuth } from "firebase/auth"; // Pakai initializeAuth
// @ts-expect-error getReactNativePersistence tersedia saat runtime React Native pada Firebase SDK
import { getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

console.log("[FIREBASE CONFIG] API Key Loaded:", !!process.env.EXPO_PUBLIC_FIREBASE_API_KEY);

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

console.log("[FIREBASE RUNTIME OPTIONS]", app.options);

// initializeAuth menerima 2 argumen untuk menetapkan persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const db = getFirestore(app);

export { app, auth, db };