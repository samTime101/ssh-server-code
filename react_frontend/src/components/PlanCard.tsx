import React from "react";
import SubscriptionCard from "@/components/SubscriptionCard";
import { getImageUrl } from "@/config/apiConfig";
import type { Subscription } from "@/types/subscription";
import { formatPeriod, formatPrice } from "@/utils/subscriptionUtils";

type PlanCardProps = {
  subscription: Subscription;
};

const PlanCard: React.FC<PlanCardProps> = ({ subscription }) => (
  <SubscriptionCard
    icon={
      subscription.image_url ? (
        <img
          src={getImageUrl(subscription.image_url)}
          alt={subscription.plan_name}
          className="h-12 w-12 rounded object-cover"
        />
      ) : undefined
    }
    title={subscription.plan_name}
    description={subscription.description}
    priceLine={
      <>
        <span className="text-3xl font-bold">{formatPrice(subscription.price)}</span>
        <span className="text-muted-foreground ml-1 text-sm">
          / {formatPeriod(subscription.number_of_months)}
        </span>
      </>
    }
    selectDisabled
  />
);

export default PlanCard;
