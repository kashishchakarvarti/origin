"use client";

import { motion } from "framer-motion";
import {
  Building2,
  Headphones,
  LayoutDashboard,
  Rocket,
  Sparkles,
  User,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/lib/constants";
import { useLanguage } from "@/providers/language-provider";

const iconMap = {
  LayoutDashboard,
  Sparkles,
  Building2,
  Rocket,
  Wallet,
  User,
  Headphones,
};

export function Sidebar() {
  const pathname = usePathname();
  const { t } = useLanguage();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-[260px] flex-col border-r border-white/[0.06] bg-[#050505]/80 backdrop-blur-2xl">
      <div className="flex h-16 items-center px-6 border-b border-white/[0.06]">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold/10 border border-gold/20">
            <span className="text-gold font-bold text-sm">C</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-white tracking-tight">CREST OS</p>
            <p className="text-[10px] text-white/40 tracking-widest uppercase">CrestOrigin</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-3 py-6 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = iconMap[item.icon as keyof typeof iconMap];
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300",
                  isActive
                    ? "text-white bg-white/[0.08]"
                    : "text-white/50 hover:text-white/80 hover:bg-white/[0.04]"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 rounded-full bg-gold"
                  />
                )}
                <Icon className="h-4 w-4 shrink-0" />
                <span className="truncate">{t(item.labelKey)}</span>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/[0.06]">
        <Link href="/build">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center gap-2 rounded-xl bg-gold/10 border border-gold/20 px-4 py-3 text-sm font-medium text-gold cursor-pointer transition-colors hover:bg-gold/15"
          >
            <Sparkles className="h-4 w-4" />
            {t("nav.build")}
          </motion.div>
        </Link>
      </div>
    </aside>
  );
}
