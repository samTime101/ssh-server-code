import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { CategoryPerformance } from "@/types/statistics";
import {
  CHART_AXIS_TICK_STYLE,
  CHART_COLORS,
  CHART_TOOLTIP_STYLE,
} from "@/utils/statisticsUtils";

export interface CategoryPerformanceChartProps {
  data: CategoryPerformance[];
}

export const CategoryPerformanceChart = ({ data }: CategoryPerformanceChartProps) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-sm text-muted-foreground">
        No category data available
      </div>
    );
  }

  const sortedData = data.slice(0, 8);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={sortedData}
        layout="vertical"
        margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
        <XAxis
          type="number"
          domain={[0, 100]}
          tick={CHART_AXIS_TICK_STYLE}
          axisLine={{ stroke: CHART_COLORS.grid }}
          tickLine={{ stroke: CHART_COLORS.grid }}
        />
        <YAxis
          type="category"
          dataKey="category_name"
          tick={CHART_AXIS_TICK_STYLE}
          axisLine={{ stroke: CHART_COLORS.grid }}
          tickLine={{ stroke: CHART_COLORS.grid }}
          width={90}
        />
        <Tooltip
          contentStyle={CHART_TOOLTIP_STYLE}
          labelStyle={{ color: "var(--foreground)" }}
          itemStyle={{ color: "var(--foreground)" }}
          formatter={(value) => {
            const numValue = typeof value === "number" ? value : 0;
            return [`${numValue.toFixed(1)}%`, "Accuracy"];
          }}
        />
        <Bar
          dataKey="accuracy"
          fill={CHART_COLORS.primary}
          radius={[0, 4, 4, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};
