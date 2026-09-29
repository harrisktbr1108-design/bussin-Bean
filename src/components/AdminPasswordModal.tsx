import React, { useState } from 'react';
import { X } from 'lucide-react';
import { apiRequest, apiToken } from '../api';

interface Props { onClose: () => void; }
export const AdminPasswordModal: React.FC<Props> = ({ onClose }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [nextPassword, setNextPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const submit = async () => {
    setError(''); setMessage('');
    if (nextPassword.length < 8) return setError('New password must be at least 8 characters.');
    if (nextPassword !== confirmPassword) return setError('New passwords do not match.');
    try { await apiRequest('/auth/password', { method: 'POST', body: JSON.stringify({ currentPassword, nextPassword }) }, apiToken()); setMessage('Password changed successfully.'); setCurrentPassword(''); setNextPassword(''); setConfirmPassword(''); }
    catch (requestError) { setError(requestError instanceof Error ? requestError.message : 'Unable to change password.'); }
  };
  return <div style={overlay}><div style={modal}><button onClick={onClose} style={close}><X size={16} /></button><p style={eyebrow}>SECURITY</p><h2 style={title}>Change admin password</h2><p style={muted}>Use at least eight characters. Your password is stored securely on the server.</p><input value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} type="password" placeholder="Current password" style={input} /><input value={nextPassword} onChange={e => setNextPassword(e.target.value)} type="password" placeholder="New password" style={input} /><input value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} type="password" placeholder="Confirm new password" style={input} />{error && <p style={{ ...muted, color: '#963E2E' }}>{error}</p>}{message && <p style={{ ...muted, color: '#47704E' }}>{message}</p>}<button onClick={submit} style={primary}>SAVE NEW PASSWORD</button></div></div>;
};
const overlay: React.CSSProperties = { position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(18,7,3,.7)', backdropFilter: 'blur(10px)', display: 'grid', placeItems: 'center', padding: 20 };
const modal: React.CSSProperties = { position: 'relative', width: '100%', maxWidth: 430, background: '#FBF7F1', borderRadius: 22, padding: 28, boxShadow: '0 30px 80px rgba(0,0,0,.3)' };
const close: React.CSSProperties = { position: 'absolute', top: 16, right: 16, border: 0, borderRadius: '50%', background: '#F1E7D9', width: 32, height: 32, cursor: 'pointer' };
const eyebrow: React.CSSProperties = { color: '#B67538', fontSize: 10, fontWeight: 800, letterSpacing: '.14em', margin: 0 };
const title: React.CSSProperties = { fontFamily: "'Playfair Display',serif", fontSize: 27, margin: '8px 0' };
const muted: React.CSSProperties = { color: '#765A43', fontSize: 12, lineHeight: 1.5, margin: '5px 0 14px' };
const input: React.CSSProperties = { width: '100%', boxSizing: 'border-box', border: '1px solid #DCC9B2', borderRadius: 9, padding: '11px 12px', background: '#F4EBE0', marginBottom: 9, font: 'inherit' };
const primary: React.CSSProperties = { width: '100%', border: 0, borderRadius: 10, padding: 13, background: '#302016', color: '#FFF9F0', fontWeight: 800, cursor: 'pointer' };
