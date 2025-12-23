import { getCurrentWindow } from "@tauri-apps/api/window";
import { useEffect, useRef, useState } from "react";

export const useWindowEvent = () => {
  const [IsDragging, setDragging] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  const handleMouseDown = (e: globalThis.MouseEvent) => {
    if (e.button === 0) {
      if (e.detail === 1) {
        getCurrentWindow().startDragging();
        setDragging(true);
      } else if (e.detail === 2) {
        getCurrentWindow().toggleMaximize();
      }
    }
  };

  const handleMouseUp = () => setDragging(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.addEventListener("mousedown", handleMouseDown);
    el.addEventListener("mouseup", handleMouseUp);

    return () => {
      el.removeEventListener("mousedown", handleMouseDown);
      el.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return { appWindow: getCurrentWindow, IsDragging, ref };
};
