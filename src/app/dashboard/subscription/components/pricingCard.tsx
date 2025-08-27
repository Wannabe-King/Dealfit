"use server";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { subscriptionTiersInOrder, TierNames } from "@/data/subscriptionTiers";
import { formatCompactNumber } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import {
  createCancelSession,
  createCheckoutSession,
} from "@/server/actions/stripe";
import { CheckIcon } from "lucide-react";
import { ReactNode } from "react";

export async function PricingCard({
  name,
  priceInCents,
  maxNumberOfVisits,
  maxNumberOfProducts,
  canRemoveBranding,
  canAccessAnalytics,
  canCustomizeBanner,
  currentTierName,
}: (typeof subscriptionTiersInOrder)[number] & { currentTierName: TierNames }) {
  const isCurrent = currentTierName === name;

  return (
    <Card className="shadow-none rounded-3xl overflow-hidden">
      <CardHeader>
        <div className="text-accent font-semibold mb-8">{name}</div>
        <CardTitle className="text-xl font-bold">
          ${priceInCents / 100} /mo
        </CardTitle>
        <CardDescription>
          {formatCompactNumber(maxNumberOfVisits)} pricing page visits/mo
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          action={
            name === "Free"
              ? async (formData: FormData) => {
                  await createCancelSession();
                }
              : async (formData: FormData) => {
                  await createCheckoutSession(name);
                }
          }
        >
          <Button
            disabled={isCurrent}
            className="text-lg w-full rounded-lg"
            size="lg"
          >
            {isCurrent ? "Current" : "Swap"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-4 items-start">
        <Feature className="font-bold">
          {maxNumberOfProducts}{" "}
          {maxNumberOfProducts === 1 ? "product" : "products"}
        </Feature>
        <Feature>Dealfit discounts</Feature>
        {canCustomizeBanner && <Feature>Banner customization</Feature>}
        {canAccessAnalytics && <Feature>Advanced analytics</Feature>}
        {canRemoveBranding && <Feature>Remove Dealfit branding</Feature>}
      </CardFooter>
    </Card>
  );
}

function Feature({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <CheckIcon className="size-4 stroke-accent bg-accent/25 rounded-full p-0.5" />
      <span>{children}</span>
    </div>
  );
}
