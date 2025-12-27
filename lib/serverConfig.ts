import AsyncStorage from "@react-native-async-storage/async-storage";

const IP_KEY = "SERVER_IP";
const PORT_KEY = "SERVER_PORT";
const ENABLED_KEY = "SERVER_ENABLED";


export async function saveServerConfig(ip: string, port: string) {
  await AsyncStorage.multiSet([
    ["SERVER_IP", ip],
    ["SERVER_PORT", port],
    ["SERVER_ENABLED", "true"], // 👈 important
  ]);
}


export async function getServerConfig() {
  const values = await AsyncStorage.multiGet([
    "SERVER_IP",
    "SERVER_PORT",
    "SERVER_ENABLED",
  ]);

  const ip = values[0][1] || "";
  const port = values[1][1] || "5000";
  const enabled = values[2][1] === "true";

  return { ip, port, enabled };
}


export async function clearServerConfig() {
  await AsyncStorage.multiRemove([IP_KEY, PORT_KEY]);
}
