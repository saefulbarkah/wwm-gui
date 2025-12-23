"use client";

import React from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { CircleAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { Switch } from "./ui/switch";

type TFeatureCard = React.ComponentProps<"div"> & {
  title?: string;
  description?: string;
  onSwitch?: React.MouseEventHandler<HTMLButtonElement>;
  checked?: boolean;
  warningInfo?: React.ReactNode;
  Info?: React.ReactNode;
  disabled?: boolean;
  RightContent?: React.ReactNode;
};

export const FeatureCardSwitch = ({
  title,
  description,
  checked = false,
  onSwitch,
  children,
  warningInfo,
  Info,
  disabled = false,
  RightContent,
  className,
}: TFeatureCard) => {
  return (
    <div className={cn("py-6 first:pt-0 last:pb-0", className)}>
      <div className="flex gap-5 w-full transition items-start">
        <div className="flex flex-col gap-2 flex-1 min-w-0 pr-5">
          <div className="flex items-center gap-2">
            {title ? <h2 className="leading-none font-semibold">{title}</h2> : null}
            <div className="flex items-center gap-2">
              {warningInfo ? (
                <Tooltip>
                  <TooltipTrigger>
                    <CircleAlert className="w-4.5 h-4.5 text-red-400" />
                  </TooltipTrigger>
                  <TooltipContent className="p-2.5 text-start">{warningInfo}</TooltipContent>
                </Tooltip>
              ) : null}
              {Info ? (
                <Tooltip>
                  <TooltipTrigger>
                    <CircleAlert className="w-4.5 h-4.5 text-slate-300" />
                  </TooltipTrigger>
                  <TooltipContent className="p-2.5 flex items-center justify-start">{Info}</TooltipContent>
                </Tooltip>
              ) : null}
            </div>
          </div>
          {description ? (
            <p className="text-sm font-normal text-slate-300/80 hover:line-clamp-none">{description}</p>
          ) : null}
        </div>
        <div className="flex items-center gap-3 mt-1">
          {RightContent ? RightContent : null}
          {onSwitch ? (
            <Switch
              disabled={disabled}
              onClick={onSwitch}
              checked={disabled ? false : (checked as boolean)}
              variant={"destructive"}
            />
          ) : null}
        </div>
      </div>
      {children ? <div className="mt-2">{children}</div> : null}
    </div>
  );
};
