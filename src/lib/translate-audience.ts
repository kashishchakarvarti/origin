import { AUDIENCE_OPTION_KEYS } from "./i18n-audience";
import { FILTER_OPTION_LABELS } from "./audience-filters";

type TranslateFn = (key: string, vars?: Record<string, string | number>) => string;

/** Translate interest/behavior/keyword chip labels */
export function translateAudienceTag(value: string, t: TranslateFn): string {
  const key = AUDIENCE_OPTION_KEYS[value];
  if (key) return t(key);
  const english = FILTER_OPTION_LABELS[value];
  return english ?? value;
}

export function translateGenderLabel(value: string, t: TranslateFn): string {
  return t(`audience.gender.${value}`);
}

export function translatePlatformLabel(value: string, t: TranslateFn): string {
  return t(`audience.platform.${value}`);
}

export function translatePlacementLabel(value: string, t: TranslateFn): string {
  return t(`audience.placement.${value}`);
}

export function translateBidLabel(value: string, t: TranslateFn): string {
  return t(`audience.bid.${value}`);
}

export function translateParentalLabel(value: string, t: TranslateFn): string {
  return t(`audience.parental.${value}`);
}

export function translateIncomeLabel(value: string, t: TranslateFn): string {
  return t(`audience.income.${value}`);
}

export function translateAudienceLangLabel(value: string, t: TranslateFn): string {
  return t(`audience.lang.${value}`);
}

export function formatAudienceReachI18n(n: number, t: TranslateFn): string {
  if (n >= 1_000_000) return t("audience.reach.m", { n: (n / 1_000_000).toFixed(1) });
  if (n >= 1_000) return t("audience.reach.k", { n: Math.round(n / 1_000) });
  return t("audience.reach.n", { n: n.toLocaleString() });
}

export function summarizeTargetingI18n(
  _targeting: {
    aiDecided?: boolean;
    ageMin: number;
    ageMax: number;
    gender: string;
    platforms: string[];
    google?: { placements: string[]; bidStrategy: string };
  },
  t: TranslateFn,
  isAi: boolean
): string {
  return isAi ? t("audience.aiTargeting") : t("audience.customTargeting");
}
