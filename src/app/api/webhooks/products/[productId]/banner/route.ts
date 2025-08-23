import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { NextRequest } from "next/server";
import { env } from "@/data/env/server";
import { getProductForBanner } from "@/server/db/products";

export async function GET(
  request: NextRequest,
  { params: { productId } }: { params: { productId: string } }
) {
  const headersMap = await headers();
  const requestingUrl = headersMap.get("referer") || headersMap.get("origin");
  if (requestingUrl == null) return notFound();
  const countryCode = getCountryCode(request);
  if (countryCode == null) return notFound();

  const { product, discount, country } = await getProductForBanner({
    id: productId,
    countryCode,
    url: requestingUrl,
  });

  if (product == null) return notFound();
}

function getCountryCode(request: NextRequest) {
  if (request.geo?.country != null) return request.geo.country;
  if (process.env.NODE_ENV === "development") {
    return env.TEST_COUNTRY_CODE;
  }
}
