// mobile/app/module/[moduleId]/_layout.tsx
import { Stack } from "expo-router";

export default function ModuleLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#0d131d" },
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="[subBabId]" />
    </Stack>
  );
}
