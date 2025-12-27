//index.tsx
import { View, Text, Image, Pressable } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import AppText from "../../components/AppText";


export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="flex-1 justify-center px-6">
        
        {/* 🔵 App Logo */}
        <View className="items-center mb-6">
          <Image
            source={require("../../assets/images/icon.png")}
            style={{ width: 130, height: 130 }} // ✅ controlled size
            resizeMode="contain"
          />
          {/* Replace with: AquaVision / Marineer logo */}
        </View>

        <Text className="text-white text-5xl font-poppinsSemibold text-center mb-3">
          AQUAVISION
        </Text>

        <Text className="text-gray-400 text-center mb-8 font-poppins">
          Underwater environmental intelligence platform for real-time
          pollution monitoring.
        </Text>

        <Pressable
          onPress={() => router.push("/dashboard")}
          className="bg-white py-4 rounded-xl"
        >
          <Text className="text-black font-poppinsMedium text-lg text-center">
            Go to Dashboard
          </Text>
        </Pressable>

      </View>
    </SafeAreaView>
  );
}
