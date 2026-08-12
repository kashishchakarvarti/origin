"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Activity, ArrowRight, Users } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CrestImage } from "@/components/ui/crest-image";
import { Button } from "@/components/ui/button";
import { OnMediaChip } from "@/components/ui/on-media-chip";
import { StatusBadge } from "@/components/ui/status-badge";
import { resolveOpportunityStatus } from "@/lib/crest-status";
import { formatNumber } from "@/lib/format";
import type { Opportunity } from "@/lib/types";
import { useLanguage } from "@/providers/language-provider";
import { cn } from "@/lib/utils";

const ACTIVITY_TEMPLATES = [
  { name: "Aisha K.", actionKey: "activity.launched" },
  { name: "Marcus W.", actionKey: "activity.started" },
  { name: "Priya S.", actionKey: "activity.joined" },
  { name: "Elena R.", actionKey: "activity.opened" },
  { name: "Omar H.", actionKey: "activity.reservedCapacity" },
  { name: "Nina L.", actionKey: "activity.isPreparing" },
] as const;

interface LiveOpportunitiesProps {
  opportunities: Opportunity[];
}

export function LiveOpportunities({ opportunities }: LiveOpportunitiesProps) {
  const { t, tn } = useLanguage();
  const featured = useMemo(
    () =>
      [...opportunities]
        .sort((a, b) => b.launchScore - a.launchScore || (b.peopleStarted ?? 0) - (a.peopleStarted ?? 0))
        .slice(0, 3),
    [opportunities]
  );

  const [viewerCount, setViewerCount] = useState(128);
  const [activityIndex, setActivityIndex] = useState(0);
  const [pulseKey, setPulseKey] = useState(0);

  useEffect(() => {
    if (featured.length === 0) return;
    const tick = setInterval(() => {
      setViewerCount((n) => n + (Math.random() > 0.45 ? 1 : 0));
      setActivityIndex((i) => (i + 1) % (ACTIVITY_TEMPLATES.length * Math.max(featured.length, 1)));
      setPulseKey((k) => k + 1);
    }, 3200);
    return () => clearInterval(tick);
  }, [featured.length]);

  if (featured.length === 0) return null;

  const activityOpp = featured[activityIndex % featured.length];
  const activityPerson = ACTIVITY_TEMPLATES[activityIndex % ACTIVITY_TEMPLATES.length];
  const totalStarted = featured.reduce((s, o) => s + (o.peopleStarted ?? 0), 0);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.55 }}
      className="space-y-5"
    >
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
            </span>
            <p className="text-xs font-semibold tracking-widest uppercase text-emerald-400">
              {t("dash.active")}
            </p>
            <span className="text-xs text-white/40">·</span>
            <p className="text-xs text-white/50">
              {t("dash.viewingNow", { n: viewerCount })}
            </p>
          </div>
          <h2 className="text-2xl font-semibold tracking-tight">{t("opp.title")}</h2>
          <p className="text-sm text-white/50 max-w-xl">{t("dash.opportunitiesRanked")}</p>
        </div>
        <Link href="/opportunities" className="shrink-0">
          <Button className="gap-2 whitespace-nowrap">
            {t("common.viewAll")}
            <ArrowRight className="h-4 w-4 shrink-0" />
          </Button>
        </Link>
      </div>

      <div className="relative overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
        <AnimatePresence mode="wait">
          <motion.div
            key={pulseKey}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
            className="flex items-center gap-3 text-sm"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold/15 border border-gold/25 text-gold">
              <Activity className="h-3.5 w-3.5" />
            </span>
            <p className="text-white/80">
              <span className="font-medium text-white">{activityPerson.name}</span>{" "}
              <span className="text-white/50">{t(activityPerson.actionKey)}</span>{" "}
              <span className="text-gold font-medium">{tn(activityOpp.name)}</span>
              <span className="text-white/40"> · {tn(activityOpp.country)}</span>
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {featured.map((opp, i) => {
          const status = resolveOpportunityStatus(opp);
          return (
            <motion.div
              key={opp.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 + i * 0.08 }}
              whileHover={{ y: -4 }}
              className="group relative flex min-w-0 flex-col rounded-2xl border border-white/[0.06] bg-card transition-shadow hover:shadow-2xl hover:shadow-black/30 hover:border-gold/25"
            >
              <Link href={`/opportunities/${opp.id}`} className="flex min-w-0 flex-1 flex-col">
                <div className="relative h-36 overflow-hidden rounded-t-2xl">
                  <CrestImage
                    src={opp.image}
                    category={opp.category}
                    seed={opp.id}
                    alt={tn(opp.name)}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="320px"
                  />
                  <div className="absolute inset-0 media-scrim" />
                  <div className="absolute top-3 left-3 right-3 flex flex-wrap gap-1.5">
                    <StatusBadge status={status} onMedia />
                    <OnMediaChip variant="country">{tn(opp.country)}</OnMediaChip>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 min-w-0">
                    <p className="font-semibold on-media-text text-white drop-shadow-md truncate">{tn(opp.name)}</p>
                    <p className="text-xs on-media-text-muted text-white/80 mt-0.5 truncate">
                      {tn(opp.country)} · {tn(opp.category)}
                    </p>
                  </div>
                </div>

                <div className="flex flex-1 flex-col gap-3 p-4 pb-4 min-w-0">
                  <div className="flex items-center justify-between gap-2 text-xs min-w-0">
                    <span className="text-white/40 truncate min-w-0">{t("opp.launchScore")}</span>
                    <span className="font-semibold text-teal-300 shrink-0 tabular-nums">{opp.launchScore}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-400"
                      initial={{ width: 0 }}
                      animate={{ width: `${opp.launchScore}%` }}
                      transition={{ delay: 0.6 + i * 0.1, duration: 0.8 }}
                    />
                  </div>
                  <div className="mt-auto grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                    <p className="text-xs text-white/50 flex items-center gap-1.5 min-w-0">
                      <Users className="h-3.5 w-3.5 text-gold shrink-0" />
                      <span className="truncate">
                        <span className="tabular-nums">{formatNumber(opp.peopleStarted ?? 0)}</span>
                        {" "}
                        {t("opp.started")}
                      </span>
                    </p>
                    <span className="justify-self-end inline-flex items-center gap-1 rounded-lg bg-gold/10 px-2.5 py-1 text-xs font-medium text-gold whitespace-nowrap">
                      {t("common.view")}
                      <ArrowRight className="h-3 w-3 shrink-0" aria-hidden />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-gold/20 bg-gold/[0.06] px-5 py-4 min-w-0">
        <div className="flex items-center gap-3 text-sm min-w-0 flex-1">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold/15 border border-gold/25">
            <Users className="h-4 w-4 text-gold" />
          </div>
          <div className="min-w-0">
            <p className="font-medium text-white truncate">
              {t("dash.peopleHaveStarted", { n: formatNumber(totalStarted + viewerCount) })}
            </p>
            <p className="text-xs text-white/50 line-clamp-2">{t("dash.compareAndLaunch")}</p>
          </div>
        </div>
        <Link href="/opportunities" className="w-full sm:w-auto shrink-0">
          <Button className={cn("w-full sm:w-auto gap-2 whitespace-nowrap")}>
            {t("dash.browseOpportunities")}
            <ArrowRight className="h-4 w-4 shrink-0" />
          </Button>
        </Link>
      </div>
    </motion.section>
  );
}
