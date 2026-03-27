import type { CategoryStatus } from "@/types/category";
import type { QuestionStatus } from "@/types/question";

export type EntityStatus = CategoryStatus | QuestionStatus;

export const STATUS_LABELS: Record<EntityStatus, string> = {
  approved: "Approved",
  pending: "Pending",
  rejected: "Rejected",
};

export const STATUS_BADGE_CLASSES: Record<EntityStatus, string> = {
  approved: "border-green-200 bg-green-50 text-green-700",
  pending: "border-amber-200 bg-amber-50 text-amber-700",
  rejected: "border-red-200 bg-red-50 text-red-700",
};

export const getStatusLabel = (status?: string): string => {
  if (status === "approved" || status === "pending" || status === "rejected") {
    return STATUS_LABELS[status];
  }
  return "Unknown";
};

export const getStatusBadgeClass = (status?: string): string => {
  if (status === "approved" || status === "pending" || status === "rejected") {
    return STATUS_BADGE_CLASSES[status];
  }
  return "border-border bg-muted text-muted-foreground";
};
