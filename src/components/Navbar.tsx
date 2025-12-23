"use client";
import { useWindowEvent } from "@/hooks/useWindowEvent";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { useState } from "react";
import { useSocket } from "@/hooks/useSocket";
import { useFeatureManager } from "@/hooks/useFeature";
import toast from "react-hot-toast";

const SyncFeature = () => {
  const [sync, setSync] = useState(false);
  const { feature } = useFeatureManager();
  const { SendMessage } = useSocket();

  const handleSync = async () => {
    try {
      await SendMessage(JSON.stringify(feature));
      toast.success("Data synced successfully");
    } catch (error) {
      toast.error("Unable to sync data");
    } finally {
      setSync(false);
    }
  };

  return (
    <div className="mr-5">
      <Button onClick={handleSync} disabled={sync}>
        Sync
      </Button>
    </div>
  );
};

export const Navbar = () => {
  const { appWindow, ref } = useWindowEvent();

  return (
    <nav className={`fixed top-0 right-0 left-0 bg-background border-b h-18 border-b-slate-400/15 z-50 select-none`}>
      <div className="flex items-center h-full mx-6.25">
        <div className="flex gap-2 items-center">
          <img src={"./k-logo.png"} alt="" width={512} height={512} style={{ width: "50px", height: "50px" }} />
          <h2 className="text-lg font-bold">Phantom WWM</h2>
        </div>
        <div className={`flex-1 h-full hover:cursor-grab`} ref={ref} />
        <div className="flex items-center gap-5">
          <div className="flex items-center justify-center gap-2 drag">
            <SyncFeature />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className="bg-yellow-500 w-4 h-4 rounded-full p-0 hover:bg-yellow-400"
                  onClick={() => {
                    appWindow().minimize();
                  }}
                />
              </TooltipTrigger>
              <TooltipContent>Minimize</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className="bg-green-500 w-4 h-4 rounded-full p-0 hover:bg-green-400 relative"
                  onClick={() => {
                    appWindow().toggleMaximize();
                  }}
                />
              </TooltipTrigger>
              <TooltipContent>Maximize</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className="bg-red-500 w-4 h-4 rounded-full p-0 hover:bg-red-400 relative"
                  onClick={() => {
                    appWindow().close();
                  }}
                />
              </TooltipTrigger>
              <TooltipContent>Close App</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </nav>
  );
};
