"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type OnMediaChipVariant =
  | "country"
  | "category"
  | "neutral"
  | "live"
  | "pending"
  | "growing";

const variantClass: Record<OnMediaChipVariant, string> = {
  country: "on-media-chip on-media-chip--country",
  category: "on-media-chip on-media-chip--category",
  neutral: "on-media-chip on-media-chip--neutral",
  live: "on-media-chip on-media-chip--live",
  pending: "on-media-chip on-media-chip--pending",
  growing: "on-media-chip on-media-chip--growing",
};

/** High-contrast chip for badges over photos — theme-aware for light & dark */
export function OnMediaChip({
  children,
  variant = "neutral",
  className,
}: {
  children: ReactNode;
  variant?: OnMediaChipVariant;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[10px] sm:text-xs font-semibold tracking-wide shadow-lg shadow-black/35 backdrop-blur-md",
        variantClass[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
