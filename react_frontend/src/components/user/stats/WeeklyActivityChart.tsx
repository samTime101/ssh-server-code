import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { WeeklyActivityData } from "@/types/statistics";
import {
  CHART_AXIS_TICK_STYLE,
  CHART_COLORS,
  CHART_LEGEND_STYLE,
  CHART_TOOLTIP_STYLE,
} from "@/utils/statisticsUtils";

export interface WeeklyActivityChartProps {
  data: WeeklyActivityData[];
}

export const WeeklyActivityChart = ({ data }: WeeklyActivityChartProps) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-sm text-muted-foreground">
        No activity data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
        <XAxis
          dataKey="day"
          tick={CHART_AXIS_TICK_STYLE}
          axisLine={{ stroke: CHART_COLORS.grid }}
          tickLine={{ stroke: CHART_COLORS.grid }}
        />
        <YAxis
          tick={CHART_AXIS_TICK_STYLE}
          axisLine={{ stroke: CHART_COLORS.grid }}
          tickLine={{ stroke: CHART_COLORS.grid }}
        />
        <Tooltip
          contentStyle={CHART_TOOLTIP_STYLE}
          labelStyle={{ color: "var(--foreground)" }}
          itemStyle={{ color: "var(--foreground)" }}
        />
        <Legend wrapperStyle={CHART_LEGEND_STYLE} />
        <Bar
          dataKey="questions"
          fill={CHART_COLORS.primary}
          radius={[4, 4, 0, 0]}
          name="Questions Solved"
        />
        <Bar
          dataKey="study_time"
          fill={CHART_COLORS.secondary}
          radius={[4, 4, 0, 0]}
          name="Study Time (min)"
        />
      </BarChart>
    </ResponsiveContainer>
  );
};
