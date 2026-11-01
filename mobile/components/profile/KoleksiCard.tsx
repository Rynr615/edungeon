// mobile/components/profile/KoleksiCard.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Svg, { Path } from "react-native-svg";
import { Icon } from "../ui/Icon";

interface KoleksiCardProps {
  onPressCard?: (cardType: string) => void;
  onPressBadge?: (badgeIndex: number) => void;
}

export const KoleksiCard: React.FC<KoleksiCardProps> = ({
  onPressCard,
  onPressBadge,
}) => {
  return (
    <View className="bg-[#dde3ea] rounded-2xl p-4 mb-5">
      {/* Label: Koleksi */}
      <Text className="font-mono text-gray-800 text-xs font-semibold mb-3">
        Koleksi
      </Text>

      {/* Row 1: 3 White Cards (ATK+2, HP+15, DEF+4) */}
      <View className="flex-row justify-between mb-4">
        {/* Card 1: Sword ATK+2 */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => onPressCard && onPressCard("ATK+2")}
          className="w-[31%] bg-white rounded-xl py-3 px-2 items-center shadow-xs"
        >
          {/* Sword SVG icon */}
          <Svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <Path
              d="M19.7 4.3c-.4-.4-1-.4-1.4 0l-9.9 9.9-2.1-.7c-.4-.1-.8 0-1.1.3l-2 2c-.4.4-.4 1 0 1.4l2.1 2.1-2.1 2.1c-.4.4-.4 1 0 1.4.2.2.5.3.7.3s.5-.1.7-.3l2.1-2.1 2.1 2.1c.4.4 1 .4 1.4 0l2-2c.3-.3.4-.7.3-1.1l-.7-2.1 9.9-9.9c.4-.4.4-1 0-1.4z"
              fill="#111827"
            />
          </Svg>
          <Text className="font-mono font-bold text-xs text-gray-900 mt-1.5">
            ATK+2
          </Text>
        </TouchableOpacity>

        {/* Card 2: Heart HP+15 */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => onPressCard && onPressCard("HP+15")}
          className="w-[31%] bg-white rounded-xl py-3 px-2 items-center shadow-xs"
        >
          {/* Heart Solid Icon */}
          <Icon name="HeartIcon" variant="solid" size={22} color="#111827" />
          <Text className="font-mono font-bold text-xs text-gray-900 mt-1.5">
            HP+15
          </Text>
        </TouchableOpacity>

        {/* Card 3: Shield DEF+4 */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => onPressCard && onPressCard("DEF+4")}
          className="w-[31%] bg-white rounded-xl py-3 px-2 items-center shadow-xs"
        >
          {/* Shield Solid Icon */}
          <Icon name="ShieldCheckIcon" variant="solid" size={22} color="#111827" />
          <Text className="font-mono font-bold text-xs text-gray-900 mt-1.5">
            DEF+4
          </Text>
        </TouchableOpacity>
      </View>

      {/* Row 2: 4 Badge Circles */}
      <View className="flex-row justify-start space-x-3 px-0.5">
        {/* Badge 1: Medal / Trophy with Star */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => onPressBadge && onPressBadge(1)}
          className="w-11 h-11 rounded-full bg-white border border-gray-300 items-center justify-center shadow-xs mr-3"
        >
          <Svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <Path
              d="M12 15a6 6 0 100-12 6 6 0 000 12z"
              stroke="#ca8a04"
              strokeWidth="2"
              fill="#fef08a"
            />
            <Path
              d="M8.21 13.89L7 21l5-2.5 5 2.5-1.21-7.11"
              stroke="#111827"
              strokeWidth="1.5"
            />
            <Path
              d="M12 6l.9 1.8 2 .3-1.45 1.4.35 2-1.8-.95-1.8.95.35-2-1.45-1.4 2-.3L12 6z"
              fill="#ca8a04"
            />
          </Svg>
        </TouchableOpacity>

        {/* Badge 2: Yellow Gear / Star Flower */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => onPressBadge && onPressBadge(2)}
          className="w-11 h-11 rounded-full bg-white border border-gray-300 items-center justify-center shadow-xs mr-3"
        >
          <Svg width="22" height="22" viewBox="0 0 24 24" fill="#eab308">
            <Path
              d="M12 2l2.4 4.8 5.3.8-3.8 3.7.9 5.3-4.8-2.5-4.8 2.5.9-5.3-3.8-3.7 5.3-.8L12 2z"
              stroke="#ca8a04"
              strokeWidth="1.5"
            />
          </Svg>
        </TouchableOpacity>

        {/* Badge 3: Red Lock / Pouch 1 */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => onPressBadge && onPressBadge(3)}
          className="w-11 h-11 rounded-full bg-white border border-gray-300 items-center justify-center shadow-xs mr-3"
        >
          <Icon name="LockClosedIcon" variant="solid" size={18} color="#ef4444" />
        </TouchableOpacity>

        {/* Badge 4: Red Lock / Pouch 2 */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => onPressBadge && onPressBadge(4)}
          className="w-11 h-11 rounded-full bg-white border border-gray-300 items-center justify-center shadow-xs"
        >
          <Icon name="LockClosedIcon" variant="solid" size={18} color="#ef4444" />
        </TouchableOpacity>
      </View>
    </View>
  );
};
