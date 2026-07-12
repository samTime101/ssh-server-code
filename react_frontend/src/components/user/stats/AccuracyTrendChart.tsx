import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { AccuracyTrendData } from "@/types/statistics";
import {
  CHART_AXIS_TICK_STYLE,
  CHART_COLORS,
  CHART_LEGEND_STYLE,
  CHART_TOOLTIP_STYLE,
} from "@/utils/statisticsUtils";

export interface AccuracyTrendChartProps {
  data: AccuracyTrendData[];
}

export const AccuracyTrendChart = ({ data }: AccuracyTrendChartProps) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-sm text-muted-foreground">
        No trend data available
      </div>
    );
  }

  const formattedData = data.map((item) => ({
    ...item,
    date: new Date(item.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={formattedData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
        <XAxis
          dataKey="date"
          tick={CHART_AXIS_TICK_STYLE}
          axisLine={{ stroke: CHART_COLORS.grid }}
          tickLine={{ stroke: CHART_COLORS.grid }}
        />
        <YAxis
          tick={CHART_AXIS_TICK_STYLE}
          axisLine={{ stroke: CHART_COLORS.grid }}
          tickLine={{ stroke: CHART_COLORS.grid }}
          domain={[0, 100]}
        />
        <Tooltip
          contentStyle={CHART_TOOLTIP_STYLE}
          labelStyle={{ color: "var(--foreground)" }}
          itemStyle={{ color: "var(--foreground)" }}
        />
        <Legend wrapperStyle={CHART_LEGEND_STYLE} />
        <Line
          type="monotone"
          dataKey="accuracy"
          stroke={CHART_COLORS.primary}
          strokeWidth={2}
          dot={{ fill: CHART_COLORS.primary, r: 4 }}
          activeDot={{ r: 6, fill: CHART_COLORS.primary }}
          name="Accuracy (%)"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
