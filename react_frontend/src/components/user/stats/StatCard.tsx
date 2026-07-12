import { Card, CardContent } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  subtitle?: string;
  valueClassName?: string;
  iconClassName?: string;
}

export const StatCard = ({
  title,
  value,
  icon: Icon,
  subtitle,
  valueClassName,
  iconClassName,
}: StatCardProps) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground mb-1">
              {title}
            </p>
            <div className="flex items-baseline gap-2">
              <h3
                className={cn(
                  "text-3xl font-bold tracking-tight text-foreground",
                  valueClassName
                )}
              >
                {value}
              </h3>
            </div>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-1">
                {subtitle}
              </p>
            )}
          </div>
          <div
            className={cn(
              "rounded-full p-3 bg-primary/10",
              iconClassName
            )}
          >
            <Icon className="h-5 w-5 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
