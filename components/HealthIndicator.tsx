//HealthIndicator.tsx
import { View, Text } from "react-native";
import AppText from "../components/AppText";


type HealthStatus = "good" | "warning" | "critical";

interface Props {
  health: Record<string, HealthStatus>;
}

export default function HealthIndicator({ health }: Props) {
  const getColor = (status: HealthStatus) => {
    if (status === "good") return "bg-green-500";
    if (status === "warning") return "bg-yellow-400";
    return "bg-red-500";
  };

  return (
    <View className="flex-row justify-between">
      {Object.entries(health).map(([key, value]) => (
        <View key={key} className="items-center w-[22%]">
          <View className={`w-4 h-4 rounded-full ${getColor(value)}`} />
          <Text className="text-gray-300 text-xs mt-1 text-center font-poppinsSemibold">
            {key.toUpperCase()}
          </Text>
        </View>
      ))}
    </View>
  );
}
