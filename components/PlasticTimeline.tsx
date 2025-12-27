import { View } from "react-native";
import { useEffect, useState } from "react";
import { AuvData } from "../app/(tabs)/dashboard";

type State = "n" | "y" | "w";

export default function PlasticTimeline({ auvData }: { auvData: AuvData }) {
  const [states, setStates] = useState<State[]>([]);

  useEffect(() => {
    let s: State = "n";
    if (auvData.plastic_detected && auvData.fishes_detected === 0) s = "y";
    if (auvData.plastic_detected && auvData.fishes_detected > 0) s = "w";

    setStates(prev => [...prev.slice(-20), s]);
  }, [auvData.plastic_detected, auvData.fishes_detected]);

  const color = (s: State) => {
    if (s === "y") return "#ef4444";
    if (s === "w") return "#38bdf8";
    return "#22c55e";
  };

  return (
    <View className="flex-row h-6 mt-6">
      {states.map((s, i) => (
        <View
          key={i}
          className="flex-1 mx-[1px] rounded-sm"
          style={{ backgroundColor: color(s) }}
        />
      ))}
    </View>
  );
}
