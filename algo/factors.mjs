/**
 * Demand multipliers for the fake-order algorithm.
 * Combines weekday/weekend, season, category, status, and business health.
 */

/** @typedef {"Baby"|"Home"|"Kitchen"|"Beauty"|"Pet"|"Fitness"|"Electronics"|"Travel"|"Office"|"Health"} Category */

/** Weekend-heavy consumer categories vs weekday-leaning */
const WEEKEND_BIAS = {
  Baby: 1.15,
  Home: 1.25,
  Kitchen: 1.2,
  Beauty: 1.35,
  Pet: 1.2,
  Fitness: 1.1,
  Electronics: 1.3,
  Travel: 1.4,
  Office: 0.55,
  Health: 1.05,
};

/** Baseline daily order rate scale by category (relative) */
const CATEGORY_BASE = {
  Baby: 1.0,
  Home: 1.1,
  Kitchen: 0.95,
  Beauty: 1.25,
  Pet: 0.9,
  Fitness: 1.05,
  Electronics: 1.35,
  Travel: 0.85,
  Office: 0.75,
  Health: 1.0,
};

const STATUS_MULT = {
  live: 1.0,
  growing: 0.72,
  pending: 0.2,
};

/** Month index 0–11 → seasonal lift */
const SEASON = [
  0.85, // Jan post-holiday dip
  0.9, // Feb
  1.0, // Mar
  1.05, // Apr
  1.1, // May
  1.15, // Jun
  1.2, // Jul summer peak
  1.15, // Aug
  1.05, // Sep
  1.15, // Oct festive ramp
  1.45, // Nov BFCM
  1.5, // Dec holidays
];

/**
 * @param {Date} date
 * @param {Category|string} category
 */
export function weekdayMultiplier(date, category) {
  const day = date.getDay(); // 0 Sun … 6 Sat
  const isWeekend = day === 0 || day === 6;
  const bias = WEEKEND_BIAS[category] ?? 1;
  if (isWeekend) return bias;
  // Midweek trough Tue/Wed, recovery Thu/Fri
  if (day === 1) return 0.95 / Math.sqrt(bias);
  if (day === 2 || day === 3) return 0.88 / Math.sqrt(bias);
  if (day === 4) return 1.02;
  return 1.08; // Friday
}

/**
 * @param {Date} date
 */
export function seasonMultiplier(date) {
  return SEASON[date.getMonth()] ?? 1;
}

/**
 * @param {Category|string} category
 */
export function categoryBase(category) {
  return CATEGORY_BASE[category] ?? 1;
}

/**
 * @param {"live"|"growing"|"pending"|string} status
 */
export function statusMultiplier(status) {
  return STATUS_MULT[status] ?? 0.5;
}

/**
 * Launch score 0–100 → 0.6–1.4
 * @param {number} launchScore
 */
export function scoreMultiplier(launchScore) {
  const clamped = Math.max(0, Math.min(100, launchScore ?? 80));
  return 0.6 + (clamped / 100) * 0.8;
}

/**
 * Newer businesses ramp up over ~30 days after createdAt.
 * @param {Date} day
 * @param {string} createdAt
 */
export function ageRampMultiplier(day, createdAt) {
  if (!createdAt) return 1;
  const created = new Date(createdAt);
  const ageDays = Math.floor((day.getTime() - created.getTime()) / 86400000);
  if (ageDays < 0) return 0;
  if (ageDays < 7) return 0.35 + ageDays * 0.05;
  if (ageDays < 30) return 0.7 + (ageDays - 7) * 0.013;
  return 1;
}

/**
 * Hour-of-day weight for spreading order timestamps (peak evenings).
 * @param {number} hour 0–23
 */
export function hourWeight(hour) {
  const weights = [
    0.2, 0.1, 0.08, 0.08, 0.1, 0.2, 0.4, 0.6, 0.8, 0.9, 1.0, 1.1, 1.15, 1.1, 1.0, 0.95, 1.05, 1.25,
    1.4, 1.5, 1.35, 1.1, 0.7, 0.4,
  ];
  return weights[hour] ?? 1;
}

export { WEEKEND_BIAS, CATEGORY_BASE, STATUS_MULT, SEASON };
