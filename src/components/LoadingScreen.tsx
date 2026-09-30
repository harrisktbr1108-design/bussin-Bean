import React from 'react';
interface Props { progress: number; isReady: boolean; }

export const LoadingScreen: React.FC<Props> = ({ progress, isReady }) => {
  const pct = Math.min(100, Math.round(progress * 100));

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 999,
      background: 'rgba(250,246,240,0.97)',
      backdropFilter: 'blur(20px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20,
      transition: 'opacity 0.7s ease, pointer-events 0s',
      opacity: isReady ? 0 : 1,
      pointerEvents: isReady ? 'none' : 'auto',
    }}>
      <div style={{
        background: '#FAF6F0', borderRadius: 28, padding: '48px 40px',
        maxWidth: 400, width: '100%', textAlign: 'center',
        border: '1px solid rgba(18,7,3,0.10)',
        boxShadow: '0 24px 60px rgba(18,7,3,0.10)',
      }}>
        {/* Icon */}
        <div style={{
          width: 84, height: 84,
          margin: '0 auto 24px',
        }}>
          <img src="/images/bussin-bean%20logo.jpeg" alt="Bussin Bean logo" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%', clipPath: 'circle(50%)' }} />
        </div>

        {/* Brand */}
        <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 30, fontWeight: 700, letterSpacing: '0.14em', color: '#120703', margin: '0 0 8px' }}>
          BUSSIN BEAN
        </h1>
        <p style={{ fontSize: 13, color: '#5C3318', fontWeight: 500, marginBottom: 32 }}>
          {isReady ? 'Your coffee is ready!' : 'Preparing your coffee...'}
        </p>

        {/* Progress bar */}
        <div style={{ background: '#EBE0CF', borderRadius: 999, height: 10, overflow: 'hidden', marginBottom: 10 }}>
          <div style={{
            height: '100%', borderRadius: 999,
            background: 'linear-gradient(90deg,#C47E38,#A8632A)',
            width: `${Math.max(6, pct)}%`,
            transition: 'width 0.3s ease',
          }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, fontWeight: 700, color: '#5C3318', letterSpacing: '0.12em', marginBottom: 24 }}>
          <span>FRAME CACHE</span><span>{pct}%</span>
        </div>

        {isReady
          ? <p style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.14em', color: '#3D2314', textTransform: 'uppercase' }}>Scroll to brew ↓</p>
          : <p style={{ fontSize: 11, color: '#7A4A2E', fontWeight: 500 }}>Loading 300 sequential animation frames…</p>
        }
      </div>
    </div>
  );
};
