import { CATEGORIES, COUNTRIES, INCLUDED_SERVICES, MISSION_STEPS } from "../types.js";
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
  Review,
  Transaction,
  UserBusiness,
  UserProfile,
} from "../types.js";
import { config } from "../config.js";

function seededRandom(seed: number): () => number {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function pick<T>(arr: readonly T[], rand: () => number): T {
  return arr[Math.floor(rand() * arr.length)]!;
}

function range(min: number, max: number, rand: () => number): number {
  return Math.floor(rand() * (max - min + 1)) + min;
}

function categoryImage(category: string, seed: string): string {
  return `https://picsum.photos/seed/${encodeURIComponent(seed + category)}/800/600`;
}

const BRAND_PREFIXES = ["Smart", "Pure", "Eco", "Nova", "Zen", "Prime", "Ultra", "Vital", "Glow", "Swift"];
const BRAND_SUFFIXES = ["Sleep", "Nest", "Wave", "Flow", "Glow", "Fit", "Hub", "Lab", "Pro", "Edge"];
const PRODUCT_TYPES: Record<Category, string[]> = {
  Baby: ["Bottle Set", "Onesie Pack", "Monitor"],
  Home: ["Lamp", "Organizer", "Throw"],
  Kitchen: ["Cookware", "Knife Set", "Storage"],
  Beauty: ["Serum", "Mask Set", "Moisturizer"],
  Pet: ["Feeder", "Bed", "Toy Pack"],
  Fitness: ["Band Set", "Mat", "Bottle"],
  Electronics: ["Charger", "Earbuds", "Stand"],
  Travel: ["Packing Cubes", "Daypack", "Toiletry Bag"],
  Office: ["Desk Lamp", "Notebook", "Organizer"],
  Health: ["Vitamins", "Thermometer", "Bandage Kit"],
};

function businessName(index: number): string {
  return `${BRAND_PREFIXES[index % BRAND_PREFIXES.length]}${BRAND_SUFFIXES[(index * 7) % BRAND_SUFFIXES.length]}™`;
}

function specialist(index: number): string {
  const first = ["Marcus", "Emma", "Oliver", "Sofia", "Kenji", "Priya", "Amara", "Chloe"];
  const last = ["Chen", "Wilson", "Hall", "Martin", "Sato", "Sharma", "Khan", "Taylor"];
  return `${first[index % first.length]} ${last[(index * 3) % last.length]}`;
}

function missionSteps(completed: number): UserBusiness["missionSteps"] {
  return MISSION_STEPS.map((step, i) => ({
    step,
    completed: i < completed,
    completedAt: i < completed ? new Date(Date.now() - (completed - i) * 86400000).toISOString() : undefined,
  }));
}

function computeStats(businesses: UserBusiness[]): DashboardStats {
  return {
    businesses: businesses.length,
    revenue: businesses.reduce((s, b) => s + b.revenue, 0),
    profit: businesses.reduce((s, b) => s + b.profit, 0),
    withdrawable: businesses.reduce((s, b) => s + b.withdrawable, 0),
    countries: new Set(businesses.map((b) => b.country)).size,
    orders: businesses.reduce((s, b) => s + b.orders, 0),
  };
}

const FESTIVAL_DEFS = [
  { id: "fest_usa_halloween", country: "USA" as Country, festival: "Halloween", festivalDate: "2026-10-31", category: "Home" as Category, brand: "HauntGlow™", score: 94 },
  { id: "fest_canada_thanksgiving", country: "Canada" as Country, festival: "Thanksgiving", festivalDate: "2026-10-12", category: "Kitchen" as Category, brand: "HarvestTable™", score: 92 },
  { id: "fest_uk_boxing", country: "UK" as Country, festival: "Boxing Day", festivalDate: "2026-12-26", category: "Beauty" as Category, brand: "GiftAura™", score: 93 },
  { id: "fest_de_oktoberfest", country: "Germany" as Country, festival: "Oktoberfest", festivalDate: "2026-09-19", category: "Kitchen" as Category, brand: "ProstHaus™", score: 95 },
  { id: "fest_in_diwali", country: "India" as Country, festival: "Diwali", festivalDate: "2026-11-08", category: "Home" as Category, brand: "DeepaLume™", score: 97 },
  { id: "fest_uae_national", country: "UAE" as Country, festival: "UAE National Day", festivalDate: "2026-12-02", category: "Beauty" as Category, brand: "FalconGlow™", score: 96 },
  { id: "fest_sg_midautumn", country: "Singapore" as Country, festival: "Mid-Autumn Festival", festivalDate: "2026-09-25", category: "Home" as Category, brand: "LanternBay™", score: 93 },
  { id: "fest_au_christmas", country: "Australia" as Country, festival: "Christmas", festivalDate: "2026-12-25", category: "Travel" as Category, brand: "SummerNoel™", score: 91 },
  { id: "fest_fr_christmas", country: "France" as Country, festival: "Christmas", festivalDate: "2026-12-25", category: "Beauty" as Category, brand: "NoëlLuxe™", score: 94 },
  { id: "fest_jp_labour", country: "Japan" as Country, festival: "Labour Thanksgiving Day", festivalDate: "2026-11-23", category: "Office" as Category, brand: "KanshaDesk™", score: 90 },
];

function buildFestivalProducts(): Product[] {
  return FESTIVAL_DEFS.flatMap((def, i) =>
    [1, 2, 3].map((n) => ({
      id: `fest_prod_${def.country.toLowerCase()}_${n}`,
      name: `${def.festival} ${PRODUCT_TYPES[def.category][(n - 1) % PRODUCT_TYPES[def.category].length]}`,
      category: def.category,
      crestPrice: range(18000, 52000, seededRandom(i * 100 + n)),
      launchScore: range(86, 97, seededRandom(i * 100 + n + 3)),
      monthlyOrders: range(900, 2200, seededRandom(i * 100 + n + 7)),
      image: categoryImage(def.category, `fest_${def.id}_${n}`),
    }))
  );
}

function buildFestivalOpportunities(products: Product[]): Opportunity[] {
  return FESTIVAL_DEFS.map((def) => {
    const productIds = products.filter((p) => p.id.startsWith(`fest_prod_${def.country.toLowerCase()}`)).map((p) => p.id);
    const matched = products.filter((p) => productIds.includes(p.id));
    const crestPrice = matched.reduce((s, p) => s + p.crestPrice, 0) || 90000;
    return {
      id: def.id,
      name: def.brand,
      country: def.country,
      category: def.category,
      launchScore: def.score,
      crestPrice,
      recommendedSellingPrice: 24.99 + (def.score - 90),
      monthlyOrders: 1800 + def.score * 20,
      minimumLaunchCost: crestPrice,
      availableCapacity: 20 + (def.score % 15),
      peopleStarted: 200 + def.score * 8,
      status: "high_potential" as const,
      image: categoryImage(def.category, def.id),
      description: `${def.festival} commerce window for ${def.country} — timed launch with CREST fulfillment.`,
      productsIncluded: matched.map((p) => p.name),
      productIds,
      commerceSpecialist: specialist(def.score),
      includedServices: [...INCLUDED_SERVICES],
      festivalName: def.festival,
      festivalDate: def.festivalDate,
    };
  });
}

function generateProducts(count: number): Product[] {
  const products: Product[] = [];
  for (let i = 0; i < count; i++) {
    const rand = seededRandom(i * 7919 + 42);
    const category = CATEGORIES[i % CATEGORIES.length]!;
    const types = PRODUCT_TYPES[category];
    products.push({
      id: `prod_${i + 1}`,
      name: `${pick(["Premium", "Essential", "Daily", "Pro"], rand)} ${types[i % types.length]}`,
      category,
      crestPrice: range(18000, 95000, rand),
      launchScore: range(72, 96, rand),
      monthlyOrders: range(120, 1800, rand),
      image: categoryImage(category, `prod_${i + 1}`),
    });
  }
  return products;
}

function generateOpportunities(count: number, products: Product[]): Opportunity[] {
  const opps: Opportunity[] = [];
  for (let i = 0; i < count; i++) {
    const rand = seededRandom(i * 3571 + 100);
    const category = CATEGORIES[i % CATEGORIES.length]!;
    const country = COUNTRIES[i % COUNTRIES.length]!;
    const categoryProducts = products.filter((p) => p.category === category).slice(0, range(3, 5, rand));
    const crestPrice = categoryProducts.reduce((s, p) => s + p.crestPrice, 0) || range(50000, 150000, rand);
    opps.push({
      id: `opp_${i + 1}`,
      name: businessName(i),
      country,
      category,
      launchScore: range(78, 97, rand),
      crestPrice,
      recommendedSellingPrice: range(1899, 5999, rand) / 100,
      monthlyOrders: range(180, 900, rand),
      minimumLaunchCost: crestPrice,
      availableCapacity: range(15, 60, rand),
      peopleStarted: range(40, 600, rand),
      status: pick(["new", "emerging", "high_potential", "established"] as const, rand),
      image: categoryImage(category, `opp_${i + 1}`),
      description: `Curated ${category} opportunity in ${country} with CREST ops stack included.`,
      productsIncluded: categoryProducts.map((p) => p.name),
      productIds: categoryProducts.map((p) => p.id),
      commerceSpecialist: specialist(i),
      includedServices: [...INCLUDED_SERVICES],
    });
  }
  return opps;
}

/** ~₹5L total revenue across 5 early-stage brands */
function generateUserBusinesses(products: Product[]): UserBusiness[] {
  const businesses: UserBusiness[] = [];
  for (let i = 0; i < 5; i++) {
    const rand = seededRandom(i * 2341 + 500);
    const category = CATEGORIES[i % CATEGORIES.length]!;
    const country = COUNTRIES[i % COUNTRIES.length]!;
    const categoryProducts = products.filter((p) => p.category === category);
    const productIds = categoryProducts.slice(0, range(2, 4, rand)).map((p) => p.id);
    const revenue = range(55000, 145000, rand);
    const profit = Math.floor(revenue * (0.16 + rand() * 0.07));
    const orders = range(32, 110, rand);
    const completedSteps = range(5, 8, rand);
    businesses.push({
      id: `biz_${i + 1}`,
      name: businessName(i + 50),
      country,
      category,
      status: completedSteps >= 7 ? "growing" : "live",
      revenue,
      profit,
      orders,
      inventory: range(24, 140, rand),
      withdrawable: Math.floor(profit * (0.55 + rand() * 0.2)),
      currentSellingPrice: range(1899, 4999, rand) / 100,
      launchScore: range(82, 96, rand),
      crestPrice: range(45000, 120000, rand),
      image: categoryImage(category, `biz_${i + 1}`),
      commerceSpecialist: specialist(i + 10),
      missionSteps: missionSteps(completedSteps),
      productIds,
      createdAt: new Date(Date.now() - range(21, 150, rand) * 86400000).toISOString(),
    });
  }
  return businesses;
}

function generateOrders(count: number, businesses: UserBusiness[]): Order[] {
  const first = ["Alex", "Jordan", "Taylor", "Morgan", "Casey", "Riley", "Quinn", "Avery"];
  const last = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Patel"];
  const orders: Order[] = [];
  for (let i = 0; i < count; i++) {
    const rand = seededRandom(i * 1237 + 900);
    const business = pick(businesses, rand);
    const f = pick(first, rand);
    const l = pick(last, rand);
    orders.push({
      id: `ord_${i + 1}`,
      businessId: business.id,
      businessName: business.name,
      customerName: `${f} ${l}`,
      customerEmail: `${f.toLowerCase()}.${l.toLowerCase()}${range(1, 99, rand)}@mail.com`,
      customerPhone: `+91${range(7000000000, 9999999999, rand)}`,
      amount: range(799, 2899, rand),
      status: pick(["completed", "processing", "shipped"] as const, rand),
      country: business.country,
      createdAt: new Date(Date.now() - range(0, 90, rand) * 86400000).toISOString(),
    });
  }
  return orders.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
}

function generateTransactions(count: number, businesses: UserBusiness[]): Transaction[] {
  const types = ["withdrawal", "revenue", "refund", "deposit"] as const;
  const txns: Transaction[] = [];
  for (let i = 0; i < count; i++) {
    const rand = seededRandom(i * 4567 + 200);
    const business = pick(businesses, rand);
    const type = pick(types, rand);
    txns.push({
      id: `txn_${i + 1}`,
      type,
      amount: range(1200, 28000, rand),
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
  return txns.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
}

function generateCustomers(count: number): Customer[] {
  const customers: Customer[] = [];
  for (let i = 0; i < count; i++) {
    const rand = seededRandom(i * 8765 + 300);
    customers.push({
      id: `cust_${i + 1}`,
      name: `Customer ${i + 1}`,
      email: `customer${i + 1}@email.com`,
      country: pick(COUNTRIES, rand),
      totalOrders: range(1, 18, rand),
      totalSpent: range(900, 28000, rand),
    });
  }
  return customers;
}

function generateNotifications(count: number, businesses: UserBusiness[]): Notification[] {
  const notifications: Notification[] = [];
  for (let i = 0; i < count; i++) {
    const rand = seededRandom(i * 5432 + 400);
    const business = pick(businesses, rand);
    notifications.push({
      id: `notif_${i + 1}`,
      title: "New Order",
      message: `${business.name} received a new order.`,
      titleKey: "notif.newOrder.title",
      messageKey: "notif.newOrder.msg",
      vars: { name: business.name },
      type: pick(["success", "info", "warning", "milestone"] as const, rand),
      read: rand() > 0.6,
      createdAt: new Date(Date.now() - range(0, 30, rand) * 86400000).toISOString(),
    });
  }
  return notifications.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
}

function generateReviews(products: Product[], opportunities: Opportunity[]): Review[] {
  const reviews: Review[] = [];
  for (let i = 0; i < 40; i++) {
    const rand = seededRandom(i * 2222 + 11);
    const product = pick(products.slice(0, 80), rand);
    const opp = pick(opportunities.slice(0, 40), rand);
    reviews.push({
      id: `rev_${i + 1}`,
      productId: product.id,
      opportunityId: opp.id,
      authorName: `Reviewer ${i + 1}`,
      authorType: pick(["customer", "seller"] as const, rand),
      rating: range(4, 5, rand),
      title: "Solid launch partner",
      comment: "Orders started within the first week with CREST ops.",
      country: pick(COUNTRIES, rand),
      createdAt: new Date(Date.now() - range(2, 120, rand) * 86400000).toISOString(),
      helpful: range(3, 40, rand),
    });
  }
  return reviews;
}

function generateProfile(): UserProfile {
  return {
    id: "user_1",
    name: config.demoUser.name,
    email: config.demoUser.email,
    phone: "+91 98765 43210",
    address: "42 Residency Road, Bengaluru, Karnataka 560025",
    avatar: "https://picsum.photos/seed/crest-avatar/200/200",
    kycStatus: "verified",
    documents: [
      { id: "doc_1", name: "PAN Card", status: "verified", uploadedAt: new Date().toISOString() },
      { id: "doc_2", name: "Aadhaar", status: "verified", uploadedAt: new Date().toISOString() },
    ],
    settings: {
      emailNotifications: true,
      pushNotifications: true,
      currency: "INR",
      language: "en",
      theme: "dark",
    },
  };
}

export function createSeedData(): AppData {
  const baseProducts = generateProducts(200);
  const festivalProducts = buildFestivalProducts();
  const products = [...festivalProducts, ...baseProducts];
  const festivalOpps = buildFestivalOpportunities(festivalProducts);
  const baseOpps = generateOpportunities(60, baseProducts);
  const opportunities = [...festivalOpps, ...baseOpps];
  const userBusinesses = generateUserBusinesses(products);
  const orders = generateOrders(72, userBusinesses);
  const transactions = generateTransactions(36, userBusinesses);
  const customers = generateCustomers(48);
  const notifications = generateNotifications(28, userBusinesses);
  const reviews = generateReviews(products, opportunities);

  return {
    opportunities,
    products,
    userBusinesses,
    orders,
    transactions,
    notifications,
    customers,
    reviews,
    profile: generateProfile(),
    dashboardStats: computeStats(userBusinesses),
    intelligence: {
      id: "homeUsa",
      insight: "Demand for Home products is rising in the USA.",
      action: "Review Home opportunities for launch.",
      confidence: 96,
      status: "high_potential",
    },
    users: [
      {
        id: "user_1",
        email: config.demoUser.email,
        password: config.demoUser.password,
        name: config.demoUser.name,
        isOnboarded: true,
      },
    ],
  };
}

export function createBusinessFromOpportunity(
  opportunity: Opportunity,
  selectedProducts: Product[]
): UserBusiness {
  const totalCost = selectedProducts.reduce((s, p) => s + p.crestPrice, 0);
  const avgScore =
    selectedProducts.length > 0
      ? Math.round(selectedProducts.reduce((s, p) => s + p.launchScore, 0) / selectedProducts.length)
      : opportunity.launchScore;
  return {
    id: `biz_${Date.now()}`,
    name: opportunity.name,
    country: opportunity.country,
    category: opportunity.category,
    status: "live",
    revenue: 0,
    profit: 0,
    orders: 0,
    inventory: selectedProducts.length * 100,
    withdrawable: 0,
    currentSellingPrice: opportunity.recommendedSellingPrice,
    launchScore: avgScore,
    crestPrice: totalCost,
    image: opportunity.image,
    commerceSpecialist: opportunity.commerceSpecialist,
    missionSteps: missionSteps(5),
    productIds: selectedProducts.map((p) => p.id),
    createdAt: new Date().toISOString(),
  };
}

export function createCustomBusiness(
  name: string,
  category: Category,
  country: Country,
  selectedProducts: Product[],
  audienceTargeting?: UserBusiness["audienceTargeting"]
): UserBusiness {
  const totalCost = selectedProducts.reduce((s, p) => s + p.crestPrice, 0);
  const avgScore =
    selectedProducts.length > 0
      ? Math.round(selectedProducts.reduce((s, p) => s + p.launchScore, 0) / selectedProducts.length)
      : 85;
  return {
    id: `biz_${Date.now()}`,
    name,
    country,
    category,
    status: "live",
    revenue: 0,
    profit: 0,
    orders: 0,
    inventory: selectedProducts.length * 100,
    withdrawable: 0,
    currentSellingPrice: range(1899, 4999, seededRandom(Date.now())) / 100,
    launchScore: avgScore,
    crestPrice: totalCost,
    image: categoryImage(category, name),
    commerceSpecialist: specialist(Date.now() % 20),
    missionSteps: missionSteps(5),
    productIds: selectedProducts.map((p) => p.id),
    audienceTargeting,
    createdAt: new Date().toISOString(),
  };
}

export { computeStats };
