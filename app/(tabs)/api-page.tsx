import { View, ScrollView, Pressable, Text, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import * as Clipboard from "expo-clipboard";
import PlanModal from "../../components/PlanModal";
import AppText from "../../components/AppText";
import GlassCard from "../../components/GlassCard";

/* ============================
   🔹 MAIN PAGE
   ============================ */

export default function ApiPage() {
  const [plan, setPlan] = useState<"free" | "pro" | "enterprise">("free");
  const [showPlans, setShowPlans] = useState(false);

  const API_KEY = "sk_live_************************";

  const copyText = async (text: string) => {
    await Clipboard.setStringAsync(text);
    console.log("📋 Copied to clipboard");
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView
        className="px-4 pt-6"
        showsVerticalScrollIndicator={false}
      >
        {/* 🔑 HEADER */}
        <View className="mb-4">
          <Text className="text-white text-2xl font-poppinsSemibold">
            Developer API Access
          </Text>

          <Text className="text-gray-400 mt-2">
            Integrate AquaVision’s underwater intelligence into your own
            applications.
          </Text>

          <Text className="text-gray-500 text-sm mt-2">
            Current plan:{" "}
            <Text className="text-white font-poppinsMedium capitalize">
              {plan}
            </Text>
          </Text>
        </View>

        {/* 🔐 API KEY CARD */}
        <GlassCard>
          <Text className="text-gray-400 text-sm">
            YOUR API KEY
          </Text>

          <View className="bg-black/40 border border-zinc-700 rounded-lg px-4 py-3 mt-2 flex-row justify-between items-center">
            <Text className="text-green-400 font-mono text-sm">
              {API_KEY}
            </Text>

            <Pressable onPress={() => copyText(API_KEY)}>
              <Text className="text-cyan-400 text-xs font-mono">
                COPY
              </Text>
            </Pressable>
          </View>

          <Text className="text-gray-500 text-xs mt-2">
            Keep this key secret. Do not expose it in public repositories.
          </Text>

          <Pressable
            className="bg-white mt-4 py-3 rounded-xl"
            onPress={() => {
              if (plan === "free") setShowPlans(true);
              else console.log("🔑 Regenerate API key");
            }}
          >
            <Text className="text-black text-center font-poppinsMedium">
              Regenerate API Key
            </Text>
          </Pressable>
        </GlassCard>

        {/* 📡 AVAILABLE ENDPOINTS */}
        <View className="mt-6">
          <Text className="text-white text-lg font-poppinsMedium mb-3">
            Available Endpoints
          </Text>

          <GlassCard>
            <Endpoint
              method="GET"
              path="/api/v1/auv/status"
              desc="Get live AUV telemetry and health data"
            />

            <Endpoint
              method="GET"
              path="/api/v1/auv/detections"
              desc="Plastic & aquatic life detections with coordinates"
              locked={plan === "free"}
              onUpgrade={() => setShowPlans(true)}
            />

            <Endpoint
              method="GET"
              path="/api/v1/auv/history"
              desc="Historical mission data and analytics"
              locked={plan === "free"}
              onUpgrade={() => setShowPlans(true)}
            />
          </GlassCard>
        </View>

        {/* 🧪 SAMPLE REQUEST */}
        <View className="mt-6">
          <Text className="text-white text-lg font-poppinsMedium mb-3">
            Sample Request
          </Text>

          <GlassCard>
            <View className="bg-black/50 rounded-lg p-3 border border-zinc-700">
              <Text className="text-gray-300 font-mono text-xs">
{`curl https://api.aquavision.io/api/v1/auv/status \\
-H "Authorization: Bearer ${API_KEY}"`}
              </Text>

              <Pressable
                onPress={() =>
                  copyText(
                    `curl https://api.aquavision.io/api/v1/auv/status -H "Authorization: Bearer ${API_KEY}"`
                  )
                }
                className="mt-2"
              >
                <Text className="text-cyan-400 text-xs font-mono">
                  COPY REQUEST
                </Text>
              </Pressable>
            </View>
          </GlassCard>
        </View>

        {/* 📜 USAGE POLICY */}
        <View className="mt-6 mb-10">
          <GlassCard>
            <Text className="text-white font-poppinsMedium mb-2">
              Usage & Limits
            </Text>

            <Text className="text-gray-400 text-sm leading-5">
              • Rate limit: 60 requests/minute{"\n"}
              • Data is near-real-time (≤ 1s latency){"\n"}
              • Intended for research, NGOs & authorities{"\n"}
              • Commercial use requires approval
            </Text>
          </GlassCard>
        </View>
      </ScrollView>

      <PlanModal
        visible={showPlans}
        currentPlan={plan}
        onSelect={(p) => {
            setPlan(p);
            setShowPlans(false);
        }}
        onClose={() => setShowPlans(false)}
        />
    </SafeAreaView>
  );
}

/* ============================
   🔹 ENDPOINT ROW
   ============================ */

function Endpoint({
  method,
  path,
  desc,
  locked = false,
  onUpgrade,
}: {
  method: string;
  path: string;
  desc: string;
  locked?: boolean;
  onUpgrade?: () => void;
}) {
  const methodColor =
    method === "GET"
      ? "bg-green-500/20 text-green-400"
      : "bg-blue-500/20 text-blue-400";

  return (
    <Pressable
      disabled={!locked}
      onPress={locked ? onUpgrade : undefined}
      className={`mb-4 ${locked ? "opacity-40" : ""}`}
    >
      <View className="flex-row items-center">
        <View className={`px-2 py-1 rounded ${methodColor}`}>
          <AppText className="text-xs font-mono">
            {method}
          </AppText>
        </View>

        <AppText className="text-white font-mono ml-2">
          {path}
        </AppText>

        {locked && (
          <Text className="ml-2 text-xs text-yellow-400">
            🔒 PRO
          </Text>
        )}
      </View>

      <AppText className="text-gray-400 text-sm mt-1 ml-1">
        {desc}
      </AppText>
    </Pressable>
  );
}

/* ============================
   🔹 PLAN CARD
   ============================ */

function Plan({
  title,
  price,
  features,
  highlight,
  active,
  onSelect,
}: {
  title: string;
  price: string;
  features: string[];
  highlight?: boolean;
  active?: boolean;
  onSelect: () => void;
}) {
  return (
    <Pressable
      onPress={!active ? onSelect : undefined}
      disabled={active}
      className={`border rounded-xl p-4 mb-3 ${
        highlight
          ? "border-cyan-400 bg-cyan-400/10"
          : "border-zinc-700"
      } ${active ? "opacity-50" : ""}`}
    >
      <Text className="text-white font-poppinsMedium">
        {title} — {price}
      </Text>

      {features.map((f) => (
        <Text key={f} className="text-gray-400 text-sm mt-1">
          • {f}
        </Text>
      ))}
    </Pressable>
  );
}
