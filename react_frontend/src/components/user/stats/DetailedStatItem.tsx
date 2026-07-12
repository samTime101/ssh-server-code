import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DetailedStatItemProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  iconClassName?: string;
  valueClassName?: string;
}

export const DetailedStatItem = ({
  label,
  value,
  icon: Icon,
  iconClassName,
  valueClassName,
}: DetailedStatItemProps) => {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-3">
        <div className={cn("rounded-full p-2 bg-background", iconClassName)}>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
        <span className="text-sm font-medium text-muted-foreground">
          {label}
        </span>
      </div>
      <span className={cn("text-lg font-semibold text-foreground", valueClassName)}>
        {value}
      </span>
    </div>
  );
};
