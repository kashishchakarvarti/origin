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
  { insight: "Demand for Home products is increasing in the USA.", action: "Launch another Home business.", confidence: 96 },
  { insight: "Beauty category showing 34% growth in UAE.", action: "Expand your Beauty portfolio.", confidence: 91 },
  { insight: "Pet products outperforming in Canada this quarter.", action: "Consider a Pet business launch.", confidence: 88 },
  { insight: "Kitchen essentials trending in Germany.", action: "Launch a Kitchen-focused brand.", confidence: 94 },
  { insight: "Fitness accessories demand spike in Australia.", action: "Add Fitness products to portfolio.", confidence: 87 },
];

export const AI_RESPONSES: Record<string, string> = {
  canada: "Canada shows strong potential for Home and Pet categories. With 23% YoY e-commerce growth and favorable cross-border logistics through CREST, launching a Home business in Toronto or Vancouver markets could yield 85%+ launch scores. Minimum launch cost starts at ₹1,00,000 with projected monthly orders of 1,200+.",
  recommend: "Based on your portfolio performance, I recommend launching SmartGlow™ in the Beauty category for UAE. Your existing Home businesses show complementary customer overlap, and Beauty has a 91% confidence rating with 2,400+ projected monthly orders.",
  category: "Your best performing category is Home with ₹18,42,000 revenue across 4 businesses. Pet follows at ₹12,08,000. Consider doubling down on Home in USA and Canada while diversifying into Beauty for UAE expansion.",
  products: "For your SmartSleep™ business, add the Premium Pillow Set and Organic Diffuser. These products have 92+ launch scores and share 68% customer affinity with your current lineup. Combined launch cost: ₹2,40,000.",
  default: "I've analyzed your portfolio across 7 countries. Your withdrawable balance of ₹6,82,000 can fund 2 new business launches. Home and Beauty categories show the highest ROI this quarter. Would you like specific recommendations for any country?",
};

export const NOTIFICATION_TEMPLATES = [
  { title: "Business Launched", message: "{name} is now live in {country}." },
  { title: "Inventory Reserved", message: "Stock secured for {name} — {count} units ready." },
  { title: "Demand Increasing", message: "{category} products trending up 28% in {country}." },
  { title: "First Order Received", message: "Congratulations! {name} received its first order." },
  { title: "Price Recommendation", message: "Optimal price for {name} updated to {price}." },
  { title: "Mission Milestone", message: "{name} reached {step} status." },
  { title: "Revenue Milestone", message: "{name} crossed {amount} in revenue." },
  { title: "Expansion Ready", message: "{name} qualifies for multi-country expansion." },
];
