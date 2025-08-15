import { z } from "zod";
import { removeTrainlingSlash } from "../lib/utils";

export const productDetailSchema = z.object({
  name: z.string(),
  url: z.url().transform(removeTrainlingSlash),
  description: z.string().optional(),
});
