import { View } from "react-native";
import { useEffect, useRef, useState } from "react";
import { AuvData } from "../app/(tabs)/dashboard";

interface Spot {
  id: number;
  x: number;
  z: number;
  color: string;
}

export default function MobileRadar({ auvData }: { auvData: AuvData }) {
  const [spots, setSpots] = useState<Spot[]>([]);
  const prevCollect = useRef(false);
  const prevDetect = useRef(false);

  /* ============================
     📍 DETECTION LOGIC
     ============================ */
  useEffect(() => {
    const detectNow = auvData.plastic_detected;
    const collectNow = auvData.plastic_collection;
    const fish = auvData.fishes_detected;

    const detectionJustHappened =
      !prevDetect.current && (detectNow || fish > 0);

    if (detectionJustHappened) {
      let color = "#38bdf8"; // fish only (blue)
      if (detectNow && fish === 0) color = "#ef4444"; // plastic
      if (detectNow && fish > 0) color = "#e5e7eb"; // plastic + fish

      setSpots(prev => [
        ...prev,
        {
          id: Date.now(),
          x: auvData.x,
          z: auvData.z,
          color,
        },
      ]);
    }

    const collectionFinished =
      prevCollect.current && !collectNow;

    if (collectionFinished) {
      setSpots(prev =>
        prev.map(s =>
          s.color === "#ef4444" || s.color === "#e5e7eb"
            ? { ...s, color: "#22c55e" } // green = collected
            : s
        )
      );
    }

    prevCollect.current = collectNow;
    prevDetect.current = detectNow;
  }, [auvData]);

  /* ============================
     🗺 POSITION MAPPING
     ============================ */
  const map = (v: number) => `${50 + v * 1.5}%`;

  /* ============================
     🔥 HEATMAP DOT
     ============================ */
  const HeatSpot = ({ x, z, color }: Spot) => (
    <View
      style={{
        position: "absolute",
        left: map(x),
        top: map(z),
        transform: [{ translateX: -20 }, { translateY: -20 }],
      }}
    >
      {/* Outer glow */}
      <View
        style={{
          position: "absolute",
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: color,
          opacity: 0.15,
        }}
      />
      {/* Mid glow */}
      <View
        style={{
          position: "absolute",
          width: 28,
          height: 28,
          borderRadius: 14,
          backgroundColor: color,
          opacity: 0.3,
          top: 6,
          left: 6,
        }}
      />
      {/* Core */}
      <View
        style={{
          position: "absolute",
          width: 12,
          height: 12,
          borderRadius: 6,
          backgroundColor: color,
          top: 14,
          left: 14,
        }}
      />
    </View>
  );

  /* ============================
     🎯 UI
     ============================ */
  return (
    <View className="w-full h-64 rounded-2xl bg-zinc-950 items-center justify-center mt-2 overflow-hidden">
      {/* Radar rings */}
      {[180, 130, 80].map(size => (
        <View
          key={size}
          className="absolute border border-zinc-700 rounded-full"
          style={{ width: size, height: size }}
        />
      ))}

      {/* Logged heat spots */}
      {spots.map(spot => (
        <HeatSpot key={spot.id} {...spot} />
      ))}

      {/* 🚀 LIVE AUV POSITION */}
      <View
        style={{
          position: "absolute",
          left: map(auvData.x),
          top: map(auvData.z),
          transform: [{ translateX: -6 }, { translateY: -6 }],
        }}
      >
        {/* Glow */}
        <View className="absolute w-6 h-6 rounded-full bg-cyan-400/20" />
        {/* Core */}
        <View className="w-3 h-3 rounded-full bg-cyan-400 border border-white" />
      </View>
    </View>
  );
}
