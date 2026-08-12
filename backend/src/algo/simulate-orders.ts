/**
 * Fake-order simulator — volume shaped by weekday/weekend, holidays,
 * season, category, status, launch score, and business age.
 */

import type { AppData, Country, Order, UserBusiness } from "../types.js";
import { getHoliday } from "./holidays.js";
import {
  ageRampMultiplier,
  categoryBase,
  hourWeight,
  scoreMultiplier,
  seasonMultiplier,
  statusMultiplier,
  weekdayMultiplier,
} from "./factors.js";

const FIRST = ["Alex", "Jordan", "Taylor", "Morgan", "Casey", "Riley", "Quinn", "Avery", "Blake", "Cameron", "Sam", "Jamie"];
const LAST = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Wilson", "Moore", "Patel", "Chen"];
const DOMAINS = ["mail.com", "inbox.co", "email.net", "post.io", "box.app"];
const PHONE_CC = ["1", "44", "91", "61", "49", "33", "971", "81", "65"];
const STATUSES = ["completed", "processing", "shipped"] as const;

export type OrderAlgoOptions = {
  days?: number;
  seed?: number;
  endDate?: Date;
  maxOrdersPerBusinessPerDay?: number;
};

export type OrderAlgoSummary = {
  totalOrders: number;
  totalRevenue: number;
  days: number;
  businesses: number;
  holidayHits: number;
};

export type SimulateOrdersResult = {
  orders: Order[];
  byBusiness: Record<string, { orderCount: number; revenue: number; holidayDays: number }>;
  summary: OrderAlgoSummary;
  dailyTotals: { date: string; orders: number; holidayHits: number }[];
};

function seededRandom(seed: number): () => number {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function pick<T>(arr: readonly T[], rand: () => number): T {
  return arr[Math.floor(rand() * arr.length)];
}

function range(min: number, max: number, rand: () => number): number {
  return Math.floor(rand() * (max - min + 1)) + min;
}

function sampleCount(lambda: number, rand: () => number): number {
  if (lambda <= 0) return 0;
  if (lambda < 30) {
    const L = Math.exp(-lambda);
    let k = 0;
    let p = 1;
    do {
      k += 1;
      p *= rand();
    } while (p > L && k < 80);
    return k - 1;
  }
  const noise = 0.85 + rand() * 0.3;
  return Math.max(0, Math.round(lambda * noise));
}

export function expectedOrdersForDay(
  business: Pick<
    UserBusiness,
    "category" | "status" | "launchScore" | "createdAt" | "orders" | "currentSellingPrice" | "country"
  >,
  day: Date
): { expected: number; factors: Record<string, number>; holiday: string | null } {
  const weekday = weekdayMultiplier(day, business.category);
  const season = seasonMultiplier(day);
  const category = categoryBase(business.category);
  const status = statusMultiplier(business.status);
  const score = scoreMultiplier(business.launchScore);
  const age = ageRampMultiplier(day, business.createdAt);
  const holiday = getHoliday(day, business.country);
  const holidayBoost = holiday?.boost ?? 1;

  const sizeHint = Math.min(2.5, 0.6 + Math.log10(Math.max(10, business.orders || 10)) * 0.5);
  const priceHint = Math.min(1.4, 0.7 + (business.currentSellingPrice || 5000) / 40000);

  const expected =
    1.1 * sizeHint * priceHint * weekday * season * category * status * score * age * holidayBoost;

  return {
    expected,
    factors: { weekday, season, category, status, score, age, holidayBoost, sizeHint, priceHint },
    holiday: holiday?.name ?? null,
  };
}

function pickHour(rand: () => number): number {
  const weights = Array.from({ length: 24 }, (_, h) => hourWeight(h));
  const total = weights.reduce((a, b) => a + b, 0);
  let r = rand() * total;
  for (let h = 0; h < 24; h++) {
    r -= weights[h];
    if (r <= 0) return h;
  }
  return 19;
}

/** Realistic INR basket size from USD display selling price (~₹900–2,800). */
function inrOrderAmount(business: UserBusiness, rand: () => number): number {
  const usd = business.currentSellingPrice || 28;
  const base = Math.round(Math.min(2800, Math.max(900, usd * 72)));
  return range(Math.floor(base * 0.9), Math.floor(base * 1.15), rand);
}

function buildOrder(business: UserBusiness, day: Date, index: number, rand: () => number): Order {
  const first = pick(FIRST, rand);
  const last = pick(LAST, rand);
  const hour = pickHour(rand);
  const minute = range(0, 59, rand);
  const second = range(0, 59, rand);
  const created = new Date(day);
  created.setHours(hour, minute, second, 0);

  const basePrice = inrOrderAmount(business, rand);
  const amount = Math.round(basePrice * (0.9 + rand() * 0.25));

  return {
    id: `algo_ord_${business.id}_${day.toISOString().slice(0, 10)}_${index}_${range(100, 999, rand)}`,
    businessId: business.id,
    businessName: business.name,
    customerName: `${first} ${last}`,
    customerEmail: `${first.toLowerCase()}.${last.toLowerCase()}${range(1, 99, rand)}@${pick(DOMAINS, rand)}`,
    customerPhone: `+${pick(PHONE_CC, rand)}${range(2000000000, 9999999999, rand)}`,
    amount,
    status: pick(STATUSES, rand),
    country: business.country as Country,
    createdAt: created.toISOString(),
  };
}

function buildLiveOrder(business: UserBusiness, index: number, rand: () => number): Order {
  const first = pick(FIRST, rand);
  const last = pick(LAST, rand);
  const now = new Date();
  // Spread within the last couple of minutes so timestamps feel live
  now.setSeconds(now.getSeconds() - range(0, 110, rand));

  const basePrice = inrOrderAmount(business, rand);
  const amount = Math.round(basePrice * (0.92 + rand() * 0.2));

  return {
    id: `live_ord_${business.id}_${Date.now()}_${index}_${range(100, 9999, rand)}`,
    businessId: business.id,
    businessName: business.name,
    customerName: `${first} ${last}`,
    customerEmail: `${first.toLowerCase()}.${last.toLowerCase()}${range(1, 99, rand)}@${pick(DOMAINS, rand)}`,
    customerPhone: `+${pick(PHONE_CC, rand)}${range(2000000000, 9999999999, rand)}`,
    amount,
    status: pick(STATUSES, rand),
    country: business.country as Country,
    createdAt: now.toISOString(),
  };
}

/**
 * Live tick: small realistic order flow so KPIs crawl up at a ~₹5L stage.
 * Portfolio-wide budget (0–2 orders) keeps growth believable.
 */
export function applyLiveOrderTick(
  data: AppData,
  options: { seed?: number; intensity?: number } = {}
): { data: AppData; created: number; revenue: number } {
  const businesses = data.userBusinesses ?? [];
  if (businesses.length === 0) {
    return { data, created: 0, revenue: 0 };
  }

  const rand = seededRandom(options.seed ?? Date.now() % 1_000_000);
  const intensity = options.intensity ?? 0.035;
  const now = new Date();
  const newOrders: Order[] = [];
  let totalRevenue = 0;

  // 0–2 new orders across the whole portfolio per tick
  let budget = 0;
  const roll = rand();
  if (roll > 0.45) budget = 1;
  if (roll > 0.88) budget = 2;

  const eligible = businesses
    .filter((b) => b.status !== "pending")
    .map((b) => {
      const { expected } = expectedOrdersForDay(b, now);
      return { b, weight: Math.max(0.2, expected * intensity) };
    })
    .sort((a, c) => c.weight - a.weight);

  let orderIndex = 0;
  for (const { b: business, weight } of eligible) {
    if (budget <= 0) break;
    if (rand() > Math.min(0.85, 0.35 + weight)) continue;

    const order = buildLiveOrder(business, orderIndex++, rand);
    newOrders.push(order);
    const profit = Math.round(order.amount * 0.2);
    business.orders += 1;
    business.revenue += order.amount;
    business.profit += profit;
    business.withdrawable += Math.round(profit * 0.65);
    business.inventory = Math.max(0, (business.inventory || 0) - 1);
    totalRevenue += order.amount;
    budget -= 1;

    if (business.status === "growing" && business.orders > 120) {
      business.status = "live";
    }
    if (rand() > 0.92) {
      const stepIndex = business.missionSteps.findIndex((s) => !s.completed);
      if (stepIndex >= 0) {
        business.missionSteps[stepIndex].completed = true;
        business.missionSteps[stepIndex].completedAt = new Date().toISOString();
      }
    }
  }

  if (newOrders.length > 0) {
    data.orders = [...newOrders, ...(data.orders ?? [])].slice(0, 120);
    data.transactions = data.transactions ?? [];
    data.transactions.unshift({
      id: `live_txn_${Date.now()}_${range(100, 999, rand)}`,
      type: "revenue",
      amount: totalRevenue,
      status: "completed",
      description: "Live order algo revenue",
      createdAt: new Date().toISOString(),
    });
    data.transactions = data.transactions.slice(0, 80);

    const top = newOrders[0];
    data.notifications = data.notifications ?? [];
    data.notifications.unshift({
      id: `notif_live_${Date.now()}`,
      title: "New Order",
      message: `${top.businessName} received a new order.`,
      titleKey: "notif.newOrder.title",
      messageKey: "notif.newOrder.msg",
      vars: { name: top.businessName },
      type: "info",
      read: false,
      createdAt: new Date().toISOString(),
    });
    data.notifications = data.notifications.slice(0, 60);
  }

  data.dashboardStats = {
    businesses: businesses.length,
    revenue: businesses.reduce((s, b) => s + b.revenue, 0),
    profit: businesses.reduce((s, b) => s + b.profit, 0),
    withdrawable: businesses.reduce((s, b) => s + b.withdrawable, 0),
    countries: new Set(businesses.map((b) => b.country)).size,
    orders: businesses.reduce((s, b) => s + b.orders, 0),
  };

  return { data, created: newOrders.length, revenue: totalRevenue };
}

export function simulateOrders(
  businesses: UserBusiness[],
  options: OrderAlgoOptions = {}
): SimulateOrdersResult {
  const days = options.days ?? 30;
  const endDate = options.endDate ? new Date(options.endDate) : new Date();
  endDate.setHours(12, 0, 0, 0);
  const seed = options.seed ?? Date.now() % 1_000_000;
  const cap = options.maxOrdersPerBusinessPerDay ?? 8;

  const rand = seededRandom(seed);
  const orders: Order[] = [];
  const byBusiness: Record<string, { orderCount: number; revenue: number; holidayDays: number }> = {};
  const daily = new Map<string, { orders: number; holidayHits: number }>();
  let holidayHits = 0;

  for (const business of businesses) {
    byBusiness[business.id] = { orderCount: 0, revenue: 0, holidayDays: 0 };

    for (let d = days - 1; d >= 0; d--) {
      const day = new Date(endDate);
      day.setDate(endDate.getDate() - d);

      const { expected, holiday } = expectedOrdersForDay(business, day);
      let count = sampleCount(expected, rand);
      count = Math.min(count, cap);

      const dateKey = day.toISOString().slice(0, 10);
      if (!daily.has(dateKey)) daily.set(dateKey, { orders: 0, holidayHits: 0 });
      const dayBucket = daily.get(dateKey)!;
      dayBucket.orders += count;
      if (holiday) {
        dayBucket.holidayHits += 1;
        holidayHits += 1;
        byBusiness[business.id].holidayDays += 1;
      }

      for (let i = 0; i < count; i++) {
        const order = buildOrder(business, day, i, rand);
        orders.push(order);
        byBusiness[business.id].orderCount += 1;
        byBusiness[business.id].revenue += order.amount;
      }
    }
  }

  orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const totalRevenue = orders.reduce((s, o) => s + o.amount, 0);
  const dailyTotals = [...daily.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, v]) => ({ date, orders: v.orders, holidayHits: v.holidayHits }));

  return {
    orders,
    byBusiness,
    summary: {
      totalOrders: orders.length,
      totalRevenue,
      days,
      businesses: businesses.length,
      holidayHits,
    },
    dailyTotals,
  };
}

export function applyOrderSimulation(
  data: AppData,
  options: OrderAlgoOptions = {}
): { data: AppData; result: SimulateOrdersResult | null; created: number } {
  const businesses = data.userBusinesses ?? [];
  if (businesses.length === 0) {
    return { data, result: null, created: 0 };
  }

  const result = simulateOrders(businesses, options);
  const days = options.days ?? 30;
  const cutoff = Date.now() - days * 86400000;

  // Roll back prior algo orders in the window so re-runs stay idempotent
  const priorAlgo = (data.orders ?? []).filter(
    (o) => typeof o.id === "string" && o.id.startsWith("algo_ord_") && new Date(o.createdAt).getTime() >= cutoff
  );
  for (const o of priorAlgo) {
    const biz = businesses.find((b) => b.id === o.businessId);
    if (!biz) continue;
    biz.orders = Math.max(0, biz.orders - 1);
    biz.revenue = Math.max(0, biz.revenue - o.amount);
    const profitShare = Math.round(o.amount * 0.22);
    biz.profit = Math.max(0, biz.profit - profitShare);
    biz.withdrawable = Math.max(0, biz.withdrawable - Math.round(profitShare * 0.7));
    biz.inventory += 1;
  }

  const kept = (data.orders ?? []).filter((o) => !priorAlgo.includes(o));
  data.orders = [...result.orders, ...kept].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Drop prior algo revenue rollups from this window
  data.transactions = (data.transactions ?? []).filter(
    (t) => !(typeof t.id === "string" && t.id.startsWith("algo_txn_"))
  );

  for (const business of businesses) {
    const stats = result.byBusiness[business.id];
    if (!stats) continue;
    business.orders += stats.orderCount;
    business.revenue += stats.revenue;
    const profit = Math.round(stats.revenue * 0.22);
    business.profit += profit;
    business.withdrawable += Math.round(profit * 0.7);
    business.inventory = Math.max(0, (business.inventory || 0) - stats.orderCount);
    if (business.status === "pending" && stats.orderCount > 0) {
      business.status = "growing";
    } else if (business.status === "growing" && stats.orderCount > 40) {
      business.status = "live";
    }
  }

  for (const business of businesses) {
    const stats = result.byBusiness[business.id];
    if (!stats || stats.orderCount === 0) continue;
    data.transactions.unshift({
      id: `algo_txn_${business.id}_${Date.now()}_${Math.floor(Math.random() * 999)}`,
      type: "revenue",
      amount: stats.revenue,
      status: "completed",
      description: `Revenue from ${business.name}`,
      businessName: business.name,
      createdAt: new Date().toISOString(),
    });
  }

  if (!data.notifications) data.notifications = [];
  data.notifications.unshift({
    id: `notif_algo_${Date.now()}`,
    title: "Order Algo Ran",
    message: `Generated ${result.summary.totalOrders} orders across ${result.summary.businesses} businesses (${result.summary.days} days).`,
    titleKey: "notif.algoOrders.title",
    messageKey: "notif.algoOrders.msg",
    vars: {
      n: String(result.summary.totalOrders),
      businesses: String(result.summary.businesses),
      days: String(result.summary.days),
    },
    type: "success",
    read: false,
    createdAt: new Date().toISOString(),
  });

  data.dashboardStats = {
    businesses: businesses.length,
    revenue: businesses.reduce((s, b) => s + b.revenue, 0),
    profit: businesses.reduce((s, b) => s + b.profit, 0),
    withdrawable: businesses.reduce((s, b) => s + b.withdrawable, 0),
    countries: new Set(businesses.map((b) => b.country)).size,
    orders: businesses.reduce((s, b) => s + b.orders, 0),
  };

  return { data, result, created: result.summary.totalOrders };
}
