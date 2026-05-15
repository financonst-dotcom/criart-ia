import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNow, format } from "date-fns";
import { ptBR } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string) {
  return format(new Date(date), "dd/MM/yyyy", { locale: ptBR });
}

export function formatRelativeDate(date: Date | string) {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: ptBR });
}

export function formatBytes(bytes: number) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export function formatCredits(credits: number) {
  return new Intl.NumberFormat("pt-BR").format(credits);
}

export function formatCurrency(value: number, currency = "BRL") {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency,
  }).format(value / 100);
}

export function truncate(str: string, length: number) {
  return str.length > length ? str.slice(0, length) + "..." : str;
}

export function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function generateId(length = 12) {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const PLAN_CREDITS: Record<string, number> = {
  FREE: 10,
  STARTER: 100,
  PRO: 500,
  BUSINESS: 2000,
  ENTERPRISE: 10000,
};

export const GENERATION_COSTS: Record<string, number> = {
  OUTFIT_SWAP: 2,
  AVATAR_CREATION: 3,
  BACKGROUND_SWAP: 1,
  PRODUCT_PHOTO: 2,
  CAMPAIGN: 4,
  UPSCALE: 1,
  REMOVE_BG: 1,
  VIRTUAL_TRYON: 3,
  POSE_CHANGE: 2,
  MOCKUP: 2,
  VIDEO: 5,
  CATALOG: 3,
  SOCIAL_PACK: 4,
};
