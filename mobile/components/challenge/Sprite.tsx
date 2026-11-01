import React, { useEffect, useState } from "react";
import { Animated, Image, View } from "react-native";
import Svg, { Path, Circle, Rect } from "react-native-svg";
import { HeroClass } from "../../types/battle";
export function Sprite({
  hero = "knight",
  size = 80,
  monster = false,
}: {
  hero?: HeroClass;
  size?: number;
  monster?: boolean;
}) {
  const [bob] = useState(() => new Animated.Value(0));
  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(bob, {
          toValue: -4,
          duration: 850,
          useNativeDriver: true,
        }),
        Animated.timing(bob, {
          toValue: 0,
          duration: 850,
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [bob]);
  return (
    <Animated.View
      accessibilityLabel={monster ? "Monster dungeon" : hero}
      style={{
        width: size,
        height: monster ? size : (size * 59) / 56,
        transform: [{ translateY: bob }],
      }}
    >
      {monster ? (
        <View style={{ width: size, height: size, overflow: "hidden" }}>
          <Image
            source={require("../../assets/challenge/slime.png")}
            resizeMode="stretch"
            style={{
              position: "absolute",
              width: size * 8.5992,
              height: size * 6.5297,
              left: -size * 5.9843,
              top: -size * 0.2656,
            }}
          />
        </View>
      ) : hero === "knight" ? (
        <View
          style={{ width: size, height: (size * 59) / 56, overflow: "hidden" }}
        >
          <Image
            source={require("../../assets/challenge/knight.png")}
            resizeMode="stretch"
            style={{
              position: "absolute",
              width: size * 4.2,
              height: (size * 59) / 56,
              left: -size * 3.2,
              top: 0,
            }}
          />
        </View>
      ) : (
        <Svg width={size} height={(size * 59) / 56} viewBox="0 0 56 59">
          <Path
            d="M10 55L17 25H39L46 55Z"
            fill={hero === "mage" ? "#7960b8" : "#427759"}
          />
          <Circle cx="28" cy="20" r="8" fill="#e9b98b" />
          {hero === "mage" ? (
            <>
              <Path d="M12 17L29 0L42 17Z" fill="#50387f" />
              <Path d="M46 20V56" stroke="#7e5637" strokeWidth="3" />
              <Circle cx="46" cy="17" r="5" fill="#8cd5f7" />
            </>
          ) : (
            <>
              <Path d="M17 18Q28 -2 39 18" fill="#315942" />
              <Path
                d="M45 17Q60 37 45 54M45 17V54"
                stroke="#ac7a3e"
                strokeWidth="2"
                fill="none"
              />
              <Path d="M33 35H54" stroke="#d8c5a4" strokeWidth="2" />
            </>
          )}
          <Rect x="20" y="53" width="7" height="6" fill="#483428" />
          <Rect x="30" y="53" width="7" height="6" fill="#483428" />
        </Svg>
      )}
    </Animated.View>
  );
}
