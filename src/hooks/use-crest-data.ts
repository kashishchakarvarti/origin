"use client";

import { useQuery } from "@tanstack/react-query";
import { crestStore } from "@/lib/data/store";
import type { AppData } from "@/lib/types";

/** Fresh clone so React Query always detects store mutations. */
function snapshot<T>(value: T): T {
  return structuredClone(value);
}

export function useCrestData() {
  return useQuery<AppData>({
    queryKey: ["crest", "data"],
    queryFn: () => snapshot(crestStore.getData()),
  });
}

export function useOpportunities(filters?: {
  category?: string;
  country?: string;
  search?: string;
  festival?: "only" | "exclude" | "all";
}) {
  return useQuery({
    queryKey: ["crest", "opportunities", filters],
    queryFn: () => snapshot(crestStore.getOpportunities(filters)),
  });
}

export function useFestivalOpportunities(filters?: { category?: string; country?: string; search?: string }) {
  return useOpportunities({ ...filters, festival: "only" });
}

export function useOpportunity(id: string) {
  return useQuery({
    queryKey: ["crest", "opportunity", id],
    queryFn: () => {
      const opp = crestStore.getOpportunity(id);
      return opp ? snapshot(opp) : undefined;
    },
    enabled: !!id,
  });
}

export function useUserBusinesses() {
  return useQuery({
    queryKey: ["crest", "businesses"],
    queryFn: () => snapshot(crestStore.getUserBusinesses()),
  });
}

export function useUserBusiness(id: string) {
  return useQuery({
    queryKey: ["crest", "business", id],
    queryFn: () => {
      const biz = crestStore.getUserBusiness(id);
      return biz ? snapshot(biz) : undefined;
    },
    enabled: !!id,
  });
}

export function useProducts(filters?: { category?: string; search?: string }) {
  return useQuery({
    queryKey: ["crest", "products", filters],
    queryFn: () =>
      snapshot(
        crestStore.getProducts({
          category: filters?.category as AppData["products"][0]["category"] | undefined,
          search: filters?.search,
        })
      ),
  });
}

export function useNotifications() {
  return useQuery({
    queryKey: ["crest", "notifications"],
    queryFn: () => snapshot(crestStore.getNotifications()),
  });
}

export function useTransactions() {
  return useQuery({
    queryKey: ["crest", "transactions"],
    queryFn: () => snapshot(crestStore.getTransactions()),
  });
}

export function useOrders(businessId?: string) {
  return useQuery({
    queryKey: ["crest", "orders", businessId],
    queryFn: () => snapshot(crestStore.getOrders(businessId)),
  });
}

export function useReviews(filters?: { opportunityId?: string; productIds?: string[] }) {
  return useQuery({
    queryKey: ["crest", "reviews", filters],
    queryFn: () => snapshot(crestStore.getReviews(filters)),
  });
}
