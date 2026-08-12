"use client";

import { motion } from "framer-motion";
import { ArrowRight, CalendarDays } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { CrestImage } from "@/components/ui/crest-image";
import { Button } from "@/components/ui/button";
import { OnMediaChip } from "@/components/ui/on-media-chip";
import { formatFestivalChip, translateFestivalName } from "@/lib/festival-label";
import { daysUntilFestival, sortByFestivalDate } from "@/lib/festival-opportunities";
import { formatNumber } from "@/lib/format";
import type { Opportunity } from "@/lib/types";
import { useLanguage } from "@/providers/language-provider";

interface UpcomingFestivalsProps {
  opportunities: Opportunity[];
}

export function UpcomingFestivals({ opportunities }: UpcomingFestivalsProps) {
  const { t, tn, language } = useLanguage();

  const upcoming = useMemo(() => {
    const sorted = sortByFestivalDate(
      opportunities.filter((o) => o.festivalName && o.festivalDate)
    );
    return sorted.slice(0, 3);
  }, [opportunities]);

  if (upcoming.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.28, duration: 0.55 }}
      className="space-y-5"
    >
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-gold" />
            <p className="text-xs font-semibold tracking-widest uppercase text-gold">
              {t("dash.festivalsLabel")}
            </p>
          </div>
          <h2 className="text-2xl font-semibold tracking-tight">{t("dash.festivalsTitle")}</h2>
          <p className="text-sm text-white/50 max-w-xl">{t("dash.festivalsSubtitle")}</p>
        </div>
        <Button asChild variant="secondary" size="sm">
          <Link href="/festivals">
            {t("common.viewAll")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {upcoming.map((opp, i) => {
          const days = opp.festivalDate ? daysUntilFestival(opp.festivalDate) : 0;
          const countdown =
            days < 0
              ? t("fest.passed")
              : days === 0
                ? t("fest.today")
                : t("fest.daysAway", { n: days });

          return (
            <motion.div
              key={opp.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.32 + i * 0.08 }}
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
                    <OnMediaChip variant="neutral">
                      {opp.festivalName && opp.festivalDate
                        ? formatFestivalChip(opp.festivalName, opp.festivalDate, t, language)
                        : tn(opp.country)}
                    </OnMediaChip>
                    <OnMediaChip variant="country">{tn(opp.country)}</OnMediaChip>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 min-w-0">
                    <p className="font-semibold on-media-text text-white drop-shadow-md truncate">
                      {opp.festivalName
                        ? translateFestivalName(opp.festivalName, t)
                        : tn(opp.name)}
                    </p>
                    <p className="text-xs on-media-text-muted text-white/80 mt-0.5 truncate">
                      {tn(opp.name)} · {tn(opp.category)}
                    </p>
                  </div>
                </div>

                <div className="flex flex-1 flex-col gap-3 p-4 min-w-0">
                  <p className="text-sm text-gold font-medium">{countdown}</p>
                  <div className="mt-auto flex items-center justify-between gap-2 text-xs text-white/50">
                    <span className="truncate">
                      {t("opp.launchScore")}{" "}
                      <span className="text-teal-300 font-semibold tabular-nums">{opp.launchScore}</span>
                    </span>
                    <span className="tabular-nums shrink-0">
                      {formatNumber(opp.peopleStarted ?? 0)} {t("opp.started")}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}
