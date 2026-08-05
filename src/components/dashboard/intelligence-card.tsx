"use client";

import { motion } from "framer-motion";
import { ArrowRight, Brain } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { IntelligenceInsight } from "@/lib/types";

export function IntelligenceCard({ insight }: { insight: IntelligenceInsight }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.6 }}
      className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-card p-8"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-gold/[0.03] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold/10 border border-gold/20">
              <Brain className="h-4 w-4 text-gold" />
            </div>
            <span className="text-xs font-medium text-gold tracking-widest uppercase">
              CREST Intelligence
            </span>
          </div>
          <p className="text-lg text-white/90 leading-relaxed max-w-xl">{insight.insight}</p>
          <div className="space-y-2">
            <p className="text-sm text-white/50">
              Recommended Action:{" "}
              <span className="text-white/80">{insight.action}</span>
            </p>
            <div className="flex items-center gap-3">
              <span className="text-sm text-white/50">Confidence</span>
              <div className="flex-1 max-w-[200px]">
                <Progress value={insight.confidence} className="h-1.5" />
              </div>
              <span className="text-sm font-semibold text-gold">{insight.confidence}%</span>
            </div>
          </div>
        </div>
        <Link href="/opportunities">
          <Button size="lg" className="shrink-0">
            View Opportunities
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}
