"use client";

import { motion } from "framer-motion";
import { ArrowRight, Brain } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/ui/status-badge";
import { resolveIntelligenceStatus } from "@/lib/crest-status";
import type { IntelligenceInsight } from "@/lib/types";
import { useLanguage } from "@/providers/language-provider";

/** Category/country placeholders for each insight id */
const INSIGHT_VARS: Record<string, { category: string; country: string }> = {
  homeUsa: { category: "Home", country: "USA" },
  beautyUae: { category: "Beauty", country: "UAE" },
  petCanada: { category: "Pet", country: "Canada" },
  kitchenGermany: { category: "Kitchen", country: "Germany" },
  fitnessAustralia: { category: "Fitness", country: "Australia" },
};

function resolveInsightId(insight: IntelligenceInsight): string | undefined {
  if (insight.id) return insight.id;
  // Fallback for older stored data without id
  const match = Object.entries(INSIGHT_VARS).find(([, v]) =>
    insight.insight.includes(v.country) && insight.insight.includes(v.category)
  );
  return match?.[0];
}

export function IntelligenceCard({ insight }: { insight: IntelligenceInsight }) {
  const { t, tn } = useLanguage();
  const status = resolveIntelligenceStatus(insight);
  const id = resolveInsightId(insight);
  const vars = id ? INSIGHT_VARS[id] : undefined;

  const insightText =
    id && vars
      ? t(`intelligence.insight.${id}`, {
          category: tn(vars.category),
          country: tn(vars.country),
        })
      : insight.insight;

  const actionText =
    id && vars
      ? t(`intelligence.action.${id}`, {
          category: tn(vars.category),
          country: tn(vars.country),
        })
      : insight.action;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.6 }}
      className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-card p-8"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-gold/[0.03] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex-1 space-y-4 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold/10 border border-gold/20">
              <Brain className="h-4 w-4 text-gold" />
            </div>
            <span className="text-xs font-medium text-gold tracking-widest uppercase">
              {t("intelligence.brand")}
            </span>
            <StatusBadge status={status} />
          </div>
          <p className="text-lg text-white/90 leading-relaxed max-w-xl">{insightText}</p>
          <div className="space-y-2">
            <p className="text-sm text-white/50">
              {t("intelligence.nextStep")}{" "}
              <span className="text-white/80">{actionText}</span>
            </p>
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-sm text-white/50 shrink-0">{t("intelligence.confidence")}</span>
              <div className="flex-1 max-w-[200px] min-w-0">
                <Progress value={insight.confidence} className="h-1.5" />
              </div>
              <span className="text-sm font-semibold text-gold shrink-0">{insight.confidence}%</span>
            </div>
          </div>
        </div>
        <Link href="/opportunities" className="shrink-0">
          <Button size="lg" className="gap-2 whitespace-nowrap">
            {t("dash.viewOpportunities")}
            <ArrowRight className="h-4 w-4 shrink-0" />
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}
