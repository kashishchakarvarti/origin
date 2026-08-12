import type { Category, Country, Opportunity, Product } from "./types";
import { getCategoryImage } from "./images";
import { INCLUDED_SERVICES } from "./constants";

/** Real upcoming 2026 festival commerce windows (from Aug 2026 onward) */
export interface FestivalOpportunityDef {
  id: string;
  country: Country;
  festival: string;
  /** ISO date — peak commerce / festival day */
  festivalDate: string;
  category: Category;
  brandName: string;
  description: string;
  specialist: string;
  launchScore: number;
  sellingPrice: number;
  monthlyOrders: number;
  capacity: number;
  peopleStarted: number;
  status: NonNullable<Opportunity["status"]>;
  products: {
    id: string;
    name: string;
    crestPrice: number;
    launchScore: number;
    monthlyOrders: number;
  }[];
}

/**
 * One festival-led opportunity per market we support.
 * Dates verified against 2026 calendars (Diwali, Oktoberfest, Thanksgiving, etc.).
 */
export const FESTIVAL_OPPORTUNITY_DEFS: FestivalOpportunityDef[] = [
  {
    id: "fest_usa_halloween",
    country: "USA",
    festival: "Halloween",
    festivalDate: "2026-10-31",
    category: "Home",
    brandName: "HauntGlow™",
    description:
      "Seasonal home décor and ambient lighting for Halloween 2026 (Oct 31). Built for US spike demand in porch décor, lanterns, and cozy hosting setups with CREST fulfillment.",
    specialist: "Marcus Chen",
    launchScore: 94,
    sellingPrice: 34.99,
    monthlyOrders: 4800,
    capacity: 28,
    peopleStarted: 612,
    status: "high_potential",
    products: [
      { id: "fest_prod_usa_1", name: "Amber Lantern Lamp", crestPrice: 42000, launchScore: 93, monthlyOrders: 2100 },
      { id: "fest_prod_usa_2", name: "Midnight Throw Blanket", crestPrice: 38000, launchScore: 91, monthlyOrders: 1800 },
      { id: "fest_prod_usa_3", name: "Entryway Organizer", crestPrice: 32000, launchScore: 88, monthlyOrders: 1500 },
      { id: "fest_prod_usa_4", name: "Glow Diffuser", crestPrice: 29000, launchScore: 90, monthlyOrders: 1600 },
    ],
  },
  {
    id: "fest_canada_thanksgiving",
    country: "Canada",
    festival: "Thanksgiving",
    festivalDate: "2026-10-12",
    category: "Kitchen",
    brandName: "HarvestTable™",
    description:
      "Hosting kitchen essentials timed for Canadian Thanksgiving 2026 (Oct 12). Cookware, serving, and storage SKUs for family dinner peaks with CREST logistics across Canada.",
    specialist: "Emma Wilson",
    launchScore: 92,
    sellingPrice: 49.99,
    monthlyOrders: 3200,
    capacity: 34,
    peopleStarted: 428,
    status: "high_potential",
    products: [
      { id: "fest_prod_ca_1", name: "Heritage Cookware", crestPrice: 78000, launchScore: 94, monthlyOrders: 1400 },
      { id: "fest_prod_ca_2", name: "Serving Storage Set", crestPrice: 41000, launchScore: 89, monthlyOrders: 1200 },
      { id: "fest_prod_ca_3", name: "Carving Knife Set", crestPrice: 36000, launchScore: 91, monthlyOrders: 1100 },
      { id: "fest_prod_ca_4", name: "Spice Rack", crestPrice: 24000, launchScore: 86, monthlyOrders: 900 },
    ],
  },
  {
    id: "fest_uk_boxing",
    country: "UK",
    festival: "Boxing Day",
    festivalDate: "2026-12-26",
    category: "Beauty",
    brandName: "GiftAura™",
    description:
      "Gift-ready beauty sets for UK Boxing Day 2026 (Dec 26) sales. Premium self-care bundles for post-Christmas gifting and retail peak with CREST marketplace ops.",
    specialist: "Oliver Hall",
    launchScore: 93,
    sellingPrice: 39.99,
    monthlyOrders: 4100,
    capacity: 22,
    peopleStarted: 701,
    status: "high_potential",
    products: [
      { id: "fest_prod_uk_1", name: "Gift Serum Duo", crestPrice: 48000, launchScore: 95, monthlyOrders: 1900 },
      { id: "fest_prod_uk_2", name: "Holiday Mask Set", crestPrice: 35000, launchScore: 92, monthlyOrders: 1700 },
      { id: "fest_prod_uk_3", name: "Velvet Lip Care", crestPrice: 22000, launchScore: 88, monthlyOrders: 1400 },
      { id: "fest_prod_uk_4", name: "Winter Moisturizer", crestPrice: 31000, launchScore: 90, monthlyOrders: 1500 },
    ],
  },
  {
    id: "fest_au_christmas",
    country: "Australia",
    festival: "Christmas",
    festivalDate: "2026-12-25",
    category: "Travel",
    brandName: "SummerNoel™",
    description:
      "Summer Christmas travel kits for Australia 2026 (Dec 25). Packing, beach-ready travel, and gift luggage SKUs for the holiday getaway surge.",
    specialist: "Chloe Taylor",
    launchScore: 91,
    sellingPrice: 59.99,
    monthlyOrders: 2900,
    capacity: 31,
    peopleStarted: 356,
    status: "emerging",
    products: [
      { id: "fest_prod_au_1", name: "Holiday Luggage Set", crestPrice: 92000, launchScore: 93, monthlyOrders: 1100 },
      { id: "fest_prod_au_2", name: "Festive Packing Cubes", crestPrice: 28000, launchScore: 90, monthlyOrders: 1300 },
      { id: "fest_prod_au_3", name: "Travel Toiletry Bag", crestPrice: 26000, launchScore: 87, monthlyOrders: 1200 },
      { id: "fest_prod_au_4", name: "Daypack", crestPrice: 34000, launchScore: 89, monthlyOrders: 1000 },
    ],
  },
  {
    id: "fest_de_oktoberfest",
    country: "Germany",
    festival: "Oktoberfest",
    festivalDate: "2026-09-19",
    category: "Kitchen",
    brandName: "ProstHaus™",
    description:
      "Home hosting kitchen line for Oktoberfest 2026 (Sep 19–Oct 4). Serving, drinkware-adjacent kitchen tools, and storage for Munich-season demand across Germany.",
    specialist: "Lucas Weber",
    launchScore: 95,
    sellingPrice: 44.99,
    monthlyOrders: 3600,
    capacity: 19,
    peopleStarted: 884,
    status: "high_potential",
    products: [
      { id: "fest_prod_de_1", name: "Festival Cookware", crestPrice: 72000, launchScore: 94, monthlyOrders: 1300 },
      { id: "fest_prod_de_2", name: "Serving Storage Set", crestPrice: 39000, launchScore: 91, monthlyOrders: 1200 },
      { id: "fest_prod_de_3", name: "Beer Garden Knife Set", crestPrice: 33000, launchScore: 88, monthlyOrders: 1000 },
      { id: "fest_prod_de_4", name: "Pretzel Cutting Board", crestPrice: 21000, launchScore: 86, monthlyOrders: 950 },
    ],
  },
  {
    id: "fest_fr_christmas",
    country: "France",
    festival: "Christmas",
    festivalDate: "2026-12-25",
    category: "Beauty",
    brandName: "NoëlLuxe™",
    description:
      "Luxury beauty gifting for French Christmas 2026 (Dec 25). Serum, mask, and lip care coffrets aligned to Noël retail peaks with CREST EU fulfillment.",
    specialist: "Sofia Martin",
    launchScore: 94,
    sellingPrice: 42.99,
    monthlyOrders: 3800,
    capacity: 25,
    peopleStarted: 540,
    status: "high_potential",
    products: [
      { id: "fest_prod_fr_1", name: "Noël Serum", crestPrice: 52000, launchScore: 96, monthlyOrders: 1600 },
      { id: "fest_prod_fr_2", name: "Coffret Mask Set", crestPrice: 37000, launchScore: 93, monthlyOrders: 1500 },
      { id: "fest_prod_fr_3", name: "Rouge Lip Care", crestPrice: 24000, launchScore: 89, monthlyOrders: 1400 },
      { id: "fest_prod_fr_4", name: "Night Eye Cream", crestPrice: 41000, launchScore: 91, monthlyOrders: 1200 },
    ],
  },
  {
    id: "fest_jp_labour_thanks",
    country: "Japan",
    festival: "Labour Thanksgiving Day",
    festivalDate: "2026-11-23",
    category: "Office",
    brandName: "KanshaDesk™",
    description:
      "Appreciation gifts for Japan’s Labour Thanksgiving Day 2026 (Nov 23). Premium desk and stationery sets for corporate and personal thank-you gifting.",
    specialist: "Kenji Sato",
    launchScore: 90,
    sellingPrice: 36.99,
    monthlyOrders: 2700,
    capacity: 36,
    peopleStarted: 298,
    status: "emerging",
    products: [
      { id: "fest_prod_jp_1", name: "Gift Desk Lamp", crestPrice: 45000, launchScore: 92, monthlyOrders: 1000 },
      { id: "fest_prod_jp_2", name: "Notebook Set", crestPrice: 22000, launchScore: 88, monthlyOrders: 1400 },
      { id: "fest_prod_jp_3", name: "Pen Collection", crestPrice: 28000, launchScore: 90, monthlyOrders: 1200 },
      { id: "fest_prod_jp_4", name: "Desk Mat", crestPrice: 19000, launchScore: 85, monthlyOrders: 1100 },
    ],
  },
  {
    id: "fest_sg_midautumn",
    country: "Singapore",
    festival: "Mid-Autumn Festival",
    festivalDate: "2026-09-25",
    category: "Home",
    brandName: "LanternBay™",
    description:
      "Lantern-inspired home décor for Singapore Mid-Autumn Festival 2026 (Sep 25). Ambient lighting, organizers, and gifting pieces for family gatherings.",
    specialist: "Mei Tan",
    launchScore: 93,
    sellingPrice: 32.99,
    monthlyOrders: 3100,
    capacity: 27,
    peopleStarted: 467,
    status: "high_potential",
    products: [
      { id: "fest_prod_sg_1", name: "Lantern Glow Lamp", crestPrice: 40000, launchScore: 94, monthlyOrders: 1500 },
      { id: "fest_prod_sg_2", name: "Festival Diffuser", crestPrice: 30000, launchScore: 91, monthlyOrders: 1300 },
      { id: "fest_prod_sg_3", name: "Gift Organizer", crestPrice: 27000, launchScore: 87, monthlyOrders: 1100 },
      { id: "fest_prod_sg_4", name: "Moon Throw Blanket", crestPrice: 35000, launchScore: 89, monthlyOrders: 1000 },
    ],
  },
  {
    id: "fest_uae_national",
    country: "UAE",
    festival: "UAE National Day",
    festivalDate: "2026-12-02",
    category: "Beauty",
    brandName: "FalconGlow™",
    description:
      "Celebration beauty gifts for UAE National Day 2026 (Dec 2). Premium skincare and grooming sets for corporate and family gifting across the Emirates.",
    specialist: "Amara Khan",
    launchScore: 96,
    sellingPrice: 54.99,
    monthlyOrders: 4500,
    capacity: 18,
    peopleStarted: 920,
    status: "high_potential",
    products: [
      { id: "fest_prod_uae_1", name: "National Serum", crestPrice: 58000, launchScore: 97, monthlyOrders: 1800 },
      { id: "fest_prod_uae_2", name: "Gold Mask Set", crestPrice: 44000, launchScore: 94, monthlyOrders: 1600 },
      { id: "fest_prod_uae_3", name: "Desert Hair Oil", crestPrice: 36000, launchScore: 92, monthlyOrders: 1400 },
      { id: "fest_prod_uae_4", name: "Luxe Moisturizer", crestPrice: 40000, launchScore: 93, monthlyOrders: 1500 },
    ],
  },
  {
    id: "fest_in_diwali",
    country: "India",
    festival: "Diwali",
    festivalDate: "2026-11-08",
    category: "Home",
    brandName: "DeepaLume™",
    description:
      "Festival of Lights home & gifting for Diwali 2026 (Nov 8). Diya-style lamps, décor, and gift organizers for India’s largest seasonal commerce peak.",
    specialist: "Priya Sharma",
    launchScore: 97,
    sellingPrice: 24.99,
    monthlyOrders: 6200,
    capacity: 14,
    peopleStarted: 1480,
    status: "high_potential",
    products: [
      { id: "fest_prod_in_1", name: "Diya Glow Lamp", crestPrice: 28000, launchScore: 96, monthlyOrders: 2800 },
      { id: "fest_prod_in_2", name: "Rangoli Diffuser", crestPrice: 22000, launchScore: 93, monthlyOrders: 2400 },
      { id: "fest_prod_in_3", name: "Gift Organizer", crestPrice: 18000, launchScore: 90, monthlyOrders: 2000 },
      { id: "fest_prod_in_4", name: "Festive Throw Blanket", crestPrice: 26000, launchScore: 91, monthlyOrders: 1800 },
    ],
  },
];

export function buildFestivalProducts(): Product[] {
  return FESTIVAL_OPPORTUNITY_DEFS.flatMap((def) =>
    def.products.map((p) => ({
      id: p.id,
      name: p.name,
      category: def.category,
      crestPrice: p.crestPrice,
      launchScore: p.launchScore,
      monthlyOrders: p.monthlyOrders,
      image: getCategoryImage(def.category, p.id),
    }))
  );
}

export function buildFestivalOpportunities(): Opportunity[] {
  return FESTIVAL_OPPORTUNITY_DEFS.map((def) => {
    const crestPrice = def.products.reduce((s, p) => s + p.crestPrice, 0);
    return {
      id: def.id,
      name: def.brandName,
      country: def.country,
      category: def.category,
      launchScore: def.launchScore,
      crestPrice,
      recommendedSellingPrice: def.sellingPrice,
      monthlyOrders: def.monthlyOrders,
      minimumLaunchCost: crestPrice,
      availableCapacity: def.capacity,
      peopleStarted: def.peopleStarted,
      status: def.status,
      image: getCategoryImage(def.category, def.id),
      description: def.description,
      productsIncluded: def.products.map((p) => p.name),
      productIds: def.products.map((p) => p.id),
      commerceSpecialist: def.specialist,
      includedServices: [...INCLUDED_SERVICES],
      festivalName: def.festival,
      festivalDate: def.festivalDate,
    };
  });
}

export function isFestivalOpportunity(opp: Pick<Opportunity, "festivalName" | "festivalDate" | "id">): boolean {
  return Boolean(opp.festivalName && opp.festivalDate) || opp.id.startsWith("fest_");
}

/** Sort soonest festival first; past dates sink to the end. */
export function sortByFestivalDate(opportunities: Opportunity[]): Opportunity[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return [...opportunities].sort((a, b) => {
    const da = a.festivalDate ? new Date(`${a.festivalDate}T12:00:00`).getTime() : Infinity;
    const db = b.festivalDate ? new Date(`${b.festivalDate}T12:00:00`).getTime() : Infinity;
    const aPast = da < today.getTime();
    const bPast = db < today.getTime();
    if (aPast !== bPast) return aPast ? 1 : -1;
    return da - db;
  });
}

export function daysUntilFestival(festivalDate: string, from = new Date()): number {
  const target = new Date(`${festivalDate}T12:00:00`);
  const start = new Date(from);
  start.setHours(12, 0, 0, 0);
  return Math.ceil((target.getTime() - start.getTime()) / 86400000);
}
