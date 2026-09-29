import React from 'react';

interface Props { activeCategory: string; onSelectCategory: (c: string) => void; }

const cats = [
  { id: 'all',       label: 'ALL ITEMS'  },
  { id: 'signature', label: 'SIGNATURES' },
  { id: 'cold',      label: 'COLD'       },
  { id: 'classic',   label: 'CLASSICS'   },
  { id: 'special',   label: 'SPECIALS'   },
];

export const CategoryFilter: React.FC<Props> = ({ activeCategory, onSelectCategory }) => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', margin: '20px 0' }}>
    {cats.map(c => {
      const active = c.id === activeCategory;
      return (
        <button key={c.id} onClick={() => onSelectCategory(c.id)} style={{
          padding: '9px 20px', borderRadius: 999, fontSize: 10,
          fontWeight: 800, letterSpacing: '0.13em', textTransform: 'uppercase',
          cursor: 'pointer', border: 'none', transition: 'all 0.25s ease',
          background: active ? '#3D2314' : 'rgba(255,255,255,0.75)',
          color: active ? '#FAF6F0' : '#3D2314',
          boxShadow: active ? '0 6px 18px rgba(18,7,3,0.22)' : '0 2px 8px rgba(18,7,3,0.08)',
          transform: active ? 'scale(1.05)' : 'scale(1)',
          backdropFilter: 'blur(8px)',
        }}>
          {c.label}
        </button>
      );
    })}
  </div>
);
