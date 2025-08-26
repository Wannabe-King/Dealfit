import { db } from "@/drizzle/db";
import { CountryTable, ProductTable, ProductViewTable } from "@/drizzle/schema";
import {
  CACHE_TAGS,
  dbCache,
  getGlobalTag,
  getIdTag,
  getUserTag,
  revalidateDbCache,
} from "@/lib/cache";
import { startOfDay, subDays } from "date-fns";
import { and, count, desc, eq, gte, sql } from "drizzle-orm";
import { tz } from "@date-fns/tz";

export function getProductViewCount(userId: string, startDate: Date) {
  const cacheFn = dbCache(getProductViewCountInternal, {
    tags: [getUserTag(userId, CACHE_TAGS.productViews)],
  });

  return cacheFn(userId, startDate);
}

export function getViewsByCountryChartData({
  timezone,
  productId,
  userId,
  interval,
}: {
  timezone: string;
  productId?: string;
  userId: string;
  interval: (typeof CHART_INTERVALS)[keyof typeof CHART_INTERVALS];
}) {
  const cacheFn = dbCache(getViewsByCountryChartDataInternal, {
    tags: [
      getUserTag(userId, CACHE_TAGS.productViews),
      productId == null
        ? getUserTag(userId, CACHE_TAGS.products)
        : getIdTag(productId, CACHE_TAGS.products),
      getGlobalTag(CACHE_TAGS.countries),
    ],
  });

  return cacheFn({
    timezone,
    productId,
    userId,
    interval,
  });
}

export async function createProductView({
  productId,
  countryId,
  userId,
}: {
  productId: string
  countryId?: string
  userId: string
}) {
  const [newRow] = await db
    .insert(ProductViewTable)
    .values({
      productId: productId,
      visitedAt: new Date(),
      countryId: countryId,
    })
    .returning({ id: ProductViewTable.id })

  if (newRow != null) {
    revalidateDbCache({ tag: CACHE_TAGS.productViews, userId, id: newRow.id })
  }
}

async function getProductViewCountInternal(userId: string, startDate: Date) {
  const counts = await db
    .select({ pricingViewCount: count() })
    .from(ProductViewTable)
    .innerJoin(ProductTable, eq(ProductTable.id, ProductViewTable.productId))
    .where(
      and(
        eq(ProductTable.clerkUserId, userId),
        gte(ProductViewTable.visitedAt, startDate)
      )
    );

  return counts[0]?.pricingViewCount ?? 0;
}

async function getViewsByCountryChartDataInternal({
  timezone,
  productId,
  userId,
  interval,
}: {
  timezone: string;
  productId?: string;
  userId: string;
  interval: (typeof CHART_INTERVALS)[keyof typeof CHART_INTERVALS];
}) {
  const startDate = startOfDay(interval.startDate, { in: tz(timezone) });
  const productSq = getProductSubQuery(userId, productId);
  return await db
    .with(productSq)
    .select({
      views: count(ProductViewTable.visitedAt),
      countryName: CountryTable.name,
      countryCode: CountryTable.code,
    })
    .from(ProductViewTable)
    .innerJoin(productSq, eq(productSq.id, ProductViewTable.productId))
    .innerJoin(CountryTable, eq(CountryTable.id, ProductViewTable.countryId))
    .where(
      gte(
        sql`${ProductViewTable.visitedAt} AT TIME ZONE ${timezone}`
          .inlineParams(),
        startDate
      )
    )
    .groupBy(({ countryCode, countryName }) => [countryCode, countryName])
    .orderBy(({ views }) => desc(views))
    .limit(25);
}

function getProductSubQuery(userId: string, productId?: string) {
  return db.$with("products").as(
    db
      .select()
      .from(ProductTable)
      .where(
        and(
          eq(ProductTable.clerkUserId, userId),
          productId == null ? undefined : eq(ProductTable.id, productId)
        )
      )
  );
}

export const CHART_INTERVALS = {
  last7days: {
    startDate: subDays(new Date(), 7),
    label: "Last 7 Days",
  },
  last30Days: {
    startDate: subDays(new Date(), 30),
    label: "Last 30 Days",
  },
  last365Days: {
    startDate: subDays(new Date(), 365),
    label: "Last 365 Days",
  },
};
