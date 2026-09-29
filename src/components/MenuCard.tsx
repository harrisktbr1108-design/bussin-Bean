import React, { useMemo, useState } from 'react';
import { CoffeeAddOn, MenuItem } from '../data/menu';
import { ShoppingBag, Check, Flame, Plus } from 'lucide-react';

interface Props { item: MenuItem; onAddToCart: (item: MenuItem, addOns?: CoffeeAddOn[]) => void; }

export const MenuCard: React.FC<Props> = ({ item, onAddToCart }) => {
  const [added, setAdded] = useState(false);
  const [showAddOnList, setShowAddOnList] = useState(false);
  const [selectedAddOns, setSelectedAddOns] = useState<CoffeeAddOn[]>([]);
  const outOfStock = item.isInStock === false;

  const availableAddOns = useMemo(() => item.addOns ?? [], [item.addOns]);

  const toggleAddOn = (addOn: CoffeeAddOn) => {
    setSelectedAddOns(prev => prev.some(selected => selected.id === addOn.id)
      ? prev.filter(selected => selected.id !== addOn.id)
      : [...prev, addOn]);
  };

  const handleAdd = () => {
    if (outOfStock) return;
    if (availableAddOns.length > 0) {
      setSelectedAddOns([]);
      setShowAddOnList(true);
      return;
    }
    onAddToCart(item, []);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  const confirmAdd = () => {
    onAddToCart(item, selectedAddOns);
    setSelectedAddOns([]);
    setShowAddOnList(false);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div
      className="glass-card storefront-menu-card"
      style={{
        borderRadius: 24, padding: 18, display: 'flex', flexDirection: 'column',
        overflow: 'hidden', cursor: 'default',
        border: '1px solid rgba(18,7,3,0.12)',
        boxShadow: '0 8px 24px rgba(18,7,3,0.06)',
        position: 'relative',
      }}
    >
      <div style={{ position: 'relative', width: '100%', height: 250, borderRadius: 18, overflow: 'hidden', marginBottom: 16, background: '#EBE0CF', flexShrink: 0 }}>
        <img src={item.image} alt={item.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease' }}
          loading="lazy"
          onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.06)')}
          onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
        />

        <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 6, flexWrap: 'wrap', zIndex: 2 }}>
          {item.isPopular && (
            <span style={{ background: 'rgba(18,7,3,0.85)', backdropFilter: 'blur(8px)', color: '#FAF6F0', fontSize: 9, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '5px 11px', borderRadius: 999, display: 'flex', alignItems: 'center', gap: 4, border: '1px solid rgba(196,126,56,0.30)' }}>
              <Flame size={11} color="#C47E38" /> POPULAR
            </span>
          )}
        </div>

        {item.calories && (
          <span style={{ position: 'absolute', bottom: 12, right: 12, background: 'rgba(250,246,240,0.92)', backdropFilter: 'blur(8px)', fontSize: 10, fontWeight: 700, color: '#3D2314', padding: '4px 9px', borderRadius: 8, fontFamily: 'monospace' }}>
            {item.calories}
          </span>
        )}
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', textAlign: 'center', alignItems: 'center' }}>
        <h3 style={{
          fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 800,
          color: '#120703', margin: '0 0 6px', letterSpacing: '0.04em', lineHeight: 1.15
        }}>
          {item.name}
        </h3>

        <p style={{
          fontSize: 13, color: '#4A2710', lineHeight: 1.5, margin: '0 0 14px',
          fontWeight: 500, flex: 1, padding: '0 4px'
        }}>
          {item.description}
        </p>

        <div style={{
          background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(10px)',
          border: '1px solid rgba(18,7,3,0.12)', borderRadius: 999,
          padding: '6px 20px', fontSize: 16, fontWeight: 800, color: '#120703',
          fontFamily: "'Playfair Display',serif", marginBottom: 14,
          boxShadow: '0 4px 12px rgba(18,7,3,0.05)',
        }}>
          {item.discountPercent ? <><span style={{ fontSize: 11, color: '#8D7967', textDecoration: 'line-through', marginRight: 6 }}>{item.currency} {item.price}</span>{item.currency} {Math.round(item.price * (1 - item.discountPercent / 100))}</> : <>{item.currency} {item.price}</>}
        </div>

        <button
          className="order-button"
          onClick={handleAdd}
          style={{
            width: '100%', minHeight: 42, padding: '12px 18px', borderRadius: 999, border: 'none', cursor: 'pointer',
            background: outOfStock ? '#9A8978' : added ? '#2e7d32' : 'linear-gradient(135deg, #120703, #2A160A)',
            color: '#FAF6F0', fontSize: 11, fontWeight: 800, letterSpacing: '0.10em',
            textTransform: 'uppercase', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            transition: 'all 0.3s ease',
            boxShadow: '0 6px 18px rgba(18,7,3,0.22)',
            transform: added ? 'scale(0.98)' : 'scale(1)',
            whiteSpace: 'nowrap',
          }}
          aria-label={`Order ${item.name}`}
          disabled={outOfStock}
        >
          {outOfStock ? <>OUT OF STOCK</> : added ? (
            <>
              <Check size={16} color="#FAF6F0" /> ADDED TO CART
            </>
          ) : (
            <>
              <ShoppingBag size={15} color="#C47E38" /> ORDER NOW
            </>
          )}
        </button>

        {showAddOnList && (
          <div className="addon-panel" style={{ marginTop: 14, width: '100%', background: '#F4ECE1', border: '1px solid rgba(18,7,3,0.12)', borderRadius: 18, padding: 12, textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.12em', color: '#5C3318', textTransform: 'uppercase' }}>Extra add-ons</div>
              <button onClick={() => setShowAddOnList(false)} style={{ border: 'none', background: 'transparent', color: '#3D2314', fontWeight: 700, cursor: 'pointer', fontSize: 12 }}>Close</button>
            </div>

            <div style={{ display: 'grid', gap: 8 }}>
              {availableAddOns.map(addOn => {
                const checked = selectedAddOns.some(selected => selected.id === addOn.id);
                return (
                  <label key={addOn.id} className="addon-item" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', background: checked ? '#E7D7C4' : '#FAF6F0', borderRadius: 12, border: '1px solid rgba(18,7,3,0.08)', cursor: 'pointer', gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <input type="checkbox" checked={checked} onChange={() => toggleAddOn(addOn)} style={{ accentColor: '#3D2314' }} />
                      <span style={{ fontSize: 11, color: '#120703', fontWeight: 700 }}>{addOn.name}</span>
                    </div>
                    <span style={{ fontSize: 11, color: '#5C3318', fontWeight: 700 }}>Rs. {addOn.price}</span>
                  </label>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, gap: 8 }}>
              <div style={{ fontSize: 11, color: '#5C3318', fontWeight: 700 }}>
                {selectedAddOns.length ? `${selectedAddOns.length} item${selectedAddOns.length > 1 ? 's' : ''} selected` : 'No extras selected'}
              </div>
              <button onClick={confirmAdd} style={{ border: 'none', borderRadius: 999, background: 'linear-gradient(135deg, #120703, #2A160A)', color: '#FAF6F0', padding: '9px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                <Plus size={14} color="#C47E38" /> ADD TO CART
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
