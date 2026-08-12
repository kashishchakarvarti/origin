"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { RollingNumber } from "@/components/ui/rolling-number";

interface KPICardProps {
  label: string;
  value: string | number;
  index: number;
  format?: "currency" | "number";
}

export function KPICard({ label, value, index, format = "number" }: KPICardProps) {
  const numeric = typeof value === "number" ? value : Number(value) || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-card p-6 transition-all duration-500 hover:border-white/[0.12] hover:shadow-xl hover:shadow-gold/[0.03]"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-gold/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <p className="text-sm text-white/50 relative">{label}</p>
      <p className={cn("text-2xl font-semibold text-white mt-2 relative tracking-tight")}>
        <RollingNumber value={numeric} format={format} />
      </p>
    </motion.div>
  );
}
