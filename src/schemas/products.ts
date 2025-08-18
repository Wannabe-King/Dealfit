import { z } from "zod";
import { removeTrainlingSlash } from "../lib/utils";

export const productDetailSchema = z.object({
  name: z.string(),
  url: z.url().transform(removeTrainlingSlash),
  description: z.string().optional(),
});

export const productCountryDiscountsSchema = z.object({
  groups: z.array(
    z.object({
      countryGroupId: z.string().min(1, "Required"),
      discountPercentage: z
        .number()
        .max(100)
        .min(1)
        .or(z.nan())
        .transform((n) => (isNaN(n) ? undefined : n))
        .optional(),
      coupon: z.string().optional(),
    })
  ),
});
