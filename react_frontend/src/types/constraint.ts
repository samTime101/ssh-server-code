export interface ConstraintRule {
  categoryId: string;
  categoryName?: string;
  count: number;
}

export interface ConstraintRuleApi {
  category?: string;
  category_id?: string;
  category_name?: string;
  count: number;
}

export interface Constraint {
  id: string;
  name: string;
  rules: ConstraintRule[];
}

export interface ConstraintApi {
  id: string;
  name: string;
  rules: ConstraintRuleApi[];
  created_at?: string;
  updated_at?: string;
}

export interface ConstraintPayload {
  name: string;
  rules: Array<{
    category: string;
    count: number;
  }>;
}

export interface PaginatedConstraintApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ConstraintApi[];
  current_page?: number;
  total_pages?: number;
}

export interface ConstraintListResponse {
  constraints: Constraint[];
}
