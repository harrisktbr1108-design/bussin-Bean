export const DEFAULT_DELIVERY_FEE = 50;

export interface OrderTotalsInput {
  subtotal: number;
  itemDiscount: number;
  customerDiscountAmount: number;
  deliveryFee?: number;
}

export function calculateOrderTotals({ subtotal, itemDiscount, customerDiscountAmount, deliveryFee = DEFAULT_DELIVERY_FEE }: OrderTotalsInput) {
  const discountedSubtotal = Math.max(0, subtotal - itemDiscount - customerDiscountAmount);
  const grandTotal = Math.max(0, Math.round(discountedSubtotal + deliveryFee));

  return {
    deliveryFee,
    grandTotal,
  };
}
