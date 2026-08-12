"use client";

import { motion } from "framer-motion";
import { CrestImage } from "@/components/ui/crest-image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { OnMediaChip } from "@/components/ui/on-media-chip";
import { StatusBadge } from "@/components/ui/status-badge";
import { resolveOpportunityStatus } from "@/lib/crest-status";
import { formatINR, formatNumber, formatUSD } from "@/lib/format";
import type { Opportunity } from "@/lib/types";
import { useLanguage } from "@/providers/language-provider";

interface OpportunityCardProps {
  opportunity: Opportunity;
  index: number;
  onLaunch?: (id: string) => void;
}

export function OpportunityCard({ opportunity, index, onLaunch }: OpportunityCardProps) {
  const { t, tn } = useLanguage();
  const status = resolveOpportunityStatus(opportunity);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: (index % 12) * 0.04, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-card transition-all duration-500 hover:border-white/[0.12] hover:shadow-2xl hover:shadow-black/40"
    >
      <Link href={`/opportunities/${opportunity.id}`}>
        <div className="relative h-48 overflow-hidden">
          <CrestImage
            src={opportunity.image}
            category={opportunity.category}
            seed={opportunity.id}
            alt={tn(opportunity.name)}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-black/35" />
          <div className="absolute top-4 left-4 right-4 flex flex-wrap gap-2">
            <StatusBadge status={status} onMedia />
            <OnMediaChip variant="country">{tn(opportunity.country)}</OnMediaChip>
            <OnMediaChip variant="category">{tn(opportunity.category)}</OnMediaChip>
          </div>
        </div>
      </Link>

      <div className="p-6 space-y-4">
        <Link href={`/opportunities/${opportunity.id}`}>
          <h3 className="text-lg font-semibold text-white group-hover:text-gold transition-colors">
            {tn(opportunity.name)}
          </h3>
        </Link>

        <div className="grid grid-cols-2 gap-3">
          <Metric label={t("opp.launchScore")} value={`${opportunity.launchScore}`} highlight />
          <Metric label={t("opp.crestPrice")} value={formatINR(opportunity.crestPrice)} />
          <Metric label={t("opp.sellingPrice")} value={formatUSD(opportunity.recommendedSellingPrice)} />
          <Metric label={t("opp.monthlyOrders")} value={formatNumber(opportunity.monthlyOrders)} />
          <Metric label={t("opp.minLaunch")} value={formatINR(opportunity.minimumLaunchCost)} />
          <Metric label={t("opp.capacity")} value={`${opportunity.availableCapacity}%`} />
        </div>

        <div className="rounded-xl border border-gold/15 bg-gold/[0.05] px-3 py-2">
          <p className="text-[11px] text-white/40 uppercase tracking-wider">{t("opp.entrepreneurs")}</p>
          <p className="text-sm font-medium text-gold mt-0.5">
            {formatNumber(opportunity.peopleStarted ?? 0)} {t("opp.started")}
          </p>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-xs text-white/40">
            <span>{t("opp.availableCapacity")}</span>
            <span>{opportunity.availableCapacity}%</span>
          </div>
          <Progress value={opportunity.availableCapacity} className="h-1" />
        </div>

        <Button
          className="w-full"
          onClick={(e) => {
            e.preventDefault();
            onLaunch?.(opportunity.id);
          }}
        >
          {t("common.launch")}
        </Button>
      </div>
    </motion.div>
  );
}

function Metric({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div>
      <p className="text-[11px] text-white/40 uppercase tracking-wider">{label}</p>
      <p className={`text-sm font-medium mt-0.5 ${highlight ? "text-gold" : "text-white/90"}`}>
        {value}
      </p>
    </div>
  );
}
