import React, { useState } from 'react';
import { MenuItem } from '../data/menu';

interface Props { item?: MenuItem; onClose: () => void; onSave: (item: MenuItem) => void; }

export const AdminMenuItemModal: React.FC<Props> = ({ item, onClose, onSave }) => {
  const [form, setForm] = useState<MenuItem>(item || { id: `item-${Date.now()}`, name: '', description: '', price: 350, currency: 'Rs.', category: 'classic', image: '/images/original_brew.png', isPopular: false, calories: '', tags: [] });
  const [imageError, setImageError] = useState('');
  const update = (key: keyof MenuItem, value: MenuItem[keyof MenuItem]) => setForm(prev => ({ ...prev, [key]: value }));
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setImageError('Please choose an image file.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setImageError('Please choose an image smaller than 2 MB.');
      return;
    }
    setImageError('');
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') update('image', reader.result);
    };
    reader.readAsDataURL(file);
  };
  return <div style={overlay}><div style={modal}>
    <h2 style={title}>{item ? 'Edit menu item' : 'Add a menu item'}</h2>
    <div style={grid}>
      <label>Name<input value={form.name} onChange={e => update('name', e.target.value)} /></label>
      <label>Price<input type="number" value={form.price} onChange={e => update('price', Number(e.target.value))} /></label>
      <label>Discount for everyone (%)<input type="number" min="0" max="100" value={form.discountPercent || 0} onChange={e => update('discountPercent', Math.min(100, Math.max(0, Number(e.target.value))))} /></label>
      <label>Category<select value={form.category} onChange={e => update('category', e.target.value)}><option value="signature">Signature</option><option value="cold">Cold</option><option value="classic">Classic</option><option value="special">Special</option></select></label>
      <label style={{ gridColumn: '1 / -1' }}>Upload image<input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleImageUpload} style={fileInput} />{imageError && <span style={error}>{imageError}</span>}</label>
      <label>Image path<input value={form.image} onChange={e => update('image', e.target.value)} /></label>
      <label style={{ gridColumn: '1 / -1' }}>Description<textarea value={form.description} onChange={e => update('description', e.target.value)} /></label>
      <label>Calories<input value={form.calories || ''} onChange={e => update('calories', e.target.value)} /></label>
      <label>Tags<input value={(form.tags || []).join(', ')} onChange={e => update('tags', e.target.value.split(',').map(tag => tag.trim()).filter(Boolean))} /></label>
      <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}><input type="checkbox" checked={Boolean(form.isPopular)} onChange={e => update('isPopular', e.target.checked)} /> Popular</label>
    </div>
    <div style={previewBox}>
      <span style={previewLabel}>IMAGE PREVIEW</span>
      <img src={form.image} alt="Menu item preview" style={previewImage} />
    </div>
    <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 22 }}><button onClick={onClose} style={secondary}>Cancel</button><button onClick={() => onSave(form)} disabled={!form.name.trim()} style={primary}>SAVE ITEM</button></div>
  </div></div>;
};
const overlay: React.CSSProperties = { position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(18,7,3,.7)', backdropFilter: 'blur(10px)', display: 'grid', placeItems: 'center', padding: 20 };
const modal: React.CSSProperties = { width: '100%', maxWidth: 600, background: '#FBF7F1', borderRadius: 22, padding: 28, boxShadow: '0 30px 80px rgba(0,0,0,.3)' };
const title: React.CSSProperties = { fontFamily: "'Playfair Display',serif", fontSize: 28, margin: '0 0 22px' };
const grid: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 };
const primary: React.CSSProperties = { border: 0, borderRadius: 10, padding: '11px 16px', background: '#302016', color: '#FFF9F0', fontWeight: 800, cursor: 'pointer' };
const secondary: React.CSSProperties = { border: '1px solid #CBB69E', borderRadius: 10, padding: '11px 16px', background: 'transparent', color: '#302016', fontWeight: 700, cursor: 'pointer' };
const fileInput: React.CSSProperties = { padding: '8px 10px', cursor: 'pointer' };
const error: React.CSSProperties = { display: 'block', color: '#963E2E', fontSize: 11, marginTop: 5 };
const previewBox: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 12, marginTop: 16, padding: 10, borderRadius: 12, background: '#F4EBE0', border: '1px solid #E4D7C7' };
const previewLabel: React.CSSProperties = { color: '#765A43', fontSize: 10, fontWeight: 800, letterSpacing: '.1em' };
const previewImage: React.CSSProperties = { width: 54, height: 54, objectFit: 'cover', borderRadius: 8, border: '1px solid #DCC9B2' };
