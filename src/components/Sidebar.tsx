"use client";

import { HTMLAttributes } from "react";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Link, LinkProps } from "@tanstack/react-router";
import { useLocation } from "@tanstack/react-router";
import { useFeatureManagerStore } from "@/hooks/useFeature";

type TRoute = {
  label: string;
  href: string;
};

const Routes: TRoute[] = [
  {
    label: "Home",
    href: "/",
  },
];

const SideNav = ({ href, children }: LinkProps & HTMLAttributes<HTMLAnchorElement>) => {
  const location = useLocation();

  return (
    <Link to={href}>
      <Button
        className={`w-full cursor-pointer h-10 hover:bg-[#08111a] hover:text-white text-md capitalize ${
          location.pathname === href ? "bg-[#08111a]" : "text-white/50"
        }`}
        variant={"ghost"}
      >
        {children}
      </Button>
    </Link>
  );
};

function Sidebar() {
  const NetworkStatus = useFeatureManagerStore((state) => state.NetworkStatus);

  return (
    <aside className="fixed left-0 top-18 h-[calc(100vh-72px)] w-56 border-r border-r-slate-400/15 overflow-hidden select-none bg-background">
      <div className="h-full w-full relative">
        <ScrollArea className="w-full h-[calc(100vh-130px)]">
          <div className="flex flex-col gap-2 mt-5 px-5">
            {Routes.map((item, i) => (
              <SideNav key={i} href={item.href}>
                {item.label}
              </SideNav>
            ))}
          </div>
        </ScrollArea>
        <div className="px-5 border-t border-t-slate-400/15 absolute h-12 right-0 bottom-0 left-0">
          <div className="flex items-center justify-center gap-2 h-12 shrink-0 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              {NetworkStatus === "connected" ? (
                <>
                  <p className="capitalize">Connected</p>
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                </>
              ) : NetworkStatus === "reconnect" ? (
                <>
                  <p className="capitalize">Reconnecting</p>
                  <div className="h-1.5 w-1.5 rounded-full bg-yellow-500"></div>
                </>
              ) : NetworkStatus === "disconnected" ? (
                <>
                  <p className="capitalize">Disconnected</p>
                  <div className="h-1.5 w-1.5 rounded-full bg-red-500"></div>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
