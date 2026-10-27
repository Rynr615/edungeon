// mobile/app/(tabs)/_layout.tsx
import React from "react";
import { Tabs } from "expo-router";
import { Icon } from "../../components/ui/Icon";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#2563eb",
        tabBarInactiveTintColor: "#94a3b8",
        tabBarStyle: {
          backgroundColor: "#1e293b",
          borderTopColor: "#334155",
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused, color, size }) => (
            <Icon name="HomeIcon" variant={focused ? "solid" : "outline"} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="challenge"
        options={{
          title: "Challenge",
          tabBarIcon: ({ focused, color, size }) => (
            <Icon name="TrophyIcon" variant={focused ? "solid" : "outline"} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused, color, size }) => (
            <Icon name="UserIcon" variant={focused ? "solid" : "outline"} size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}