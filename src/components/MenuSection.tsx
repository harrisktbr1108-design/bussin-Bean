import React, { useState } from 'react';
import { CoffeeAddOn, MenuItem } from '../data/menu';
import { MenuCard } from './MenuCard';
import { CategoryFilter } from './CategoryFilter';
import { Coffee, Heart, Sparkles } from 'lucide-react';

interface Props { items: MenuItem[]; onAddToCart: (item: MenuItem, addOns?: CoffeeAddOn[]) => void; }

export const MenuSection: React.FC<Props> = ({ items: menuItems, onAddToCart }) => {
  const [cat, setCat] = useState('all');
  const items = cat === 'all' ? menuItems : menuItems.filter(m => m.category === cat);

  return (
    <section id="menu" style={{ padding: '72px 24px', maxWidth: 1320, margin: '0 auto' }}>

      {/* Frosted Container */}
      <div style={{
        background: 'rgba(250,246,240,0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(18,7,3,0.12)',
        borderRadius: 32,
        padding: 'clamp(24px,4vw,56px)',
        boxShadow: '0 20px 60px rgba(18,7,3,0.09)',
        position: 'relative',
        overflow: 'hidden',
      }}>

        {/* Menu Header (Matching Uploaded Menu Card) */}
        <div style={{ textAlign: 'center', marginBottom: 28, position: 'relative' }}>
          
          {/* Brand Tagline Top Pill */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(255,255,255,0.90)', backdropFilter: 'blur(8px)',
            border: '1px solid rgba(196,126,56,0.30)', borderRadius: 999,
            padding: '7px 18px', fontSize: 11, fontWeight: 800,
            letterSpacing: '0.14em', color: '#120703', textTransform: 'uppercase',
            marginBottom: 16, boxShadow: '0 4px 14px rgba(18,7,3,0.06)',
          }}>
            <Sparkles size={13} color="#C47E38" />
            THE BUSSIN BEAN
          </div>

          {/* Main Title */}
          <h2 style={{
            fontFamily: "'Playfair Display',serif",
            fontSize: 'clamp(32px,5.5vw,60px)',
            fontWeight: 900, color: '#120703',
            margin: '0 0 8px', letterSpacing: '0.06em', textTransform: 'uppercase',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, flexWrap: 'wrap'
          }}>
            MENU <Heart size={28} color="#C47E38" fill="#C47E38" style={{ transform: 'translateY(-2px)' }} />
          </h2>

          {/* Handcrafted Slogan */}
          <p style={{
            fontFamily: "'Playfair Display',serif",
            fontSize: 'clamp(16px,2vw,22px)',
            color: '#5C3318', fontStyle: 'italic', fontWeight: 500, margin: '0 0 16px'
          }}>
            Your favorite coffee, made your way.
          </p>

          {/* Slogan Pill Badges */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
            <span style={{
              fontSize: 11, fontWeight: 700, color: '#3D2314', letterSpacing: '0.08em',
              background: 'rgba(255,255,255,0.70)', padding: '5px 14px', borderRadius: 999,
              border: '1px solid rgba(18,7,3,0.10)'
            }}>
              Good Coffee, Good Mood ♡
            </span>
            <span style={{
              fontSize: 11, fontWeight: 700, color: '#3D2314', letterSpacing: '0.08em',
              background: 'rgba(255,255,255,0.70)', padding: '5px 14px', borderRadius: 999,
              border: '1px solid rgba(18,7,3,0.10)'
            }}>
              More than just coffee ♡
            </span>
          </div>

          <div style={{ width: 80, height: 3, background: 'linear-gradient(90deg, transparent, #C47E38, transparent)', borderRadius: 999, margin: '20px auto 0' }} />
        </div>

        {/* Filter */}
        <CategoryFilter activeCategory={cat} onSelectCategory={setCat} />

        {/* Grid of Menu Cards with Branded Cups */}
        <div className="menu-card-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 28,
          marginTop: 32
        }}>
          {items.map(item => (
            <MenuCard key={item.id} item={item} onAddToCart={onAddToCart} />
          ))}
        </div>

        {/* Footer Note */}
        <div style={{
          textAlign: 'center', marginTop: 44, paddingTop: 20,
          borderTop: '1px solid rgba(18,7,3,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
        }}>
          <Coffee size={16} color="#C47E38" />
          <span style={{ fontSize: 12, fontWeight: 700, color: '#5C3318', letterSpacing: '0.08em' }}>
            ALL DRINKS SERVED FRESH IN OUR SIGNATURE BUSSIN BEAN BRANDED CUPS
          </span>
        </div>

      </div>
    </section>
  );
};
