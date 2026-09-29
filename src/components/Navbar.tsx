import React, { useState, useEffect } from 'react';
import { Home, Coffee, Heart, Mail, Search, User, ShoppingBag, X } from 'lucide-react';
import { MenuItem } from '../data/menu';

interface NavbarProps { items: MenuItem[]; cartCount: number; onOpenCart: () => void; onOpenAdmin: () => void; }

export const Navbar: React.FC<NavbarProps> = ({ items, cartCount, onOpenCart, onOpenAdmin }) => {
  const [scrolled, setScrolled]       = useState(false);
  const [searchOpen, setSearchOpen]   = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const links = [
    { label: 'HOME',       href: '#hero',     icon: Home },
    { label: 'SHOP',       href: '#menu',     icon: ShoppingBag },
    { label: 'OUR STORY',  href: '#about',    icon: Heart },
    { label: 'MENU',       href: '#menu',     icon: Coffee },
    { label: 'CONTACT',    href: '#contact',  icon: Mail },
  ];

  return (
    <>
      <header
        className="storefront-header"
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 40,
          transition: 'all 0.4s ease',
          background: 'transparent',
          backdropFilter: 'none',
          WebkitBackdropFilter: 'none',
          ...(scrolled ? {
            borderBottom: '1px solid rgba(18,7,3,0.08)',
            boxShadow: '0 2px 24px rgba(18,7,3,0.04)',
            padding: '10px 0',
          } : { padding: '16px 0' }),
        }}
      >
        <div className="storefront-nav-inner" style={{ position: 'relative', width: '100%', maxWidth: 1500, margin: '0 auto', padding: '0 24px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

          {/* Logo */}
          <a href="#hero" className="storefront-brand" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', justifySelf: 'start' }}>
            <img src="/images/bussin-bean%20logo.jfif" alt="Bussin Bean logo" style={{ width: 68, height: 68, objectFit: 'cover', borderRadius: '50%', clipPath: 'circle(50%)', flexShrink: 0 }} />
            <div className="storefront-brand-copy">
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 21, fontWeight: 800, letterSpacing: '0.12em', color: '#C47E38', lineHeight: 1 }}>BUSSIN BEAN</div>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.18em', color: '#5C3318', textTransform: 'uppercase', marginTop: 3 }}>CRAFT COFFEE ROASTERS</div>
            </div>
          </a>

        </div>

      </header>

      <aside className="storefront-quick-actions" aria-label="Quick actions" style={{ position: 'fixed', right: 18, top: '50%', transform: 'translateY(-50%)', zIndex: 42, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <button onClick={() => setSearchOpen(true)} style={{ ...iconBtnStyle, background: 'rgba(255,255,255,0.9)' }} aria-label="Search">
          <Search size={18} />
        </button>
        <button onClick={onOpenCart} style={{ ...iconBtnStyle, background: '#3D2314', borderColor: '#3D2314', color: '#FAF6F0', position: 'relative' }} aria-label="Bag">
          <ShoppingBag size={18} color="#C47E38" />
          {cartCount > 0 && (
            <span style={{ position: 'absolute', top: -4, right: -4, background: '#C47E38', color: '#120703', borderRadius: '50%', width: 18, height: 18, fontSize: 10, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {cartCount}
            </span>
          )}
        </button>
        <button onClick={onOpenAdmin} style={{ ...iconBtnStyle, background: 'rgba(255,255,255,0.9)' }} aria-label="Open admin portal" title="Admin portal">
          <User size={18} />
        </button>
      </aside>

      <nav className="mobile-bottom-nav" aria-label="Store sections">
        {links.filter(link => link.label !== 'SHOP').map(({ label, href, icon: Icon }) => (
          <a key={label} href={href} className="mobile-nav-item">
            <Icon size={17} />
            <span>{label}</span>
          </a>
        ))}
        <button onClick={onOpenCart} className="mobile-nav-item" aria-label="Open shopping bag">
          <ShoppingBag size={17} />
          <span>BAG{cartCount > 0 ? ` · ${cartCount}` : ''}</span>
        </button>
        <button onClick={onOpenAdmin} className="mobile-nav-item" aria-label="Open staff admin panel">
          <User size={17} />
          <span>STAFF</span>
        </button>
      </nav>

      {/* Search modal */}
      {searchOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(18,7,3,0.55)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 100, padding: '100px 16px 0' }}>
          <div style={{ background: '#FAF6F0', borderRadius: 20, maxWidth: 520, width: '100%', padding: 28, border: '1px solid rgba(18,7,3,0.10)', boxShadow: '0 24px 60px rgba(18,7,3,0.20)', position: 'relative' }}>
            <button onClick={() => { setSearchOpen(false); setSearchQuery(''); }} aria-label="Close search" style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(18,7,3,0.07)', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <X size={16} />
            </button>
            <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 700, marginBottom: 16, color: '#120703' }}>Search Coffee Menu</p>
            <input type="search" placeholder="e.g. Vanilla Velvet, Oreo, Caramel..." autoFocus value={searchQuery} onChange={event => setSearchQuery(event.target.value)}
              style={{ width: '100%', background: '#F4ECE1', border: '1.5px solid rgba(18,7,3,0.15)', borderRadius: 12, padding: '12px 16px', fontSize: 14, color: '#120703', outline: 'none', boxSizing: 'border-box' }} />
            {searchQuery.trim() ? (
              <div style={{ display: 'grid', gap: 8, marginTop: 16 }}>
                {items.filter(item => `${item.name} ${item.description} ${item.category}`.toLowerCase().includes(searchQuery.trim().toLowerCase())).map(item => (
                  <button key={item.id} onClick={() => { setSearchOpen(false); setSearchQuery(''); document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' }); }} style={{ display: 'flex', alignItems: 'center', gap: 10, textAlign: 'left', border: '1px solid rgba(18,7,3,0.10)', borderRadius: 10, padding: 9, background: '#F4ECE1', cursor: 'pointer' }}>
                    <img src={item.image} alt="" style={{ width: 38, height: 38, borderRadius: 8, objectFit: 'cover' }} />
                    <span><strong style={{ display: 'block', fontSize: 12, color: '#120703' }}>{item.name}</strong><small style={{ color: '#5C3318' }}>{item.currency} {item.price}</small></span>
                  </button>
                ))}
                {!items.some(item => `${item.name} ${item.description} ${item.category}`.toLowerCase().includes(searchQuery.trim().toLowerCase())) && <p style={{ margin: 0, fontSize: 12, color: '#5C3318' }}>No menu items match that search.</p>}
              </div>
            ) : <p style={{ marginTop: 12, fontSize: 11, color: '#5C3318', fontWeight: 600 }}>Popular: Loaded Oreo · Spanish Sunset · Vanilla Velvet</p>}
          </div>
        </div>
      )}
    </>
  );
};

const iconBtnStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.82)',
  border: '1px solid rgba(18,7,3,0.12)',
  borderRadius: '50%',
  width: 42,
  height: 42,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  color: '#120703',
  boxShadow: '0 2px 10px rgba(18,7,3,0.08)',
  transition: 'all 0.2s ease',
};
