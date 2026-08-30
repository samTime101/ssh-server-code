import { useAuth } from "@/hooks/useAuth";

export const TEMP_SUBSCRIBED_EMAILS = new Set<string>([
  
]);

export const SUBSCRIPTION_PLANS_PATH = "/userpanel/profile?tab=subscriptions";

export function isTemporarilySubscribed(email?: string | null): boolean {
  if (!email) return false;
  const normalizedEmail = email.toLowerCase();
  for (const subscribed of TEMP_SUBSCRIBED_EMAILS) {
    if (subscribed.toLowerCase() === normalizedEmail) return true;
  }
  return false;
}

export function useHasActiveSubscription(): boolean {
  const { user } = useAuth();
  if (user?.roles?.includes("ADMIN")) return true;
  return isTemporarilySubscribed(user?.email);
}
