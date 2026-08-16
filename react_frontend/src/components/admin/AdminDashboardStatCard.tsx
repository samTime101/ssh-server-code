import { Link } from "react-router-dom";
import { ArrowUpRight, type LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type CardVariant = "questions" | "users" | "subscription";

const variantStyles: Record<
  CardVariant,
  { iconBg: string; iconColor: string; accent: string; hoverBorder: string }
> = {
  questions: {
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-600 dark:text-blue-400",
    accent: "group-hover:text-blue-600 dark:group-hover:text-blue-400",
    hoverBorder: "hover:border-blue-500/30",
  },
  users: {
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    accent: "group-hover:text-emerald-600 dark:group-hover:text-emerald-400",
    hoverBorder: "hover:border-emerald-500/30",
  },
  subscription: {
    iconBg: "bg-violet-500/10",
    iconColor: "text-violet-600 dark:text-violet-400",
    accent: "group-hover:text-violet-600 dark:group-hover:text-violet-400",
    hoverBorder: "hover:border-violet-500/30",
  },
};

export interface AdminDashboardStatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  subtitle: string;
  actionLabel: string;
  to: string;
  variant: CardVariant;
  valueClassName?: string;
}

export const AdminDashboardStatCard = ({
  title,
  value,
  icon: Icon,
  subtitle,
  actionLabel,
  to,
  variant,
  valueClassName,
}: AdminDashboardStatCardProps) => {
  const styles = variantStyles[variant];

  return (
    <Link to={to} className="group block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
      <Card
        className={cn(
          "cursor-pointer gap-0 py-0 shadow-sm transition-all duration-200",
          "hover:-translate-y-0.5 hover:shadow-md",
          styles.hoverBorder
        )}
      >
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <p
                className={cn(
                  "mt-2 truncate text-3xl font-bold tracking-tight text-foreground",
                  valueClassName
                )}
                title={String(value)}
              >
                {value}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
            </div>
            <div className={cn("shrink-0 rounded-xl p-3", styles.iconBg)}>
              <Icon className={cn("h-5 w-5", styles.iconColor)} />
            </div>
          </div>

          <div
            className={cn(
              "mt-4 flex items-center justify-between border-t pt-3 text-xs font-medium text-muted-foreground transition-colors",
              styles.accent
            )}
          >
            <span>{actionLabel}</span>
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
