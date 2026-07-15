import { PieChart, Pie, Sector, ResponsiveContainer, Legend, Tooltip } from "recharts";
import type { PieSectorShapeProps } from "recharts";
import type { CorrectIncorrectData } from "@/types/statistics";
import {
  CHART_COLORS,
  CHART_LEGEND_STYLE,
  CHART_TOOLTIP_STYLE,
} from "@/utils/statisticsUtils";

export interface CorrectIncorrectChartProps {
  data: CorrectIncorrectData;
}

type ChartSlice = {
  name: string;
  value: number;
  color: string;
};

export const CorrectIncorrectChart = ({ data }: CorrectIncorrectChartProps) => {
  if (!data || (data.correct === 0 && data.incorrect === 0)) {
    return (
      <div className="flex items-center justify-center h-[300px] text-sm text-muted-foreground">
        No answer data available
      </div>
    );
  }

  const chartData: ChartSlice[] = [
    { name: "Correct", value: data.correct, color: CHART_COLORS.correct },
    { name: "Incorrect", value: data.incorrect, color: CHART_COLORS.incorrect },
  ];

  if (data.unattempted && data.unattempted > 0) {
    chartData.push({
      name: "Unattempted",
      value: data.unattempted,
      color: CHART_COLORS.unattempted,
    });
  }

  const filteredData = chartData.filter((item) => item.value > 0);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={filteredData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={2}
          dataKey="value"
          label={({ name, percent, x, y }) => (
            <text
              x={x}
              y={y}
              fill="var(--foreground)"
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={12}
            >
              {`${name}: ${((percent || 0) * 100).toFixed(0)}%`}
            </text>
          )}
          labelLine={{ stroke: CHART_COLORS.grid }}
          shape={(props: PieSectorShapeProps) => (
            <Sector {...props} fill={(props.payload as ChartSlice).color} />
          )}
        />
        <Tooltip
          contentStyle={CHART_TOOLTIP_STYLE}
          labelStyle={{ color: "var(--foreground)" }}
          itemStyle={{ color: "var(--foreground)" }}
        />
        <Legend wrapperStyle={CHART_LEGEND_STYLE} />
      </PieChart>
    </ResponsiveContainer>
  );
};
