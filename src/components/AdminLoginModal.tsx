import React, { useState } from 'react';
import { LockKeyhole, X } from 'lucide-react';
import { apiRequest } from '../api';

interface Props { onClose: () => void; onSuccess: () => void; }

export const AdminLoginModal: React.FC<Props> = ({ onClose, onSuccess }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const submit = async () => {
    setBusy(true);
    try {
      const result = await apiRequest<{ token: string }>('/auth/login', { method: 'POST', body: JSON.stringify({ password: pin }) });
      sessionStorage.setItem('bussin-admin-token', result.token);
      onSuccess();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to sign in.');
    } finally { setBusy(false); }
  };
  return (
    <div style={overlay}>
      <div style={modal}>
        <button onClick={onClose} style={close}><X size={16} /></button>
        <div style={icon}><LockKeyhole size={22} color="#D8A15D" /></div>
        <p style={eyebrow}>STAFF ACCESS</p>
        <h2 style={title}>Welcome back.</h2>
        <p style={muted}>Enter your admin password to manage the store.</p>
        <input autoFocus value={pin} onChange={e => { setPin(e.target.value); setError(''); }} onKeyDown={e => e.key === 'Enter' && submit()} type="password" autoComplete="current-password" placeholder="Password" style={input} />
        {error && <p style={{ ...muted, color: '#A33A2B', marginTop: 8 }}>{error}</p>}
        <button onClick={submit} disabled={busy} style={primary}>{busy ? 'SIGNING IN...' : 'SIGN IN TO ADMIN PANEL'}</button>
        <p style={{ ...muted, fontSize: 11, marginTop: 16 }}>Use your staff password to continue.</p>
      </div>
    </div>
  );
};

const overlay: React.CSSProperties = { position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(18,7,3,.7)', backdropFilter: 'blur(12px)', display: 'grid', placeItems: 'center', padding: 20 };
const modal: React.CSSProperties = { position: 'relative', width: '100%', maxWidth: 390, background: '#FBF7F1', borderRadius: 24, padding: 36, textAlign: 'center', boxShadow: '0 30px 80px rgba(0,0,0,.3)' };
const close: React.CSSProperties = { position: 'absolute', top: 16, right: 16, border: 0, background: '#F1E7D9', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer' };
const icon: React.CSSProperties = { width: 50, height: 50, borderRadius: 16, background: '#302016', display: 'grid', placeItems: 'center', margin: '0 auto 18px' };
const eyebrow: React.CSSProperties = { color: '#A96D32', fontSize: 10, fontWeight: 800, letterSpacing: '.16em', margin: 0 };
const title: React.CSSProperties = { fontFamily: "'Playfair Display',serif", fontSize: 32, margin: '8px 0' };
const muted: React.CSSProperties = { color: '#765A43', fontSize: 13, lineHeight: 1.6, margin: 0 };
const input: React.CSSProperties = { width: '100%', margin: '24px 0 12px', border: '1px solid #DCC9B2', borderRadius: 12, padding: '14px', textAlign: 'center', fontSize: 24, letterSpacing: '.35em', outline: 'none', background: '#F4EBE0' };
const primary: React.CSSProperties = { width: '100%', border: 0, borderRadius: 12, padding: 14, background: '#302016', color: '#FFF9F0', fontWeight: 800, letterSpacing: '.08em', cursor: 'pointer' };
