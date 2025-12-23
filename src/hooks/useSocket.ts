import { invoke } from "@tauri-apps/api/core";
import { listen, UnlistenFn } from "@tauri-apps/api/event";
import { useEffect, useState } from "react";

// Definisikan tipe data untuk log agar lebih aman
interface SocketLog {
  origin: "front_end" | "game" | "System";
  text: string;
}

export const useSocket = () => {
  const [inputMessage, setInputMessage] = useState<string>("");
  const [logs, setLogs] = useState<SocketLog[]>([]);

  const Send = async () => {
    if (!inputMessage.trim()) return;

    try {
      await invoke("send_to_game", { message: inputMessage });
      setLogs((prev) => [...prev, { origin: "front_end", text: inputMessage }]);
      setInputMessage("");
    } catch (error) {
      console.error("Failed send to game:", error);
      setLogs((prev) => [...prev, { origin: "System", text: `Error: ${error}` }]);
    }
  };

  useEffect(() => {
    let unlisten: UnlistenFn;

    const setupListener = async () => {
      unlisten = await listen<string>("message_from_game", (event) => {
        try {
          const data = JSON.parse(event.payload);
          console.log("Status:", data);
        } catch {
          console.log("Bukan JSON:", event.payload);
        }
      });
    };

    setupListener();

    return () => {
      if (unlisten) {
        unlisten();
      }
    };
  }, []);

  return {
    inputMessage,
    setInputMessage,
    logs,
    Send,
  };
};
