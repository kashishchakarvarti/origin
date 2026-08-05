"use client";

import { motion } from "framer-motion";
import { CrestImage } from "@/components/ui/crest-image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatINR, formatNumber } from "@/lib/format";
import type { UserBusiness } from "@/lib/types";

export function BusinessCard({ business, index }: { business: UserBusiness; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.5 }}
      className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-card transition-all duration-500 hover:border-white/[0.12]"
    >
      <div className="relative h-40 overflow-hidden">
        <CrestImage src={business.image} category={business.category} seed={business.id} alt={business.name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="400px" />
        <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <Badge variant="live">LIVE</Badge>
          <Badge variant="outline">{business.country}</Badge>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <h3 className="text-lg font-semibold text-white">{business.name}</h3>
        <div className="grid grid-cols-2 gap-3">
          <Stat label="Revenue" value={formatINR(business.revenue)} />
          <Stat label="Profit" value={formatINR(business.profit)} />
          <Stat label="Orders" value={formatNumber(business.orders)} />
          <Stat label="Inventory" value={formatNumber(business.inventory)} />
          <Stat label="Withdrawable" value={formatINR(business.withdrawable)} colSpan />
        </div>
        <Link href={`/businesses/${business.id}`}>
          <Button variant="secondary" className="w-full group/btn">
            Open
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
