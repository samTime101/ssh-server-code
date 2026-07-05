import type { Subscription } from "@/types/subscription";

export const toSubscriptionList = (raw: unknown): Subscription[] => {
  if (Array.isArray(raw)) return raw as Subscription[];
  if (raw && typeof raw === "object" && "results" in raw) {
    return (raw as { results: Subscription[] }).results;
  }
  return [];
};

export const formatPeriod = (months: number): string =>
  months === 1 ? "1 month" : `${months} months`;

export const formatPrice = (price: string): string => `Rs. ${price}`;
