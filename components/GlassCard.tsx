import { View } from "react-native";
import { ReactNode } from "react";

export default function GlassCard({ children }: { children: ReactNode }) {
  return (
    <View className="bg-white/5 border border-white/10 rounded-2xl p-4">
      {children}
    </View>
  );
}
