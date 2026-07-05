import React, { useEffect, useState } from "react";
import PlanCard from "@/components/PlanCard";
import CoffeeCard from "@/components/CoffeeCard";
import Loader from "@/components/ui/Loader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchSubscriptions } from "@/services/subscription-service";
import type { Subscription } from "@/types/subscription";

const SubscriptionSection: React.FC = () => {
  const [plans, setPlans] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPlans = async () => {
      setIsLoading(true);
      setError(null);
      try {
        setPlans(await fetchSubscriptions(true));
      } catch {
        setError("Failed to load subscription plans.");
      } finally {
        setIsLoading(false);
      }
    };

    loadPlans();
  }, []);

  return (
    <Card className="max-w-4xl">
      <CardHeader className="border-b">
        <CardTitle className="text-2xl">Subscription</CardTitle>
        <p className="text-muted-foreground mt-1 text-sm">
          Manage your plan and billing preferences
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader />
          </div>
        ) : (
          <>
            {error && <p className="text-muted-foreground text-center text-sm">{error}</p>}
            <div className="grid items-stretch gap-4 md:grid-cols-2">
              {plans.map((plan) => (
                <PlanCard key={plan.id} subscription={plan} />
              ))}
              <CoffeeCard />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default SubscriptionSection;
