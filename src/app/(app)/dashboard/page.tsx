"use client";

import { motion } from "framer-motion";
import { useCrestData, useOpportunities } from "@/hooks/use-crest-data";
import { useAuth } from "@/providers/auth-provider";
import { useLanguage } from "@/providers/language-provider";
import { KPICard } from "@/components/dashboard/kpi-card";
import { IntelligenceCard } from "@/components/dashboard/intelligence-card";
import { LiveOpportunities } from "@/components/dashboard/live-opportunities";

export default function DashboardPage() {
  const { data, isLoading } = useCrestData();
  const { data: opportunities = [] } = useOpportunities();
  const { name } = useAuth();
  const { t } = useLanguage();
  const stats = data?.dashboardStats;
  const intelligence = data?.intelligence;

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? t("dash.greetingMorning") : hour < 17 ? t("dash.greetingAfternoon") : t("dash.greetingEvening");

  const kpis = stats
    ? [
        { label: t("dash.businesses"), value: stats.businesses, format: "number" as const },
        { label: t("dash.revenue"), value: stats.revenue, format: "currency" as const },
        { label: t("dash.profit"), value: stats.profit, format: "currency" as const },
        { label: t("dash.withdrawable"), value: stats.withdrawable, format: "currency" as const },
        { label: t("dash.countries"), value: stats.countries, format: "number" as const },
        { label: t("dash.orders"), value: stats.orders, format: "number" as const },
      ]
    : [];

  if (isLoading) {
    return (
      <div className="space-y-10 max-w-7xl animate-pulse">
        <div className="space-y-2">
          <div className="h-5 w-32 bg-white/[0.06] rounded" />
          <div className="h-10 w-48 bg-white/[0.06] rounded" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-24 rounded-2xl bg-white/[0.04]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-white/50 text-lg">{greeting},</p>
        <h1 className="text-4xl font-semibold tracking-tight mt-1">{name || t("dash.fallbackName")}</h1>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpis.map((kpi, i) => (
          <KPICard key={kpi.label} label={kpi.label} value={kpi.value} index={i} format={kpi.format} />
        ))}
      </div>

      {intelligence && <IntelligenceCard insight={intelligence} />}

      <LiveOpportunities opportunities={opportunities} />
    </div>
  );
}
