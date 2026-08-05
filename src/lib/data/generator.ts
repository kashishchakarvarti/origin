import {
  BRAND_PREFIXES,
  BRAND_SUFFIXES,
  CATEGORIES,
  COUNTRIES,
  INCLUDED_SERVICES,
  INTELLIGENCE_INSIGHTS,
  MISSION_STEPS,
  NOTIFICATION_TEMPLATES,
  PRODUCT_DESCRIPTORS,
  PRODUCT_TYPES,
  SPECIALIST_FIRST,
  SPECIALIST_LAST,
} from "../constants";
import { AVATAR_IMAGE, getCategoryImage } from "../images";
import type {
  AppData,
  Category,
  Country,
  Customer,
  DashboardStats,
  Notification,
  Opportunity,
  Order,
  Product,
  Transaction,
  UserBusiness,
  UserProfile,
} from "../types";

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function pick<T>(arr: readonly T[], rand: () => number): T {
  return arr[Math.floor(rand() * arr.length)];
}

function range(min: number, max: number, rand: () => number): number {
  return Math.floor(rand() * (max - min + 1)) + min;
}

function generateBusinessName(index: number): string {
  const prefix = BRAND_PREFIXES[index % BRAND_PREFIXES.length];
  const suffix = BRAND_SUFFIXES[(index * 7) % BRAND_SUFFIXES.length];
  const useTm = index % 3 === 0;
  return useTm ? `${prefix}${suffix}™` : `${prefix}${suffix}`;
}

function generateProductName(category: Category, index: number, rand: () => number): string {
  const types = PRODUCT_TYPES[category];
  const type = types[index % types.length];
  const descriptor = pick(PRODUCT_DESCRIPTORS, rand);
  return `${descriptor} ${type}`;
}

function generateSpecialist(index: number): string {
  const first = SPECIALIST_FIRST[index % SPECIALIST_FIRST.length];
  const last = SPECIALIST_LAST[(index * 3) % SPECIALIST_LAST.length];
  return `${first} ${last}`;
}

export function generateProducts(count: number): Product[] {
  const products: Product[] = [];
  for (let i = 0; i < count; i++) {
    const rand = seededRandom(i * 7919 + 42);
    const category = CATEGORIES[i % CATEGORIES.length];
    products.push({
      id: `prod_${i + 1}`,
      name: generateProductName(category, i, rand),
      category,
      crestPrice: range(25000, 250000, rand),
      launchScore: range(72, 99, rand),
      monthlyOrders: range(180, 4200, rand),
      image: getCategoryImage(category, `prod_${i + 1}`),
    });
  }
  return products;
}

export function generateOpportunities(count: number, products: Product[]): Opportunity[] {
  const opportunities: Opportunity[] = [];
  for (let i = 0; i < count; i++) {
    const rand = seededRandom(i * 3571 + 100);
    const category = CATEGORIES[i % CATEGORIES.length];
    const country = COUNTRIES[i % COUNTRIES.length];
    const categoryProducts = products.filter((p) => p.category === category);
    const selectedProductObjs = categoryProducts.slice(0, range(3, 6, rand));
    const selectedProducts =
      selectedProductObjs.length > 0
        ? selectedProductObjs.map((p) => p.name)
        : [generateProductName(category, i, rand)];
    const productIds =
      selectedProductObjs.length > 0 ? selectedProductObjs.map((p) => p.id) : [];
    const crestPrice =
      selectedProductObjs.length > 0
        ? selectedProductObjs.reduce((s, p) => s + p.crestPrice, 0)
        : range(75000, 350000, rand);
    opportunities.push({
      id: `opp_${i + 1}`,
      name: generateBusinessName(i),
      country,
      category,
      launchScore: range(78, 98, rand),
      crestPrice,
      recommendedSellingPrice: range(1299, 8999, rand) / 100,
      monthlyOrders: range(420, 5200, rand),
      minimumLaunchCost: crestPrice,
      availableCapacity: range(12, 89, rand),
      image: getCategoryImage(category, `opp_${i + 1}`),
      description: `A premium ${category.toLowerCase()} brand optimized for the ${country} market with end-to-end CREST fulfillment.`,
      productsIncluded: selectedProducts,
      productIds,
      commerceSpecialist: generateSpecialist(i),
      includedServices: [...INCLUDED_SERVICES],
    });
  }
  return opportunities;
}

function generateMissionSteps(completedCount: number): UserBusiness["missionSteps"] {
  return MISSION_STEPS.map((step, i) => ({
    step,
    completed: i < completedCount,
    completedAt: i < completedCount ? new Date(Date.now() - (completedCount - i) * 86400000 * 3).toISOString() : undefined,
  }));
}

export function generateUserBusinesses(count: number, products: Product[]): UserBusiness[] {
  const businesses: UserBusiness[] = [];
  for (let i = 0; i < count; i++) {
    const rand = seededRandom(i * 2341 + 500);
    const category = CATEGORIES[i % CATEGORIES.length];
    const country = COUNTRIES[i % COUNTRIES.length];
    const categoryProducts = products.filter((p) => p.category === category);
    const productIds = categoryProducts.slice(0, range(2, 5, rand)).map((p) => p.id);
    const revenue = range(180000, 9800000, rand);
    const profit = Math.floor(revenue * (rand() * 0.25 + 0.08));
    const orders = range(120, 8400, rand);
    const completedSteps = range(5, 8, rand);
    businesses.push({
      id: `biz_${i + 1}`,
      name: generateBusinessName(i + 50),
      country,
      category,
      status: completedSteps >= 7 ? "growing" : "live",
      revenue,
      profit,
      orders,
      inventory: range(45, 2400, rand),
      withdrawable: Math.floor(profit * (rand() * 0.4 + 0.5)),
      currentSellingPrice: range(1999, 7999, rand) / 100,
      launchScore: range(82, 97, rand),
      crestPrice: range(80000, 300000, rand),
      image: getCategoryImage(category, `biz_${i + 1}`),
      commerceSpecialist: generateSpecialist(i + 10),
      missionSteps: generateMissionSteps(completedSteps),
      productIds,
      createdAt: new Date(Date.now() - range(30, 365, rand) * 86400000).toISOString(),
    });
  }
  return businesses;
}

export function generateOrders(count: number, businesses: UserBusiness[]): Order[] {
  const firstNames = ["Alex", "Jordan", "Taylor", "Morgan", "Casey", "Riley", "Quinn", "Avery", "Blake", "Cameron"];
  const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Wilson", "Moore"];
  const orders: Order[] = [];
  for (let i = 0; i < count; i++) {
    const rand = seededRandom(i * 1237 + 900);
    const business = pick(businesses, rand);
    orders.push({
      id: `ord_${i + 1}`,
      businessId: business.id,
      businessName: business.name,
      customerName: `${pick(firstNames, rand)} ${pick(lastNames, rand)}`,
      amount: range(1500, 45000, rand),
      status: pick(["completed", "processing", "shipped"] as const, rand),
      country: business.country,
      createdAt: new Date(Date.now() - range(0, 180, rand) * 86400000).toISOString(),
    });
  }
  return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function generateTransactions(count: number, businesses: UserBusiness[]): Transaction[] {
  const types = ["withdrawal", "revenue", "refund", "deposit"] as const;
  const transactions: Transaction[] = [];
  for (let i = 0; i < count; i++) {
    const rand = seededRandom(i * 4567 + 200);
    const business = pick(businesses, rand);
    const type = pick(types, rand);
    transactions.push({
      id: `txn_${i + 1}`,
      type,
      amount: range(5000, 500000, rand),
      status: pick(["completed", "pending", "failed"] as const, rand),
      description:
        type === "withdrawal"
          ? "Withdrawal to bank account"
          : type === "revenue"
            ? `Revenue from ${business.name}`
            : type === "refund"
              ? `Customer refund — ${business.name}`
              : "Account deposit",
      businessName: business.name,
      createdAt: new Date(Date.now() - range(0, 120, rand) * 86400000).toISOString(),
    });
  }
  return transactions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function generateCustomers(count: number): Customer[] {
  const firstNames = ["Emma", "Liam", "Olivia", "Noah", "Ava", "Ethan", "Sophia", "Mason", "Isabella", "William"];
  const lastNames = ["Anderson", "Thomas", "Jackson", "White", "Harris", "Martin", "Thompson", "Robinson", "Clark", "Lewis"];
  const customers: Customer[] = [];
  for (let i = 0; i < count; i++) {
    const rand = seededRandom(i * 8765 + 300);
    customers.push({
      id: `cust_${i + 1}`,
      name: `${pick(firstNames, rand)} ${pick(lastNames, rand)}`,
      email: `customer${i + 1}@email.com`,
      country: pick(COUNTRIES, rand),
      totalOrders: range(1, 45, rand),
      totalSpent: range(2000, 180000, rand),
    });
  }
  return customers;
}

export function generateNotifications(count: number, businesses: UserBusiness[]): Notification[] {
  const notifications: Notification[] = [];
  const types = ["success", "info", "warning", "milestone"] as const;
  for (let i = 0; i < count; i++) {
    const rand = seededRandom(i * 5432 + 400);
    const business = pick(businesses, rand);
    const template = pick(NOTIFICATION_TEMPLATES, rand);
    const message = template.message
      .replace("{name}", business.name)
      .replace("{country}", business.country)
      .replace("{category}", business.category)
      .replace("{count}", String(range(50, 500, rand)))
      .replace("{price}", `$${business.currentSellingPrice.toFixed(2)}`)
      .replace("{step}", pick(MISSION_STEPS, rand))
      .replace("{amount}", `₹${range(1, 50, rand)},${range(10, 99, rand)},000`);
    notifications.push({
      id: `notif_${i + 1}`,
      title: template.title,
      message,
      type: pick(types, rand),
      read: rand() > 0.4,
      createdAt: new Date(Date.now() - range(0, 30, rand) * 86400000).toISOString(),
    });
  }
  return notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

function computeDashboardStats(businesses: UserBusiness[]): DashboardStats {
  const countries = new Set(businesses.map((b) => b.country));
  return {
    businesses: businesses.length,
    revenue: businesses.reduce((s, b) => s + b.revenue, 0),
    profit: businesses.reduce((s, b) => s + b.profit, 0),
    withdrawable: businesses.reduce((s, b) => s + b.withdrawable, 0),
    countries: countries.size,
    orders: businesses.reduce((s, b) => s + b.orders, 0),
  };
}

export function generateProfile(): UserProfile {
  return {
    id: "user_1",
    name: "Kashish",
    email: "kashish@crestorigin.com",
    phone: "+91 98765 43210",
    avatar: AVATAR_IMAGE,
    kycStatus: "verified",
    documents: [
      { id: "doc_1", name: "Passport", status: "Verified", uploadedAt: "2025-06-15T10:00:00Z" },
      { id: "doc_2", name: "Business License", status: "Verified", uploadedAt: "2025-06-16T14:30:00Z" },
      { id: "doc_3", name: "Tax Certificate", status: "Verified", uploadedAt: "2025-07-01T09:15:00Z" },
    ],
    settings: {
      emailNotifications: true,
      pushNotifications: true,
      currency: "INR",
    },
  };
}

export function generateSeedData(): AppData {
  const products = generateProducts(500);
  const opportunities = generateOpportunities(100, products);
  const userBusinesses = generateUserBusinesses(12, products);
  // Keep stored payload small — stats reflect full scale via business aggregates
  const orders = generateOrders(500, userBusinesses);
  const transactions = generateTransactions(200, userBusinesses);
  const customers = generateCustomers(200);
  const notifications = generateNotifications(100, userBusinesses);

  return {
    opportunities,
    products,
    userBusinesses,
    orders,
    transactions,
    notifications,
    customers,
    profile: generateProfile(),
    dashboardStats: computeDashboardStats(userBusinesses),
    intelligence: INTELLIGENCE_INSIGHTS[0],
  };
}

export function createBusinessFromOpportunity(
  opportunity: Opportunity,
  selectedProducts: Product[]
): UserBusiness {
  const totalCost = selectedProducts.reduce((s, p) => s + p.crestPrice, 0);
  const avgScore =
    selectedProducts.length > 0
      ? Math.round(
          selectedProducts.reduce((s, p) => s + p.launchScore, 0) / selectedProducts.length
        )
      : opportunity.launchScore;
  return {
    id: `biz_${Date.now()}`,
    name: opportunity.name,
    country: opportunity.country,
    category: opportunity.category,
    status: "pending",
    revenue: 0,
    profit: 0,
    orders: 0,
    inventory: selectedProducts.length * 100,
    withdrawable: 0,
    currentSellingPrice: opportunity.recommendedSellingPrice,
    launchScore: avgScore,
    crestPrice: totalCost || opportunity.crestPrice,
    image: opportunity.image,
    commerceSpecialist: opportunity.commerceSpecialist,
    missionSteps: generateMissionSteps(1),
    productIds: selectedProducts.map((p) => p.id),
    createdAt: new Date().toISOString(),
  };
}

export function createCustomBusiness(
  name: string,
  category: Category,
  country: Country,
  selectedProducts: Product[]
): UserBusiness {
  const totalCost = selectedProducts.reduce((s, p) => s + p.crestPrice, 0);
  const avgScore = Math.round(
    selectedProducts.reduce((s, p) => s + p.launchScore, 0) / selectedProducts.length
  );
  return {
    id: `biz_${Date.now()}`,
    name,
    country,
    category,
    status: "pending",
    revenue: 0,
    profit: 0,
    orders: 0,
    inventory: selectedProducts.length * 100,
    withdrawable: 0,
    currentSellingPrice: range(1999, 5999, seededRandom(Date.now())) / 100,
    launchScore: avgScore,
    crestPrice: totalCost,
    image: getCategoryImage(category, `custom_${Date.now()}`),
    commerceSpecialist: generateSpecialist(Date.now() % 20),
    missionSteps: generateMissionSteps(1),
    productIds: selectedProducts.map((p) => p.id),
    createdAt: new Date().toISOString(),
  };
}
