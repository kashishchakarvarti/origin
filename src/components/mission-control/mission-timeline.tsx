"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { MISSION_STEP_KEYS } from "@/lib/constants";
import type { MissionStep } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/providers/language-provider";

interface TimelineStep {
  step: MissionStep;
  completed: boolean;
  completedAt?: string;
}

const DATE_LOCALES: Record<string, string> = {
  en: "en-US",
  hi: "hi-IN",
  es: "es-ES",
  fr: "fr-FR",
  ar: "ar-AE",
  de: "de-DE",
};

export function MissionTimeline({ steps }: { steps: TimelineStep[] }) {
  const { t, language } = useLanguage();
  const dateLocale = DATE_LOCALES[language] ?? "en-US";

  return (
    <div className="relative max-w-2xl mx-auto">
      {steps.map((item, index) => {
        const isLast = index === steps.length - 1;
        const label = t(MISSION_STEP_KEYS[item.step] ?? item.step);
        const completedDate = item.completedAt
          ? new Date(item.completedAt).toLocaleDateString(dateLocale, {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : null;

        return (
          <motion.div
            key={item.step}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.12, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative flex gap-6 pb-10"
          >
            {!isLast && (
              <div
                className={cn(
                  "absolute left-[19px] top-10 w-0.5 h-[calc(100%-24px)]",
                  item.completed ? "bg-gold/40" : "bg-white/[0.06]"
                )}
              />
            )}

            <motion.div
              initial={false}
              animate={{
                scale: item.completed ? [1, 1.2, 1] : 1,
                backgroundColor: item.completed ? "rgba(212, 175, 55, 0.15)" : "rgba(255,255,255, 0.04)",
              }}
              transition={{ duration: 0.4 }}
              className={cn(
                "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-colors duration-500",
                item.completed ? "border-gold/40" : "border-white/[0.06]"
              )}
            >
              {item.completed ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Check className="h-4 w-4 text-gold" />
                </motion.div>
              ) : (
                <span className="h-2 w-2 rounded-full bg-white/20" />
              )}
            </motion.div>

            <div className="flex-1 pt-1.5">
              <p
                className={cn(
                  "text-base font-medium transition-colors duration-300",
                  item.completed ? "text-white" : "text-white/40"
                )}
              >
                {label}
              </p>
              {item.completed && completedDate && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-white/30 mt-1"
                >
                  {t("mission.completedOn", { date: completedDate })}
                </motion.p>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
