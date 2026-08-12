import type { AudienceTargeting } from "./audience-filters";
import type { CATEGORIES, COUNTRIES, MISSION_STEPS } from "./constants";

export type Category = (typeof CATEGORIES)[number];
export type Country = (typeof COUNTRIES)[number];
export type MissionStep = (typeof MISSION_STEPS)[number];

export interface Product {
  id: string;
  name: string;
  category: Category;
  crestPrice: number;
  launchScore: number;
  monthlyOrders: number;
  image: string;
}

export type ReviewAuthorType = "customer" | "seller";

export interface Review {
  id: string;
  productId?: string;
  opportunityId?: string;
  authorName: string;
  authorType: ReviewAuthorType;
  rating: number;
  title: string;
  comment: string;
  country: Country;
  createdAt: string;
  helpful: number;
}

export interface Opportunity {
  id: string;
  name: string;
  country: Country;
  category: Category;
  launchScore: number;
  crestPrice: number;
  recommendedSellingPrice: number;
  monthlyOrders: number;
  minimumLaunchCost: number;
  availableCapacity: number;
  peopleStarted: number;
  image: string;
  description: string;
  productsIncluded: string[];
  productIds: string[];
  commerceSpecialist: string;
  includedServices: string[];
}

export interface UserBusiness {
  id: string;
  name: string;
  country: Country;
  category: Category;
  status: "live" | "pending" | "growing";
  revenue: number;
  profit: number;
  orders: number;
  inventory: number;
  withdrawable: number;
  currentSellingPrice: number;
  launchScore: number;
  crestPrice: number;
  image: string;
  commerceSpecialist: string;
  missionSteps: { step: MissionStep; completed: boolean; completedAt?: string }[];
  productIds: string[];
  audienceTargeting?: AudienceTargeting;
  createdAt: string;
}

export interface Order {
  id: string;
  businessId: string;
  businessName: string;
  customerName: string;
  amount: number;
  status: "completed" | "processing" | "shipped";
  country: Country;
  createdAt: string;
}

export interface Transaction {
  id: string;
  type: "withdrawal" | "revenue" | "refund" | "deposit";
  amount: number;
  status: "completed" | "pending" | "failed";
  description: string;
  businessName?: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "success" | "info" | "warning" | "milestone";
  read: boolean;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  country: Country;
  totalOrders: number;
  totalSpent: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  avatar: string;
  kycStatus: "verified" | "pending" | "not_started";
  documents: { id: string; name: string; status: string; uploadedAt: string }[];
  settings: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    currency: string;
    language: string;
  };
}

export interface DashboardStats {
  businesses: number;
  revenue: number;
  profit: number;
  withdrawable: number;
  countries: number;
  orders: number;
}

export interface IntelligenceInsight {
  insight: string;
  action: string;
  confidence: number;
}

export interface AppData {
  opportunities: Opportunity[];
  products: Product[];
  userBusinesses: UserBusiness[];
  orders: Order[];
  transactions: Transaction[];
  notifications: Notification[];
  customers: Customer[];
  reviews: Review[];
  profile: UserProfile;
  dashboardStats: DashboardStats;
  intelligence: IntelligenceInsight;
}

export interface AuthState {
  isAuthenticated: boolean;
  isOnboarded: boolean;
  email: string;
  name: string;
}
