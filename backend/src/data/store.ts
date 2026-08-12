import { prisma } from "./prisma.js";
import { applyLiveOrderTick, applyOrderSimulation } from "../algo/simulate-orders.js";
import type { OrderAlgoOptions } from "../algo/simulate-orders.js";
import {
  computeStats,
  createBusinessFromOpportunity,
  createCustomBusiness,
  createSeedData,
} from "./seed.js";
import type {
  AppData,
  AudienceTargeting,
  Category,
  Country,
  DashboardStats,
  IntelligenceInsight,
  Notification,
  Opportunity,
  Order,
  Product,
  Review,
  Transaction,
  UserBusiness,
  UserProfile,
} from "../types.js";

function asJson<T>(value: unknown, fallback: T): T {
  return (value as T) ?? fallback;
}

async function hydrate(): Promise<AppData> {
  const [
    users,
    profile,
    products,
    opportunities,
    userBusinesses,
    orders,
    transactions,
    notifications,
    customers,
    reviews,
    meta,
  ] = await Promise.all([
    prisma.user.findMany(),
    prisma.profile.findFirst(),
    prisma.product.findMany(),
    prisma.opportunity.findMany(),
    prisma.userBusiness.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.order.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.transaction.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.notification.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.customer.findMany(),
    prisma.review.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.appMeta.findUnique({ where: { id: 1 } }),
  ]);

  if (!profile || !meta) {
    throw new Error("Database not seeded. Run: npm run db:seed");
  }

  return {
    users: users.map((u) => ({
      id: u.id,
      email: u.email,
      password: u.password,
      name: u.name,
      isOnboarded: u.isOnboarded,
    })),
    profile: {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      address: profile.address,
      avatar: profile.avatar,
      kycStatus: profile.kycStatus as UserProfile["kycStatus"],
      documents: asJson(profile.documents, []),
      settings: asJson(profile.settings, {
        emailNotifications: true,
        pushNotifications: true,
        currency: "INR",
        language: "en",
        theme: "dark" as const,
      }),
    },
    products: products as Product[],
    opportunities: opportunities.map((o) => ({
      ...o,
      productsIncluded: asJson<string[]>(o.productsIncluded, []),
      productIds: asJson<string[]>(o.productIds, []),
      includedServices: asJson<string[]>(o.includedServices, []),
      status: o.status as Opportunity["status"],
      festivalName: o.festivalName ?? undefined,
      festivalDate: o.festivalDate ?? undefined,
    })),
    userBusinesses: userBusinesses.map((b) => ({
      ...b,
      status: b.status as UserBusiness["status"],
      missionSteps: asJson(b.missionSteps, []),
      productIds: asJson<string[]>(b.productIds, []),
      audienceTargeting: (b.audienceTargeting as AudienceTargeting | null) ?? undefined,
      createdAt: b.createdAt.toISOString(),
    })),
    orders: orders.map((o) => ({
      ...o,
      status: o.status as Order["status"],
      country: o.country as Order["country"],
      createdAt: o.createdAt.toISOString(),
    })),
    transactions: transactions.map((t) => ({
      ...t,
      type: t.type as Transaction["type"],
      status: t.status as Transaction["status"],
      businessName: t.businessName ?? undefined,
      createdAt: t.createdAt.toISOString(),
    })),
    notifications: notifications.map((n) => ({
      ...n,
      titleKey: n.titleKey ?? undefined,
      messageKey: n.messageKey ?? undefined,
      vars: (n.vars as Record<string, string> | null) ?? undefined,
      type: n.type as Notification["type"],
      createdAt: n.createdAt.toISOString(),
    })),
    customers: customers as AppData["customers"],
    reviews: reviews.map((r) => ({
      ...r,
      productId: r.productId ?? undefined,
      opportunityId: r.opportunityId ?? undefined,
      authorType: r.authorType as Review["authorType"],
      country: r.country as Review["country"],
      createdAt: r.createdAt.toISOString(),
    })),
    dashboardStats: asJson<DashboardStats>(meta.dashboard, {
      businesses: 0,
      revenue: 0,
      profit: 0,
      withdrawable: 0,
      countries: 0,
      orders: 0,
    }),
    intelligence: asJson<IntelligenceInsight>(meta.intelligence, {
      insight: "",
      action: "",
      confidence: 0,
    }),
  };
}

async function persistFull(data: AppData): Promise<void> {
  await prisma.$transaction(async (tx) => {
    await tx.order.deleteMany();
    await tx.transaction.deleteMany();
    await tx.notification.deleteMany();
    await tx.review.deleteMany();
    await tx.customer.deleteMany();
    await tx.userBusiness.deleteMany();
    await tx.opportunity.deleteMany();
    await tx.product.deleteMany();
    await tx.profile.deleteMany();
    await tx.user.deleteMany();
    await tx.appMeta.deleteMany();

    await tx.user.createMany({
      data: data.users.map((u) => ({
        id: u.id,
        email: u.email,
        password: u.password,
        name: u.name,
        isOnboarded: u.isOnboarded,
      })),
    });

    await tx.profile.create({
      data: {
        id: data.profile.id,
        userId: data.users[0]?.id ?? data.profile.id,
        name: data.profile.name,
        email: data.profile.email,
        phone: data.profile.phone,
        address: data.profile.address,
        avatar: data.profile.avatar,
        kycStatus: data.profile.kycStatus,
        documents: data.profile.documents,
        settings: data.profile.settings,
      },
    });

    await tx.product.createMany({
      data: data.products.map((p) => ({ ...p })),
    });

    await tx.opportunity.createMany({
      data: data.opportunities.map((o) => ({
        id: o.id,
        name: o.name,
        country: o.country,
        category: o.category,
        launchScore: o.launchScore,
        crestPrice: o.crestPrice,
        recommendedSellingPrice: o.recommendedSellingPrice,
        monthlyOrders: o.monthlyOrders,
        minimumLaunchCost: o.minimumLaunchCost,
        availableCapacity: o.availableCapacity,
        peopleStarted: o.peopleStarted,
        status: o.status ?? null,
        image: o.image,
        description: o.description,
        productsIncluded: o.productsIncluded,
        productIds: o.productIds,
        commerceSpecialist: o.commerceSpecialist,
        includedServices: o.includedServices,
        festivalName: o.festivalName ?? null,
        festivalDate: o.festivalDate ?? null,
      })),
    });

    await tx.userBusiness.createMany({
      data: data.userBusinesses.map((b) => ({
        id: b.id,
        name: b.name,
        country: b.country,
        category: b.category,
        status: b.status,
        revenue: b.revenue,
        profit: b.profit,
        orders: b.orders,
        inventory: b.inventory,
        withdrawable: b.withdrawable,
        currentSellingPrice: b.currentSellingPrice,
        launchScore: b.launchScore,
        crestPrice: b.crestPrice,
        image: b.image,
        commerceSpecialist: b.commerceSpecialist,
        missionSteps: b.missionSteps,
        productIds: b.productIds,
        audienceTargeting: b.audienceTargeting ?? undefined,
        createdAt: new Date(b.createdAt),
      })),
    });

    await tx.order.createMany({
      data: data.orders.map((o) => ({
        ...o,
        createdAt: new Date(o.createdAt),
      })),
    });

    await tx.transaction.createMany({
      data: data.transactions.map((t) => ({
        id: t.id,
        type: t.type,
        amount: t.amount,
        status: t.status,
        description: t.description,
        businessName: t.businessName ?? null,
        createdAt: new Date(t.createdAt),
      })),
    });

    await tx.notification.createMany({
      data: data.notifications.map((n) => ({
        id: n.id,
        title: n.title,
        message: n.message,
        titleKey: n.titleKey ?? null,
        messageKey: n.messageKey ?? null,
        vars: n.vars ?? undefined,
        type: n.type,
        read: n.read,
        createdAt: new Date(n.createdAt),
      })),
    });

    await tx.customer.createMany({
      data: data.customers.map((c) => ({ ...c })),
    });

    await tx.review.createMany({
      data: data.reviews.map((r) => ({
        id: r.id,
        productId: r.productId ?? null,
        opportunityId: r.opportunityId ?? null,
        authorName: r.authorName,
        authorType: r.authorType,
        rating: r.rating,
        title: r.title,
        comment: r.comment,
        country: r.country,
        createdAt: new Date(r.createdAt),
        helpful: r.helpful,
      })),
    });

    await tx.appMeta.create({
      data: {
        id: 1,
        dashboard: data.dashboardStats,
        intelligence: data.intelligence,
      },
    });
  });
}

/** Persist mutable runtime slices after algo / withdraw / launch */
async function persistRuntime(data: AppData): Promise<void> {
  await prisma.$transaction(async (tx) => {
    await tx.userBusiness.deleteMany();
    await tx.userBusiness.createMany({
      data: data.userBusinesses.map((b) => ({
        id: b.id,
        name: b.name,
        country: b.country,
        category: b.category,
        status: b.status,
        revenue: b.revenue,
        profit: b.profit,
        orders: b.orders,
        inventory: b.inventory,
        withdrawable: b.withdrawable,
        currentSellingPrice: b.currentSellingPrice,
        launchScore: b.launchScore,
        crestPrice: b.crestPrice,
        image: b.image,
        commerceSpecialist: b.commerceSpecialist,
        missionSteps: b.missionSteps,
        productIds: b.productIds,
        audienceTargeting: b.audienceTargeting ?? undefined,
        createdAt: new Date(b.createdAt),
      })),
    });

    await tx.order.deleteMany();
    await tx.order.createMany({
      data: data.orders.slice(0, 200).map((o) => ({
        ...o,
        createdAt: new Date(o.createdAt),
      })),
    });

    await tx.transaction.deleteMany();
    await tx.transaction.createMany({
      data: data.transactions.slice(0, 100).map((t) => ({
        id: t.id,
        type: t.type,
        amount: t.amount,
        status: t.status,
        description: t.description,
        businessName: t.businessName ?? null,
        createdAt: new Date(t.createdAt),
      })),
    });

    await tx.notification.deleteMany();
    await tx.notification.createMany({
      data: data.notifications.slice(0, 80).map((n) => ({
        id: n.id,
        title: n.title,
        message: n.message,
        titleKey: n.titleKey ?? null,
        messageKey: n.messageKey ?? null,
        vars: n.vars ?? undefined,
        type: n.type,
        read: n.read,
        createdAt: new Date(n.createdAt),
      })),
    });

    await tx.appMeta.upsert({
      where: { id: 1 },
      create: {
        id: 1,
        dashboard: data.dashboardStats,
        intelligence: data.intelligence,
      },
      update: {
        dashboard: data.dashboardStats,
        intelligence: data.intelligence,
      },
    });
  });
}

export const db = {
  async getAll(): Promise<AppData> {
    return hydrate();
  },

  async reset(): Promise<AppData> {
    const data = createSeedData();
    await persistFull(data);
    return hydrate();
  },

  async getDashboard() {
    const data = await hydrate();
    return {
      stats: data.dashboardStats,
      intelligence: data.intelligence,
      profile: data.profile,
    };
  },

  async getOpportunities(filters?: {
    category?: string;
    country?: string;
    search?: string;
    festival?: "only" | "exclude" | "all";
  }): Promise<Opportunity[]> {
    const data = await hydrate();
    let opps = data.opportunities;
    const mode = filters?.festival ?? "all";
    if (mode === "only") {
      opps = opps.filter((o) => Boolean(o.festivalName && o.festivalDate) || o.id.startsWith("fest_"));
    } else if (mode === "exclude") {
      opps = opps.filter((o) => !(o.festivalName && o.festivalDate) && !o.id.startsWith("fest_"));
    }
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
          o.country.toLowerCase().includes(q) ||
          (o.festivalName?.toLowerCase().includes(q) ?? false)
      );
    }
    return opps;
  },

  async getOpportunity(id: string) {
    const data = await hydrate();
    return data.opportunities.find((o) => o.id === id) ?? null;
  },

  async getOpportunityProducts(opportunityId: string): Promise<Product[]> {
    const data = await hydrate();
    const opp = data.opportunities.find((o) => o.id === opportunityId);
    if (!opp) return [];
    if (opp.productIds?.length) {
      const matched = data.products.filter((p) => opp.productIds.includes(p.id));
      if (matched.length) return matched;
    }
    return data.products.filter(
      (p) => p.category === opp.category && opp.productsIncluded.includes(p.name)
    );
  },

  async getProducts(filters?: { category?: string; search?: string }) {
    let products = (await hydrate()).products;
    if (filters?.category) products = products.filter((p) => p.category === filters.category);
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      products = products.filter((p) => p.name.toLowerCase().includes(q));
    }
    return products;
  },

  async getBusinesses() {
    return (await hydrate()).userBusinesses;
  },

  async getBusiness(id: string) {
    return (await hydrate()).userBusinesses.find((b) => b.id === id) ?? null;
  },

  async launchBusiness(opportunityId: string, selectedProductIds?: string[]) {
    const data = await hydrate();
    const opp = data.opportunities.find((o) => o.id === opportunityId);
    if (!opp) return null;
    const allProducts = await db.getOpportunityProducts(opportunityId);
    const selected = selectedProductIds?.length
      ? allProducts.filter((p) => selectedProductIds.includes(p.id))
      : allProducts;
    if (!selected.length) return null;
    const business = createBusinessFromOpportunity(opp, selected);
    data.userBusinesses.unshift(business);
    data.dashboardStats = computeStats(data.userBusinesses);
    data.notifications.unshift({
      id: `notif_${Date.now()}`,
      title: "Business Launched",
      message: `${business.name} is now live in ${business.country}.`,
      titleKey: "notif.launched.title",
      messageKey: "notif.launched.msg",
      vars: { name: business.name, country: business.country },
      type: "success",
      read: false,
      createdAt: new Date().toISOString(),
    });
    await persistRuntime(data);
    return business;
  },

  async launchCustomBusiness(input: {
    name: string;
    category: Category;
    country: Country;
    selectedProductIds: string[];
    audienceTargeting?: AudienceTargeting;
  }) {
    const data = await hydrate();
    const selected = data.products.filter((p) => input.selectedProductIds.includes(p.id));
    if (!input.name.trim() || !selected.length) return null;
    const business = createCustomBusiness(
      input.name.trim(),
      input.category,
      input.country,
      selected,
      input.audienceTargeting
    );
    data.userBusinesses.unshift(business);
    data.dashboardStats = computeStats(data.userBusinesses);
    data.notifications.unshift({
      id: `notif_${Date.now()}`,
      title: "Business Launched",
      message: `${business.name} is now live in ${business.country}.`,
      titleKey: "notif.launched.title",
      messageKey: "notif.launched.msg",
      vars: { name: business.name, country: business.country },
      type: "success",
      read: false,
      createdAt: new Date().toISOString(),
    });
    await persistRuntime(data);
    return business;
  },

  async getOrders(businessId?: string) {
    const orders = (await hydrate()).orders;
    if (businessId) return orders.filter((o) => o.businessId === businessId).slice(0, 50);
    return orders.slice(0, 50);
  },

  async getTransactions() {
    return (await hydrate()).transactions.slice(0, 30);
  },

  async getNotifications() {
    return (await hydrate()).notifications;
  },

  async markNotificationRead(id: string) {
    await prisma.notification.updateMany({ where: { id }, data: { read: true } });
  },

  async markAllNotificationsRead() {
    await prisma.notification.updateMany({ data: { read: true } });
  },

  async withdraw(amount: number) {
    const data = await hydrate();
    if (amount <= 0 || amount > data.dashboardStats.withdrawable) return false;
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
    await persistRuntime(data);
    return true;
  },

  async getReviews(filters?: { opportunityId?: string; productIds?: string[] }) {
    let reviews = (await hydrate()).reviews;
    if (filters?.opportunityId) {
      reviews = reviews.filter((r) => r.opportunityId === filters.opportunityId);
    }
    if (filters?.productIds?.length) {
      const ids = new Set(filters.productIds);
      reviews = reviews.filter((r) => r.productId && ids.has(r.productId));
    }
    return reviews;
  },

  async updateProfile(updates: Partial<UserProfile>) {
    const data = await hydrate();
    data.profile = { ...data.profile, ...updates };
    await prisma.profile.update({
      where: { id: data.profile.id },
      data: {
        name: data.profile.name,
        phone: data.profile.phone,
        address: data.profile.address,
        avatar: data.profile.avatar,
        kycStatus: data.profile.kycStatus,
        documents: data.profile.documents,
        settings: data.profile.settings,
      },
    });
    if (updates.name) {
      await prisma.user.updateMany({
        where: { email: data.profile.email },
        data: { name: updates.name },
      });
    }
    return data.profile;
  },

  async updateSettings(settings: Partial<UserProfile["settings"]>) {
    const data = await hydrate();
    data.profile.settings = { ...data.profile.settings, ...settings };
    await prisma.profile.update({
      where: { id: data.profile.id },
      data: { settings: data.profile.settings },
    });
    return data.profile.settings;
  },

  async findUserByEmail(email: string) {
    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    return user
      ? {
          id: user.id,
          email: user.email,
          password: user.password,
          name: user.name,
          isOnboarded: user.isOnboarded,
        }
      : null;
  },

  async signup(email: string, name: string, password: string) {
    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existing) return { error: "Email already registered" as const };
    const id = `user_${Date.now()}`;
    const user = await prisma.user.create({
      data: {
        id,
        email: email.trim().toLowerCase(),
        password,
        name: name.trim() || "User",
        isOnboarded: false,
        profile: {
          create: {
            id,
            name: name.trim() || "User",
            email: email.trim().toLowerCase(),
            phone: "",
            address: "",
            avatar: "",
            kycStatus: "not_started",
            documents: [],
            settings: {
              emailNotifications: true,
              pushNotifications: true,
              currency: "INR",
              language: "en",
              theme: "dark",
            },
          },
        },
      },
    });
    return {
      user: {
        id: user.id,
        email: user.email,
        password: user.password,
        name: user.name,
        isOnboarded: user.isOnboarded,
      },
    };
  },

  async completeOnboarding(email: string, name: string) {
    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!user) return null;
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        isOnboarded: true,
        name: name.trim() || user.name,
        profile: {
          update: {
            name: name.trim() || user.name,
            kycStatus: "pending",
          },
        },
      },
    });
    return {
      id: updated.id,
      email: updated.email,
      password: updated.password,
      name: updated.name,
      isOnboarded: updated.isOnboarded,
    };
  },

  async tickOrderAlgo(options?: { intensity?: number }) {
    const data = await hydrate();
    const result = applyLiveOrderTick(data, {
      seed: Date.now() % 1_000_000,
      intensity: options?.intensity ?? 0.035,
    });
    await persistRuntime(data);
    return result;
  },

  async runOrderAlgo(options: OrderAlgoOptions = {}) {
    const data = await hydrate();
    const result = applyOrderSimulation(data, {
      days: options.days ?? 14,
      seed: options.seed ?? Date.now() % 1_000_000,
      maxOrdersPerBusinessPerDay: options.maxOrdersPerBusinessPerDay ?? 6,
    });
    await persistRuntime(data);
    return result;
  },
};
