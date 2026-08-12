"use client";

import { useEffect, useRef, useState } from "react";
import { formatINR, formatNumber, formatUSD } from "@/lib/format";
import { cn } from "@/lib/utils";

const DURATION_MS = 1200;

type NumberFormat = "currency" | "number" | "usd";

function formatValue(n: number, format: NumberFormat): string {
  if (format === "currency") return formatINR(n);
  if (format === "usd") return formatUSD(n);
  return formatNumber(n);
}

/**
 * Smooth count-up for live KPI values — same formatted look, no flash.
 * Tweens the numeric value then formats each frame (~1.2s).
 */
export function RollingNumber({
  value,
  format = "number",
  className,
}: {
  value: number;
  format?: NumberFormat;
  className?: string;
}) {
  const prevRef = useRef<number | null>(null);
  const [display, setDisplay] = useState(value);
  const rafRef = useRef(0);

  useEffect(() => {
    const from = prevRef.current;
    prevRef.current = value;

    // First paint — show final value, no tween
    if (from === null || from === value) {
      setDisplay(value);
      return;
    }

    const start = performance.now();
    const delta = value - from;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION_MS);
      const eased = 1 - (1 - t) ** 3;
      setDisplay(Math.round(from + delta * eased));
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setDisplay(value);
      }
    };

    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [value]);

  return (
    <span className={cn("tabular-nums", className)} aria-label={formatValue(value, format)}>
      {formatValue(display, format)}
    </span>
  );
}
