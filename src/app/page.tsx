"use client";

import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { WorldMap } from "@/components/landing/world-map";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function LandingPage() {
  const [showDemo, setShowDemo] = useState(false);

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gold/[0.03] rounded-full blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 w-[600px] h-[400px] bg-gold/[0.02] rounded-full blur-[100px]" />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/10 border border-gold/20">
            <span className="text-gold font-bold">C</span>
          </div>
          <div>
            <p className="text-sm font-semibold tracking-tight">CREST OS</p>
            <p className="text-[10px] text-white/40 tracking-widest uppercase">CrestOrigin</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Login
            </Button>
          </Link>
          <Link href="/signup">
            <Button size="sm">Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
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
                Launch Your
                <br />
                <span className="text-gold">Global Business.</span>
              </h1>
              <p className="text-lg text-white/50 max-w-md leading-relaxed">
                Launch. Operate. Scale Globally.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link href="/signup">
                <Button size="lg">
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Button size="lg" variant="secondary" onClick={() => setShowDemo(true)}>
                <Play className="h-4 w-4" />
                Watch Demo
              </Button>
            </div>

            <div className="flex items-center gap-8 pt-4">
              {[
                { value: "100+", label: "Business Models" },
                { value: "10", label: "Countries" },
                { value: "50K+", label: "Orders Processed" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-semibold text-white">{stat.value}</p>
                  <p className="text-xs text-white/40 mt-1">{stat.label}</p>
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

      {/* Features strip */}
      <section className="relative z-10 border-t border-white/[0.06] py-20">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Launch",
                desc: "Choose from 100+ curated business opportunities across 10 global markets.",
              },
              {
                title: "Operate",
                desc: "Full-stack commerce operations — inventory, branding, marketplace, and support.",
              },
              {
                title: "Scale",
                desc: "AI-powered intelligence to expand into new countries and categories.",
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="rounded-2xl border border-white/[0.06] bg-card/50 p-8 backdrop-blur-sm"
              >
                <p className="text-gold text-sm font-medium tracking-widest uppercase mb-3">
                  {feature.title}
                </p>
                <p className="text-white/60 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/[0.06] py-8">
        <div className="max-w-7xl mx-auto px-8 flex items-center justify-between">
          <p className="text-xs text-white/30">© 2026 CrestOrigin. All rights reserved.</p>
          <p className="text-xs text-white/30">CREST OS — Launch. Operate. Scale Globally.</p>
        </div>
      </footer>

      <Dialog open={showDemo} onOpenChange={setShowDemo}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>CREST OS Demo</DialogTitle>
            <DialogDescription>
              See how entrepreneurs launch global commerce businesses with CREST OS.
            </DialogDescription>
          </DialogHeader>
          <div className="aspect-video rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold/10 border border-gold/20">
                <Play className="h-6 w-6 text-gold ml-1" />
              </div>
              <p className="text-sm text-white/50">
                Interactive demo — sign up to explore the full platform
              </p>
              <Link href="/signup">
                <Button onClick={() => setShowDemo(false)}>Start Free</Button>
              </Link>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
