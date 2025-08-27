"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { formatCompactNumber } from "@/lib/formatters";
import { Bar, BarChart, XAxis, YAxis } from "recharts";

export const ViewsByDealfitChart = ({
  chartData,
}: {
  chartData: {
    dealfitName: string;
    views: number;
  }[];
}) => {
  const chartConfig = {
    views: {
      label: "Visitors",
      color: "hsl(var(--accent))",
    },
  };
  if (chartData.length == 0) {
    return (
      <p className="flex items-center justify-center text-muted-foregroud min-h-[150px] max-h-[250px]">
        No data available
      </p>
    );
  }

  const data = chartData.map((d) => ({
    ...d,
    dealfitName: d.dealfitName.replace("Parity Group:", ""),
  }));
  return (
    <ChartContainer
      config={chartConfig}
      className="min-h-[150px] max-h-[250px] w-full"
    >
      <BarChart accessibilityLayer data={data}>
        <XAxis dataKey={"dealfitName"} tickLine={false} tickMargin={5} />
        <YAxis
          tickLine={false}
          tickMargin={10}
          allowDecimals={false}
          tickFormatter={formatCompactNumber}
        />
        <ChartTooltip content={<ChartTooltipContent labelKey="Parity"/>} />
        <Bar dataKey={"views"} fill="var(--color-views)" />
      </BarChart>
    </ChartContainer>
  );
};
