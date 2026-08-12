"use client";

import { cn } from "@/lib/utils";

interface CrestLogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  showWordmark?: boolean;
}

const sizes = {
  sm: { box: "h-8 w-8" },
  md: { box: "h-9 w-9" },
  lg: { box: "h-10 w-10" },
};

/** C path: upper opening → left curve → lower opening (viewBox 0 0 40 40) */
const C_PATH =
  "M30 9.5 C26 7.2, 21 6.2, 16.5 7.4 C10.2 9.2, 6.2 14.2, 6.2 20 C6.2 25.8, 10.2 30.8, 16.5 32.6 C21 33.8, 26 32.8, 30 30.5";

export function CrestLogo({ size = "md", className, showWordmark = true }: CrestLogoProps) {
  const s = sizes[size];
  const gradId = `crestCGrad-${size}`;

  return (
    <div className={cn("flex items-center gap-3 group", className)}>
      <div
        className={cn(
          "relative flex items-center justify-center rounded-xl bg-gold/10 border border-gold/20 overflow-hidden crest-logo-vibe",
          s.box
        )}
      >
        <svg
          className="relative z-10 w-[78%] h-[78%] overflow-visible"
          viewBox="0 0 40 40"
          fill="none"
          aria-label="CREST"
        >
          {/* Fixed solid C — does not animate */}
          <path
            d={C_PATH}
            stroke={`url(#${gradId})`}
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />

          {/* Star runs top → bottom along the fixed C */}
          <g className="crest-traveling-star">
            <path
              d="M0 -3.2 L0.85 -1 L3.2 -0.75 L1.4 0.75 L1.9 3.1 L0 1.9 L-1.9 3.1 L-1.4 0.75 L-3.2 -0.75 L-0.85 -1 Z"
              fill="#fff4c4"
              stroke="#d4af37"
              strokeWidth="0.35"
            />
          </g>

          <defs>
            <linearGradient id={gradId} x1="30" y1="8" x2="16" y2="33">
              <stop offset="0%" stopColor="#e8c547" />
              <stop offset="55%" stopColor="#d4af37" />
              <stop offset="100%" stopColor="#b8922a" />
            </linearGradient>
          </defs>
        </svg>
        <span className="crest-vibe-glow" aria-hidden />
      </div>
      {showWordmark && (
        <div>
          <p className="crest-logo-wordmark text-sm font-semibold text-white tracking-tight">CREST OS</p>
          <p className="crest-logo-sub text-[10px] text-white/40 tracking-widest uppercase">CrestOrigin</p>
        </div>
      )}
    </div>
  );
}
