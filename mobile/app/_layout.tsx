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
      <Stack.Screen name="profile/edit" options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="profile/leaderboard" options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="profile/settings" options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="profile/badges" options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="profile/cards" options={{ animation: "slide_from_right" }} />
    </Stack>
  );
}

import { useFonts } from "expo-font";
import {
  SourceCodePro_400Regular,
  SourceCodePro_500Medium,
  SourceCodePro_600SemiBold,
  SourceCodePro_700Bold,
  SourceCodePro_800ExtraBold,
} from "@expo-google-fonts/source-code-pro";
import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_700Bold,
} from "@expo-google-fonts/dm-sans";
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_800ExtraBold,
} from "@expo-google-fonts/poppins";
import { AudioProvider } from "../context/AudioContext";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    SourceCodePro_400Regular,
    SourceCodePro_500Medium,
    SourceCodePro_600SemiBold,
    SourceCodePro_700Bold,
    SourceCodePro_800ExtraBold,
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
  });

  if (!fontsLoaded) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#111827" />
      </View>
    );
  }

  return (
    <AuthProvider>
      <AudioProvider>
        <RootLayoutNav />
      </AudioProvider>
    </AuthProvider>
  );
}