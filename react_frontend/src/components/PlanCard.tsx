import React from "react";
import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { PlanCardProps } from "@/types/subscription";

const PlanCard: React.FC<PlanCardProps> = ({
  name,
  price,
  period,
  description,
  features,
  isActive = false,
  buttonLabel,
}) => (
  <div
    className={cn(
      "flex flex-col rounded-lg border p-5",
      isActive ? "border-primary bg-primary/5 ring-primary/20 ring-1" : "bg-card"
    )}
  >
    <div className="mb-4 flex items-start justify-between gap-2">
      <div>
        <h3 className="text-lg font-semibold">{name}</h3>
        <p className="text-muted-foreground mt-1 text-sm">{description}</p>
      </div>
      {isActive && <Badge variant="secondary">Active</Badge>}
    </div>

    <div className="mb-4">
      <span className="text-3xl font-bold">{price}</span>
      <span className="text-muted-foreground ml-1 text-sm">/ {period}</span>
    </div>

    <ul className="mb-6 flex flex-1 flex-col gap-2">
      {features.map((feature) => (
        <li key={feature} className="flex items-start gap-2 text-sm">
          <Check className="text-primary mt-0.5 h-4 w-4 shrink-0" />
          <span>{feature}</span>
        </li>
      ))}
    </ul>

    <Button
      type="button"
      variant={isActive ? "secondary" : "default"}
      className="w-full"
      disabled
      aria-disabled
    >
      {buttonLabel}
    </Button>
  </div>
);

export default PlanCard;
