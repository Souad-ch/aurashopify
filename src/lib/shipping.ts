export type ShippingOption = {
  id: "standard" | "express" | "pickup";
  label: string;
  cost: number;
  eta: string;
};

export const SHIPPING_OPTIONS: ShippingOption[] = [
  { id: "standard", label: "توصيل عادي", cost: 5, eta: "3-5 أيام عمل" },
  { id: "express", label: "توصيل سريع", cost: 15, eta: "1-2 يوم عمل" },
  { id: "pickup", label: "استلام من المتجر", cost: 0, eta: "اليوم" },
];

export function getShipping(id: string | null | undefined): ShippingOption {
  return SHIPPING_OPTIONS.find((s) => s.id === id) || SHIPPING_OPTIONS[0];
}
