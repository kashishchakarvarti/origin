export const DEMO_CREDENTIALS = {
  email: "user@mail.com",
  password: "user",
} as const;

export const CATEGORIES = [
  "Baby",
  "Home",
  "Kitchen",
  "Beauty",
  "Pet",
  "Fitness",
  "Electronics",
  "Travel",
  "Office",
  "Health",
] as const;

export const COUNTRIES = [
  "USA",
  "Canada",
  "UK",
  "Australia",
  "Germany",
  "France",
  "Japan",
  "Singapore",
  "UAE",
  "India",
] as const;

export const INCLUDED_SERVICES = [
  "Inventory",
  "Brand Setup",
  "Marketplace Setup",
  "Marketing",
  "Analytics",
  "Support",
] as const;

export const MISSION_STEPS = [
  "Business Created",
  "Inventory Reserved",
  "Quality Inspection",
  "Brand Created",
  "Marketplace Live",
  "First Order",
  "Growing",
  "Expansion Ready",
] as const;

/** i18n keys for mission timeline steps */
export const MISSION_STEP_KEYS: Record<(typeof MISSION_STEPS)[number], string> = {
  "Business Created": "mission.step.created",
  "Inventory Reserved": "mission.step.inventory",
  "Quality Inspection": "mission.step.quality",
  "Brand Created": "mission.step.brand",
  "Marketplace Live": "mission.step.marketplace",
  "First Order": "mission.step.firstOrder",
  Growing: "mission.step.growing",
  "Expansion Ready": "mission.step.expansion",
};

export const NAV_ITEMS = [
  { href: "/dashboard", labelKey: "nav.dashboard", icon: "LayoutDashboard" },
  { href: "/opportunities", labelKey: "nav.opportunities", icon: "Sparkles" },
  { href: "/businesses", labelKey: "nav.businesses", icon: "Building2" },
  { href: "/mission-control", labelKey: "nav.mission", icon: "Rocket" },
  { href: "/payments", labelKey: "nav.payments", icon: "Wallet" },
  { href: "/profile", labelKey: "nav.profile", icon: "User" },
  { href: "/support", labelKey: "nav.support", icon: "Headphones" },
] as const;

export const BRAND_PREFIXES = [
  "Smart", "Pure", "Eco", "Nova", "Zen", "Prime", "Ultra", "Vital", "Glow", "Swift",
  "Apex", "Core", "Elite", "Flux", "Haven", "Luxe", "Nexus", "Orbit", "Peak", "Pulse",
];

export const BRAND_SUFFIXES = [
  "Sleep", "Nest", "Wave", "Flow", "Glow", "Fit", "Hub", "Lab", "Pro", "Edge",
  "Craft", "Bloom", "Spark", "Shield", "Blend", "Sense", "Vault", "Rise", "Forge", "Mind",
];

export const PRODUCT_DESCRIPTORS = [
  "Premium", "Essential", "Advanced", "Classic", "Deluxe", "Compact", "Pro", "Elite",
  "Organic", "Smart", "Ultra", "Natural", "Signature", "Heritage", "Modern", "Artisan",
];

export const PRODUCT_TYPES: Record<string, string[]> = {
  Baby: ["Stroller", "Monitor", "Carrier", "Bottle Set", "Play Mat", "Swaddle Pack", "High Chair", "Diaper Bag"],
  Home: ["Pillow Set", "Lamp", "Throw Blanket", "Diffuser", "Organizer", "Curtain Set", "Rug", "Mirror"],
  Kitchen: ["Blender", "Knife Set", "Cookware", "Storage Set", "Coffee Maker", "Air Fryer", "Cutting Board", "Spice Rack"],
  Beauty: ["Serum", "Moisturizer", "Cleanser", "Mask Set", "Hair Oil", "Lip Care", "Eye Cream", "Toner"],
  Pet: ["Feeder", "Bed", "Grooming Kit", "Leash Set", "Toy Bundle", "Treat Jar", "Water Fountain", "Carrier"],
  Fitness: ["Yoga Mat", "Resistance Bands", "Dumbbell Set", "Foam Roller", "Jump Rope", "Tracker", "Bottle", "Gloves"],
  Electronics: ["Earbuds", "Speaker", "Charger Hub", "Smart Watch", "Tablet Stand", "Webcam", "Keyboard", "Mouse"],
  Travel: ["Luggage Set", "Packing Cubes", "Neck Pillow", "Adapter Kit", "Toiletry Bag", "Passport Holder", "Daypack", "Suitcase"],
  Office: ["Desk Lamp", "Ergonomic Chair", "Monitor Stand", "Notebook Set", "Pen Collection", "Desk Mat", "File Organizer", "Whiteboard"],
  Health: ["Vitamin Pack", "Massager", "Scale", "Blood Monitor", "Sleep Aid", "First Aid Kit", "Thermometer", "Posture Corrector"],
};

export const SPECIALIST_FIRST = [
  "Sarah", "Marcus", "Elena", "James", "Priya", "David", "Amara", "Lucas", "Mei", "Oliver",
  "Sofia", "Raj", "Emma", "Kenji", "Isabella", "Ahmed", "Chloe", "Vikram", "Nina", "Carlos",
];

export const SPECIALIST_LAST = [
  "Chen", "Williams", "Patel", "Johnson", "Garcia", "Kim", "Martinez", "Singh", "Brown", "Lee",
  "Anderson", "Taylor", "Nguyen", "Wilson", "Thompson", "Rodriguez", "Clark", "Walker", "Hall", "Young",
];

export const INTELLIGENCE_INSIGHTS = [
  {
    id: "homeUsa",
    insight: "Demand for Home products is rising in the USA.",
    action: "Review Home opportunities for launch.",
    confidence: 96,
    status: "high_potential" as const,
  },
  {
    id: "beautyUae",
    insight: "Beauty category up 34% in the UAE this period.",
    action: "Compare Beauty opportunities in UAE.",
    confidence: 91,
    status: "emerging" as const,
  },
  {
    id: "petCanada",
    insight: "Pet products are outperforming in Canada this quarter.",
    action: "Review Pet opportunities in Canada.",
    confidence: 88,
    status: "established" as const,
  },
  {
    id: "kitchenGermany",
    insight: "Kitchen essentials demand is strong in Germany.",
    action: "Open Kitchen opportunities for Germany.",
    confidence: 94,
    status: "high_potential" as const,
  },
  {
    id: "fitnessAustralia",
    insight: "Fitness accessories demand increased in Australia.",
    action: "Add Fitness products to your portfolio.",
    confidence: 87,
    status: "new" as const,
  },
];

export const AI_RESPONSES: Record<string, string> = {
  canada: "Canada shows solid demand for Home and Pet. E-commerce growth is about 23% YoY, with CREST logistics supporting cross-border fulfillment. Home businesses in Toronto or Vancouver typically score 85+ on launch readiness. Minimum launch cost starts at ₹1,00,000 with projected monthly orders around 1,200.",
  recommend: "Based on your portfolio, SmartGlow™ in Beauty for UAE is a strong fit. Your Home businesses share customer overlap, and Beauty currently rates about 91% confidence with roughly 2,400 projected monthly orders.",
  category: "Your top category is Home at ₹18,42,000 across 4 businesses. Pet follows at ₹12,08,000. Home in the USA and Canada remains strong; Beauty in UAE is a useful diversification.",
  products: "For SmartSleep™, consider the Premium Pillow Set and Organic Diffuser. Both score 92+ and share about 68% customer affinity with your current lineup. Combined launch cost: ₹2,40,000.",
  default: "I've reviewed your portfolio across 7 countries. Your withdrawable balance of ₹6,82,000 can fund up to 2 new launches. Home and Beauty show the strongest returns this quarter. Ask about a specific country for details.",
};

export const NOTIFICATION_TEMPLATES = [
  {
    title: "Business Launched",
    titleKey: "notif.launched.title",
    messageKey: "notif.launched.msg",
    message: "{name} is now live in {country}.",
  },
  {
    title: "Inventory Reserved",
    titleKey: "notif.inventory.title",
    messageKey: "notif.inventory.msg",
    message: "Stock secured for {name} — {count} units ready.",
  },
  {
    title: "Demand Update",
    titleKey: "notif.demand.title",
    messageKey: "notif.demand.msg",
    message: "{category} demand rose 28% in {country}.",
  },
  {
    title: "First Order Received",
    titleKey: "notif.firstOrder.title",
    messageKey: "notif.firstOrder.msg",
    message: "{name} received its first order.",
  },
  {
    title: "Price Recommendation",
    titleKey: "notif.price.title",
    messageKey: "notif.price.msg",
    message: "Suggested price for {name} updated to {price}.",
  },
  {
    title: "Mission Milestone",
    titleKey: "notif.mission.title",
    messageKey: "notif.mission.msg",
    message: "{name} reached {step}.",
  },
  {
    title: "Revenue Milestone",
    titleKey: "notif.revenue.title",
    messageKey: "notif.revenue.msg",
    message: "{name} crossed {amount} in revenue.",
  },
  {
    title: "Expansion Eligible",
    titleKey: "notif.expansion.title",
    messageKey: "notif.expansion.msg",
    message: "{name} qualifies for multi-country expansion.",
  },
] as const;
