import React from 'react';
import { Coffee, Heart, Sparkles, Truck } from 'lucide-react';

const stats = [
  { icon: Coffee, value: 'FRESH', title: 'BREWED TO ORDER', desc: 'Every cup is prepared for the moment you order.' },
  { icon: Heart, value: 'MADE', title: 'WITH CARE', desc: 'Thoughtful ingredients and careful preparation.' },
  { icon: Sparkles, value: 'YOUR', title: 'DAILY RITUAL', desc: 'Smooth coffee for slow mornings and late nights.' },
  { icon: Truck, value: 'FAST', title: 'EXPRESS DELIVERY', desc: 'Delivery service available during store hours.' },
];

export const StatsBar: React.FC = () => (
  <section style={{ background: 'rgba(42,22,10,0.92)', backdropFilter: 'blur(14px)', borderTop: '1px solid rgba(196,126,56,0.20)', borderBottom: '1px solid rgba(196,126,56,0.20)', padding: '52px 24px' }}>
    <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 36 }}>
      {stats.map(({ icon: Icon, value, title, desc }, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
          <div style={{ color: '#C47E38', flexShrink: 0, marginTop: 2 }}>
            <Icon size={28} />
          </div>
          <div>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 700, color: '#FAF6F0', lineHeight: 1 }}>{value}</div>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#C47E38', marginTop: 5, marginBottom: 5 }}>{title}</div>
            <div style={{ fontSize: 12, color: 'rgba(250,246,240,0.65)', fontWeight: 400, lineHeight: 1.5 }}>{desc}</div>
          </div>
        </div>
      ))}
    </div>
  </section>
);
