import { useAuth } from "@/hooks/useAuth";

export const TEMP_SUBSCRIBED_EMAILS = new Set<string>([
  // "super@gmail.com"
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
  return isTemporarilySubscribed(user?.email);
}
