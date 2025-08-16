"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { productDetailSchema } from "@/schemas/products";
import {
  createProduct as createProductDB,
  deleteProduct as deleteProductDb,
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
