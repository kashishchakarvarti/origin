export type GenderFilter = "all" | "male" | "female";
export type PlatformFilter = "ios" | "android" | "web";

export interface GoogleAdsTargeting {
  placements: string[];
  keywords: string[];
  inMarket: string[];
  affinity: string[];
  customIntent: string[];
  remarketing: string[];
  bidStrategy: string;
  parentalStatus: string;
  lifeEvents: string[];
}

export interface AudienceTargeting {
  ageMin: number;
  ageMax: number;
  gender: GenderFilter;
  platforms: PlatformFilter[];
  interests: string[];
  behaviors: string[];
  incomeLevel: string;
  language: string;
  google: GoogleAdsTargeting;
  aiDecided?: boolean;
}

export const DEFAULT_GOOGLE: GoogleAdsTargeting = {
  placements: ["search", "display"],
  keywords: [],
  inMarket: [],
  affinity: [],
  customIntent: [],
  remarketing: [],
  bidStrategy: "maximize_conversions",
  parentalStatus: "all",
  lifeEvents: [],
};

export const DEFAULT_AUDIENCE: AudienceTargeting = {
  ageMin: 25,
  ageMax: 54,
  gender: "all",
  platforms: ["ios", "android"],
  interests: [],
  behaviors: [],
  incomeLevel: "any",
  language: "english",
  google: DEFAULT_GOOGLE,
  aiDecided: true,
};

const CATEGORY_AI_PROFILES: Record<
  string,
  Pick<AudienceTargeting, "ageMin" | "ageMax" | "interests" | "behaviors" | "incomeLevel"> & {
    google: Partial<GoogleAdsTargeting>;
  }
> = {
  Baby: {
    ageMin: 25,
    ageMax: 44,
    interests: ["Parenting & Baby", "Online Shopping"],
    behaviors: ["Engaged Shoppers", "Mobile-First Users"],
    incomeLevel: "top50",
    google: {
      placements: ["search", "display", "youtube"],
      keywords: ["Buy Online", "Best Seller", "Free Shipping"],
      inMarket: ["Baby & Children's Products", "Apparel & Accessories"],
      affinity: ["Shoppers", "Value Shoppers"],
      bidStrategy: "maximize_conversions",
      parentalStatus: "parent",
    },
  },
  Home: {
    ageMin: 28,
    ageMax: 54,
    interests: ["Home & Garden", "Online Shopping"],
    behaviors: ["Engaged Shoppers", "Repeat Purchasers"],
    incomeLevel: "top50",
    google: {
      placements: ["search", "display", "shopping"],
      keywords: ["Best Deals", "Premium Quality", "Shop Now"],
      inMarket: ["Home & Garden", "Consumer Electronics"],
      affinity: ["Shoppers", "Green Living Enthusiasts"],
      bidStrategy: "target_roas",
    },
  },
  Kitchen: {
    ageMin: 25,
    ageMax: 54,
    interests: ["Home & Garden", "Online Shopping"],
    behaviors: ["Engaged Shoppers", "Premium Buyers"],
    incomeLevel: "top50",
    google: {
      placements: ["search", "display", "shopping", "youtube"],
      keywords: ["Shop Now", "Best Seller", "Compare Prices"],
      inMarket: ["Home & Garden"],
      affinity: ["Foodies", "Shoppers"],
      bidStrategy: "maximize_conversions",
    },
  },
  Beauty: {
    ageMin: 18,
    ageMax: 44,
    interests: ["Beauty & Personal Care", "Luxury Goods"],
    behaviors: ["Premium Buyers", "Mobile-First Users"],
    incomeLevel: "top25",
    google: {
      placements: ["search", "display", "youtube", "discover"],
      keywords: ["New Arrivals", "Premium Quality", "Limited Offer"],
      inMarket: ["Beauty Products", "Apparel & Accessories"],
      affinity: ["Luxury Shoppers", "Shoppers"],
      bidStrategy: "target_roas",
    },
  },
  Pet: {
    ageMin: 25,
    ageMax: 54,
    interests: ["Pet Owners", "Online Shopping"],
    behaviors: ["Repeat Purchasers", "Engaged Shoppers"],
    incomeLevel: "any",
    google: {
      placements: ["search", "display"],
      keywords: ["Buy Online", "Best Seller", "Shop Now"],
      inMarket: ["Consumer Electronics"],
      affinity: ["Shoppers", "Value Shoppers"],
      bidStrategy: "maximize_conversions",
    },
  },
  Fitness: {
    ageMin: 18,
    ageMax: 44,
    interests: ["Fitness & Wellness", "Health & Nutrition"],
    behaviors: ["Mobile-First Users", "Early Adopters"],
    incomeLevel: "top50",
    google: {
      placements: ["search", "youtube", "performance_max"],
      keywords: ["Shop Now", "Best Deals", "Eco Friendly"],
      inMarket: ["Health & Fitness"],
      affinity: ["Sports Fans", "Technophiles"],
      bidStrategy: "target_cpa",
    },
  },
  Electronics: {
    ageMin: 18,
    ageMax: 44,
    interests: ["Technology", "Online Shopping"],
    behaviors: ["Early Adopters", "Mobile-First Users"],
    incomeLevel: "top25",
    google: {
      placements: ["search", "display", "youtube", "shopping"],
      keywords: ["Compare Prices", "Best Seller", "Brand Direct"],
      inMarket: ["Consumer Electronics", "Software"],
      affinity: ["Technophiles", "Bargain Hunters"],
      bidStrategy: "target_roas",
    },
  },
  Travel: {
    ageMin: 25,
    ageMax: 54,
    interests: ["Travel", "Luxury Goods"],
    behaviors: ["Frequent Travelers", "Premium Buyers"],
    incomeLevel: "top25",
    google: {
      placements: ["search", "display", "youtube", "discover"],
      keywords: ["Limited Offer", "Premium Quality", "Shop Now"],
      inMarket: ["Travel & Tourism"],
      affinity: ["Travel Buffs", "Luxury Shoppers"],
      bidStrategy: "maximize_conversions",
    },
  },
  Office: {
    ageMin: 25,
    ageMax: 54,
    interests: ["Small Business Owners", "Technology"],
    behaviors: ["Early Adopters", "Cross-Border Shoppers"],
    incomeLevel: "top50",
    google: {
      placements: ["search", "display", "gmail"],
      keywords: ["Brand Direct", "Best Deals", "Same Day Delivery"],
      inMarket: ["Business Services", "Software"],
      affinity: ["Business Professionals", "Technophiles"],
      bidStrategy: "target_cpa",
    },
  },
  Health: {
    ageMin: 25,
    ageMax: 54,
    interests: ["Health & Nutrition", "Fitness & Wellness"],
    behaviors: ["Engaged Shoppers", "Premium Buyers"],
    incomeLevel: "top50",
    google: {
      placements: ["search", "display", "youtube"],
      keywords: ["Premium Quality", "Eco Friendly", "Buy Online"],
      inMarket: ["Health & Fitness", "Beauty Products"],
      affinity: ["Green Living Enthusiasts", "Shoppers"],
      bidStrategy: "maximize_conversions",
    },
  },
};

export const FILTER_UI = {
  panelTitle: "Customer Targeting",
  panelSubtitle: (country: string) => `${country} market`,
  estimatedReach: "Estimated Reach",
  aiCheckbox: "Let CREST AI choose targeting",
  aiDescription: "AI picks the best age, interests, and ad channels for your category and market.",
  aiActive: "AI targeting is active — settings are optimized for your business.",
  customizeButton: "Advanced Targeting",
  tabs: {
    audience: "Customer Profile",
    google: "Ad Channels",
  },
  sections: {
    demographics: "Age & Gender",
    platforms: "Shopping Platforms",
    interests: "Interests",
    behaviors: "Shopping Behavior",
    income: "Income Level",
    language: "Language",
    placements: "Where Ads Appear",
    keywords: "Search Keywords",
    inMarket: "Ready to Buy",
    affinity: "Lifestyle Interests",
    customIntent: "Purchase Intent",
    remarketing: "Returning Visitors",
    lifeEvents: "Life Milestones",
    bidStrategy: "Budget Strategy",
    parentalStatus: "Parent Status",
  },
  fieldLabels: {
    ageRange: "Age range",
    gender: "Gender",
  },
} as const;

export const FILTER_OPTION_LABELS: Record<string, string> = {
  "Online Shopping": "Online shoppers",
  "Home & Garden": "Home & garden",
  "Beauty & Personal Care": "Beauty & self-care",
  "Fitness & Wellness": "Fitness & wellness",
  "Technology": "Tech enthusiasts",
  "Parenting & Baby": "Parents & baby",
  Travel: "Travel lovers",
  "Luxury Goods": "Luxury buyers",
  "Health & Nutrition": "Health & nutrition",
  "Pet Owners": "Pet owners",
  "Small Business Owners": "Small business owners",
  Entrepreneurship: "Entrepreneurs",
  "Engaged Shoppers": "Active shoppers",
  "Mobile-First Users": "Mobile-first users",
  "Frequent Travelers": "Frequent travelers",
  "Premium Buyers": "Premium buyers",
  "Cart Abandoners": "Cart abandoners",
  "Repeat Purchasers": "Repeat buyers",
  "Early Adopters": "Early adopters",
  "Cross-Border Shoppers": "Cross-border shoppers",
  "Buy Online": "Buy online",
  "Best Deals": "Best deals",
  "Free Shipping": "Free shipping",
  "Premium Quality": "Premium quality",
  "Shop Now": "Shop now",
  "Limited Offer": "Limited offer",
  "Brand Direct": "Brand direct",
  "Same Day Delivery": "Same-day delivery",
  "Eco Friendly": "Eco-friendly",
  "New Arrivals": "New arrivals",
  "Best Seller": "Best sellers",
  "Compare Prices": "Compare prices",
  "Apparel & Accessories": "Fashion & accessories",
  "Consumer Electronics": "Electronics",
  "Beauty Products": "Beauty products",
  "Health & Fitness": "Health & fitness",
  "Baby & Children's Products": "Baby & kids",
  "Travel & Tourism": "Travel & tourism",
  "Business Services": "Business services",
  Software: "Software",
  "Financial Services": "Financial services",
  "Bargain Hunters": "Deal seekers",
  Shoppers: "Shoppers",
  Technophiles: "Tech lovers",
  "Luxury Shoppers": "Luxury shoppers",
  "Green Living Enthusiasts": "Eco-conscious",
  "Sports Fans": "Sports fans",
  Foodies: "Food lovers",
  "Travel Buffs": "Travel enthusiasts",
  "Business Professionals": "Professionals",
  "Value Shoppers": "Value shoppers",
  "High-Intent Buyers": "High-intent buyers",
  "Product Researchers": "Product researchers",
  "Competitor Shoppers": "Competitor shoppers",
  "Comparison Shoppers": "Comparison shoppers",
  "Brand Loyalists": "Brand loyalists",
  "Impulse Buyers": "Impulse buyers",
  "Seasonal Shoppers": "Seasonal shoppers",
  "Website Visitors": "Site visitors",
  "Past Purchasers": "Past buyers",
  "Similar Audiences": "Similar audiences",
  "Customer Match": "Customer match",
  "App Users": "App users",
  "Video Viewers": "Video viewers",
  "Recently Moved": "Recently moved",
  "Graduating Soon": "Graduating soon",
  "Getting Married": "Getting married",
  "New Job": "New job",
  "Purchasing a Home": "Buying a home",
  "Starting a Business": "Starting a business",
};

export function formatFilterLabel(value: string): string {
  return FILTER_OPTION_LABELS[value] ?? value;
}

export const GENDER_OPTIONS: { value: GenderFilter; label: string }[] = [
  { value: "all", label: "Everyone" },
  { value: "male", label: "Men" },
  { value: "female", label: "Women" },
];

export const PLATFORM_OPTIONS: { value: PlatformFilter; label: string }[] = [
  { value: "ios", label: "iOS" },
  { value: "android", label: "Android" },
  { value: "web", label: "Web" },
];

export const AGE_PRESETS = [
  { label: "18–24", min: 18, max: 24 },
  { label: "25–34", min: 25, max: 34 },
  { label: "35–44", min: 35, max: 44 },
  { label: "45–54", min: 45, max: 54 },
  { label: "55+", min: 55, max: 65 },
];

export const INTEREST_OPTIONS = [
  "Online Shopping",
  "Home & Garden",
  "Beauty & Personal Care",
  "Fitness & Wellness",
  "Technology",
  "Parenting & Baby",
  "Travel",
  "Luxury Goods",
  "Health & Nutrition",
  "Pet Owners",
  "Small Business Owners",
  "Entrepreneurship",
];

export const BEHAVIOR_OPTIONS = [
  "Engaged Shoppers",
  "Mobile-First Users",
  "Frequent Travelers",
  "Premium Buyers",
  "Cart Abandoners",
  "Repeat Purchasers",
  "Early Adopters",
  "Cross-Border Shoppers",
];

export const GOOGLE_PLACEMENT_OPTIONS = [
  { value: "search", label: "Search" },
  { value: "display", label: "Display" },
  { value: "youtube", label: "YouTube" },
  { value: "gmail", label: "Gmail" },
  { value: "discover", label: "Discover" },
  { value: "shopping", label: "Shopping" },
  { value: "performance_max", label: "Performance Max" },
];

export const GOOGLE_KEYWORD_OPTIONS = [
  "Buy Online",
  "Best Deals",
  "Free Shipping",
  "Premium Quality",
  "Shop Now",
  "Limited Offer",
  "Brand Direct",
  "Same Day Delivery",
  "Eco Friendly",
  "New Arrivals",
  "Best Seller",
  "Compare Prices",
];

export const GOOGLE_IN_MARKET_OPTIONS = [
  "Apparel & Accessories",
  "Consumer Electronics",
  "Home & Garden",
  "Beauty Products",
  "Health & Fitness",
  "Baby & Children's Products",
  "Travel & Tourism",
  "Business Services",
  "Software",
  "Financial Services",
];

export const GOOGLE_AFFINITY_OPTIONS = [
  "Bargain Hunters",
  "Shoppers",
  "Technophiles",
  "Luxury Shoppers",
  "Green Living Enthusiasts",
  "Sports Fans",
  "Foodies",
  "Travel Buffs",
  "Business Professionals",
  "Value Shoppers",
];

export const GOOGLE_CUSTOM_INTENT_OPTIONS = [
  "High-Intent Buyers",
  "Product Researchers",
  "Competitor Shoppers",
  "Comparison Shoppers",
  "Brand Loyalists",
  "Impulse Buyers",
  "Seasonal Shoppers",
];

export const GOOGLE_REMARKETING_OPTIONS = [
  "Website Visitors",
  "Cart Abandoners",
  "Past Purchasers",
  "Similar Audiences",
  "Customer Match",
  "App Users",
  "Video Viewers",
];

export const GOOGLE_BID_STRATEGY_OPTIONS = [
  { value: "maximize_conversions", label: "Maximize sales" },
  { value: "target_cpa", label: "Control cost per sale" },
  { value: "target_roas", label: "Target return on ad spend" },
  { value: "maximize_clicks", label: "Maximize traffic" },
  { value: "manual_cpc", label: "Manual bidding" },
];

export const GOOGLE_PARENTAL_OPTIONS = [
  { value: "all", label: "All parents" },
  { value: "not_parent", label: "Not a parent" },
  { value: "parent", label: "Parents" },
];

export const GOOGLE_LIFE_EVENT_OPTIONS = [
  "Recently Moved",
  "Graduating Soon",
  "Getting Married",
  "New Job",
  "Purchasing a Home",
  "Starting a Business",
];

export const INCOME_OPTIONS = [
  { value: "any", label: "All income levels" },
  { value: "top50", label: "Above average" },
  { value: "top25", label: "High income" },
  { value: "top10", label: "Top earners" },
];

export const LANGUAGE_OPTIONS = [
  { value: "english", label: "English" },
  { value: "spanish", label: "Spanish" },
  { value: "french", label: "French" },
  { value: "german", label: "German" },
  { value: "hindi", label: "Hindi" },
  { value: "japanese", label: "Japanese" },
  { value: "arabic", label: "Arabic" },
];

const COUNTRY_REACH: Record<string, number> = {
  USA: 8900000,
  Canada: 2100000,
  UK: 3400000,
  Australia: 1800000,
  Germany: 2900000,
  France: 2600000,
  Japan: 3200000,
  Singapore: 680000,
  UAE: 920000,
  India: 12400000,
};

function applyGoogleMultiplier(targeting: AudienceTargeting, multiplier: number): number {
  const g = targeting.google ?? DEFAULT_GOOGLE;
  let m = multiplier;

  m *= Math.max(0.3, g.placements.length / 5);

  if (g.keywords.length > 0) m *= Math.max(0.2, 1 - g.keywords.length * 0.05);
  if (g.inMarket.length > 0) m *= Math.max(0.25, 1 - g.inMarket.length * 0.07);
  if (g.affinity.length > 0) m *= Math.max(0.3, 1 - g.affinity.length * 0.06);
  if (g.customIntent.length > 0) m *= Math.max(0.35, 1 - g.customIntent.length * 0.08);
  if (g.remarketing.length > 0) m *= Math.max(0.15, 1 - g.remarketing.length * 0.1);
  if (g.lifeEvents.length > 0) m *= Math.max(0.4, 1 - g.lifeEvents.length * 0.08);
  if (g.parentalStatus !== "all") m *= 0.55;

  return m;
}

export function estimateAudienceReach(
  country: string | null,
  targeting: AudienceTargeting
): number {
  if (!country) return 0;
  const base = COUNTRY_REACH[country] ?? 1500000;
  let multiplier = 1;

  const ageSpan = targeting.ageMax - targeting.ageMin + 1;
  multiplier *= Math.min(ageSpan / 40, 0.85);

  if (targeting.gender !== "all") multiplier *= 0.52;

  multiplier *= Math.max(0.25, targeting.platforms.length / 3);

  if (targeting.interests.length > 0) {
    multiplier *= Math.max(0.15, 1 - targeting.interests.length * 0.08);
  }
  if (targeting.behaviors.length > 0) {
    multiplier *= Math.max(0.2, 1 - targeting.behaviors.length * 0.06);
  }

  if (targeting.incomeLevel === "top10") multiplier *= 0.12;
  else if (targeting.incomeLevel === "top25") multiplier *= 0.25;
  else if (targeting.incomeLevel === "top50") multiplier *= 0.5;

  multiplier = applyGoogleMultiplier(targeting, multiplier);

  return Math.max(Math.round(base * multiplier), 12000);
}

export function formatAudienceReach(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M people`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K people`;
  return `${n.toLocaleString()} people`;
}

export function generateAiAudienceTargeting(
  category: string,
  _country?: string
): AudienceTargeting {
  const profile = CATEGORY_AI_PROFILES[category] ?? CATEGORY_AI_PROFILES.Home;
  return {
    ...DEFAULT_AUDIENCE,
    ageMin: profile.ageMin,
    ageMax: profile.ageMax,
    interests: profile.interests,
    behaviors: profile.behaviors,
    incomeLevel: profile.incomeLevel,
    google: { ...DEFAULT_GOOGLE, ...profile.google },
    aiDecided: true,
  };
}

export function isAiDecidedTargeting(targeting: AudienceTargeting): boolean {
  return targeting.aiDecided !== false;
}

export function resolveAudienceTargeting(
  targeting: AudienceTargeting,
  category?: string | null,
  country?: string | null
): AudienceTargeting {
  if (isAiDecidedTargeting(targeting) && category && country) {
    return generateAiAudienceTargeting(category, country);
  }
  return normalizeAudienceTargeting(targeting);
}

export function summarizeTargeting(
  targeting: AudienceTargeting,
  category?: string | null,
  country?: string | null
): string {
  if (isAiDecidedTargeting(targeting)) {
    return "AI-optimized targeting";
  }
  const resolved = resolveAudienceTargeting(targeting, category, country);
  const audience = summarizeAudience(resolved);
  const google = summarizeGoogleAudience(resolved);
  return google === "Standard ad setup" ? audience : `${audience} · ${google}`;
}

export function summarizeAudience(targeting: AudienceTargeting): string {
  const parts: string[] = [];
  parts.push(`${targeting.ageMin}–${targeting.ageMax}`);
  if (targeting.gender !== "all") {
    parts.push(targeting.gender === "male" ? "Men" : "Women");
  }
  if (targeting.platforms.length) {
    parts.push(
      targeting.platforms
        .map((p) => PLATFORM_OPTIONS.find((o) => o.value === p)?.label ?? p)
        .join(", ")
    );
  }
  return parts.join(" · ");
}

export function summarizeGoogleAudience(targeting: AudienceTargeting): string {
  const g = targeting.google ?? DEFAULT_GOOGLE;
  const parts: string[] = [];
  if (g.placements.length) {
    parts.push(
      g.placements
        .map((p) => GOOGLE_PLACEMENT_OPTIONS.find((o) => o.value === p)?.label ?? p)
        .join(", ")
    );
  }
  if (g.bidStrategy) {
    parts.push(
      GOOGLE_BID_STRATEGY_OPTIONS.find((o) => o.value === g.bidStrategy)?.label ?? g.bidStrategy
    );
  }
  return parts.join(" · ") || "Standard ad setup";
}

export function normalizeAudienceTargeting(
  targeting: Partial<AudienceTargeting> | undefined
): AudienceTargeting {
  return {
    ...DEFAULT_AUDIENCE,
    ...targeting,
    google: { ...DEFAULT_GOOGLE, ...targeting?.google },
    aiDecided: targeting?.aiDecided ?? DEFAULT_AUDIENCE.aiDecided,
  };
}
