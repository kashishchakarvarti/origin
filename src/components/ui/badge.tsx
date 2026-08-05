import * as React from "react";
import { cn } from "@/lib/utils";

const Badge = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { variant?: "default" | "gold" | "live" | "outline" }
>(({ className, variant = "default", ...props }, ref) => {
  const variants = {
    default: "bg-white/[0.08] text-white/80",
    gold: "bg-gold/15 text-gold border border-gold/20",
    live: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20",
    outline: "border border-white/[0.06] text-white/60",
  };
  return (
    <div
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
        variants[variant],
        className
      )}
      {...props}
    />
  );
});
Badge.displayName = "Badge";

export { Badge };
