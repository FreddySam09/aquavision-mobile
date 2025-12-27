import { View, ScrollView, TextInput, Pressable, Text, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { saveServerConfig, getServerConfig } from "../../lib/serverConfig";
import { useEffect } from "react";
import AppText from "../../components/AppText";
import GlassCard from "../../components/GlassCard";
import { useRouter } from "expo-router";
import PlanModal from "@/components/PlanModal";


type Plan = "free" | "pro" | "enterprise";

interface Device {
  id: string;
  name: string;
  type: "AUV" | "ROVER";
  distance: number; // meters
  paired: boolean;
}

export default function SettingsPage() {
  /* ============================
     STATE
     ============================ */

  const [plan, setPlan] = useState<Plan>("free");
  const router = useRouter();
  const [showPlanModal, setShowPlanModal] = useState(false);

  const [profile, setProfile] = useState({
    name: "Freddy Samjacob",
    email: "freddy@aquavision.io",
    organization: "AquaVision Labs",
  });

  const [devices, setDevices] = useState<Device[]>([
    {
      id: "auv-01",
      name: "AUV Triton",
      type: "AUV",
      distance: 18,
      paired: true,
    },
    {
      id: "rov-02",
      name: "ROV Nautilus",
      type: "ROVER",
      distance: 42,
      paired: false,
    },
  ]);

  const [autoConnect, setAutoConnect] = useState(true);
  const [servers, setServers] = useState<
    { name: string; ip: string; port: string; active: boolean }[]
  >([]);

  const [newServer, setNewServer] = useState({
    name: "",
    ip: "",
    port: "5000",
  });


  /* ============================
     HELPERS
     ============================ */

  const togglePair = (id: string) => {
    setDevices((prev) =>
      prev.map((d) =>
        d.id === id ? { ...d, paired: !d.paired } : d
      )
    );
  };

  useEffect(() => {
    (async () => {
      const { ip, port } = await getServerConfig();
      if (!ip) return;

      setServers((prev) =>
        prev.map((s) =>
          s.ip === ip && s.port === port
            ? { ...s, active: true }
            : { ...s, active: false }
        )
      );
    })();
  }, []);

  const addServer = async () => {
    if (!newServer.name || !newServer.ip) return;

    const updated = servers.map((s) => ({ ...s, active: false }));
    const entry = { ...newServer, active: true };

    setServers([...updated, entry]);
    await saveServerConfig(newServer.ip, newServer.port);
    router.replace({
      pathname: "/(tabs)/dashboard",
      params: { serverChanged: Date.now().toString() },
    });



    setNewServer({ name: "", ip: "", port: "5000" });
  };

  const selectServer = async (ip: string, port: string) => {
    setServers((prev) =>
      prev.map((s) => ({
        ...s,
        active: s.ip === ip && s.port === port,
      }))
    );

    await saveServerConfig(ip, port);
    router.replace({
      pathname: "/(tabs)/dashboard",
      params: { serverChanged: Date.now().toString() },
    });


  };



  /* ============================
     UI
     ============================ */

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView
        className="px-4 pt-6"
        showsVerticalScrollIndicator={false}
      >
        {/* ⚙️ HEADER */}
        <View className="mb-6">
          <Text className="text-white text-2xl font-poppinsSemibold">
            Settings
          </Text>
          <Text className="text-gray-400 mt-1">
            Manage your account, devices & subscriptions
          </Text>
        </View>

        {/* 👤 PROFILE */}
        <GlassCard>
          <Text className="text-white text-lg font-poppinsMedium mb-3">
            Profile
          </Text>

          <Label>Full Name</Label>
          <Input
            value={profile.name}
            onChangeText={(v) => setProfile({ ...profile, name: v })}
          />

          <Label>Email</Label>
          <Input
            value={profile.email}
            keyboardType="email-address"
            onChangeText={(v) => setProfile({ ...profile, email: v })}
          />

          <Label>Organization</Label>
          <Input
            value={profile.organization}
            onChangeText={(v) =>
              setProfile({ ...profile, organization: v })
            }
          />

          <Pressable className="bg-white mt-4 py-3 rounded-xl">
            <Text className="text-black text-center font-poppinsMedium">
              Save Profile
            </Text>
          </Pressable>
        </GlassCard>

        {/* 🌐 SERVER CONFIG */}
        <View className="mt-6">
          <GlassCard>
            <Text className="text-white text-lg font-poppinsMedium mb-3">
              AUV Servers
            </Text>

            {servers.map((server, i) => (
              <Pressable
                key={i}
                onPress={() => selectServer(server.ip, server.port)}
                className={`mb-3 p-3 rounded-lg border ${
                  server.active
                    ? "border-green-500 bg-green-500/10"
                    : "border-zinc-700"
                }`}
              >
                <Text className="text-white">
                  {server.name}
                </Text>
                <Text className="text-gray-400 text-xs">
                  {server.ip}:{server.port}
                </Text>
                {server.active && (
                  <Text className="text-green-400 text-xs mt-1">
                    ACTIVE
                  </Text>
                )}
              </Pressable>
            ))}

            <Label>Server Name</Label>
            <Input
              value={newServer.name}
              onChangeText={(v) => setNewServer({ ...newServer, name: v })}
              placeholder="e.g. AUV Triton"
            />

            <Label>Server IP</Label>
            <Input
              value={newServer.ip}
              onChangeText={(v) => setNewServer({ ...newServer, ip: v })}
              placeholder="192.168.1.10"
            />

            <Label>Port</Label>
            <Input
              value={newServer.port}
              onChangeText={(v) => setNewServer({ ...newServer, port: v })}
              placeholder="5000"
              keyboardType="numeric"
            />

            <Pressable
              className="bg-white mt-4 py-3 rounded-xl"
              onPress={addServer}
            >
              <Text className="text-black text-center font-poppinsMedium">
                Save Server
              </Text>
            </Pressable>
          </GlassCard>
        </View>


        {/* 💳 SUBSCRIPTION */}
        <View className="mt-6 mb-10">
          <GlassCard>
            <Text className="text-white text-lg font-poppinsMedium mb-2">
              Subscription
            </Text>

            <Text className="text-gray-400 mb-3">
              Current plan:{" "}
              <Text className="text-white capitalize">
                {plan}
              </Text>
            </Text>

            <PlanRow label="Free" active={plan === "free"} />
            <PlanRow label="Pro" active={plan === "pro"} />
            <PlanRow label="Enterprise" active={plan === "enterprise"} />

            <Pressable
              className="bg-cyan-500/20 mt-4 py-3 rounded-xl"
              onPress={() => setShowPlanModal(true)}
            >
              <Text className="text-cyan-400 text-center font-poppinsMedium">
                Change Plan
              </Text>
            </Pressable>
          </GlassCard>
        </View>
      </ScrollView>
      <PlanModal
        visible={showPlanModal}
        currentPlan={plan}
        onSelect={(p) => {
          setPlan(p);
          setShowPlanModal(false);
        }}
        onClose={() => setShowPlanModal(false)}
      />

    </SafeAreaView>
  );
}

/* ============================
   🔹 SMALL COMPONENTS
   ============================ */

function Label({ children }: { children: string }) {
  return (
    <Text className="text-gray-400 text-sm mt-3 mb-1">
      {children}
    </Text>
  );
}

function Input(props: any) {
  return (
    <TextInput
      {...props}
      className="bg-black/40 border border-zinc-700 rounded-lg px-4 py-3 text-white"
      placeholderTextColor="#777"
    />
  );
}

function PlanRow({
  label,
  active,
}: {
  label: string;
  active: boolean;
}) {
  return (
    <View className="flex-row justify-between items-center mb-2">
      <Text className="text-white">{label}</Text>
      {active && (
        <Text className="text-green-400 text-xs">ACTIVE</Text>
      )}
    </View>
  );
}
