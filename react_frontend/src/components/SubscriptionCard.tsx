import React from "react";
import { Button } from "@/components/ui/button";
import type { SubscriptionCardProps } from "@/types/subscription";

const CardHeader = ({
  icon,
  title,
  description,
}: {
  icon?: React.ReactNode;
  title: string;
  description: string;
}) => (
  <div className="flex gap-3 text-left">
    <div className="flex h-12 w-12 shrink-0 items-center justify-center">{icon}</div>
    <div className="min-w-0 flex-1">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-muted-foreground mt-1 text-sm">{description}</p>
    </div>
  </div>
);

const SubscriptionCard = ({
  icon,
  title,
  description,
  priceLine,
  onSelect,
  selectDisabled = false,
}: SubscriptionCardProps) => (
  <div className="bg-card flex h-full flex-col rounded-lg border p-5 text-left">
    <CardHeader icon={icon} title={title} description={description} />

    <div className="min-h-10 pt-4">{priceLine}</div>

    <div className="mt-auto pt-4">
      <Button
        type="button"
        variant="default"
        className="w-full"
        disabled={selectDisabled}
        onClick={onSelect}
      >
        Select
      </Button>
    </div>
  </div>
);

export default SubscriptionCard;
