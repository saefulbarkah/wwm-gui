import { cn } from "@/lib/utils";
import { ComponentProps } from "react";

function FeatureWrapper({ children, className, ...props }: ComponentProps<"div">) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-5 items-start", className)} {...props}>
      {children}
    </div>
  );
}

export default FeatureWrapper;
