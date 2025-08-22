import { PageWithBackButton } from "@/app/dashboard/_components/PageWithBackButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getProduct } from "@/server/db/products";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { DetailsTab } from "./_components/detailsTab";
import { CountryTab } from "./_components/countryTab";
import { CustomizationsTab } from "./_components/customizationTab";

type PageProps = {
  params: Promise<{ productId: string }>;
};

export default async function EditProductPage({
  params,
}: PageProps) {
  const { productId } = await params;
  var tab="details";
  const { userId, redirectToSignIn } = auth();
  if (userId == null) return redirectToSignIn();

  const proudct = await getProduct({ id: productId, userId });
  if (proudct == null) return notFound();

  return (
    <PageWithBackButton
      backButtonHref="/dashboard/products/"
      pageTitle="Edit Product"
    >
      <Tabs defaultValue={tab}>
        <TabsList className="bg-background/60">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="country">Country</TabsTrigger>
          <TabsTrigger value="customization">Customization</TabsTrigger>
        </TabsList>
        <TabsContent value="details">
          <DetailsTab product={proudct} />
        </TabsContent>
        <TabsContent value="country">
          <CountryTab productId={productId} userId={userId} />
        </TabsContent>
        <TabsContent value="customization">
          <CustomizationsTab productId={productId} userId={userId} />
        </TabsContent>
      </Tabs>
    </PageWithBackButton>
  );
}
