/**
 * Country-aware holiday calendar (month-day keys).
 */

type Holiday = { name: string; boost: number };

const GLOBAL: Record<string, Holiday> = {
  "01-01": { name: "New Year", boost: 1.45 },
  "02-14": { name: "Valentine's Day", boost: 1.55 },
  "11-24": { name: "Black Friday Week", boost: 2.2 },
  "11-25": { name: "Black Friday", boost: 2.4 },
  "11-28": { name: "Cyber Monday", boost: 2.1 },
  "12-24": { name: "Christmas Eve", boost: 1.9 },
  "12-25": { name: "Christmas", boost: 1.7 },
  "12-26": { name: "Boxing Day", boost: 1.8 },
  "12-31": { name: "New Year's Eve", boost: 1.5 },
};

const BY_COUNTRY: Record<string, Record<string, Holiday>> = {
  USA: {
    "07-04": { name: "Independence Day", boost: 1.5 },
    "11-11": { name: "Veterans Day", boost: 1.25 },
    "10-31": { name: "Halloween", boost: 1.6 },
  },
  Canada: {
    "07-01": { name: "Canada Day", boost: 1.45 },
    "10-31": { name: "Halloween", boost: 1.5 },
  },
  UK: {
    "05-01": { name: "Early May Bank Holiday", boost: 1.35 },
    "08-29": { name: "Summer Bank Holiday", boost: 1.35 },
  },
  Australia: {
    "01-26": { name: "Australia Day", boost: 1.4 },
    "04-25": { name: "ANZAC Day", boost: 1.3 },
  },
  Germany: {
    "10-03": { name: "German Unity Day", boost: 1.35 },
    "12-06": { name: "St. Nicholas", boost: 1.4 },
  },
  France: {
    "07-14": { name: "Bastille Day", boost: 1.4 },
    "05-01": { name: "Labour Day", boost: 1.3 },
  },
  Japan: {
    "01-02": { name: "New Year Holiday", boost: 1.55 },
    "05-03": { name: "Golden Week", boost: 1.65 },
    "05-04": { name: "Golden Week", boost: 1.7 },
    "05-05": { name: "Children's Day", boost: 1.6 },
  },
  Singapore: {
    "02-10": { name: "Chinese New Year", boost: 1.7 },
    "08-09": { name: "National Day", boost: 1.4 },
  },
  UAE: {
    "12-02": { name: "National Day", boost: 1.5 },
    "04-10": { name: "Eid peak", boost: 1.85 },
  },
  India: {
    "01-26": { name: "Republic Day", boost: 1.4 },
    "08-15": { name: "Independence Day", boost: 1.45 },
    "10-20": { name: "Diwali peak", boost: 2.0 },
    "10-21": { name: "Diwali", boost: 2.15 },
    "11-01": { name: "Post-Diwali sales", boost: 1.7 },
  },
};

function dayKey(date: Date): string {
  return `${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function getHoliday(date: Date, country: string): Holiday | null {
  const key = dayKey(date);
  return BY_COUNTRY[country]?.[key] ?? GLOBAL[key] ?? null;
}

export function isHoliday(date: Date, country: string): boolean {
  return getHoliday(date, country) !== null;
}
