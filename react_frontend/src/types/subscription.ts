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

export interface SubscriptionFormState {
  plan_name: string;
  description: string;
  price: string;
  number_of_months: string;
  status: boolean;
}

export interface SubscriptionCardProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  priceLine?: React.ReactNode;
  onSelect?: () => void;
  selectDisabled?: boolean;
}

export interface SubscriptionListResponse {
  count: number;
  total_pages: number;
  current_page?: number;
  next: string | null;
  previous: string | null;
  results: Subscription[];
}
