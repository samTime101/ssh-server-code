import type { ReactNode } from "react";
import { Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/Loader";
import { SUBSCRIPTION_PLANS_PATH, useHasActiveSubscription } from "@/config/subscriptionAccess";
import { useAuth } from "@/hooks/useAuth";

const LockedPreview = () => (
  <div className="pointer-events-none select-none space-y-4 blur-sm" aria-hidden>
    <div className="bg-muted h-8 w-48 rounded" />
    <div className="bg-muted h-4 w-72 rounded" />
    <div className="grid gap-4 md:grid-cols-2">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="bg-card h-32 rounded-lg border" />
      ))}
    </div>
  </div>
);

const SubscriptionGate = ({ children }: { children: ReactNode }) => {
  const { token, user } = useAuth();
  const hasAccess = useHasActiveSubscription();

  if (token && !user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (hasAccess) return children;

  return (
    <div className="relative min-h-[70vh]">
      <LockedPreview />
      <div className="absolute inset-0 z-10 flex items-center justify-center p-4">
        <div className="bg-card w-full max-w-sm rounded-xl border p-6 text-center shadow-lg">
          <div className="bg-primary/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
            <Lock className="text-primary h-5 w-5" />
          </div>
          <h2 className="text-lg font-semibold">Subscription required</h2>
          <p className="text-muted-foreground mt-2 text-sm">
            Unlock Question Bank, CEE Practice, Mock Exams, History, and Bookmarks with an active
            plan.
          </p>
          <Button asChild className="mt-5 w-full">
            <Link to={SUBSCRIPTION_PLANS_PATH}>View plans</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionGate;
