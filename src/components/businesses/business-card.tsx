"use client";

import { motion } from "framer-motion";
import { CrestImage } from "@/components/ui/crest-image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatINR, formatNumber } from "@/lib/format";
import type { UserBusiness } from "@/lib/types";
import { useLanguage } from "@/providers/language-provider";

export function BusinessCard({ business, index }: { business: UserBusiness; index: number }) {
  const { t, tn } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.5 }}
      className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-card transition-all duration-500 hover:border-white/[0.12]"
    >
      <div className="relative h-40 overflow-hidden">
        <CrestImage src={business.image} category={business.category} seed={business.id} alt={tn(business.name)} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="400px" />
        <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <Badge variant="live">{t("common.live")}</Badge>
          <Badge variant="outline">{tn(business.country)}</Badge>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <h3 className="text-lg font-semibold text-white">{tn(business.name)}</h3>
        <div className="grid grid-cols-2 gap-3">
          <Stat label={t("biz.revenue")} value={formatINR(business.revenue)} />
          <Stat label={t("biz.profit")} value={formatINR(business.profit)} />
          <Stat label={t("common.orders")} value={formatNumber(business.orders)} />
          <Stat label={t("biz.inventory")} value={formatNumber(business.inventory)} />
          <Stat label={t("biz.withdrawable")} value={formatINR(business.withdrawable)} colSpan />
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

function Stat({ label, value, colSpan }: { label: string; value: string; colSpan?: boolean }) {
  return (
    <div className={colSpan ? "col-span-2" : ""}>
      <p className="text-[11px] text-white/40 uppercase tracking-wider">{label}</p>
      <p className="text-sm font-medium text-white/90 mt-0.5">{value}</p>
    </div>
  );
}
