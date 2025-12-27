import { View, Text, Pressable, Modal } from "react-native";

interface PlanModalProps {
  visible: boolean;
  currentPlan: "free" | "pro" | "enterprise";
  onSelect: (plan: "free" | "pro" | "enterprise") => void;
  onClose: () => void;
}

export default function PlanModal({
  visible,
  currentPlan,
  onSelect,
  onClose,
}: PlanModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 bg-black/70 justify-center px-6">
        <View className="bg-zinc-950 rounded-2xl p-5 border border-zinc-800">
          <Text className="text-white text-xl font-poppinsSemibold mb-2">
            Upgrade Your Plan
          </Text>

          <Text className="text-gray-400 mb-4">
            Unlock higher limits and advanced underwater analytics.
          </Text>

          <Plan
            title="Free"
            price="₹0"
            features={[
              "Live AUV status",
              "Basic detections",
              "60 req/min",
            ]}
            active={currentPlan === "free"}
            onSelect={() => onSelect("free")}
          />

          <Plan
            title="Pro"
            price="₹999 / month"
            features={[
              "Detection history",
              "Heatmaps & zones",
              "Higher rate limits",
            ]}
            highlight
            active={currentPlan === "pro"}
            onSelect={() => onSelect("pro")}
          />

          <Plan
            title="Enterprise"
            price="Custom"
            features={[
              "Unlimited access",
              "Bulk data export",
              "Priority support",
            ]}
            active={currentPlan === "enterprise"}
            onSelect={() => onSelect("enterprise")}
          />

          <Pressable onPress={onClose} className="mt-4">
            <Text className="text-gray-400 text-center">
              Close
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

/* 🔹 INTERNAL PLAN CARD */

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
