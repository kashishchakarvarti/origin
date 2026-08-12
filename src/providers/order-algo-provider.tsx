"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect, type ReactNode } from "react";
import { crestStore } from "@/lib/data/store";
import { useAuth } from "@/providers/auth-provider";

const TICK_MS = 10 * 1000; // every 10 seconds

/**
 * Automatically assigns fake orders via the demand algorithm every 10 seconds
 * while the user is signed in — keeps dashboard KPIs moving.
 */
export function OrderAlgoProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (isLoading || !isAuthenticated) return;

    const runTick = () => {
      crestStore.tickOrderAlgo();
      // Push a fresh clone so UI updates without a full page reload
      // (store mutates in place; React Query needs a new reference)
      const fresh = structuredClone(crestStore.getData());
      queryClient.setQueryData(["crest", "data"], fresh);
      queryClient.invalidateQueries({ queryKey: ["crest"] });
    };

    // First tick soon after login so stats start moving
    const kickoff = window.setTimeout(runTick, 2500);
    const interval = window.setInterval(runTick, TICK_MS);

    return () => {
      window.clearTimeout(kickoff);
      window.clearInterval(interval);
    };
  }, [isAuthenticated, isLoading, queryClient]);

  return <>{children}</>;
}
