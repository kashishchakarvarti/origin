"use client";

import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { CalendarDays, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { LaunchBusinessDialog } from "@/components/opportunities/launch-business-dialog";
import { OpportunityCard } from "@/components/opportunities/opportunity-card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORIES, COUNTRIES } from "@/lib/constants";
import { crestStore } from "@/lib/data/store";
import { sortByFestivalDate } from "@/lib/festival-opportunities";
import { useFestivalOpportunities } from "@/hooks/use-crest-data";
import { useLanguage } from "@/providers/language-provider";
import { useToast } from "@/providers/toast-provider";
import type { Opportunity } from "@/lib/types";

export default function FestivalsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [country, setCountry] = useState("all");
  const [launchTarget, setLaunchTarget] = useState<Opportunity | null>(null);
  const { data: festivalOpps = [], isLoading } = useFestivalOpportunities({
    category,
    country,
    search,
  });
  const queryClient = useQueryClient();
  const router = useRouter();
  const { toast } = useToast();
  const { t, tn } = useLanguage();

  const opportunities = useMemo(() => sortByFestivalDate(festivalOpps), [festivalOpps]);

  const launchProducts = useMemo(
    () => (launchTarget ? crestStore.getOpportunityProducts(launchTarget.id) : []),
    [launchTarget]
  );

  const handleLaunchClick = (id: string) => {
    const opp = crestStore.getOpportunity(id);
    if (opp) setLaunchTarget(opp);
  };

  const handleConfirmLaunch = (selectedProductIds: string[]) => {
    if (!launchTarget) return;
    const business = crestStore.launchBusiness(launchTarget.id, selectedProductIds);
    if (business) {
      queryClient.invalidateQueries({ queryKey: ["crest"] });
      toast({
        title: t("opp.launched"),
        description: `${tn(business.name)} ${t("opp.nowLive")}`,
        variant: "success",
      });
      setLaunchTarget(null);
      router.push(`/businesses/${business.id}`);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
        <div className="flex items-center gap-2 text-gold">
          <CalendarDays className="h-5 w-5" />
          <p className="text-xs font-semibold tracking-widest uppercase">{t("fest.label")}</p>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight">{t("fest.title")}</h1>
        <p className="text-white/50 mt-1 max-w-2xl">{t("fest.subtitle")}</p>
      </motion.div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
          <Input
            placeholder={t("fest.search")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder={t("common.category")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("common.all")}</SelectItem>
            {CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>
                {tn(c)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={country} onValueChange={setCountry}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder={t("common.country")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("common.all")}</SelectItem>
            {COUNTRIES.map((c) => (
              <SelectItem key={c} value={c}>
                {tn(c)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-96 rounded-2xl bg-white/[0.04] animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {opportunities.map((opp, i) => (
            <OpportunityCard key={opp.id} opportunity={opp} index={i} onLaunch={handleLaunchClick} />
          ))}
        </div>
      )}

      {!isLoading && opportunities.length === 0 && (
        <div className="text-center py-20 text-white/40">{t("fest.noResults")}</div>
      )}

      <LaunchBusinessDialog
        opportunity={launchTarget}
        products={launchProducts}
        open={!!launchTarget}
        onOpenChange={(open) => !open && setLaunchTarget(null)}
        onLaunch={handleConfirmLaunch}
      />
    </div>
  );
}
