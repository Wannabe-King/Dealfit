import { HasPersmission } from "@/components/HadPermission";
import { canAccessAnalytics } from "@/server/permissions";
import { auth } from "@clerk/nextjs/server";
import { ChartTile } from "./_components/ChartTile";
import {
  CHART_INTERVALS,
  getViewsByCountryChartData,
  getViewsByDayChartData,
  getViewsByDealfitChartData,
} from "@/server/db/productViews";
import { ViewsByCountryChart } from "./_components/charts/ViewByCountryChart";
import { ViewsByDealfitChart } from "./_components/charts/ViewsByDealfitChart";
import { ViewsByDayChart } from "./_components/charts/ViewByDayChart";

import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { createURL } from "@/lib/utils";
import { ProductDropDown } from "./_components/ProductDropDown";
import { TimeZoneDropDownMenuItem } from "./_components/TimeZoneDropDownMenuItem";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analytics",
};

export default async function Analytics({
  searchParams,
}: {
  searchParams: Promise<{
    interval?: string;
    timezone?: string;
    productId?: string;
  }>;
}) {
  const { userId, redirectToSignIn } = auth();
  if (userId == null) return redirectToSignIn();
  const searchParam = await searchParams;
  const interval =
    CHART_INTERVALS[searchParam.interval as keyof typeof CHART_INTERVALS] ??
    CHART_INTERVALS.last7days;
  const timezone = searchParam.timezone ?? "UTC";
  const productId = searchParam.productId;

  return (
    <>
      <div className="mb-6 flex justify-between items-baseline">
        <h1 className="text-3xl font-semibold">Analytics</h1>
        <HasPersmission permission={canAccessAnalytics}>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant={"outline"}>
                  {interval.label}
                  <ChevronDown className="size-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {Object.entries(CHART_INTERVALS).map(([key, value]) => (
                  <DropdownMenuItem asChild key={key}>
                    <Link
                      href={createURL("/dashboard/analytics", searchParam, {
                        interval: key,
                      })}
                    >
                      {value.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant={"outline"}>
                  {timezone}
                  <ChevronDown className="size-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link
                    href={createURL("/dashboard/analytics", searchParam, {
                      timezone: "UTC",
                    })}
                  >
                    UTC
                  </Link>
                </DropdownMenuItem>
                <TimeZoneDropDownMenuItem searchParams={searchParam} />
              </DropdownMenuContent>
            </DropdownMenu>
            <ProductDropDown
              userId={userId}
              productId={productId}
              searchParams={searchParam}
            />
          </div>
        </HasPersmission>
      </div>
      <HasPersmission permission={canAccessAnalytics} renderFallback>
        <div className="flex flex-col gap-8">
          <ViewsByDayCard
            interval={interval}
            timezone={timezone}
            userId={userId}
            productId={productId}
          />
          <ViewsByDealfitCard
            interval={interval}
            timezone={timezone}
            userId={userId}
            productId={productId}
          />
          <ViewsByCountryCard
            interval={interval}
            timezone={timezone}
            userId={userId}
            productId={productId}
          />
        </div>
      </HasPersmission>
    </>
  );
}

async function ViewsByDayCard(
  props: Parameters<typeof getViewsByDayChartData>[0]
) {
  const chartData = await getViewsByDayChartData(props);

  return (
    <ChartTile title="Visitors Per Day">
      <ViewsByDayChart chartData={chartData} />
    </ChartTile>
  );
}

async function ViewsByDealfitCard(
  props: Parameters<typeof getViewsByDealfitChartData>[0]
) {
  const chartData = await getViewsByDealfitChartData(props);
  console.log(chartData);
  return (
    <ChartTile title="Visitors Per Dealfit Group">
      <ViewsByDealfitChart chartData={chartData} />
    </ChartTile>
  );
}

async function ViewsByCountryCard(
  props: Parameters<typeof getViewsByCountryChartData>[0]
) {
  const chartData = await getViewsByCountryChartData(props);

  return (
    <ChartTile title="Visitors Per Country">
      <ViewsByCountryChart chartData={chartData} />
    </ChartTile>
  );
}
