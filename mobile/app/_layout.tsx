// mobile/app/_layout.tsx
import "../global.css";
import "react-native-get-random-values";
import React, { useEffect } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { View, ActivityIndicator } from "react-native";

function RootLayoutNav() {
  const { user, userProfile, loading, isNewUser } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  fetch("https://identitytoolkit.googleapis.com")
  .then((res) => console.log("[TEST KONEKSI GOOGLE] Berhasil terhubung, Status:", res.status))
    .catch((err) => console.error("[TEST KONEKSI GOOGLE] Gagal terhubung ke Google:", err.message));

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!user) {
      if (!inAuthGroup) router.replace("/(auth)/login");
    } else if (isNewUser) {
      router.replace("/(auth)/onboarding");
    } else if (userProfile && inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [user, userProfile, loading, isNewUser, segments]);

  if (loading) {
    return (
      <View className="flex-1 bg-background justify-center items-center">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)/login" />
      <Stack.Screen name="(auth)/register" />
      <Stack.Screen name="(auth)/onboarding" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}