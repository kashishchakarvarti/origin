/**
 * Fake-order simulator.
 * For each business × day, expected volume is shaped by:
 * weekday/weekend, holidays, season, category, status, launch score, age ramp.
 */

import { getHoliday } from "./holidays.mjs";
import {
  ageRampMultiplier,
  categoryBase,
  hourWeight,
  scoreMultiplier,
  seasonMultiplier,
  statusMultiplier,
  weekdayMultiplier,
} from "./factors.mjs";

const FIRST = ["Alex", "Jordan", "Taylor", "Morgan", "Casey", "Riley", "Quinn", "Avery", "Blake", "Cameron", "Sam", "Jamie"];
const LAST = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Wilson", "Moore", "Patel", "Chen"];
const DOMAINS = ["mail.com", "inbox.co", "email.net", "post.io", "box.app"];
const PHONE_CC = ["1", "44", "91", "61", "49", "33", "971", "81", "65"];
const STATUSES = /** @type {const} */ (["completed", "processing", "shipped"]);

/**
 * @param {number} seed
 */
function seededRandom(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/**
 * @template T
 * @param {readonly T[]} arr
 * @param {() => number} rand
 */
function pick(arr, rand) {
  return arr[Math.floor(rand() * arr.length)];
}

/**
 * @param {number} min
 * @param {number} max
 * @param {() => number} rand
 */
function range(min, max, rand) {
  return Math.floor(rand() * (max - min + 1)) + min;
}

/**
 * Poisson-ish sample from expected rate λ (clamped).
 * @param {number} lambda
 * @param {() => number} rand
 */
function sampleCount(lambda, rand) {
  if (lambda <= 0) return 0;
  // Knuth for small λ; otherwise round with noise
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

/**
 * Expected orders for one business on one calendar day.
 * @param {object} business
 * @param {Date} day
 * @returns {{ expected: number; factors: Record<string, number>; holiday: string | null }}
 */
export function expectedOrdersForDay(business, day) {
  const weekday = weekdayMultiplier(day, business.category);
  const season = seasonMultiplier(day);
  const category = categoryBase(business.category);
  const status = statusMultiplier(business.status);
  const score = scoreMultiplier(business.launchScore);
  const age = ageRampMultiplier(day, business.createdAt);
  const holiday = getHoliday(day, business.country);
  const holidayBoost = holiday?.boost ?? 1;

  // Base ~2–8 orders/day scaled by business size (orders history + price band)
  const sizeHint = Math.min(2.5, 0.6 + Math.log10(Math.max(10, business.orders || 10)) * 0.5);
  const priceHint = Math.min(1.4, 0.7 + (business.currentSellingPrice || 5000) / 40000);

  const expected =
    3.2 * sizeHint * priceHint * weekday * season * category * status * score * age * holidayBoost;

  return {
    expected,
    factors: { weekday, season, category, status, score, age, holidayBoost, sizeHint, priceHint },
    holiday: holiday?.name ?? null,
  };
}

/**
 * Pick an hour weighted by shopping patterns.
 * @param {() => number} rand
 */
function pickHour(rand) {
  const weights = Array.from({ length: 24 }, (_, h) => hourWeight(h));
  const total = weights.reduce((a, b) => a + b, 0);
  let r = rand() * total;
  for (let h = 0; h < 24; h++) {
    r -= weights[h];
    if (r <= 0) return h;
  }
  return 19;
}

/**
 * @param {object} business
 * @param {Date} day
 * @param {number} index
 * @param {() => number} rand
 */
function buildOrder(business, day, index, rand) {
  const first = pick(FIRST, rand);
  const last = pick(LAST, rand);
  const hour = pickHour(rand);
  const minute = range(0, 59, rand);
  const second = range(0, 59, rand);
  const created = new Date(day);
  created.setHours(hour, minute, second, 0);

  const basePrice = business.currentSellingPrice || range(2000, 25000, rand);
  const amount = Math.round(basePrice * (0.7 + rand() * 0.8));

  return {
    id: `algo_ord_${business.id}_${day.toISOString().slice(0, 10)}_${index}_${range(100, 999, rand)}`,
    businessId: business.id,
    businessName: business.name,
    customerName: `${first} ${last}`,
    customerEmail: `${first.toLowerCase()}.${last.toLowerCase()}${range(1, 99, rand)}@${pick(DOMAINS, rand)}`,
    customerPhone: `+${pick(PHONE_CC, rand)}${range(2000000000, 9999999999, rand)}`,
    amount,
    status: pick(STATUSES, rand),
    country: business.country,
    createdAt: created.toISOString(),
  };
}

/**
 * Simulate orders across businesses for a lookback window.
 *
 * @param {object[]} businesses
 * @param {{
 *   days?: number;
 *   endDate?: Date;
 *   seed?: number;
 *   maxOrdersPerBusinessPerDay?: number;
 * }} [options]
 * @returns {{
 *   orders: object[];
 *   byBusiness: Record<string, { orderCount: number; revenue: number; holidayDays: number }>;
 *   summary: { totalOrders: number; totalRevenue: number; days: number; businesses: number; holidayHits: number };
 *   dailyTotals: { date: string; orders: number; holidayHits: number }[];
 * }}
 */
export function simulateOrders(businesses, options = {}) {
  const days = options.days ?? 30;
  const endDate = options.endDate ? new Date(options.endDate) : new Date();
  endDate.setHours(12, 0, 0, 0);
  const seed = options.seed ?? Date.now() % 1_000_000;
  const cap = options.maxOrdersPerBusinessPerDay ?? 40;

  const rand = seededRandom(seed);
  /** @type {object[]} */
  const orders = [];
  /** @type {Record<string, { orderCount: number; revenue: number; holidayDays: number }>} */
  const byBusiness = {};
  /** @type {Map<string, { orders: number; holidayHits: number }>} */
  const daily = new Map();
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
      const dayBucket = daily.get(dateKey);
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

/**
 * Apply simulated orders onto a mutable AppData-like object.
 * Updates orders list, business aggregates, transactions, notifications, dashboardStats.
 *
 * @param {object} data - AppData shape
 * @param {{ days?: number; seed?: number; replaceRecent?: boolean }} [options]
 */
export function applyOrderSimulation(data, options = {}) {
  const businesses = data.userBusinesses ?? [];
  if (businesses.length === 0) {
    return { data, result: null, created: 0 };
  }

  const result = simulateOrders(businesses, options);
  const days = options.days ?? 30;
  const cutoff = Date.now() - days * 86400000;

  // Drop prior algo-generated orders in the window (idempotent re-runs)
  const kept = (data.orders ?? []).filter((o) => {
    if (typeof o.id === "string" && o.id.startsWith("algo_ord_")) {
      return new Date(o.createdAt).getTime() < cutoff;
    }
    return true;
  });

  data.orders = [...result.orders, ...kept].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
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

  // Revenue transactions (one rollup per business)
  if (!data.transactions) data.transactions = [];
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
