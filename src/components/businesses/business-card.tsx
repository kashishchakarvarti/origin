"use client";

import { motion } from "framer-motion";
import { CrestImage } from "@/components/ui/crest-image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OnMediaChip } from "@/components/ui/on-media-chip";
import { TranslatedStatus } from "@/components/ui/translated-status";
import type { UserBusiness } from "@/lib/types";
import { useLanguage } from "@/providers/language-provider";
import { RollingNumber } from "@/components/ui/rolling-number";

const STATUS_VARIANT = {
  live: "live",
  pending: "pending",
  growing: "growing",
} as const;

export function BusinessCard({ business, index }: { business: UserBusiness; index: number }) {
  const { t, tn } = useLanguage();
  const statusVariant = STATUS_VARIANT[business.status] ?? "live";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.5 }}
      className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-card crest-card-lift transition-all duration-500 hover:border-white/[0.12]"
    >
      <div className="relative h-40 overflow-hidden">
        <CrestImage
          src={business.image}
          category={business.category}
          seed={business.id}
          alt={tn(business.name)}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="400px"
        />
        <div className="absolute inset-0 media-scrim" />
        <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center gap-2">
          <OnMediaChip variant={statusVariant} className="uppercase">
            <TranslatedStatus kind="biz" status={business.status} />
          </OnMediaChip>
          <OnMediaChip variant="country">{tn(business.country)}</OnMediaChip>
          <OnMediaChip variant="category">{tn(business.category)}</OnMediaChip>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <h3 className="text-lg font-semibold text-white">{tn(business.name)}</h3>
        <div className="grid grid-cols-2 gap-3">
          <Stat label={t("biz.revenue")} value={business.revenue} format="currency" />
          <Stat label={t("biz.profit")} value={business.profit} format="currency" />
          <Stat label={t("common.orders")} value={business.orders} />
          <Stat label={t("biz.inventory")} value={business.inventory} />
          <Stat label={t("biz.withdrawable")} value={business.withdrawable} format="currency" colSpan />
        </div>
        <Link href={`/businesses/${business.id}`}>
          <Button variant="secondary" className="w-full group/btn">
            {t("common.continue")}
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}

function Stat({
  label,
  value,
  format = "number",
  colSpan,
}: {
  label: string;
  value: number;
  format?: "currency" | "number";
  colSpan?: boolean;
}) {
  return (
    <div className={colSpan ? "col-span-2" : ""}>
      <p className="text-[11px] text-white/40 uppercase tracking-wider">{label}</p>
      <p className="text-sm font-medium text-white/90 mt-0.5">
        <RollingNumber value={value} format={format} />
      </p>
    </div>
  );
}
