import { API_ENDPOINTS } from "@/config/apiConfig";
import axiosInstance from "@/services/axios";
import type {
  Constraint,
  ConstraintApi,
  ConstraintListResponse,
  ConstraintPayload,
  PaginatedConstraintApiResponse,
  ConstraintRuleApi,
} from "@/types/constraint";

const toConstraintRule = (rule: ConstraintRuleApi) => {
  const categoryId = rule.category_id ?? rule.category ?? "";

  return {
    categoryId,
    categoryName: rule.category_name,
    count: rule.count,
  };
};

const toConstraint = (constraint: ConstraintApi): Constraint => {
  const rules = Array.isArray(constraint.rules)
    ? constraint.rules.filter(Boolean).map((rule) => toConstraintRule(rule))
    : [];

  return {
    id: constraint.id,
    name: constraint.name,
    rules,
  };
};

export const fetchConstraints = async (): Promise<ConstraintListResponse> => {
  try {
    const allConstraints: Constraint[] = [];
    let nextUrl: string | null = API_ENDPOINTS.constraints;

    while (nextUrl) {
      const response: { data: PaginatedConstraintApiResponse } =
        await axiosInstance.get<PaginatedConstraintApiResponse>(nextUrl);
      const current = response.data.results.map((item) => toConstraint(item));
      allConstraints.push(...current);
      nextUrl = response.data.next;
    }

    const uniqueConstraints = Array.from(
      new Map(allConstraints.map((constraint) => [constraint.id, constraint])).values()
    );

    return { constraints: uniqueConstraints };
  } catch (error) {
    console.error("Failed to fetch constraints:", error);
    throw new Error("Failed to fetch constraints");
  }
};

export const createConstraint = async (payload: ConstraintPayload): Promise<Constraint> => {
  try {
    const response = await axiosInstance.post<ConstraintApi>(API_ENDPOINTS.constraints, payload);
    return toConstraint(response.data);
  } catch (error) {
    console.error("Failed to create constraint:", error);
    throw new Error("Failed to create constraint");
  }
};

export const updateConstraint = async (
  id: string,
  payload: ConstraintPayload
): Promise<Constraint> => {
  try {
    const response = await axiosInstance.put<ConstraintApi>(
      `${API_ENDPOINTS.constraints}${id}/`,
      payload
    );
    return toConstraint(response.data);
  } catch (error) {
    console.error("Failed to update constraint:", error);
    throw new Error("Failed to update constraint");
  }
};

export const deleteConstraint = async (id: string): Promise<void> => {
  try {
    await axiosInstance.delete(`${API_ENDPOINTS.constraints}${id}/`);
  } catch (error) {
    console.error("Failed to delete constraint:", error);
    throw new Error("Failed to delete constraint");
  }
};
