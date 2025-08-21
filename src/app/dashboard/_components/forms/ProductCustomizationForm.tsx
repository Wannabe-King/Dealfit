export function ProductCustomizationForm({
  canRemoveBranding,
  canCustomizeBanner,
  customization,
}: {
  canRemoveBranding: boolean;
  canCustomizeBanner: boolean;
  customization: {
    productId: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    classPrefix: string | null;
    locationMessage: string;
    backgroundColor: string;
    textColor: string;
    fontSize: string;
    bannerContainer: string;
    isSticky: boolean;
  };
}) {
  return null;
}
