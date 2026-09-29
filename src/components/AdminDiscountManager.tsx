import React, { useState } from 'react';
import { CustomerDiscount } from '../adminTypes';
import { Percent, Trash2, UserPlus } from 'lucide-react';

interface Props { discounts: CustomerDiscount[]; onChange: (discounts: CustomerDiscount[]) => void; }
export const AdminDiscountManager: React.FC<Props> = ({ discounts, onChange }) => {
  const [customerKey, setCustomerKey] = useState('');
  const [percent, setPercent] = useState(10);
  const [label, setLabel] = useState('Loyalty discount');
  const addDiscount = () => {
    const key = customerKey.trim().toLowerCase();
    if (!key || percent <= 0) return;
    onChange([...discounts.filter(discount => discount.customerKey !== key), { id: `discount-${Date.now()}`, customerKey: key, percent: Math.min(100, percent), label: label.trim() || 'Customer discount', active: true }]);
    setCustomerKey('');
  };
  return <section style={panel}><div style={header}><div><p style={eyebrow}>TARGETED OFFERS</p><h2 style={heading}>Customer discounts</h2><p style={muted}>Use the customer phone, email, or member ID they enter at checkout.</p></div><Percent size={22} color="#B67538" /></div><div className="discount-form"><input value={customerKey} onChange={e => setCustomerKey(e.target.value)} placeholder="Customer phone or email" /><input type="number" min="1" max="100" value={percent} onChange={e => setPercent(Number(e.target.value))} aria-label="Discount percentage" /><input value={label} onChange={e => setLabel(e.target.value)} placeholder="Offer label" /><button onClick={addDiscount} style={primary}><UserPlus size={14} /> ADD DISCOUNT</button></div><div>{discounts.length === 0 ? <p style={muted}>No targeted discounts yet.</p> : discounts.map(discount => <div key={discount.id} style={row}><div><strong>{discount.customerKey}</strong><span style={small}>{discount.label}</span></div><b style={badge}>{discount.percent}% off</b><button onClick={() => onChange(discounts.filter(item => item.id !== discount.id))} style={deleteButton} aria-label={`Remove discount for ${discount.customerKey}`}><Trash2 size={15} /></button></div>)}</div></section>;
}
const panel: React.CSSProperties = { background: '#FFF9F2', border: '1px solid #E4D7C7', borderRadius: 16, padding: 20, marginBottom: 18 };
const header: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', gap: 16 };
const eyebrow: React.CSSProperties = { color: '#B67538', fontSize: 10, fontWeight: 800, letterSpacing: '.14em', margin: 0 };
const heading: React.CSSProperties = { fontFamily: "'Playfair Display',serif", fontSize: 27, margin: '7px 0' };
const muted: React.CSSProperties = { color: '#765A43', fontSize: 12, lineHeight: 1.5, margin: '5px 0 14px' };
const primary: React.CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, border: 0, borderRadius: 9, padding: '11px 13px', background: '#302016', color: '#FFF9F2', fontSize: 10, fontWeight: 800, cursor: 'pointer' };
const row: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderTop: '1px solid #EEE3D7' };
const small: React.CSSProperties = { display: 'block', color: '#765A43', fontSize: 11, marginTop: 3 };
const badge: React.CSSProperties = { marginLeft: 'auto', color: '#47704E', background: '#DDEBDC', borderRadius: 99, padding: '6px 9px', fontSize: 10 };
const deleteButton: React.CSSProperties = { border: 0, background: '#F6DCD5', color: '#963E2E', borderRadius: 8, width: 31, height: 31, display: 'grid', placeItems: 'center', cursor: 'pointer' };
