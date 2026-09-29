import React from 'react';
import { ArrowRight, Users, Coffee, Sparkles } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section id="hero" className="storefront-hero" style={{ position: 'relative', minHeight: '100vh', width: '100%', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>

      {/* Hero Background Image Layer (Uploaded Espresso Extraction shot with logo) */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <img
          src="/images/hero_bg.png"
          alt="Bussin Bean Espresso Extraction"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', filter: 'brightness(0.92) contrast(1.03)' }}
        />
      </div>

      {/* Soft vignettes for optimal contrast */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
        background: 'linear-gradient(to right, rgba(250,246,240,0.95) 0%, rgba(250,246,240,0.72) 48%, transparent 82%)',
      }} />
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 180, zIndex: 1, pointerEvents: 'none',
        background: 'linear-gradient(to top, rgba(250,246,240,0.90), transparent)',
      }} />

      {/* Content Container */}
      <div style={{
        position: 'relative', zIndex: 2,
        width: '100%', maxWidth: 1280, margin: '0 auto',
        padding: 'clamp(20px,5vw,72px)',
        paddingTop: 'clamp(110px,12vh,140px)',
        paddingBottom: 'clamp(60px,8vh,80px)',
        boxSizing: 'border-box',
      }}>

        {/* Main hero text block */}
        <div className="hero-copy" style={{ maxWidth: 580, display: 'flex', flexDirection: 'column', gap: 22 }}>

          {/* Tag badge with Caramel color styling */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(10px)',
            border: '1px solid rgba(196,126,56,0.30)', borderRadius: 999,
            padding: '8px 18px', fontSize: 11, fontWeight: 800,
            letterSpacing: '0.14em', color: '#C47E38',
            boxShadow: '0 4px 14px rgba(196,126,56,0.12)', width: 'fit-content',
          }}>
            <Sparkles size={14} color="#C47E38" />
            SIP. RELAX. REPEAT.
          </div>

          {/* Headline with Caramel color highlight */}
          <h1 style={{
            fontFamily: "'Playfair Display',serif",
            fontSize: 'clamp(42px,7.5vw,82px)',
            fontWeight: 800, lineHeight: 1.06,
            color: '#120703', margin: 0,
          }}>
            Coffee crafted for<br />
            <span style={{
              fontStyle: 'italic', fontWeight: 400, color: '#C47E38',
              textDecoration: 'underline', textDecorationStyle: 'wavy',
              textDecorationColor: 'rgba(196,126,56,0.50)', textUnderlineOffset: 6
            }}>
              real moments.
            </span>
          </h1>

          {/* Subtitle */}
          <p style={{ fontSize: 'clamp(15px,1.5vw,19px)', color: '#2A160A', fontWeight: 500, lineHeight: 1.65, margin: 0 }}>
            Smooth, refreshing, and made with 100% Arabica beans — your perfect daily escape in every sip.
          </p>

          {/* Buttons */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, paddingTop: 4 }}>
            <a href="#menu" className="btn-dark" style={{ textDecoration: 'none' }}>
              SHOP NOW <ArrowRight size={16} color="#C47E38" />
            </a>
            <a href="#menu" className="btn-outline" style={{ textDecoration: 'none' }}>
              EXPLORE OUR MENU
            </a>
          </div>

          {/* Social proof pill */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 14,
            background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(10px)',
            border: '1px solid rgba(196,126,56,0.25)', borderRadius: 18,
            padding: '12px 18px', width: 'fit-content',
            boxShadow: '0 6px 20px rgba(18,7,3,0.07)',
          }}>
            <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#3D2314', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Users size={17} color="#C47E38" />
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.10em', color: '#C47E38', textTransform: 'uppercase' }}>Made for your daily ritual</div>
              <div style={{ fontSize: 10, color: '#5C3318', fontWeight: 600, marginTop: 2 }}>
                Freshly brewed with 100% Arabica beans
              </div>
            </div>
          </div>

          {/* Bottom badge in caramel */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(255,255,255,0.90)', backdropFilter: 'blur(10px)',
            border: '1px solid rgba(196,126,56,0.30)', borderRadius: 999,
            padding: '8px 16px', fontSize: 10, fontWeight: 800,
            color: '#C47E38', letterSpacing: '0.12em', textTransform: 'uppercase',
            marginTop: 4, width: 'fit-content',
          }}>
            <Coffee size={13} color="#C47E38" />
            FRESHLY BREWED DAILY
          </div>

        </div>

      </div>
    </section>
  );
};
