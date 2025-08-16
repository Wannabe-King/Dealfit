import { db } from "@/drizzle/db";
import { ProductCustomizationTable, ProductTable } from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";

export function getProducts(userId: string, { limit }: { limit?: number }) {
  return db.query.ProductTable.findMany({
    where: ({ clerkUserId }, { eq }) => eq(clerkUserId, userId),
    orderBy: ({ createdAt }, { desc }) => desc(createdAt),
    limit,
  });
}

export async function createProduct(data: typeof ProductTable.$inferInsert) {
  const [newProduct] = await db
    .insert(ProductTable)
    .values(data)
    .returning({ id: ProductTable.id });

  try {
    await db
      .insert(ProductCustomizationTable)
      .values({
        productId: newProduct.id,
      })
      .onConflictDoNothing({
        target: ProductCustomizationTable.productId,
      });
  } catch (e) {
    await db.delete(ProductTable).where(eq(ProductTable.id, newProduct.id));
  }

  return newProduct;
}

export async function deleteProduct({
  productId,
  userId,
}: {
  productId: string;
  userId: string;
}) {
  const { rowCount } = await db
    .delete(ProductTable)
    .where(
      and(eq(ProductTable.id, productId), eq(ProductTable.clerkUserId, userId))
    );

    if(rowCount>0){
      // revalidateDbCache({
      //   tag: CACHE_TAGS.products,
      //   userId,
      //   productId,
      // })
    }

    return rowCount>0;
}
