"use client";

import { useQuery } from "@tanstack/react-query";
import { crestStore } from "@/lib/data/store";
import type { AppData } from "@/lib/types";

export function useCrestData() {
  return useQuery<AppData>({
    queryKey: ["crest", "data"],
    queryFn: () => crestStore.getData(),
  });
}

export function useOpportunities(filters?: { category?: string; country?: string; search?: string }) {
  return useQuery({
    queryKey: ["crest", "opportunities", filters],
    queryFn: () => crestStore.getOpportunities(filters),
  });
}

export function useOpportunity(id: string) {
  return useQuery({
    queryKey: ["crest", "opportunity", id],
    queryFn: () => crestStore.getOpportunity(id),
    enabled: !!id,
  });
}

export function useUserBusinesses() {
  return useQuery({
    queryKey: ["crest", "businesses"],
    queryFn: () => crestStore.getUserBusinesses(),
  });
}

export function useUserBusiness(id: string) {
  return useQuery({
    queryKey: ["crest", "business", id],
    queryFn: () => crestStore.getUserBusiness(id),
    enabled: !!id,
  });
}

export function useProducts(filters?: { category?: string; search?: string }) {
  return useQuery({
    queryKey: ["crest", "products", filters],
    queryFn: () =>
      crestStore.getProducts({
        category: filters?.category as AppData["products"][0]["category"] | undefined,
        search: filters?.search,
      }),
  });
}

export function useNotifications() {
  return useQuery({
    queryKey: ["crest", "notifications"],
    queryFn: () => crestStore.getNotifications(),
  });
}

export function useTransactions() {
  return useQuery({
    queryKey: ["crest", "transactions"],
    queryFn: () => crestStore.getTransactions(),
  });
}

export function useOrders(businessId?: string) {
  return useQuery({
    queryKey: ["crest", "orders", businessId],
    queryFn: () => crestStore.getOrders(businessId),
  });
}

export function useReviews(filters?: { opportunityId?: string; productIds?: string[] }) {
  return useQuery({
    queryKey: ["crest", "reviews", filters],
    queryFn: () => crestStore.getReviews(filters),
  });
}
