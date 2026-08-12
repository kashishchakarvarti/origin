"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useUserBusinesses } from "@/hooks/use-crest-data";
import { MissionTimeline } from "@/components/mission-control/mission-timeline";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/providers/language-provider";

export default function MissionControlPage() {
  const { t, tn } = useLanguage();
  const { data: businesses = [] } = useUserBusinesses();

  return (
    <div className="space-y-8 max-w-4xl">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-3xl font-semibold tracking-tight">{t("mission.title")}</h1>
        <p className="text-white/50 mt-2">{t("mission.subtitle")}</p>
      </motion.div>

      {businesses.length === 0 ? (
        <div className="rounded-2xl border border-white/[0.06] bg-card p-10 text-center space-y-4">
          <p className="text-white/50">{t("mission.empty")}</p>
          <Link href="/opportunities">
            <Button>{t("dash.viewOpportunities")}</Button>
          </Link>
        </div>
      ) : (
        <Tabs defaultValue={businesses[0]?.id}>
          <TabsList className="flex-wrap h-auto gap-1">
            {businesses.slice(0, 6).map((biz) => {
              const label = tn(biz.name);
              return (
                <TabsTrigger key={biz.id} value={biz.id} className="text-xs">
                  {label.length > 15 ? label.slice(0, 15) + "…" : label}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {businesses.map((biz) => (
            <TabsContent key={biz.id} value={biz.id}>
              <div className="rounded-2xl border border-white/[0.06] bg-card p-8 mt-4">
                <div className="flex items-center gap-3 mb-8 flex-wrap">
                  <h2 className="text-xl font-semibold">{tn(biz.name)}</h2>
                  <Badge variant="outline">{tn(biz.country)}</Badge>
                  <Badge variant="gold">{tn(biz.category)}</Badge>
                </div>
                <MissionTimeline steps={biz.missionSteps} />
              </div>
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
}
