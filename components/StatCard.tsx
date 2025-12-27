//StatCard.tsx
import { View, Text } from "react-native";
import AppText from "../components/AppText";

interface Props {
  label: string;
  value: string | number;
}

export default function StatCard({ label, value }: Props) {
  return (
    <View className="bg-zinc-900 rounded-xl p-4 w-[48%]">
      <Text className="text-gray-400 text-sm font-poppinsMedium">{label}</Text>
      <Text className="text-white text-xl font-poppinsBold mt-1">
        {value}
      </Text>
    </View>
  );
}
