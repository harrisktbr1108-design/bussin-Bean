import test from 'node:test';
import assert from 'node:assert/strict';

import { calculateOrderTotals } from './orderPricing';

test('delivery charge is added to the final total', () => {
  const totals = calculateOrderTotals({
    subtotal: 1000,
    itemDiscount: 100,
    customerDiscountAmount: 50,
    deliveryFee: 50,
  });

  assert.equal(totals.deliveryFee, 50);
  assert.equal(totals.grandTotal, 900);
});
