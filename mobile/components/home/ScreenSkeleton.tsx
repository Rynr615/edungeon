// mobile/components/home/ScreenSkeleton.tsx
import React, { useEffect, useRef } from "react";
import { View, Animated } from "react-native";

export const ScreenSkeleton: React.FC = () => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.8,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnimation.start();

    return () => pulseAnimation.stop();
  }, [opacity]);

  return (
    <View className="px-5 pt-4 space-y-4">
      {/* Skeleton Hero Greeting */}
      <Animated.View
        style={{ opacity }}
        className="h-28 bg-surface rounded-2xl border border-border p-4 mb-4"
      >
        <View className="w-1/2 h-5 bg-surface-alt rounded mb-3" />
        <View className="w-3/4 h-3 bg-surface-alt rounded mb-4" />
        <View className="w-full h-3 bg-surface-alt rounded-full" />
      </Animated.View>

      {/* Skeleton Continue Card */}
      <Animated.View
        style={{ opacity }}
        className="h-32 bg-surface rounded-2xl border border-border p-4 mb-4"
      >
        <View className="w-1/3 h-4 bg-surface-alt rounded mb-2" />
        <View className="w-2/3 h-6 bg-surface-alt rounded mb-2" />
        <View className="w-full h-3 bg-surface-alt rounded-full mt-3" />
      </Animated.View>

      {/* Skeleton Module Cards */}
      {[1, 2, 3].map((key) => (
        <Animated.View
          key={key}
          style={{ opacity }}
          className="h-24 bg-surface rounded-2xl border border-border p-4 mb-3 flex-row items-center justify-between"
        >
          <View className="flex-1 mr-4">
            <View className="w-1/4 h-3 bg-surface-alt rounded mb-2" />
            <View className="w-3/4 h-5 bg-surface-alt rounded mb-2" />
            <View className="w-1/2 h-3 bg-surface-alt rounded" />
          </View>
          <View className="w-20 h-9 bg-surface-alt rounded-xl" />
        </Animated.View>
      ))}
    </View>
  );
};
