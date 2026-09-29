import React, { useState } from 'react';
import { CoffeeAddOn, MenuItem } from '../data/menu';
import { Star, ShoppingCart, Sparkles, Flame, Droplets, CheckCircle2 } from 'lucide-react';

interface Props { item: MenuItem; onAddToCart: (item: MenuItem, addOns?: CoffeeAddOn[]) => void; }

const TABS = ['OVERVIEW', 'INGREDIENTS', 'TASTING NOTES'] as const;
type Tab = typeof TABS[number];

export const FeaturedProduct: React.FC<Props> = ({ item, onAddToCart }) => {
  const [tab, setTab] = useState<Tab>('OVERVIEW');
  const [selectedAddOns, setSelectedAddOns] = useState<CoffeeAddOn[]>([]);

  const toggleAddOn = (addOn: CoffeeAddOn) => {
    setSelectedAddOns(prev => prev.some(selected => selected.id === addOn.id)
      ? prev.filter(selected => selected.id !== addOn.id)
      : [...prev, addOn]);
  };

  return (
    <section id="featured" style={{ padding: '72px 24px', maxWidth: 1280, margin: '0 auto' }}>
      <div style={{
        background: 'rgba(250,246,240,0.78)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        border: '1px solid rgba(18,7,3,0.10)',
        borderRadius: 28,
        padding: 'clamp(28px,5vw,64px)',
        boxShadow: '0 20px 60px rgba(18,7,3,0.09)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))',
        gap: 56,
        alignItems: 'center',
        overflow: 'hidden',
        position: 'relative',
      }}>
        {/* Ambient glow */}
        <div style={{ position: 'absolute', top: -80, right: -80, width: 360, height: 360, background: 'radial-gradient(circle,rgba(196,126,56,0.12),transparent 70%)', pointerEvents: 'none' }} />

        {/* Cup showcase */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{
            width: 280, height: 380, borderRadius: 22,
            background: 'rgba(255,255,255,0.70)', backdropFilter: 'blur(10px)',
            border: '1px solid rgba(18,7,3,0.12)',
            boxShadow: '0 24px 60px rgba(18,7,3,0.14)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', overflow: 'hidden', padding: 14, gap: 12,
          }}>
            <div style={{ position: 'relative', flex: 1, width: '100%', borderRadius: 14, overflow: 'hidden' }}>
              <img src={item.image} alt={item.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(18,7,3,0.60),transparent 45%)', pointerEvents: 'none' }} />
              <div style={{
                position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)',
                background: 'rgba(18,7,3,0.92)', backdropFilter: 'blur(8px)',
                borderRadius: 12, padding: '10px 20px', textAlign: 'center',
                border: '1px solid rgba(255,255,255,0.12)', width: 'calc(100% - 32px)',
              }}>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 15, fontWeight: 700, letterSpacing: '0.12em', color: '#FAF6F0' }}>BUSSIN BEAN</div>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', color: '#C47E38', marginTop: 3, textTransform: 'uppercase' }}>{item.name}</div>
              </div>
            </div>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.12em', color: '#3D2314', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Sparkles size={12} color="#C47E38" /> Handcrafted Cold Foam
            </div>
          </div>
        </div>

        {/* Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Top labels */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#3D2314', color: '#FAF6F0', fontSize: 10, fontWeight: 800, letterSpacing: '0.13em', textTransform: 'uppercase', padding: '6px 14px', borderRadius: 999 }}>
              <Sparkles size={11} color="#C47E38" /> FEATURED SIGNATURE
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(255,255,255,0.80)', border: '1px solid rgba(18,7,3,0.12)', color: '#3D2314', fontSize: 10, fontWeight: 700, padding: '6px 12px', borderRadius: 999 }}>
              <Flame size={11} color="#C47E38" /> 320 kcal
            </span>
          </div>

          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(28px,4vw,48px)', fontWeight: 700, color: '#120703', margin: 0, letterSpacing: '-0.01em' }}>
            {item.name}
          </h2>

          {/* Tab Bar */}
          <div style={{ display: 'flex', gap: 6, borderBottom: '1.5px solid rgba(18,7,3,0.10)', paddingBottom: 0 }}>
            {TABS.map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                padding: '8px 14px', borderRadius: '8px 8px 0 0', fontSize: 10, fontWeight: 800,
                letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer', border: 'none',
                background: tab === t ? '#3D2314' : 'transparent',
                color: tab === t ? '#FAF6F0' : '#5C3318',
                transition: 'all 0.2s',
              }}>{t}</button>
            ))}
          </div>

          {/* Tab content */}
          <div style={{ minHeight: 100 }}>
            {tab === 'OVERVIEW' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <p style={{ fontSize: 14, fontStyle: 'italic', color: '#2A160A', fontWeight: 500, borderLeft: '3px solid #C47E38', paddingLeft: 14, margin: 0, lineHeight: 1.6 }}>
                  "{item.description}"
                </p>
                <p style={{ fontSize: 13, color: '#3D2314', lineHeight: 1.7, margin: 0 }}>
                  Crafted with cold-extracted French vanilla syrup, slow-steeped espresso, and crowned with a velvet cloud of thick whipped vanilla cold foam. Drizzled with warm Madagascar caramel.
                </p>
              </div>
            )}
            {tab === 'INGREDIENTS' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {['French Vanilla Bean Syrup','Slow-Extracted Arabica','Whipped Vanilla Foam','Madagascar Caramel'].map(ing => (
                  <div key={ing} style={{ background: 'rgba(255,255,255,0.75)', border: '1px solid rgba(18,7,3,0.10)', borderRadius: 12, padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, fontWeight: 600, color: '#2A160A' }}>
                    <Droplets size={14} color="#C47E38" />{ing}
                  </div>
                ))}
              </div>
            )}
            {tab === 'TASTING NOTES' && (
              <div style={{ background: 'rgba(255,255,255,0.75)', border: '1px solid rgba(18,7,3,0.10)', borderRadius: 14, padding: 18, display: 'flex', flexDirection: 'column', gap: 10, fontSize: 12, color: '#2A160A', lineHeight: 1.6 }}>
                <p style={{ margin: 0 }}><strong>Aroma:</strong> Rich vanilla pod with roasted cocoa undertones.</p>
                <p style={{ margin: 0 }}><strong>Body:</strong> Creamy, velvety mouthfeel with a cold foam crown.</p>
                <p style={{ margin: 0 }}><strong>Finish:</strong> Smooth caramel sweetness with a clean espresso end.</p>
              </div>
            )}
          </div>

          {/* Highlights */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {['Madagascar Vanilla Pods','Whipped Cream Crown','Golden Caramel Drizzle','Slow-Extracted Espresso'].map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 500, color: '#2A160A' }}>
                <CheckCircle2 size={15} color="#3D2314" />{f}
              </div>
            ))}
          </div>

          {/* Stars */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="#C47E38" color="#C47E38" />)}
            <span style={{ fontSize: 11, color: '#4A2710', fontWeight: 600, marginLeft: 8, fontFamily: 'monospace' }}>(4.9 / 5 from 1,200+ reviews)</span>
          </div>

          {(item.addOns ?? []).length > 0 && (
            <div style={{ background: 'rgba(255,255,255,0.75)', border: '1px solid rgba(18,7,3,0.10)', borderRadius: 16, padding: 14 }}>
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.14em', color: '#5C3318', textTransform: 'uppercase', marginBottom: 10 }}>Extra add-ons</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 8 }}>
                {item.addOns?.map(addOn => {
                  const checked = selectedAddOns.some(selected => selected.id === addOn.id);
                  return (
                    <label key={addOn.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, background: checked ? '#E7D7C4' : '#FAF6F0', borderRadius: 10, padding: '8px 10px', border: '1px solid rgba(18,7,3,0.08)', cursor: 'pointer' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <input type="checkbox" checked={checked} onChange={() => toggleAddOn(addOn)} style={{ accentColor: '#3D2314' }} />
                        <span style={{ fontSize: 10, fontWeight: 700, color: '#120703' }}>{addOn.name}</span>
                      </div>
                      <span style={{ fontSize: 10, color: '#5C3318', fontWeight: 700 }}>Rs. {addOn.price}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* Price & CTA */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 28, paddingTop: 16, borderTop: '1px solid rgba(18,7,3,0.10)' }}>
            <div>
              <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.14em', color: '#5C3318', textTransform: 'uppercase', marginBottom: 4 }}>SPECIAL PRICE</div>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 34, fontWeight: 700, color: '#120703' }}>{item.discountPercent ? <><span style={{ fontSize: 15, color: '#8D7967', textDecoration: 'line-through', marginRight: 8 }}>Rs. {item.price}</span>Rs. {Math.round(item.price * (1 - item.discountPercent / 100))}</> : <>Rs. {item.price}</>}</div>
            </div>
            <button onClick={() => onAddToCart(item, selectedAddOns)} className="btn-dark" style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }} disabled={item.isInStock === false}>
              <ShoppingCart size={16} color="#C47E38" /> ORDER {item.name}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
