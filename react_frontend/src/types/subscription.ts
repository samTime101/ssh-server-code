export interface Subscription {
  id: number;
  plan_name: string;
  description: string;
  price: string;
  image_url: string | null;
  number_of_months: number;
  status: boolean;
}

export type SubscriptionPayload = Omit<Subscription, "id" | "image_url">;

export interface PlanCardProps {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  isActive?: boolean;
  buttonLabel: string;
}
