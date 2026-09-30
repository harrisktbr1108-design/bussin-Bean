import React from 'react';
import { ArrowRight, Coffee } from 'lucide-react';

export const About: React.FC = () => (
  <section id="about" style={{ padding: '72px 24px', maxWidth: 1280, margin: '0 auto' }}>
    <div style={{
      background: 'rgba(250,246,240,0.74)',
      backdropFilter: 'blur(14px)',
      WebkitBackdropFilter: 'blur(14px)',
      border: '1px solid rgba(18,7,3,0.09)',
      borderRadius: 28,
      padding: 'clamp(28px,5vw,64px)',
      boxShadow: '0 16px 48px rgba(18,7,3,0.07)',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))',
      gap: 48,
      alignItems: 'center',
    }}>

      {/* Left – Photo */}
      <div style={{ position: 'relative', borderRadius: 20, overflow: 'hidden', boxShadow: '0 20px 50px rgba(18,7,3,0.15)' }}>
        <img
          src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=900"
          alt="Coffee Extraction"
          style={{ width: '100%', height: 420, objectFit: 'cover', display: 'block' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(18,7,3,0.65), transparent 50%)', pointerEvents: 'none' }} />
        <div style={{
          position: 'absolute', bottom: 20, left: 20,
          background: 'rgba(18,7,3,0.90)', backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 14, padding: '12px 20px',
        }}>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 14, fontWeight: 700, letterSpacing: '0.12em', color: '#FAF6F0' }}>BUSSIN BEAN</div>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.16em', color: '#C47E38', marginTop: 3, textTransform: 'uppercase' }}>EST. 2026 · CRAFT ROASTERY</div>
        </div>
      </div>

      {/* Right – Text */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 22, position: 'relative' }}>
        <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.16em', color: '#5C3318', textTransform: 'uppercase' }}>OUR STORY</span>

        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(26px,4vw,46px)', fontWeight: 700, color: '#120703', margin: 0, lineHeight: 1.15 }}>
          More Than Coffee, <br />
          It's Our <span style={{ fontStyle: 'italic', fontWeight: 400, color: '#C47E38' }}>Passion.</span>
        </h2>

        <p style={{ fontSize: 14, color: '#2A160A', lineHeight: 1.75, margin: 0, fontWeight: 400 }}>
          At Bussin Bean in Shikarpur, Sindh, we believe great coffee brings people together. From sourcing 100% specialty Arabica beans to small-batch roasts, every step is crafted with care, quality, and an unyielding love for the perfect brew.
        </p>

        <a href="#menu" className="btn-dark" style={{ textDecoration: 'none', width: 'fit-content' }}>
          LEARN MORE ABOUT US <ArrowRight size={16} color="#C47E38" />
        </a>

        {/* Circular stamp */}
        <div style={{
          position: 'absolute', right: 0, bottom: 0,
          width: 100, height: 100, borderRadius: '50%',
          border: '1.5px dashed rgba(61,35,20,0.30)',
          background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(8px)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4,
        }}>
          <span style={{ fontSize: 8, fontWeight: 800, letterSpacing: '0.14em', color: '#3D2314', textTransform: 'uppercase' }}>GOOD COFFEE</span>
          <Coffee size={18} color="#3D2314" />
          <span style={{ fontSize: 8, fontWeight: 800, letterSpacing: '0.14em', color: '#3D2314', textTransform: 'uppercase' }}>GOOD DAY</span>
        </div>
      </div>

    </div>
  </section>
);
