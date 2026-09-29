import React from 'react';
import { MapPin, Clock, Phone, Sparkles, Instagram, MessageCircle } from 'lucide-react';

export const CTA: React.FC = () => (
  <section id="contact" style={{ padding: '72px 24px', maxWidth: 1280, margin: '0 auto' }}>
    <div style={{
      background: 'rgba(250,246,240,0.82)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      border: '1px solid rgba(18,7,3,0.12)',
      borderRadius: 32,
      padding: 'clamp(28px,5vw,60px)',
      textAlign: 'center',
      boxShadow: '0 16px 48px rgba(18,7,3,0.08)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Ambient glow */}
      <div style={{ position: 'absolute', top: -80, left: '50%', transform: 'translateX(-50%)', width: 400, height: 400, background: 'radial-gradient(circle,rgba(196,126,56,0.12),transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 780, margin: '0 auto', position: 'relative' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#3D2314', color: '#FAF6F0', fontSize: 10, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', padding: '6px 18px', borderRadius: 999, marginBottom: 20 }}>
          <Sparkles size={12} color="#C47E38" /> SHIKARPUR EXPRESS DELIVERY
        </div>

        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(28px,4.5vw,48px)', fontWeight: 800, color: '#120703', margin: '0 0 14px' }}>
          Ready for your Bussin experience?
        </h2>

        <p style={{ fontSize: 15, color: '#2A160A', fontWeight: 500, lineHeight: 1.7, margin: '0 0 36px' }}>
          Place an instant express delivery order straight to your doorstep anywhere in Shikarpur.
        </p>

        {/* Info grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 16, marginBottom: 36, textAlign: 'left' }}>
          
          <div style={{ background: 'rgba(255,255,255,0.85)', border: '1px solid rgba(18,7,3,0.10)', borderRadius: 18, padding: '18px 20px', display: 'flex', alignItems: 'flex-start', gap: 14 }}>
            <MapPin size={20} color="#C47E38" style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.14em', color: '#120703', textTransform: 'uppercase', marginBottom: 4 }}>LOCATION</div>
              <div style={{ fontSize: 13, color: '#3D2314', fontWeight: 600 }}>Shikarpur, Sindh, Pakistan</div>
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.85)', border: '1px solid rgba(18,7,3,0.10)', borderRadius: 18, padding: '18px 20px', display: 'flex', alignItems: 'flex-start', gap: 14 }}>
            <Clock size={20} color="#C47E38" style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.14em', color: '#120703', textTransform: 'uppercase', marginBottom: 4 }}>DELIVERY HOURS</div>
              <div style={{ fontSize: 13, color: '#3D2314', fontWeight: 600 }}>11:00 A.M. – 1:00 A.M. (Daily)</div>
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.85)', border: '1px solid rgba(18,7,3,0.10)', borderRadius: 18, padding: '18px 20px', display: 'flex', alignItems: 'flex-start', gap: 14 }}>
            <Phone size={20} color="#C47E38" style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.14em', color: '#120703', textTransform: 'uppercase', marginBottom: 4 }}>PHONE & WHATSAPP</div>
              <a href="tel:+923353491964" style={{ fontSize: 13, color: '#C47E38', fontWeight: 800, textDecoration: 'none' }}>
                +92 335 3491964
              </a>
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.85)', border: '1px solid rgba(18,7,3,0.10)', borderRadius: 18, padding: '18px 20px', display: 'flex', alignItems: 'flex-start', gap: 14 }}>
            <Instagram size={20} color="#C47E38" style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.14em', color: '#120703', textTransform: 'uppercase', marginBottom: 4 }}>INSTAGRAM</div>
              <a href="https://www.instagram.com/_bussin_bean_" target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: '#C47E38', fontWeight: 800, textDecoration: 'none' }}>
                @_bussin_bean_
              </a>
            </div>
          </div>

        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 14, flexWrap: 'wrap' }}>
          <a href="https://wa.me/923353491964" target="_blank" rel="noopener noreferrer" className="btn-dark" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <MessageCircle size={16} color="#C47E38" /> ORDER VIA WHATSAPP (+92 335 3491964)
          </a>
          <a href="https://www.instagram.com/_bussin_bean_" target="_blank" rel="noopener noreferrer" className="btn-outline" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <Instagram size={16} color="#C47E38" /> FOLLOW @_bussin_bean_
          </a>
        </div>

      </div>
    </div>
  </section>
);
