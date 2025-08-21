import { CountryDiscountsForm } from "@/app/dashboard/_components/forms/CountryDiscountsForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getProductCountryGroups } from "@/server/db/products";

export async function CountryTab({
  productId,
  userId,
}: {
  productId: string;
  userId: string;
}) {
  const countryGroups = await getProductCountryGroups({
    productId,
    userId,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Country Discounts</CardTitle>
        <CardDescription>
          Leave the discount field blank if you do not want to display deals for
          any specific parity group.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CountryDiscountsForm
          productId={productId}
          countryGroups={countryGroups}
        />
      </CardContent>
    </Card>
  );
}
