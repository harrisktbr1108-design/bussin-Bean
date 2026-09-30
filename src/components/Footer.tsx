import React from 'react';
import { Instagram, Phone, MapPin, Clock } from 'lucide-react';

export const Footer: React.FC = () => (
  <footer style={{ background: 'rgba(18,7,3,0.95)', backdropFilter: 'blur(14px)', borderTop: '1px solid rgba(196,126,56,0.25)', padding: '60px 24px 32px' }}>
    <div style={{ maxWidth: 1280, margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(180px, 1fr))', gap: 40, paddingBottom: 40, borderBottom: '1px solid rgba(250,246,240,0.10)' }}>

        {/* Brand Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img src="/images/bussin-bean%20logo.jpeg" alt="Bussin Bean logo" style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: '50%', clipPath: 'circle(50%)', flexShrink: 0 }} />
            <div>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 800, letterSpacing: '0.12em', color: '#C47E38' }}>BUSSIN BEAN</div>
              <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.18em', color: 'rgba(250,246,240,0.60)', marginTop: 2, textTransform: 'uppercase' }}>CRAFT COFFEE ROASTERS</div>
            </div>
          </div>
          <p style={{ fontSize: 12, color: 'rgba(250,246,240,0.65)', lineHeight: 1.65, margin: 0, maxWidth: 280 }}>
            Craft coffee engineered for perfection in Shikarpur. 100% Arabica brews delivered fresh to your doorstep from 11:00 AM to 1:00 AM daily.
          </p>
          <div style={{ display: 'flex', gap: 12 }}>
            <a
              href="https://www.instagram.com/_bussin_bean_"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(196,126,56,0.30)', display: 'flex', alignItems: 'center',
                justifyContent: 'center', color: '#C47E38', textDecoration: 'none', transition: 'all 0.2s ease'
              }}
              aria-label="Instagram @_bussin_bean_"
            >
              <Instagram size={18} />
            </a>
            <a
              href="tel:+923353491964"
              style={{
                width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(196,126,56,0.30)', display: 'flex', alignItems: 'center',
                justifyContent: 'center', color: '#C47E38', textDecoration: 'none', transition: 'all 0.2s ease'
              }}
              aria-label="Call +92 335 3491964"
            >
              <Phone size={18} />
            </a>
          </div>
        </div>

        {/* Quick Links Column */}
        <div>
          <h4 style={{ fontFamily: "'Playfair Display',serif", fontSize: 13, fontWeight: 800, letterSpacing: '0.12em', color: '#C47E38', textTransform: 'uppercase', marginBottom: 18, marginTop: 0 }}>NAVIGATION</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '10px 16px', alignItems: 'start' }}>
            {[
              ['#hero','Home Experience'],
              ['#menu','Bussin Menu'],
              ['#menu','Vanilla Velvet'],
              ['#blog','Coffee Journal'],
              ['#reviews','Customer Reviews'],
              ['#contact','Express Delivery']
            ].map(([href, label]) => (
              <a key={label} href={href} style={{ fontSize: 12, color: 'rgba(250,246,240,0.70)', textDecoration: 'none', fontWeight: 500, transition: 'color 0.2s', lineHeight: 1.4 }}
                onMouseEnter={e => (e.currentTarget.style.color = '#C47E38')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(250,246,240,0.70)')}>
                {label}
              </a>
            ))}
          </div>
        </div>

        {/* Contact Info Column */}
        <div>
          <h4 style={{ fontFamily: "'Playfair Display',serif", fontSize: 13, fontWeight: 800, letterSpacing: '0.12em', color: '#C47E38', textTransform: 'uppercase', marginBottom: 18, marginTop: 0 }}>SHIKARPUR HUB</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 12, color: 'rgba(250,246,240,0.70)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <MapPin size={15} color="#C47E38" /> Shikarpur, Sindh, Pakistan
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Clock size={15} color="#C47E38" /> 11:00 A.M. – 1:00 A.M. (Daily)
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Phone size={15} color="#C47E38" />
              <a href="tel:+923353491964" style={{ color: '#FAF6F0', textDecoration: 'none', fontWeight: 700 }}>+92 335 3491964</a>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Instagram size={15} color="#C47E38" />
              <a href="https://www.instagram.com/_bussin_bean_" target="_blank" rel="noopener noreferrer" style={{ color: '#C47E38', textDecoration: 'none', fontWeight: 700 }}>@_bussin_bean_</a>
            </div>
          </div>
        </div>

      </div>

      <div style={{ paddingTop: 24, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <p style={{ margin: 0, fontSize: 11, color: 'rgba(250,246,240,0.40)' }}>© {new Date().getFullYear()} BUSSIN BEAN COFFEE CO. Shikarpur, Sindh. All rights reserved.</p>
        <div style={{ display: 'flex', gap: 20 }}>
          {['Privacy Policy','Terms of Service','Nutritional Info'].map(l => (
            <a key={l} href="#" style={{ fontSize: 11, color: 'rgba(250,246,240,0.40)', textDecoration: 'none' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#C47E38')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(250,246,240,0.40)')}>
              {l}
            </a>
          ))}
        </div>
      </div>
    </div>
  </footer>
);
