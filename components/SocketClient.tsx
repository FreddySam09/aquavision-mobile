import { useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { AuvData } from "../app/(tabs)/dashboard";
import { getServerConfig } from "../lib/serverConfig";

interface Props {
  onUpdate: (data: AuvData) => void;
  onConnectionChange?: (connected: boolean) => void;
  serverVersion: number;
}

export default function SocketClient({
  onUpdate,
  onConnectionChange,
  serverVersion,
}: Props) {
  useEffect(() => {
    let socket: Socket | null = null;
    let active = true;

    const connect = async () => {
      const { ip, port, enabled } = await getServerConfig(); // ✅ FIX

      if (!ip || !enabled) {
        console.log("🚫 Server configured but not enabled");
        onConnectionChange?.(false);
        return;
      }

      const url = `http://${ip}:${port}`;
      console.log("🔌 Connecting to", url);

      socket = io(url, {
        transports: ["websocket"],
        reconnection: true,
        timeout: 5000,
      });

      socket.on("connect", () => {
        if (!active) return;
        console.log("🟢 Connected to AUV server");
        onConnectionChange?.(true);
      });

      socket.on("auv_update", (data: AuvData) => {
        if (!active) return;
        onUpdate(data);
      });

      socket.on("disconnect", () => {
        if (!active) return;
        onConnectionChange?.(false);
      });

      socket.on("connect_error", (err) => {
        if (!active) return;
        console.log("❌ Socket error:", err.message);
        onConnectionChange?.(false);
      });
    };

    connect();

    return () => {
      active = false;
      socket?.disconnect();
    };
  }, [serverVersion]); // reconnect when server changes

  return null;
}
