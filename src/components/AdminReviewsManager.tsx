import React, { useEffect, useState } from 'react';
import { Eye, EyeOff, Star } from 'lucide-react';
import { apiRequest, apiToken } from '../api';

interface Review { id: string; name: string; text: string; rating: number; visible: boolean; }
interface ApiReview { id: number; name: string; comment: string; rating: number; approved: number; }

export const AdminReviewsManager: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [error, setError] = useState('');
  useEffect(() => { apiRequest<ApiReview[]>('/admin/reviews', {}, apiToken()).then(result => setReviews(result.map(review => ({ id: String(review.id), name: review.name, text: review.comment, rating: review.rating, visible: Boolean(review.approved) })))).catch(requestError => setError(requestError instanceof Error ? requestError.message : 'Unable to load reviews.')); }, []);
  const toggle = async (review: Review) => { try { await apiRequest(`/admin/reviews/${review.id}`, { method: 'PATCH', body: JSON.stringify({ approved: !review.visible }) }, apiToken()); setReviews(prev => prev.map(item => item.id === review.id ? { ...item, visible: !item.visible } : item)); } catch (requestError) { setError(requestError instanceof Error ? requestError.message : 'Unable to update review.'); } };
  return <div><p style={eyebrow}>CUSTOMER VOICE</p><h2 style={heading}>Reviews moderation</h2>{error && <p style={{ ...empty, color: '#963E2E' }}>{error}</p>}<div style={list}>{reviews.length === 0 ? <p style={empty}>No reviews have been submitted yet.</p> : reviews.map(review => <div key={review.id} style={row}><div style={{ flex: 1 }}><strong style={{ fontSize: 13 }}>{review.name}</strong><div style={{ display: 'flex', gap: 2, margin: '6px 0' }}>{Array.from({ length: review.rating }, (_, index) => <Star key={index} size={12} fill="#B67538" color="#B67538" />)}</div><p style={text}>{review.text}</p></div><button onClick={() => toggle(review)} style={{ ...action, color: review.visible ? '#963E2E' : '#47704E' }}>{review.visible ? <><EyeOff size={14} /> HIDE</> : <><Eye size={14} /> APPROVE</>}</button></div>)}</div></div>;
};
const eyebrow: React.CSSProperties = { color: '#B67538', fontSize: 10, fontWeight: 800, letterSpacing: '.14em', margin: 0 };
const heading: React.CSSProperties = { fontFamily: "'Playfair Display',serif", fontSize: 28, margin: '7px 0 18px' };
const list: React.CSSProperties = { background: '#FFF9F2', border: '1px solid #E4D7C7', borderRadius: 16, overflow: 'hidden' };
const row: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 18, padding: 18, borderBottom: '1px solid #EEE3D7' };
const text: React.CSSProperties = { color: '#765A43', fontSize: 12, lineHeight: 1.5, margin: 0 };
const action: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 5, border: 0, background: '#F1E4D4', borderRadius: 8, padding: '9px 10px', fontSize: 10, fontWeight: 800, cursor: 'pointer' };
const empty: React.CSSProperties = { color: '#765A43', fontSize: 13, padding: 24, margin: 0 };
