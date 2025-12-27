import { View, Image, ScrollView } from "react-native";
import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import AppText from "../../components/AppText";
import StatCard from "../../components/StatCard";
import StatusBadge from "../../components/StatusBadge";
import HealthIndicator from "../../components/HealthIndicator";
import SocketClient from "../../components/SocketClient";
import GlassCard from "../../components/GlassCard";
import MiniLineChart from "../../components/MiniLineChart";
import PlasticTimeline from "@/components/PlasticTimeline";
import MobileRadar from "@/components/MobileRadar";
import { useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";



export interface AuvData {
  battery: number;
  speed: number;
  x: number;
  y: number;
  z: number;
  plastic_detected: boolean;
  plastic_collection: boolean;
  fishes_detected: number;
  health_status: Record<string, "good" | "warning" | "critical">;
}

/* 🔴 ADD THIS (inactive state, no UI impact) */
const INACTIVE_AUV: AuvData = {
  battery: 0,
  speed: 0,
  x: 0,
  y: 0,
  z: 0,
  plastic_detected: false,
  plastic_collection: false,
  fishes_detected: 0,
  health_status: {
    motor: "critical",
    sensors: "critical",
    camera: "critical",
    thrusters: "critical",
  },
};

export default function DashboardScreen() {
  const { serverChanged } = useLocalSearchParams();
  const [missionKey, setMissionKey] = useState(0);
  const [serverVersion, setServerVersion] = useState(0);
  const [auvData, setAuvData] = useState<AuvData>({
    battery: 100,
    speed: 0.12,
    x: 0,
    y: 12.4,
    z: 42.1,
    plastic_detected: false,
    plastic_collection: false,
    fishes_detected: 0,
    health_status: {
      motor: "good",
      sensors: "good",
      camera: "warning",
      thrusters: "critical",
    },
  });

  const [connected, setConnected] = useState(false);

  const resetMission = () => {
    setAuvData({
      battery: 0,
      speed: 0,
      x: 0,
      y: 0,
      z: 0,
      plastic_detected: false,
      plastic_collection: false,
      fishes_detected: 0,
      health_status: {
        motor: "critical",
        sensors: "critical",
        camera: "critical",
        thrusters: "critical",
      },
    });

    setMissionKey(k => k + 1);
  };

    useEffect(() => {
    if (serverChanged) {
      setServerVersion(v => v + 1);
    }
  }, [serverChanged]);

  useEffect(() => {
    AsyncStorage.setItem("SERVER_ENABLED", "false");
  }, []);



  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView className="px-4 pt-6" showsVerticalScrollIndicator={false}>
        {/* 🔵 HEADER */}
        <View className="items-center mb-6">
          <Image
            source={require("../../assets/images/icon.png")}
            style={{ width: 80, height: 80 }}
            resizeMode="contain"
            className="mt-2"
          />

          <AppText className="text-white text-xl font-poppinsMedium mt-2">
            Live AUV Dashboard
          </AppText>
        </View>

        {/* 🚀 AUV STATUS CARD */}
        <GlassCard>
          <View className="flex-row justify-between items-center mb-4">
            <View>
              <AppText className="text-gray-400 text-sm">
                AUV STATUS
              </AppText>
              <AppText className="text-white text-xl font-poppinsSemibold">
                {connected ? "Operational" : "Unpaired"}
              </AppText>
            </View>

            <View className={`${connected ? "bg-green-500/20" : "bg-red-500/20"} px-3 py-1 rounded-full`}>
              <AppText className={`${connected ? "text-green-400" : "text-red-400"} text-xs`}>
                {connected ? "LIVE" : "DISCONNECTED"}
              </AppText>
            </View>
          </View>

          <View className="mb-4">
            <GlassCard>
              <AppText className="text-gray-400 text-sm">
                Environment Map
              </AppText>
              <MobileRadar key={missionKey} auvData={auvData} />
            </GlassCard>
          </View>

          <GlassCard>
            <AppText className="text-gray-400 text-sm">
              Plastic Detection Timeline
            </AppText>
            <PlasticTimeline key={missionKey} auvData={auvData} />
          </GlassCard>

          <AppText className="text-gray-400 text-sm mt-6">
            Battery Trend
          </AppText>

          <MiniLineChart
            data={[100, 98, 96, 95, 94, auvData.battery]}
            color="#22c55e"
          />
        </GlassCard>

        {/* 📊 TELEMETRY GRAPHS */}
        <View className="flex-row justify-between mt-4">
          <View className="w-[48%]">
            <GlassCard>
              <AppText className="text-gray-400 text-sm">
                Battery %
              </AppText>
              <AppText className="text-white text-2xl font-poppinsBold">
                {auvData.battery.toFixed(0)}%
              </AppText>

              <MiniLineChart
                data={[92, 94, 96, 97, auvData.battery]}
                color="#22c55e"
              />
            </GlassCard>
          </View>

          <View className="w-[48%]">
            <GlassCard>
              <AppText className="text-gray-400 text-sm">
                Speed (m/s)
              </AppText>
              <AppText className="text-white text-2xl font-poppinsBold">
                {auvData.speed.toFixed(2)}
              </AppText>

              <MiniLineChart
                data={[0.06, 0.08, 0.1, auvData.speed]}
                color="#38bdf8"
              />
            </GlassCard>
          </View>
        </View>

        <View className="flex-row justify-between mt-4">
          <StatCard label="Depth (Y)" value={`${auvData.y.toFixed(2)} m`} />
          <StatCard label="Direction (Z)" value={`${auvData.z.toFixed(2)}°`} />
        </View>

        <View className="mt-4">
          <GlassCard>
            <StatusBadge auvData={auvData} />
          </GlassCard>
        </View>

        <View className="mt-4 mb-10">
          <GlassCard>
            <AppText className="text-white text-lg font-poppinsMedium mb-3">
              AUV Health
            </AppText>
            <HealthIndicator health={auvData.health_status} />
          </GlassCard>
        </View>

        {/* 📡 SOCKET LISTENER */}
        <SocketClient
          serverVersion={serverVersion}
          onUpdate={setAuvData}
          onConnectionChange={(isConnected) => {
            setConnected(isConnected);
            if (!isConnected) resetMission();
          }}
        />

      </ScrollView>
    </SafeAreaView>
  );
}
