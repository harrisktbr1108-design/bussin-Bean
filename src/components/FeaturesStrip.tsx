import React from 'react';
import { Compass, Flame, Snowflake, Heart } from 'lucide-react';

const features = [
  { icon: Compass,  title: 'PREMIUM BEANS',     desc: "Sourced from the world's finest coffee regions." },
  { icon: Flame,    title: 'RICH & SMOOTH',      desc: 'Expertly roasted for bold, balanced flavor.'       },
  { icon: Snowflake,title: 'REFRESHINGLY COLD',  desc: 'Perfectly brewed for a smooth, refreshing taste.' },
  { icon: Heart,    title: 'MADE WITH CARE',     desc: 'Crafted with passion, served with love.'           },
];

export const FeaturesStrip: React.FC = () => (
  <section style={{
    borderTop: '1px solid rgba(18,7,3,0.10)',
    borderBottom: '1px solid rgba(18,7,3,0.10)',
    background: 'rgba(250,246,240,0.80)',
    backdropFilter: 'blur(12px)',
    padding: '36px 24px',
  }}>
    <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 32 }}>
      {features.map(({ icon: Icon, title, desc }, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
          <div style={{
            width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
            background: 'rgba(255,255,255,0.80)', border: '1px solid rgba(18,7,3,0.14)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(18,7,3,0.07)',
          }}>
            <Icon size={20} color="#3D2314" />
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: 10, fontWeight: 800, letterSpacing: '0.14em', color: '#120703', textTransform: 'uppercase', marginBottom: 4 }}>{title}</h4>
            <p style={{ margin: 0, fontSize: 12, color: '#4A2710', lineHeight: 1.55, fontWeight: 400 }}>{desc}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
);
