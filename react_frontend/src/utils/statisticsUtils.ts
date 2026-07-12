/**
 * Format seconds into a human-readable time string.
 * Returns "—" when the value is null (not yet calculated).
 */
export const formatTime = (seconds: number | null): string => {
  if (seconds === null || seconds === undefined) {
    return "—";
  }

  if (seconds < 60) {
    return `${Math.round(seconds)}s`;
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.round(seconds % 60);

  if (minutes < 60) {
    return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
};

/**
 * Format minutes into hours and minutes.
 * Returns "—" when the value is null (not yet calculated).
 */
export const formatStudyTime = (minutes: number | null): string => {
  if (minutes === null || minutes === undefined) {
    return "—";
  }

  if (minutes < 60) {
    return `${Math.round(minutes)} min`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = Math.round(minutes % 60);

  if (hours < 24) {
    return remainingMinutes > 0
      ? `${hours}h ${remainingMinutes}m`
      : `${hours}h`;
  }

  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;

  return remainingHours > 0
    ? `${days}d ${remainingHours}h`
    : `${days}d`;
};

/**
 * Format accuracy percentage
 */
export const formatAccuracy = (accuracy: number): string => {
  return `${accuracy.toFixed(1)}%`;
};

/** Shadcn semantic text colors — work in light and dark mode */
export const STAT_COLORS = {
  default: "text-foreground",
  emphasis: "text-primary",
  muted: "text-muted-foreground",
  negative: "text-destructive",
} as const;

/** Chart colors using theme CSS variables (hex/oklch-safe) */
export const CHART_COLORS = {
  primary: "var(--chart-1)",
  secondary: "var(--chart-2)",
  tertiary: "var(--chart-3)",
  correct: "var(--chart-1)",
  incorrect: "var(--chart-3)",
  unattempted: "var(--muted-foreground)",
  grid: "var(--border)",
} as const;

export const CHART_TOOLTIP_STYLE = {
  backgroundColor: "var(--popover)",
  border: "1px solid var(--border)",
  borderRadius: "var(--radius)",
  color: "var(--popover-foreground)",
} as const;

export const CHART_AXIS_TICK_STYLE = {
  fill: "var(--muted-foreground)",
  fontSize: 12,
} as const;

export const CHART_LEGEND_STYLE = {
  color: "var(--foreground)",
} as const;

export const CHART_LABEL_STYLE = {
  fill: "var(--foreground)",
  fontSize: 12,
} as const;
