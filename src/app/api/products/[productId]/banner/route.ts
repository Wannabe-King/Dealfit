import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { NextRequest } from "next/server";
import { env } from "@/data/env/server";
import { getProductForBanner } from "@/server/db/products";
import { createProductView } from "@/server/db/productViews";
import { canRemoveBranding, canShowDiscountBanner } from "@/server/permissions";
import { createElement } from "react";
import { Banner } from "@/components/Banner";

interface GeoNextRequest extends NextRequest {
  geo?: {
    country?: string;
    city?: string;
    region?: string;
  };
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ productId: string }> }
) {
  console.log("Hi");
  const { productId } = await context.params;
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
  console.log("discount");
  console.log(discount);

  if (product == null) return notFound();

  const canShowBanner = await canShowDiscountBanner(product.clerkUserId);

  await createProductView({
    productId,
    countryId: country?.id,
    userId: product.clerkUserId,
  });

  if (canShowBanner == null) return notFound();
  if (country == null || discount == null) return notFound();

  return new Response(
    await getJavaScript(
      product,
      country,
      discount,
      await canRemoveBranding(product.clerkUserId)
    ),
    { headers: { "content-type": "text/javascript" } }
  );
}

function getCountryCode(request: GeoNextRequest) {
  if (request.geo?.country != null) return request.geo.country;
  if (process.env.NODE_ENV === "development") {
    return env.TEST_COUNTRY_CODE;
  }
}

async function getJavaScript(
  product: {
    customization: {
      classPrefix?: string | null;
      locationMessage: string;
      backgroundColor: string;
      textColor: string;
      fontSize: string;
      bannerContainer: string;
      isSticky: boolean;
    };
  },
  country: { id: string; name: string },
  discount: { coupon: string; percentage: number },
  canRemoveBranding: boolean
) {
  const { renderToStaticMarkup } = await import("react-dom/server");
  return `
    const banner = document.createElement("div");
    banner.innerHTML = '${renderToStaticMarkup(
      createElement(Banner, {
        message: product.customization.locationMessage,
        mappings: {
          country: country.name,
          coupon: discount.coupon,
          discount: (discount.percentage * 100).toString(),
        },
        customization: product.customization,
        canRemoveBranding,
      })
    )}';
    document.querySelector("${
      product.customization.bannerContainer
    }").prepend(...banner.children);
  `.replace(/(\r\n|\n|\r)/g, "");
}
