"use client";

import { motion } from "framer-motion";
import { useUserBusinesses } from "@/hooks/use-crest-data";
import { MissionTimeline } from "@/components/mission-control/mission-timeline";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function MissionControlPage() {
  const { data: businesses = [] } = useUserBusinesses();

  return (
    <div className="space-y-8 max-w-4xl">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-3xl font-semibold tracking-tight">Mission Control</h1>
        <p className="text-white/50 mt-2">Track your business launch progress</p>
      </motion.div>

      <Tabs defaultValue={businesses[0]?.id}>
        <TabsList className="flex-wrap h-auto gap-1">
          {businesses.slice(0, 6).map((biz) => (
            <TabsTrigger key={biz.id} value={biz.id} className="text-xs">
              {biz.name.length > 15 ? biz.name.slice(0, 15) + "…" : biz.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {businesses.map((biz) => (
          <TabsContent key={biz.id} value={biz.id}>
            <div className="rounded-2xl border border-white/[0.06] bg-card p-8 mt-4">
              <div className="flex items-center gap-3 mb-8">
                <h2 className="text-xl font-semibold">{biz.name}</h2>
                <Badge variant="outline">{biz.country}</Badge>
                <Badge variant="gold">{biz.category}</Badge>
              </div>
              <MissionTimeline steps={biz.missionSteps} />
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
