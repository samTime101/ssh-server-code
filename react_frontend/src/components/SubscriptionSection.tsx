import React from "react";
import { Clock } from "lucide-react";
import PlanCard from "@/components/PlanCard";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SubscriptionSection: React.FC = () => {
  return (
    <Card className="max-w-4xl">
      <CardHeader className="border-b">
        <CardTitle className="text-2xl">Subscription</CardTitle>
        <p className="text-muted-foreground mt-1 text-sm">
          Manage your plan and billing preferences
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-muted/50 flex items-center gap-3 rounded-lg border px-4 py-3">
          <Clock className="text-primary h-5 w-5 shrink-0" />
          <div>
            <p className="text-sm font-medium">7-day free trial</p>
            <p className="text-muted-foreground text-sm">Your trial is currently active</p>
          </div>
          <Badge className="ml-auto shrink-0">Active</Badge>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <PlanCard
            name="7-Day Free Trial"
            price="Free"
            period="for 7 days"
            description="Try everything Vaidix has to offer at no cost."
            features={[
              "Full access to question bank",
              "CEE practice sets",
              "Mock exams",
              "Bookmarks and history",
            ]}
            isActive
            buttonLabel="Current plan"
          />
          <PlanCard
            name="6 Months"
            price="XXX"
            period="one-time"
            description="Extended access for serious exam preparation."
            features={[
              "Everything in free trial",
              "6 months uninterrupted access",
              "Priority support",
              "All future updates included",
            ]}
            buttonLabel="Upgrade to 6 months"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default SubscriptionSection;
