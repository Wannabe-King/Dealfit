import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { formatCompactNumber } from "@/lib/formatters";
import {
  CHART_INTERVALS,
  getViewsByDayChartData,
} from "@/server/db/productViews";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import { ChartTile } from "./analytics/_components/ChartTile";
import { ViewsByDayChart } from "./analytics/_components/charts/ViewByDayChart";

export async function AnalyticsChart({ userId }: { userId: string }) {
  const chartData = await getViewsByDayChartData({
    userId,
    interval: CHART_INTERVALS.last30Days,
    timezone: "UTC",
  });

  return (
    <ChartTile title="Views by Day">
      <ViewsByDayChart chartData={chartData} />
    </ChartTile>
  );
}
