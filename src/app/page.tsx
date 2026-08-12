"use client";

import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { WorldMap } from "@/components/landing/world-map";
import { CrestLogo } from "@/components/brand/crest-logo";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLanguage } from "@/providers/language-provider";

export default function LandingPage() {
  const { t } = useLanguage();
  const [showDemo, setShowDemo] = useState(false);

  const stats = [
    { value: "100+", labelKey: "landing.stat.models" },
    { value: "10", labelKey: "landing.stat.countries" },
    { value: "50K+", labelKey: "landing.stat.orders" },
  ] as const;

  const features = [
    { titleKey: "landing.feature.launch", descKey: "landing.feature.launchDesc" },
    { titleKey: "landing.feature.operate", descKey: "landing.feature.operateDesc" },
    { titleKey: "landing.feature.scale", descKey: "landing.feature.scaleDesc" },
  ] as const;

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gold/[0.03] rounded-full blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 w-[600px] h-[400px] bg-gold/[0.02] rounded-full blur-[100px]" />

      <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <CrestLogo size="lg" />
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm">
              {t("landing.login")}
            </Button>
          </Link>
          <Link href="/signup">
            <Button size="sm">{t("landing.getStarted")}</Button>
          </Link>
        </div>
      </nav>

      <section className="relative z-10 max-w-7xl mx-auto px-8 pt-16 pb-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-sm text-gold tracking-widest uppercase font-medium"
              >
                CrestOrigin
              </motion.p>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.05]">
                {t("landing.headline1")}
                <br />
                <span className="text-gold">{t("landing.headline2")}</span>
              </h1>
              <p className="text-lg text-white/50 max-w-md leading-relaxed">
                {t("landing.tagline")}
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link href="/signup">
                <Button size="lg">
                  {t("landing.getStarted")}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Button size="lg" variant="secondary" onClick={() => setShowDemo(true)}>
                <Play className="h-4 w-4" />
                {t("landing.watchDemo")}
              </Button>
            </div>

            <div className="flex items-center gap-8 pt-4">
              {stats.map((stat) => (
                <div key={stat.labelKey}>
                  <p className="text-2xl font-semibold text-white">{stat.value}</p>
                  <p className="text-xs text-white/40 mt-1">{t(stat.labelKey)}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="h-[400px] lg:h-[500px]"
          >
            <WorldMap />
          </motion.div>
        </div>
      </section>

      <section className="relative z-10 border-t border-white/[0.06] py-20">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={feature.titleKey}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="rounded-2xl border border-white/[0.06] bg-card/50 p-8 backdrop-blur-sm"
              >
                <p className="text-gold text-sm font-medium tracking-widest uppercase mb-3">
                  {t(feature.titleKey)}
                </p>
                <p className="text-white/60 leading-relaxed">{t(feature.descKey)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/[0.06] py-8">
        <div className="max-w-7xl mx-auto px-8 flex items-center justify-between">
          <p className="text-xs text-white/30">{t("landing.copyright")}</p>
          <p className="text-xs text-white/30">{t("landing.footerTag")}</p>
        </div>
      </footer>

      <Dialog open={showDemo} onOpenChange={setShowDemo}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{t("landing.demoTitle")}</DialogTitle>
            <DialogDescription>{t("landing.demoDesc")}</DialogDescription>
          </DialogHeader>
          <div className="aspect-video rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold/10 border border-gold/20">
                <Play className="h-6 w-6 text-gold ml-1" />
              </div>
              <p className="text-sm text-white/50">{t("landing.demoHint")}</p>
              <Link href="/signup">
                <Button onClick={() => setShowDemo(false)}>{t("landing.startFree")}</Button>
              </Link>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
