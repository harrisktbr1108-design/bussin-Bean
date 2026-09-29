import React from 'react';
import { CustomerOrder } from '../adminTypes';
import { MenuItem } from '../data/menu';
import { Clock3, Coffee, DollarSign, ShoppingBag } from 'lucide-react';

interface Props { orders: CustomerOrder[]; items: MenuItem[]; }
export const AdminDashboard: React.FC<Props> = ({ orders, items }) => {
  const revenue = orders.filter(order => order.status !== 'Rejected').reduce((sum, order) => sum + order.total, 0);
  const pending = orders.filter(order => order.status === 'Pending').length;
  const stats = [{ label: 'Today revenue', value: `Rs. ${revenue.toLocaleString()}`, icon: DollarSign }, { label: 'Order volume', value: orders.length, icon: ShoppingBag }, { label: 'Active products', value: items.filter(item => item.isInStock !== false).length, icon: Coffee }, { label: 'Pending review', value: pending, icon: Clock3 }];
  return <div><div className="admin-kpi-grid">{stats.map(({ label, value, icon: Icon }) => <div key={label} style={card}><div style={statIcon}><Icon size={17} /></div><p style={labelStyle}>{label}</p><strong style={valueStyle}>{value}</strong><span style={trend}>{label === 'Pending review' && pending ? 'Needs attention' : 'Live store data'}</span></div>)}</div><div className="admin-split-grid" style={{ marginTop: 18 }}><section style={panel}><p style={eyebrow}>OPERATIONS SNAPSHOT</p><h2 style={heading}>Keep the bar moving.</h2><p style={muted}>Orders are shared instantly between the customer storefront and this panel. Review pending tickets first, then advance them as the barista works.</p><div style={{ display: 'flex', gap: 8, marginTop: 20 }}>{['Pending', 'Accepted', 'Preparing', 'Ready'].map((step, index) => <div key={step} style={{ flex: 1 }}><div style={{ height: 7, borderRadius: 99, background: index < 2 ? '#B67538' : '#E5D6C4' }} /><span style={{ display: 'block', marginTop: 7, fontSize: 10, color: '#765A43' }}>{step}</span></div>)}</div></section><section style={panel}><p style={eyebrow}>RECENT ORDERS</p>{orders.length === 0 ? <p style={muted}>No orders yet. New customer orders will land here.</p> : orders.slice(-4).reverse().map(order => <div key={order.id} style={row}><div><strong style={{ fontSize: 13 }}>{order.id}</strong><span style={small}>{order.items.length} item type{order.items.length === 1 ? '' : 's'}</span></div><span style={status}>{order.status}</span></div>)}</section></div></div>;
};
const card: React.CSSProperties = { background: '#FFF9F2', border: '1px solid #E4D7C7', borderRadius: 16, padding: 18, minHeight: 132 };
const panel: React.CSSProperties = { background: '#FFF9F2', border: '1px solid #E4D7C7', borderRadius: 18, padding: 22 };
const statIcon: React.CSSProperties = { width: 32, height: 32, display: 'grid', placeItems: 'center', borderRadius: 10, color: '#B67538', background: '#F1E4D4' };
const labelStyle: React.CSSProperties = { fontSize: 11, color: '#765A43', margin: '16px 0 4px' };
const valueStyle: React.CSSProperties = { fontFamily: "'Playfair Display',serif", fontSize: 27, display: 'block' };
const trend: React.CSSProperties = { color: '#56815C', fontSize: 10, fontWeight: 700 };
const eyebrow: React.CSSProperties = { color: '#B67538', fontSize: 10, fontWeight: 800, letterSpacing: '.14em', margin: 0 };
const heading: React.CSSProperties = { fontFamily: "'Playfair Display',serif", fontSize: 28, margin: '8px 0' };
const muted: React.CSSProperties = { color: '#765A43', fontSize: 13, lineHeight: 1.6, margin: 0 };
const row: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '13px 0', borderBottom: '1px solid #EEE3D7' };
const small: React.CSSProperties = { display: 'block', fontSize: 11, color: '#765A43', marginTop: 3 };
const status: React.CSSProperties = { color: '#855321', background: '#F1E4D4', borderRadius: 99, padding: '5px 9px', fontSize: 10, fontWeight: 800 };
