/** Demand multipliers: weekday/weekend, season, category, status, score, age. */

const WEEKEND_BIAS: Record<string, number> = {
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

const CATEGORY_BASE: Record<string, number> = {
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

const STATUS_MULT: Record<string, number> = {
  live: 1.0,
  growing: 0.72,
  pending: 0.2,
};

const SEASON = [0.85, 0.9, 1.0, 1.05, 1.1, 1.15, 1.2, 1.15, 1.05, 1.15, 1.45, 1.5];

export function weekdayMultiplier(date: Date, category: string): number {
  const day = date.getDay();
  const isWeekend = day === 0 || day === 6;
  const bias = WEEKEND_BIAS[category] ?? 1;
  if (isWeekend) return bias;
  if (day === 1) return 0.95 / Math.sqrt(bias);
  if (day === 2 || day === 3) return 0.88 / Math.sqrt(bias);
  if (day === 4) return 1.02;
  return 1.08;
}

export function seasonMultiplier(date: Date): number {
  return SEASON[date.getMonth()] ?? 1;
}

export function categoryBase(category: string): number {
  return CATEGORY_BASE[category] ?? 1;
}

export function statusMultiplier(status: string): number {
  return STATUS_MULT[status] ?? 0.5;
}

export function scoreMultiplier(launchScore: number): number {
  const clamped = Math.max(0, Math.min(100, launchScore ?? 80));
  return 0.6 + (clamped / 100) * 0.8;
}

export function ageRampMultiplier(day: Date, createdAt?: string): number {
  if (!createdAt) return 1;
  const created = new Date(createdAt);
  const ageDays = Math.floor((day.getTime() - created.getTime()) / 86400000);
  if (ageDays < 0) return 0;
  if (ageDays < 7) return 0.35 + ageDays * 0.05;
  if (ageDays < 30) return 0.7 + (ageDays - 7) * 0.013;
  return 1;
}

export function hourWeight(hour: number): number {
  const weights = [
    0.2, 0.1, 0.08, 0.08, 0.1, 0.2, 0.4, 0.6, 0.8, 0.9, 1.0, 1.1, 1.15, 1.1, 1.0, 0.95, 1.05, 1.25,
    1.4, 1.5, 1.35, 1.1, 0.7, 0.4,
  ];
  return weights[hour] ?? 1;
}
