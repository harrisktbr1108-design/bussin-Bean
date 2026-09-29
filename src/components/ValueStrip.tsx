import React from 'react';
import { Truck, ShieldCheck, Headphones, RefreshCw } from 'lucide-react';

const values = [
  { icon: Truck,       title: 'FAST DELIVERY',   desc: 'Freshly delivered to your doorstep.'     },
  { icon: ShieldCheck, title: 'SECURE PAYMENT',  desc: '100% safe & encrypted checkout.'          },
  { icon: Headphones,  title: '24/7 SUPPORT',    desc: "We're here anytime you need us."          },
  { icon: RefreshCw,   title: 'EASY RETURNS',    desc: "Not satisfied? We've got you covered."    },
];

export const ValueStrip: React.FC = () => (
  <section style={{
    borderTop: '1px solid rgba(18,7,3,0.10)',
    background: 'rgba(250,246,240,0.75)',
    backdropFilter: 'blur(12px)',
    padding: '32px 24px',
  }}>
    <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 24 }}>
      {values.map(({ icon: Icon, title, desc }, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
            background: 'rgba(255,255,255,0.85)', border: '1px solid rgba(18,7,3,0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(18,7,3,0.06)',
          }}>
            <Icon size={18} color="#3D2314" />
          </div>
          <div>
            <h5 style={{ margin: 0, fontSize: 10, fontWeight: 800, letterSpacing: '0.14em', color: '#120703', textTransform: 'uppercase', marginBottom: 3 }}>{title}</h5>
            <p style={{ margin: 0, fontSize: 11, color: '#4A2710', fontWeight: 400 }}>{desc}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
);
