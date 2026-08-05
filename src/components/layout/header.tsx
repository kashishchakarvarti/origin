"use client";

import { useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Check, Search } from "lucide-react";
import { useState } from "react";
import { crestStore } from "@/lib/data/store";
import { useNotifications } from "@/hooks/use-crest-data";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

export function Header({ title }: { title?: string }) {
  const { data: notifications = [] } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const queryClient = useQueryClient();
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = () => {
    crestStore.markAllNotificationsRead();
    queryClient.invalidateQueries({ queryKey: ["crest"] });
  };

  const handleMarkRead = (id: string) => {
    crestStore.markNotificationRead(id);
    queryClient.invalidateQueries({ queryKey: ["crest"] });
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/[0.06] bg-[#050505]/80 px-8 backdrop-blur-2xl">
      {title && <h1 className="text-lg font-semibold text-white">{title}</h1>}

      <div className="flex items-center gap-4 ml-auto">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64 pl-10 h-9 bg-white/[0.03]"
          />
        </div>

        <div className="relative">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.04] border border-white/[0.06] text-white/60 hover:text-white hover:bg-white/[0.08] transition-colors"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-black">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </motion.button>

          <AnimatePresence>
            {showNotifications && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-12 z-50 w-96 rounded-2xl border border-white/[0.06] bg-card shadow-2xl overflow-hidden"
                >
                  <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
                    <p className="text-sm font-semibold">Notifications</p>
                    <button
                      onClick={handleMarkAllRead}
                      className="text-xs text-gold hover:text-gold-light flex items-center gap-1"
                    >
                      <Check className="h-3 w-3" /> Mark all read
                    </button>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.slice(0, 20).map((notif) => (
                      <button
                        key={notif.id}
                        onClick={() => handleMarkRead(notif.id)}
                        className={cn(
                          "w-full text-left px-4 py-3 border-b border-white/[0.04] hover:bg-white/[0.04] transition-colors",
                          !notif.read && "bg-gold/[0.03]"
                        )}
                      >
                        <div className="flex items-start gap-2">
                          {!notif.read && <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-gold shrink-0" />}
                          <div className={cn(!notif.read ? "" : "ml-3.5")}>
                            <p className="text-sm font-medium text-white">{notif.title}</p>
                            <p className="text-xs text-white/50 mt-0.5">{notif.message}</p>
                            <p className="text-[10px] text-white/30 mt-1">
                              {new Date(notif.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
