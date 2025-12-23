import { invoke } from "@tauri-apps/api/core";
import { listen, UnlistenFn } from "@tauri-apps/api/event";
import { useEffect } from "react";
import { useFeatureManager } from "./useFeature";

export const useSocket = () => {
  const SendMessage = async (msg: string) => {
    try {
      await invoke("send_to_game", { message: msg });
      console.log(msg);
    } catch (error) {
      console.error("Failed send to game:", error);
    }
  };

  return {
    SendMessage,
  };
};

export const useSocketRender = () => {
  const { SetNetworkStatus } = useFeatureManager();
  useEffect(() => {
    let unlistenMsg: UnlistenFn;
    let unlistenStatus: UnlistenFn;

    const setupListener = async () => {
      unlistenMsg = await listen<string>("message_from_game", (event) => {
        try {
          const data = JSON.parse(event.payload);
          console.log("Status:", data);
        } catch {
          console.log("Bukan JSON:", event.payload);
        }
      });

      unlistenStatus = await listen<string>("connection-status", (event) => {
        const status = event.payload as "connected" | "disconnected";
        SetNetworkStatus(status);
      });
    };

    setupListener();

    return () => {
      if (unlistenMsg) unlistenMsg();
      if (unlistenStatus) unlistenStatus();
    };
  }, []);
};
