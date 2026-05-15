export type GenerationType =
  | "OUTFIT_SWAP"
  | "AVATAR_CREATION"
  | "BACKGROUND_SWAP"
  | "PRODUCT_PHOTO"
  | "CAMPAIGN"
  | "UPSCALE"
  | "REMOVE_BG"
  | "VIRTUAL_TRYON"
  | "POSE_CHANGE"
  | "MOCKUP"
  | "VIDEO"
  | "CATALOG"
  | "SOCIAL_PACK";

export type GenerationStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";

export type SubscriptionPlan = "FREE" | "STARTER" | "PRO" | "BUSINESS" | "ENTERPRISE";

export type ImageFormat = "square" | "portrait" | "stories" | "landscape";

export interface User {
  id: string;
  email: string;
  name: string | null;
  username: string | null;
  avatar: string | null;
  credits: number;
  role: "USER" | "ADMIN" | "SUPER_ADMIN";
  subscription?: Subscription;
  createdAt: string;
}

export interface Subscription {
  id: string;
  plan: SubscriptionPlan;
  status: string;
  currentPeriodEnd: string | null;
  monthlyCredits: number;
}

export interface Project {
  id: string;
  name: string;
  description: string | null;
  thumbnail: string | null;
  status: "ACTIVE" | "ARCHIVED" | "DELETED";
  createdAt: string;
  updatedAt: string;
  _count?: { generations: number };
}

export interface Generation {
  id: string;
  projectId: string | null;
  type: GenerationType;
  status: GenerationStatus;
  prompt: string | null;
  settings: Record<string, unknown>;
  inputImages: string[];
  outputImages: string[];
  outputVideo: string | null;
  creditsUsed: number;
  processingTime: number | null;
  isFavorited: boolean;
  createdAt: string;
  completedAt: string | null;
}

export interface Asset {
  id: string;
  type: "IMAGE" | "VIDEO" | "MASK" | "REFERENCE";
  url: string;
  filename: string;
  mimeType: string;
  size: number;
  width: number | null;
  height: number | null;
  isFavorited: boolean;
  createdAt: string;
}

export interface Brand {
  id: string;
  name: string;
  logo: string | null;
  colors: string[];
  fonts: string[];
  description: string | null;
}

export interface Template {
  id: string;
  name: string;
  description: string | null;
  thumbnail: string;
  category: string;
  tags: string[];
  type: GenerationType;
  format: ImageFormat;
  isPremium: boolean;
  usageCount: number;
}

export interface GenerationConfig {
  type: GenerationType;
  prompt: string;
  negativePrompt?: string;
  inputImages?: string[];
  settings?: {
    format?: ImageFormat;
    quality?: "standard" | "hd";
    style?: string;
    steps?: number;
    cfgScale?: number;
    seed?: number;
    width?: number;
    height?: number;
    // Virtual Try-On
    garmentImage?: string;
    modelImage?: string;
    category?: string;
    // Avatar
    age?: string;
    gender?: string;
    ethnicity?: string;
    hairColor?: string;
    hairStyle?: string;
    // Background
    backgroundPrompt?: string;
    backgroundStyle?: string;
    // Campaign
    platform?: string;
    campaignText?: string;
  };
}

export interface PlanFeature {
  text: string;
  included: boolean;
}

export interface PricingPlan {
  id: SubscriptionPlan;
  name: string;
  price: number;
  yearlyPrice: number;
  credits: number;
  description: string;
  features: string[];
  highlighted?: boolean;
  badge?: string;
}

export type ToastType = "success" | "error" | "info" | "warning";

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
