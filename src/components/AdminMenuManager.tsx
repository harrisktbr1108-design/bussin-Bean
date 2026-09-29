import React, { useState } from 'react';
import { MenuItem } from '../data/menu';
import { AdminMenuItemModal } from './AdminMenuItemModal';
import { Edit3, Plus, Trash2 } from 'lucide-react';

interface Props { items: MenuItem[]; onChange: (items: MenuItem[]) => void; }
export const AdminMenuManager: React.FC<Props> = ({ items, onChange }) => { const [editing, setEditing] = useState<MenuItem | undefined>(); const [modal, setModal] = useState(false); const save = (item: MenuItem) => { onChange(items.some(existing => existing.id === item.id) ? items.map(existing => existing.id === item.id ? item : existing) : [...items, item]); setModal(false); setEditing(undefined); }; return <div><div style={toolbar}><div><p style={eyebrow}>CATALOG CONTROL</p><h2 style={heading}>Menu & inventory</h2></div><button onClick={() => { setEditing(undefined); setModal(true); }} style={primary}><Plus size={15} /> ADD ITEM</button></div><div style={table}>{items.map(item => <div key={item.id} style={row}><img src={item.image} alt="" style={image} /><div style={{ flex: 1 }}><strong style={{ fontSize: 13 }}>{item.name}</strong><span style={small}>{item.category} · {item.currency} {item.price}{item.discountPercent ? ` · ${item.discountPercent}% off` : ''}</span></div><button onClick={() => onChange(items.map(existing => existing.id === item.id ? { ...existing, isInStock: existing.isInStock === false } : existing))} style={{ ...stock, color: item.isInStock === false ? '#963E2E' : '#47704E' }}>{item.isInStock === false ? 'OUT OF STOCK' : 'IN STOCK'}</button><button onClick={() => { setEditing(item); setModal(true); }} style={iconButton}><Edit3 size={15} /></button><button onClick={() => onChange(items.filter(existing => existing.id !== item.id))} style={{ ...iconButton, color: '#963E2E' }}><Trash2 size={15} /></button></div>)}</div>{modal && <AdminMenuItemModal item={editing} onClose={() => setModal(false)} onSave={save} />}</div>; };
const toolbar: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 18 };
const eyebrow: React.CSSProperties = { color: '#B67538', fontSize: 10, fontWeight: 800, letterSpacing: '.14em', margin: 0 };
const heading: React.CSSProperties = { fontFamily: "'Playfair Display',serif", fontSize: 28, margin: '7px 0 0' };
const primary: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 7, border: 0, borderRadius: 10, padding: '11px 14px', background: '#302016', color: '#FFF9F0', fontWeight: 800, fontSize: 10, cursor: 'pointer' };
const table: React.CSSProperties = { background: '#FFF9F2', border: '1px solid #E4D7C7', borderRadius: 16, overflow: 'hidden' };
const row: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 12, padding: 12, borderBottom: '1px solid #EEE3D7' };
const image: React.CSSProperties = { width: 48, height: 48, borderRadius: 9, objectFit: 'cover' };
const small: React.CSSProperties = { display: 'block', color: '#765A43', fontSize: 11, marginTop: 4 };
const stock: React.CSSProperties = { border: 0, background: 'transparent', fontSize: 10, fontWeight: 800, cursor: 'pointer' };
const iconButton: React.CSSProperties = { border: 0, background: '#F1E4D4', color: '#6D4A2D', width: 32, height: 32, borderRadius: 8, display: 'grid', placeItems: 'center', cursor: 'pointer' };
