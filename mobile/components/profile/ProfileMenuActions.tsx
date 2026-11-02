// mobile/components/profile/ProfileMenuActions.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Icon } from "../ui/Icon";

interface ProfileMenuActionsProps {
  onPressEditProfile: () => void;
  onPressSettings: () => void;
  onPressLogout: () => void;
}

export const ProfileMenuActions: React.FC<ProfileMenuActionsProps> = ({
  onPressEditProfile,
  onPressSettings,
  onPressLogout,
}) => {
  return (
    <View className="mb-8">
      {/* 1. Edit Profile */}
      <TouchableOpacity
        onPress={onPressEditProfile}
        activeOpacity={0.7}
        className="flex-row items-center justify-between py-3 mb-1"
      >
        <View className="flex-row items-center flex-1">
          <View className="w-11 h-11 rounded-full bg-indigo-50 items-center justify-center mr-3.5">
            <Icon name="UserIcon" variant="outline" size={20} color="#6366f1" />
          </View>
          <View className="flex-1">
            <Text className="font-mono font-bold text-sm text-gray-900">Edit Profile</Text>
            <Text className="font-mono text-xs text-gray-400 mt-0.5">
              Make changes to your account
            </Text>
          </View>
        </View>

        <Icon name="ChevronRightIcon" variant="outline" size={18} color="#9ca3af" />
      </TouchableOpacity>

      {/* 2. Settings */}
      <TouchableOpacity
        onPress={onPressSettings}
        activeOpacity={0.7}
        className="flex-row items-center justify-between py-3 mb-1"
      >
        <View className="flex-row items-center flex-1">
          <View className="w-11 h-11 rounded-full bg-indigo-50 items-center justify-center mr-3.5">
            <Icon name="UserIcon" variant="outline" size={20} color="#6366f1" />
          </View>
          <View className="flex-1">
            <Text className="font-mono font-bold text-sm text-gray-900">Settings</Text>
            <Text className="font-mono text-xs text-gray-400 mt-0.5">
              Manage your account
            </Text>
          </View>
        </View>

        <Icon name="ChevronRightIcon" variant="outline" size={18} color="#9ca3af" />
      </TouchableOpacity>

      {/* 3. Log out */}
      <TouchableOpacity
        onPress={onPressLogout}
        activeOpacity={0.7}
        className="flex-row items-center justify-between py-3"
      >
        <View className="flex-row items-center flex-1">
          <View className="w-11 h-11 rounded-full bg-slate-100 items-center justify-center mr-3.5">
            <Icon name="ArrowRightOnRectangleIcon" variant="outline" size={20} color="#64748b" />
          </View>
          <View className="flex-1">
            <Text className="font-mono font-bold text-sm text-gray-900">Log out</Text>
            <Text className="font-mono text-xs text-gray-400 mt-0.5">
              Further secure your account for safety
            </Text>
          </View>
        </View>

        <Icon name="ChevronRightIcon" variant="outline" size={18} color="#9ca3af" />
      </TouchableOpacity>
    </View>
  );
};
