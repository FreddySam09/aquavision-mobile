//StatusBadge.tsx
import { View, Text } from "react-native";
import { AuvData } from "../app/(tabs)/dashboard";

interface Props {
  auvData: AuvData;
}

export default function StatusBadge({ auvData }: Props) {
  let text = "Idle";
  let color = "bg-gray-700";

  if (auvData.plastic_detected && auvData.fishes_detected > 0) {
    text = "Waiting for Aquatic Life";
    color = "bg-cyan-700";
  } else if (auvData.plastic_collection) {
    text = "Collecting Plastic";
    color = "bg-green-700";
  }

  return (
    <View className={`${color} rounded-xl py-4 px-4 mt-2`}>
      <Text className="text-white font-poppinsSemibold text-center -mb-1">
        {text}
      </Text>
    </View>
  );
}
