import { invoke } from "@tauri-apps/api/core";
import { listen, UnlistenFn } from "@tauri-apps/api/event";
import { useEffect } from "react";
import { useFeatureManager, useFeatureManagerStore } from "./useFeature";

export const useSocket = () => {
  const SendMessage = async (msg: string) => {
    try {
      await invoke("send_to_game", { message: msg });
    } catch (error) {
      console.error("Failed send to game:", error);
      throw error;
    }
  };

  return {
    SendMessage,
  };
};

export const useSocketRender = () => {
  const { SetNetworkStatus } = useFeatureManager();
  const { SendMessage } = useSocket();
  useEffect(() => {
    let unlistenMsg: UnlistenFn;
    let unlistenStatus: UnlistenFn;

    const setupListener = async () => {
      unlistenMsg = await listen<string>("message_from_game", (event) => {
        try {
          const data = JSON.parse(event.payload);
          if (data.key === "REQUEST_DATA") {
            const latestFeature = useFeatureManagerStore.getState().feature;
            SendMessage(JSON.stringify(latestFeature));
          }
        } catch {
          // console.log("Bukan JSON:", event.payload);
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
