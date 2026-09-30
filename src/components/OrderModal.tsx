import React, { useEffect, useState } from 'react';
import { CoffeeAddOn, MenuItem } from '../data/menu';
import { CustomerDiscount, CustomerOrder } from '../adminTypes';
import { formatCountdown, getStoreHoursState } from '../operatingHours';
import { X, ShoppingBag, Trash2, CheckCircle2, ArrowRight, Truck } from 'lucide-react';
import { apiRequest } from '../api';
import { DEFAULT_DELIVERY_FEE, calculateOrderTotals } from '../orderPricing';

export interface CartItem { item: MenuItem; quantity: number; addOns: CoffeeAddOn[]; key: string; }

interface Props {
  isOpen: boolean; onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (key: string, delta: number) => void;
  onRemoveItem: (key: string) => void;
  onClearCart: () => void;
  storeOpen: boolean;
  onCreateOrder: (items: CartItem[], total: number, contactNumber: string, address: string) => Promise<CustomerOrder>;
  orders: CustomerOrder[];
  discounts: CustomerDiscount[];
}

export const OrderModal: React.FC<Props> = ({ isOpen, onClose, cart, onUpdateQuantity, onRemoveItem, onClearCart, storeOpen, onCreateOrder, orders, discounts }) => {
  const [ordered, setOrdered] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [address, setAddress] = useState('');
  const [customerKey, setCustomerKey] = useState('');
  const [serverDiscount, setServerDiscount] = useState<{ percent: number; label: string } | null>(null);

  const subtotal = cart.reduce((total, cartItem) => {
    const addOnTotal = cartItem.addOns.reduce((sum, addOn) => sum + addOn.price, 0);
    return total + (cartItem.item.price + addOnTotal) * cartItem.quantity;
  }, 0);
  const itemDiscount = cart.reduce((total, cartItem) => total + cartItem.item.price * cartItem.quantity * ((cartItem.item.discountPercent || 0) / 100), 0);
  const customerDiscount = serverDiscount || discounts.find(discount => discount.active && discount.customerKey === customerKey.trim().toLowerCase()) || null;
  const customerDiscountAmount = (subtotal - itemDiscount) * ((customerDiscount?.percent || 0) / 100);
  const deliveryFee = DEFAULT_DELIVERY_FEE;
  const totals = calculateOrderTotals({ subtotal, itemDiscount, customerDiscountAmount, deliveryFee });
  const grandTotal = totals.grandTotal;

  useEffect(() => {
    const key = customerKey.trim();
    if (!key) { setServerDiscount(null); return; }
    const timer = window.setTimeout(() => {
      apiRequest<{ percent: number; label: string } | null>(`/discounts/customer/${encodeURIComponent(key)}`)
        .then(setServerDiscount)
        .catch(() => setServerDiscount(null));
    }, 350);
    return () => window.clearTimeout(timer);
  }, [customerKey]);

  const [checkoutError, setCheckoutError] = useState('');
  const checkout = async () => {
    if (!storeOpen) return;
    setCheckoutError('');
    if (!contactNumber.trim() || !address.trim()) {
      setCheckoutError('Contact number and delivery address are required.');
      return;
    }
    try {
      const order = await onCreateOrder(cart, grandTotal, contactNumber.trim(), address.trim());
      if (customerDiscount && customerKey.trim()) {
        await apiRequest(`/discounts/customer/${encodeURIComponent(customerKey.trim())}/redeem`, { method: 'POST' }).catch(() => undefined);
      }
      setOrderId(order.id); setOrdered(true); onClearCart();
    } catch (error) { setCheckoutError(error instanceof Error ? error.message : 'Unable to place order.'); }
  };

  if (!isOpen) return null;

  const trackedOrder = orders.find(order => order.id === orderId);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(18,7,3,0.60)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{
        background: '#FAF6F0', borderRadius: 24,
        maxWidth: 500, width: '100%', maxHeight: '90vh',
        display: 'flex', flexDirection: 'column',
        border: '1px solid rgba(18,7,3,0.10)',
        boxShadow: '0 32px 80px rgba(18,7,3,0.22)',
        overflow: 'hidden', position: 'relative',
      }}>

        {/* Close */}
        <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: '#F4ECE1', border: '1px solid rgba(18,7,3,0.10)', borderRadius: '50%', width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 1 }}>
          <X size={16} color="#120703" />
        </button>

        {ordered ? (
          <div style={{ padding: 48, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#3D2314', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'pulse 1s infinite' }}>
              <CheckCircle2 size={36} color="#C47E38" />
            </div>
            <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, fontWeight: 700, color: '#120703', margin: 0 }}>Order Confirmed!</h3>
            <p style={{ fontSize: 13, color: '#4A2710', margin: 0, lineHeight: 1.6 }}>Order {orderId} is in the queue. You can close this window and reopen your bag to check live progress.</p>
            {trackedOrder && <div style={{ width: '100%', background: '#F4ECE1', borderRadius: 14, padding: 14, textAlign: 'left' }}><strong style={{ fontSize: 11, color: '#5C3318' }}>LIVE STATUS</strong><div style={{ fontFamily: "'Playfair Display',serif", fontSize: 21, marginTop: 4 }}>{trackedOrder.status}</div>{trackedOrder.rejectionReason && <p style={{ color: '#963E2E', fontSize: 11, margin: '6px 0 0' }}>{trackedOrder.rejectionReason}</p>}</div>}
            <button onClick={() => { setOrdered(false); onClose(); }} className="btn-dark" style={{ cursor: 'pointer' }}>CONTINUE BROWSING</button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div style={{ padding: '22px 24px', borderBottom: '1px solid rgba(18,7,3,0.08)', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: '#3D2314', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShoppingBag size={20} color="#C47E38" />
              </div>
              <div>
                <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 700, color: '#120703', margin: 0 }}>Your Coffee Order</h3>
                <p style={{ fontSize: 11, color: '#5C3318', margin: 0, fontWeight: 500 }}>{cart.length} item type{cart.length !== 1 ? 's' : ''} in your bag</p>
              </div>
            </div>

            {/* Cart items */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: '#7A4A2E', fontSize: 13 }}>
                  Your bag is empty. Browse the menu to add items!
                </div>
              ) : cart.map(({ item, quantity, addOns, key }) => (
                <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 14, background: '#F4ECE1', borderRadius: 16, padding: '12px 14px', border: '1px solid rgba(18,7,3,0.08)' }}>
                  <img src={item.image} alt={item.name} style={{ width: 56, height: 56, borderRadius: 10, objectFit: 'cover', border: '1px solid rgba(18,7,3,0.10)', flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#120703' }}>{item.name}</div>
                    {addOns.length > 0 && (
                      <div style={{ fontSize: 10, color: '#5C3318', marginTop: 3, lineHeight: 1.5 }}>
                        Extras: {addOns.map(addOn => addOn.name).join(', ')}
                      </div>
                    )}
                    <div style={{ fontSize: 11, fontFamily: 'monospace', color: '#5C3318', fontWeight: 600, marginTop: 4 }}>{item.currency} {Math.round(item.price * (1 - (item.discountPercent || 0) / 100))}{item.discountPercent ? ` · ${item.discountPercent}% off` : ''}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', background: '#FAF6F0', border: '1px solid rgba(18,7,3,0.14)', borderRadius: 8, padding: '4px 8px', gap: 10 }}>
                      <button onClick={() => onUpdateQuantity(key, -1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3D2314', fontWeight: 800, fontSize: 16, lineHeight: 1, padding: 0 }}>−</button>
                      <span style={{ fontSize: 13, fontFamily: 'monospace', fontWeight: 700, color: '#120703', minWidth: 16, textAlign: 'center' }}>{quantity}</span>
                      <button onClick={() => onUpdateQuantity(key, 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3D2314', fontWeight: 800, fontSize: 16, lineHeight: 1, padding: 0 }}>+</button>
                    </div>
                    <button onClick={() => onRemoveItem(key)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7A4A2E', padding: 4 }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer summary */}
            {cart.length > 0 && (
              <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(18,7,3,0.08)', display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#5C3318' }}>
                  <span>Subtotal</span><span>Rs. {subtotal}</span>
                </div>
                {itemDiscount > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#47704E' }}><span>Menu discounts</span><span>- Rs. {Math.round(itemDiscount)}</span></div>}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginTop: 4 }}>
                  <label htmlFor="order-contact-number" style={{ fontSize: 11, fontWeight: 800, color: '#5C3318' }}>CONTACT NUMBER *</label>
                  <input id="order-contact-number" type="tel" autoComplete="tel" required maxLength={40} value={contactNumber} onChange={event => setContactNumber(event.target.value)} placeholder="Your phone number" style={{ width: '100%', boxSizing: 'border-box', background: '#FAF6F0', border: '1px solid rgba(18,7,3,.14)', borderRadius: 9, padding: '9px 11px', fontSize: 12, outline: 'none' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  <label htmlFor="order-address" style={{ fontSize: 11, fontWeight: 800, color: '#5C3318' }}>DELIVERY ADDRESS *</label>
                  <textarea id="order-address" autoComplete="street-address" required maxLength={500} rows={2} value={address} onChange={event => setAddress(event.target.value)} placeholder="Street, building, area" style={{ width: '100%', boxSizing: 'border-box', resize: 'vertical', background: '#FAF6F0', border: '1px solid rgba(18,7,3,.14)', borderRadius: 9, padding: '9px 11px', fontSize: 12, outline: 'none', fontFamily: 'inherit' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 4 }}>
                  <label style={{ fontSize: 11, fontWeight: 800, color: '#5C3318' }}>CUSTOMER DISCOUNT</label>
                  <input value={customerKey} onChange={e => setCustomerKey(e.target.value)} placeholder="Phone, email, or member ID" style={{ width: '100%', boxSizing: 'border-box', background: '#FAF6F0', border: '1px solid rgba(18,7,3,.14)', borderRadius: 9, padding: '9px 11px', fontSize: 12, outline: 'none' }} />
                  {customerDiscount && <span style={{ color: '#47704E', fontSize: 11 }}>{customerDiscount.label}: {customerDiscount.percent}% off applied</span>}
                </div>
                {customerDiscountAmount > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#47704E' }}><span>Customer discount</span><span>- Rs. {Math.round(customerDiscountAmount)}</span></div>}
                {checkoutError && <p style={{ color: '#963E2E', fontSize: 11, margin: 0 }}>{checkoutError}</p>}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#5C3318' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Truck size={13} color="#2e7d32" /> Express Delivery
                  </span>
                  <span style={{ color: '#2e7d32', fontWeight: 800, letterSpacing: '0.05em' }}>Rs. {deliveryFee}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 700, color: '#120703', paddingTop: 8, borderTop: '1px solid rgba(18,7,3,0.08)' }}>
                  <span>Grand Total</span>
                  <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 20 }}>Rs. {grandTotal}</span>
                </div>
                <button onClick={checkout} disabled={!storeOpen} className="btn-dark" style={{ marginTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: storeOpen ? 'pointer' : 'not-allowed', width: '100%', background: storeOpen ? undefined : '#8D7967' }}>
                  {storeOpen ? <>PLACE COFFEE ORDER <ArrowRight size={16} color="#C47E38" /></> : <>STORE CLOSED · OPENS 11 AM <span style={{ fontSize: 10 }}>({formatCountdown(getStoreHoursState().minutesUntilChange)})</span></>}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
