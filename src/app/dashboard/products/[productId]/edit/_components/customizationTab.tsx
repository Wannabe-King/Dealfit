import { ProductCustomizationForm } from "@/app/dashboard/_components/forms/ProductCustomizationForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getProductCustomization } from "@/server/db/products";
import { canCustomizeBanner, canRemoveBranding } from "@/server/permissions";
import { notFound } from "next/navigation";

export async function CustomizationsTab({
  productId,
  userId,
}: {
  productId: string;
  userId: string;
}) {
  const customization = await getProductCustomization({ productId, userId });

  if (customization == null) return notFound();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Banner Customization</CardTitle>
      </CardHeader>
      <CardContent>
        <ProductCustomizationForm
          canRemoveBranding={await canRemoveBranding(userId)}
          canCustomizeBanner={await canCustomizeBanner(userId)}
          customization={customization}
        />
      </CardContent>
    </Card>
  );
}
