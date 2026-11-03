// mobile/components/home/CompletionFooter.tsx
import React from "react";
import { View } from "react-native";
import { Button } from "../ui/Button";

interface CompletionFooterProps {
  isCompleted: boolean;
  onComplete: () => void;
  loading: boolean;
}

export const CompletionFooter: React.FC<CompletionFooterProps> = ({ isCompleted, onComplete, loading }) => {
  return (
    <View className="py-4">
      <Button
        title={isCompleted ? "Materi Selesai (Ulangi/Lanjut ke Challenge)" : "Tandai Materi Selesai"}
        variant={isCompleted ? "secondary" : "success"}
        onPress={onComplete}
        loading={loading}
      />
    </View>
  );
};