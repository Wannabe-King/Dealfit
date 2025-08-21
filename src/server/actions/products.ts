"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import {
  productCountryDiscountsSchema,
  productDetailSchema,
} from "@/schemas/products";
import {
  createProduct as createProductDB,
  deleteProduct as deleteProductDb,
  updateProduct as updateProductDb,
  updateCountryDiscounts as updateCountryDiscountsDb,
} from "@/server/db/products";
import { redirect } from "next/navigation";

export async function createProduct(
  unsafeData: z.infer<typeof productDetailSchema>
): Promise<{ error: boolean; message: string } | undefined> {
  const { userId } = auth();
  const { success, data } = productDetailSchema.safeParse(unsafeData);

  if (!success || userId == null) {
    return {
      error: true,
      message: "There was an error creating your product",
    };
  }

  const { id } = await createProductDB({ ...data, clerkUserId: userId });

  redirect(`/dashboard/products/${id}/edit?tab=countries`);
}

export async function updateProduct(
  id: string,
  unsafeData: z.infer<typeof productDetailSchema>
): Promise<{ error: boolean; message: string } | undefined> {
  const { userId } = auth();
  const { success, data } = productDetailSchema.safeParse(unsafeData);
  const errorMessage = "There was an error updating your product";

  if (!success || userId == null) {
    return {
      error: true,
      message: errorMessage,
    };
  }

  const isSuccess = await updateProductDb(data, { id, userId });

  return {
    error: !isSuccess,
    message: isSuccess ? "Product details updated" : errorMessage,
  };
}

export async function deleteProduct(
  id: string
): Promise<{ error: boolean; message: string } | undefined> {
  const { userId } = auth();
  const errorMessage = "There was an error deleting your product";

  if (userId == null) {
    return { error: true, message: errorMessage };
  }

  const isSuccess = await deleteProductDb({ productId: id, userId });

  return {
    error: !isSuccess,
    message: isSuccess ? "Successfully deleted your product" : errorMessage,
  };
}

export async function updateCountryDiscounts(
  id: string,
  unsafeData: z.infer<typeof productCountryDiscountsSchema>
) {
  const { userId } = auth();
  const { success, data } = productCountryDiscountsSchema.safeParse(unsafeData);

  if (!success || userId == null) {
    return {
      error: true,
      message: "There was an error saving your country discounts",
    };
  }

  const insert: {
    countryGroupId: string;
    productId: string;
    coupon: string;
    discountPercentage: number;
  }[] = [];
  const deleteIds: { countryGroupId: string }[] = [];

  data.groups.forEach((group) => {
    if (
      group.coupon != null &&
      group.coupon.length > 0 &&
      group.discountPercentage != null &&
      group.discountPercentage > 0
    ) {
      insert.push({
        countryGroupId: group.countryGroupId,
        coupon: group.coupon,
        discountPercentage: group.discountPercentage / 100,
        productId: id,
      });
    } else {
      deleteIds.push({ countryGroupId: group.countryGroupId });
    }
  });

  await updateCountryDiscountsDb(deleteIds, insert, {
    productId: id,
    userId,
  });

  return { error: false, message: "Country discounts saved" };
}
