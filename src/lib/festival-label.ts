import type { LanguageCode } from "./i18n";

const DATE_LOCALES: Record<string, string> = {
  en: "en-US",
  hi: "hi-IN",
  es: "es-ES",
  fr: "fr-FR",
  ar: "ar-AE",
  de: "de-DE",
};

function festivalKey(name: string): string {
  return `festival.${name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "")}`;
}

type TranslateFn = (key: string, vars?: Record<string, string | number>) => string;

export function translateFestivalName(name: string, t: TranslateFn): string {
  const key = festivalKey(name);
  const translated = t(key);
  return translated === key ? name : translated;
}

export function formatFestivalDate(
  isoDate: string,
  language: LanguageCode | string
): string {
  const locale = DATE_LOCALES[language] ?? "en-US";
  return new Date(`${isoDate}T12:00:00`).toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatFestivalChip(
  festivalName: string,
  festivalDate: string,
  t: TranslateFn,
  language: LanguageCode | string
): string {
  return `${translateFestivalName(festivalName, t)} · ${formatFestivalDate(festivalDate, language)}`;
}
