import { HasPersmission } from "@/components/HadPermission";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { canAccessAnalytics } from "@/server/permissions";
import { auth } from "@clerk/nextjs/server";
import { ChartTile } from "./_components/ChartTile";
import {
  CHART_INTERVALS,
  getViewsByCountryChartData,
} from "@/server/db/productViews";
import { ViewsByCountryChart } from "./_components/charts/ViewByCountryChart";

interface AnalyticsProps {
  interval?: string;
  timezone?: string;
  productId?: string;
}

export default async function Analytics({
  searchParams,
}: {
  searchParams: Promise<AnalyticsProps>;
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
      <h1 className="text-3xl font-semibold">Analytics</h1>
      <HasPersmission permission={canAccessAnalytics} renderFallback>
        <div className="flex flex-col gap-8">
          <ViewsByDayCard />
          {/* <ViewsByDealfitCard /> */}
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

async function ViewsByDayCard() {
  //   props: Parameters<typeof getViewsByDayChartData>[0]
  //   const chartData = await getViewsByDayChartData(props);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Visitors Per Day</CardTitle>
      </CardHeader>
      <CardContent>
        {/* <ViewsByDayChart chartData={chartData} /> */}
      </CardContent>
    </Card>
  );
}

async function ViewsByDealfitCard() {
  //   props: Parameters<typeof getViewsByPPPChartData>[0]
  //   const chartData = await getViewsByPPPChartData(props);
  //   return (
  //     <ChartTile title="Visitors Per Dealfit Group">
  //       <ViewsByDealfitChart chartData={chartData} />
  //     </ChartTile>
  //   );
}

async function ViewsByCountryCard(
  props: Parameters<typeof getViewsByCountryChartData>[0]
) {
  const chartData = await getViewsByCountryChartData(props);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Visitors Per Country</CardTitle>
      </CardHeader>
      <CardContent>
        <ViewsByCountryChart chartData={chartData} />
      </CardContent>
    </Card>
  );
}
