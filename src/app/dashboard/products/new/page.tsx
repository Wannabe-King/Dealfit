import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageWithBackButton } from "../../_components/PageWithBackButton";
import { ProductDetailForm } from "../../_components/ProductDetailForm";

export default function NewProductPage() {
  return (
    <PageWithBackButton
      backButtonHref="/dashboard/products"
      pageTitle="New Product"
    >
      <Card>
        <CardHeader>
            <CardTitle className="text-xl">
                Product Details
            </CardTitle>
        </CardHeader>
        <CardContent>
            <ProductDetailForm/>
        </CardContent>
      </Card>
    </PageWithBackButton>
  );
}
