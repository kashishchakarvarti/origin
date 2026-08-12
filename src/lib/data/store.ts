"use client";

import type { AppData, AuthState, Category, Country, Notification, Opportunity, Product, UserBusiness } from "../types";
import type { AudienceTargeting } from "../audience-filters";
import { normalizeAudienceTargeting } from "../audience-filters";
import { DEMO_CREDENTIALS } from "../constants";
import { createBusinessFromOpportunity, createCustomBusiness, generateSeedData } from "./generator";

const STORAGE_KEY = "crest_os_data_v9";
const AUTH_KEY = "crest_os_auth";
const DEMO_KEY = "crest_os_demo";

let memoryCache: AppData | null = null;

function loadData(): AppData {
  if (typeof window === "undefined") return generateSeedData();
  if (memoryCache) return memoryCache;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      memoryCache = JSON.parse(stored) as AppData;
      return memoryCache;
    } catch {
      // fall through
    }
  }
  memoryCache = generateSeedData();
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(memoryCache));
  } catch {
    // Quota exceeded — in-memory cache still works this session
  }
  return memoryCache;
}

function saveData(data: AppData): void {
  memoryCache = data;
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // Quota exceeded — keep in-memory only
    }
  }
}

export const crestStore = {
  getData(): AppData {
    return loadData();
  },

  resetData(): AppData {
    const data = generateSeedData();
    saveData(data);
    return data;
  },

  getAuth(): AuthState {
    if (typeof window === "undefined") {
      return { isAuthenticated: false, isOnboarded: false, email: "", name: "" };
    }
    const stored = localStorage.getItem(AUTH_KEY);
    if (stored) {
      try {
        return JSON.parse(stored) as AuthState;
      } catch {
        // fall through
      }
    }
    return { isAuthenticated: false, isOnboarded: false, email: "", name: "" };
  },

  setAuth(auth: AuthState): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
    }
  },

  logout(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(AUTH_KEY);
    }
  },

  isDemoMode(): boolean {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(DEMO_KEY) === "true";
  },

  setDemoMode(enabled: boolean): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(DEMO_KEY, String(enabled));
    }
  },

  getOpportunities(filters?: { category?: string; country?: string; search?: string }): Opportunity[] {
    let opps = loadData().opportunities;
    if (filters?.category && filters.category !== "all") {
      opps = opps.filter((o) => o.category === filters.category);
    }
    if (filters?.country && filters.country !== "all") {
      opps = opps.filter((o) => o.country === filters.country);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      opps = opps.filter(
        (o) =>
          o.name.toLowerCase().includes(q) ||
          o.category.toLowerCase().includes(q) ||
          o.country.toLowerCase().includes(q)
      );
    }
    return opps;
  },

  getOpportunity(id: string): Opportunity | undefined {
    return loadData().opportunities.find((o) => o.id === id);
  },

  getOpportunityProducts(opportunityId: string): Product[] {
    const data = loadData();
    const opp = data.opportunities.find((o) => o.id === opportunityId);
    if (!opp) return [];

    if (opp.productIds?.length) {
      const matched = data.products.filter((p) => opp.productIds.includes(p.id));
      if (matched.length > 0) return matched;
    }

    return data.products.filter(
      (p) => p.category === opp.category && opp.productsIncluded.includes(p.name)
    );
  },

  getProducts(filters?: { category?: Category; search?: string }): Product[] {
    let products = loadData().products;
    if (filters?.category) {
      products = products.filter((p) => p.category === filters.category);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      products = products.filter((p) => p.name.toLowerCase().includes(q));
    }
    return products;
  },

  getUserBusinesses(): UserBusiness[] {
    return loadData().userBusinesses;
  },

  getUserBusiness(id: string): UserBusiness | undefined {
    return loadData().userBusinesses.find((b) => b.id === id);
  },

  launchBusiness(opportunityId: string, selectedProductIds?: string[]): UserBusiness | null {
    const data = loadData();
    const opp = data.opportunities.find((o) => o.id === opportunityId);
    if (!opp) return null;

    const allProducts = crestStore.getOpportunityProducts(opportunityId);
    const selectedProducts = selectedProductIds
      ? allProducts.filter((p) => selectedProductIds.includes(p.id))
      : allProducts;

    if (selectedProducts.length === 0) return null;

    const business = createBusinessFromOpportunity(opp, selectedProducts);
    business.status = "live";
    business.missionSteps = business.missionSteps.map((s, i) => ({
      ...s,
      completed: i < 5,
    }));
    data.userBusinesses.unshift(business);
    data.dashboardStats.businesses += 1;
    data.dashboardStats.countries = new Set(data.userBusinesses.map((b) => b.country)).size;
    const notif: Notification = {
      id: `notif_${Date.now()}`,
      title: "Business Launched",
      message: `${business.name} is now live in ${business.country}.`,
      titleKey: "notif.launched.title",
      messageKey: "notif.launched.msg",
      vars: { name: business.name, country: business.country },
      type: "success",
      read: false,
      createdAt: new Date().toISOString(),
    };
    data.notifications.unshift(notif);
    saveData(data);
    return business;
  },

  launchCustomBusiness(
    category: Category,
    country: Country,
    selectedProductIds: string[],
    name: string,
    audienceTargeting?: AudienceTargeting
  ): UserBusiness | null {
    const data = loadData();
    const trimmedName = name.trim();
    if (!trimmedName) return null;
    const selectedProducts = data.products.filter((p) => selectedProductIds.includes(p.id));
    if (selectedProducts.length === 0) return null;
    const business = createCustomBusiness(
      trimmedName,
      category,
      country,
      selectedProducts,
      audienceTargeting ? normalizeAudienceTargeting(audienceTargeting) : undefined
    );
    business.status = "live";
    business.missionSteps = business.missionSteps.map((s, i) => ({
      ...s,
      completed: i < 5,
    }));
    data.userBusinesses.unshift(business);
    data.dashboardStats.businesses += 1;
    data.dashboardStats.countries = new Set(data.userBusinesses.map((b) => b.country)).size;
    const notif: Notification = {
      id: `notif_${Date.now()}`,
      title: "Business Launched",
      message: `${business.name} is now live in ${business.country}.`,
      titleKey: "notif.launched.title",
      messageKey: "notif.launched.msg",
      vars: { name: business.name, country: business.country },
      type: "success",
      read: false,
      createdAt: new Date().toISOString(),
    };
    data.notifications.unshift(notif);
    saveData(data);
    return business;
  },

  getOrders(businessId?: string) {
    const orders = loadData().orders;
    if (businessId) return orders.filter((o) => o.businessId === businessId).slice(0, 50);
    return orders.slice(0, 50);
  },

  getTransactions() {
    return loadData().transactions.slice(0, 30);
  },

  getNotifications() {
    return loadData().notifications;
  },

  markNotificationRead(id: string) {
    const data = loadData();
    const notif = data.notifications.find((n) => n.id === id);
    if (notif) notif.read = true;
    saveData(data);
  },

  markAllNotificationsRead() {
    const data = loadData();
    data.notifications.forEach((n) => (n.read = true));
    saveData(data);
  },

  withdraw(amount: number): boolean {
    const data = loadData();
    if (amount > data.dashboardStats.withdrawable || amount <= 0) return false;
    data.dashboardStats.withdrawable -= amount;
    data.userBusinesses.forEach((b) => {
      const share = b.withdrawable / (data.dashboardStats.withdrawable + amount);
      b.withdrawable = Math.max(0, Math.floor(b.withdrawable - amount * share));
    });
    data.transactions.unshift({
      id: `txn_${Date.now()}`,
      type: "withdrawal",
      amount,
      status: "pending",
      description: "Withdrawal to bank account",
      createdAt: new Date().toISOString(),
    });
    saveData(data);
    return true;
  },

  getReviews(filters?: { opportunityId?: string; productIds?: string[] }) {
    const data = loadData();
    let reviews = data.reviews ?? [];
    if (filters?.opportunityId) {
      reviews = reviews.filter((r) => r.opportunityId === filters.opportunityId);
    }
    if (filters?.productIds?.length) {
      const ids = new Set(filters.productIds);
      reviews = reviews.filter((r) => r.productId && ids.has(r.productId));
    }
    return reviews;
  },

  updateProfile(updates: Partial<AppData["profile"]>) {
    const data = loadData();
    data.profile = { ...data.profile, ...updates };
    saveData(data);
  },

  updateSettings(settings: Partial<AppData["profile"]["settings"]>) {
    const data = loadData();
    data.profile.settings = { ...data.profile.settings, ...settings };
    saveData(data);
  },

  simulateDemoTick() {
    const data = loadData();
    const growthFactor = 1 + Math.random() * 0.02;
    data.userBusinesses.forEach((b) => {
      b.orders += Math.floor(Math.random() * 5) + 1;
      b.revenue += Math.floor(Math.random() * 8000) + 2000;
      b.profit += Math.floor(Math.random() * 2000) + 500;
      b.withdrawable += Math.floor(Math.random() * 1500) + 300;
      if (Math.random() > 0.7) {
        const stepIndex = b.missionSteps.findIndex((s) => !s.completed);
        if (stepIndex >= 0) {
          b.missionSteps[stepIndex].completed = true;
          b.missionSteps[stepIndex].completedAt = new Date().toISOString();
        }
      }
    });
    data.dashboardStats.orders = data.userBusinesses.reduce((s, b) => s + b.orders, 0);
    data.dashboardStats.revenue = data.userBusinesses.reduce((s, b) => s + b.revenue, 0);
    data.dashboardStats.profit = data.userBusinesses.reduce((s, b) => s + b.profit, 0);
    data.dashboardStats.withdrawable = data.userBusinesses.reduce((s, b) => s + b.withdrawable, 0);

    if (Math.random() > 0.5) {
      const biz = data.userBusinesses[Math.floor(Math.random() * data.userBusinesses.length)];
      const templates: {
        title: string;
        titleKey: string;
        messageKey: string;
        message: string;
        vars: Record<string, string>;
      }[] = [
        {
          title: "New Order",
          titleKey: "notif.newOrder.title",
          messageKey: "notif.newOrder.msg",
          message: `${biz.name} received a new order.`,
          vars: { name: biz.name },
        },
        {
          title: "Revenue Update",
          titleKey: "notif.revenueUp.title",
          messageKey: "notif.revenueUp.msg",
          message: `${biz.name} revenue increased by ${Math.floor(growthFactor * 100)}%.`,
          vars: { name: biz.name, pct: String(Math.floor(growthFactor * 100)) },
        },
        {
          title: "Inventory Alert",
          titleKey: "notif.stock.title",
          messageKey: "notif.stock.msg",
          message: `Stock replenished for ${biz.name}.`,
          vars: { name: biz.name },
        },
      ];
      const t = templates[Math.floor(Math.random() * templates.length)];
      data.notifications.unshift({
        id: `notif_${Date.now()}`,
        title: t.title,
        message: t.message,
        titleKey: t.titleKey,
        messageKey: t.messageKey,
        vars: t.vars,
        type: "info",
        read: false,
        createdAt: new Date().toISOString(),
      });
    }
    saveData(data);
    return data;
  },
};

// Fake Supabase client interface
export const supabase = {
  from: (table: string) => ({
    select: () => ({
      data: crestStore.getData()[table as keyof AppData] ?? [],
      error: null,
    }),
    insert: () => ({ data: null, error: null }),
    update: () => ({ data: null, error: null }),
    delete: () => ({ data: null, error: null }),
  }),
  auth: {
    signIn: async (email: string, password: string) => {
      const normalizedEmail = email.trim().toLowerCase();
      if (
        normalizedEmail !== DEMO_CREDENTIALS.email ||
        password !== DEMO_CREDENTIALS.password
      ) {
        return { data: null, error: { message: "Invalid email or password." } };
      }
      crestStore.setAuth({
        isAuthenticated: true,
        isOnboarded: true,
        email: DEMO_CREDENTIALS.email,
        name: "Kashish",
      });
      return { data: { user: { email: DEMO_CREDENTIALS.email } }, error: null };
    },
    signUp: async (email: string, name: string) => {
      crestStore.setAuth({ isAuthenticated: true, isOnboarded: false, email, name });
      return { data: { user: { email } }, error: null };
    },
    signOut: async () => {
      crestStore.logout();
      return { error: null };
    },
    getSession: async () => {
      const auth = crestStore.getAuth();
      return { data: { session: auth.isAuthenticated ? { user: auth } : null }, error: null };
    },
  },
};
