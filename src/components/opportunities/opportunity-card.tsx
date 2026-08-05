"use client";

import { motion } from "framer-motion";
import { CrestImage } from "@/components/ui/crest-image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { formatINR, formatNumber, formatUSD } from "@/lib/format";
import type { Opportunity } from "@/lib/types";

interface OpportunityCardProps {
  opportunity: Opportunity;
  index: number;
  onLaunch?: (id: string) => void;
}

export function OpportunityCard({ opportunity, index, onLaunch }: OpportunityCardProps) {
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
            alt={opportunity.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
          <div className="absolute top-4 left-4 flex gap-2">
            <Badge variant="outline">{opportunity.country}</Badge>
            <Badge variant="gold">{opportunity.category}</Badge>
          </div>
        </div>
      </Link>

      <div className="p-6 space-y-4">
        <Link href={`/opportunities/${opportunity.id}`}>
          <h3 className="text-lg font-semibold text-white group-hover:text-gold transition-colors">
            {opportunity.name}
          </h3>
        </Link>

        <div className="grid grid-cols-2 gap-3">
          <Metric label="Launch Score" value={`${opportunity.launchScore}`} highlight />
          <Metric label="CREST Price" value={formatINR(opportunity.crestPrice)} />
          <Metric label="Selling Price" value={formatUSD(opportunity.recommendedSellingPrice)} />
          <Metric label="Monthly Orders" value={formatNumber(opportunity.monthlyOrders)} />
          <Metric label="Min. Launch" value={formatINR(opportunity.minimumLaunchCost)} />
          <Metric label="Capacity" value={`${opportunity.availableCapacity}%`} />
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-xs text-white/40">
            <span>Available Capacity</span>
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
          Launch Business
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
