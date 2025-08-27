import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createURL } from "@/lib/utils";
import { getProducts } from "@/server/db/products";
import { ChevronDown } from "lucide-react";
import Link from "next/link";

export async function ProductDropDown({
  userId,
  productId,
  searchParams,
}: {
  userId: string;
  productId?: string;
  searchParams: Record<string, string>;
}) {
  const products = await getProducts(userId);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"outline"}>
          {products.find((p) => p.id === productId)?.name ?? "All Products"}
          <ChevronDown className="size-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem asChild>
          <Link
            href={createURL("/dashboard/analytics", searchParams, {
              productId: undefined,
            })}
          >
            All Products
          </Link>
        </DropdownMenuItem>
        {products.map((product) => (
          <DropdownMenuItem asChild key={product.id}>
            <Link
              href={createURL("/dashboard/analytics", searchParams, {
                productId: product.id,
              })}
            >
              {product.name}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
