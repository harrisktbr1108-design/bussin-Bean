import React, { useState, useEffect } from 'react';
import { Star, CheckCircle2, Send, ThumbsUp, Sparkles } from 'lucide-react';
import { apiRequest } from '../api';

export interface CustomerReview {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
  itemOrdered?: string;
  likes: number;
}

const INITIAL_REVIEWS: CustomerReview[] = [];

export const ReviewsSection: React.FC = () => {
  const [reviews, setReviews] = useState<CustomerReview[]>(INITIAL_REVIEWS);

  const [userName, setUserName]       = useState('');
  const [userRating, setUserRating]   = useState(5);
  const [userComment, setUserComment] = useState('');
  const [userItem, setUserItem]       = useState('LOADED OREO');
  const [customerKey, setCustomerKey] = useState('');
  const [discountConsent, setDiscountConsent] = useState(false);
  const [submitted, setSubmitted]     = useState(false);
  const [error, setError]             = useState('');

  useEffect(() => {
    apiRequest<Array<CustomerReview & { createdAt: string }>>('/reviews').then(result => setReviews(result.map(review => ({ ...review, date: new Date(review.createdAt).toLocaleDateString() })))).catch(() => setError('Reviews are temporarily unavailable.'));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !userComment.trim()) return;
    try {
      await apiRequest('/reviews', { method: 'POST', body: JSON.stringify({ name: userName.trim(), rating: userRating, comment: userComment.trim(), itemOrdered: userItem, customerKey, discountConsent }) });
      setSubmitted(true); setUserName(''); setUserComment(''); setCustomerKey(''); setDiscountConsent(false); setTimeout(() => setSubmitted(false), 4000);
    } catch (requestError) { setError(requestError instanceof Error ? requestError.message : 'Unable to submit review.'); }
  };

  const handleLike = (id: string) => {
    apiRequest(`/reviews/${id}/like`, { method: 'POST' }).then(() => setReviews(prev => prev.map(r => r.id === id ? { ...r, likes: r.likes + 1 } : r))).catch(() => undefined);
  };

  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0
    ? (reviews.reduce((a, b) => a + b.rating, 0) / totalReviews).toFixed(1)
    : '5.0';

  return (
    <section id="reviews" style={{ padding: '72px 24px', maxWidth: 1280, margin: '0 auto' }}>
      
      {/* Container */}
      <div style={{
        background: 'rgba(250,246,240,0.85)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(18,7,3,0.12)',
        borderRadius: 32,
        padding: 'clamp(24px,4vw,56px)',
        boxShadow: '0 20px 60px rgba(18,7,3,0.09)',
      }}>

        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(255,255,255,0.90)', backdropFilter: 'blur(8px)',
            border: '1px solid rgba(196,126,56,0.30)', borderRadius: 999,
            padding: '6px 18px', fontSize: 10, fontWeight: 800,
            letterSpacing: '0.14em', color: '#C47E38', textTransform: 'uppercase',
            marginBottom: 14, boxShadow: '0 4px 12px rgba(18,7,3,0.05)',
          }}>
            <Sparkles size={13} color="#C47E38" />
            CUSTOMER FEEDBACK
          </div>
          <h2 style={{
            fontFamily: "'Playfair Display',serif",
            fontSize: 'clamp(28px,4.5vw,48px)',
            fontWeight: 800, color: '#120703', margin: '0 0 12px', letterSpacing: '-0.01em'
          }}>
            Customer Ratings & Reviews
          </h2>
          <p style={{ fontSize: 14, color: '#5C3318', maxWidth: 620, margin: '0 auto', lineHeight: 1.6 }}>
            Share your experience with the Bussin Bean community.
          </p>
          <div style={{ width: 60, height: 3, background: '#C47E38', borderRadius: 999, margin: '18px auto 0' }} />
        </div>

        {/* Scoreboard & Form Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 36, marginBottom: 44 }}>
          
          {/* Rating Summary Card */}
          <div style={{
            background: 'rgba(255,255,255,0.85)',
            border: '1px solid rgba(18,7,3,0.10)',
            borderRadius: 24, padding: 28,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', textAlign: 'center',
            boxShadow: '0 8px 24px rgba(18,7,3,0.05)'
          }}>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 56, fontWeight: 900, color: '#120703', lineHeight: 1 }}>
              {avgRating}
            </div>
            <div style={{ display: 'flex', gap: 4, margin: '10px 0' }}>
              {[1, 2, 3, 4, 5].map(star => (
                <Star key={star} size={22} fill="#C47E38" color="#C47E38" />
              ))}
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#5C3318', textTransform: 'uppercase', letterSpacing: '0.10em' }}>
              Based on {totalReviews} Customer Review{totalReviews !== 1 ? 's' : ''}
            </div>
            <div style={{ fontSize: 11, color: '#7A4A2E', marginTop: 8, fontWeight: 500 }}>
              Shikarpur, Sindh Express Delivery Orders
            </div>
          </div>

          {/* Leave a Review Form */}
          <div style={{
            background: 'rgba(255,255,255,0.85)',
            border: '1px solid rgba(18,7,3,0.10)',
            borderRadius: 24, padding: 28,
            boxShadow: '0 8px 24px rgba(18,7,3,0.05)'
          }}>
            <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 700, color: '#120703', margin: '0 0 14px' }}>
              Rate Your Experience
            </h3>

            {submitted ? (
              <div style={{ background: '#E8F5E9', border: '1px solid #A5D6A7', borderRadius: 14, padding: 18, textAlign: 'center', color: '#2E7D32', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <CheckCircle2 size={18} /> Thank you! Your review was submitted for approval.
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {/* Star Selector */}
                <div>
                  <label style={{ fontSize: 11, fontWeight: 800, color: '#5C3318', letterSpacing: '0.10em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Select Rating</label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setUserRating(star)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}
                        aria-label={`${star} star rating`}
                      >
                        <Star size={24} fill={star <= userRating ? '#C47E38' : 'none'} color="#C47E38" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name */}
                <div>
                  <input
                    type="text"
                    placeholder="Your Name (e.g. Ali Raza)"
                    value={userName}
                    onChange={e => setUserName(e.target.value)}
                    required
                    style={{ width: '100%', background: '#FAF6F0', border: '1.5px solid rgba(18,7,3,0.12)', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#120703', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>

                {/* Item selection */}
                <div>
                  <select
                    value={userItem}
                    onChange={e => setUserItem(e.target.value)}
                    style={{ width: '100%', background: '#FAF6F0', border: '1.5px solid rgba(18,7,3,0.12)', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#120703', outline: 'none', boxSizing: 'border-box' }}
                  >
                    <option value="LOADED OREO">LOADED OREO</option>
                    <option value="VANILLA VELVET">VANILLA VELVET</option>
                    <option value="THE ORIGINAL BREW">THE ORIGINAL BREW</option>
                    <option value="MIDNIGHT MOCHA">MIDNIGHT MOCHA</option>
                    <option value="SPANISH SUNSET">SPANISH SUNSET</option>
                    <option value="GOLDEN CARAMEL BLISS">GOLDEN CARAMEL BLISS</option>
                    <option value="THE BUSSIN SIGNATURE">THE BUSSIN SIGNATURE</option>
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <input type="text" value={customerKey} onChange={e => setCustomerKey(e.target.value)} placeholder="Phone or email (optional for discount)" style={{ width: '100%', boxSizing: 'border-box', background: '#FAF6F0', border: '1.5px solid rgba(18,7,3,0.12)', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#120703', outline: 'none' }} />
                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 11, color: '#5C3318', lineHeight: 1.4 }}><input type="checkbox" checked={discountConsent} onChange={e => setDiscountConsent(e.target.checked)} />I allow Bussin Bean to contact this identifier with a one-time discount for submitting this review.</label>
                </div>

                {/* Comment */}
                <div>
                  <textarea
                    placeholder="Write your thoughts on the coffee, taste & express delivery speed..."
                    value={userComment}
                    onChange={e => setUserComment(e.target.value)}
                    required
                    rows={3}
                    style={{ width: '100%', background: '#FAF6F0', border: '1.5px solid rgba(18,7,3,0.12)', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#120703', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
                  />
                </div>

                {error && <p style={{ color: '#963E2E', fontSize: 11, margin: 0 }}>{error}</p>}
                <button type="submit" className="btn-dark" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer', width: '100%', padding: '12px 18px' }}>
                  SUBMIT REVIEW <Send size={14} color="#C47E38" />
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Customer Review List */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {reviews.map(rev => (
            <div key={rev.id} style={{
              background: 'rgba(255,255,255,0.90)',
              border: '1px solid rgba(18,7,3,0.10)',
              borderRadius: 18, padding: 20,
              display: 'flex', flexDirection: 'column',
              boxShadow: '0 4px 14px rgba(18,7,3,0.04)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#3D2314', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C47E38', fontWeight: 800, fontSize: 14 }}>
                    {rev.name.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: '#120703', display: 'flex', alignItems: 'center', gap: 6 }}>
                      {rev.name}
                      {rev.verified && <CheckCircle2 size={13} color="#2e7d32" />}
                    </div>
                    <div style={{ fontSize: 10, color: '#7A4A2E', fontWeight: 500 }}>{rev.date}</div>
                  </div>
                </div>

                {/* Stars */}
                <div style={{ display: 'flex', gap: 2 }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={13} fill={i < rev.rating ? '#C47E38' : 'none'} color="#C47E38" />
                  ))}
                </div>
              </div>

              {rev.itemOrdered && (
                <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.10em', color: '#5C3318', background: '#F4ECE1', padding: '3px 8px', borderRadius: 6, width: 'fit-content', marginBottom: 8, textTransform: 'uppercase' }}>
                  Ordered: {rev.itemOrdered}
                </span>
              )}

              <p style={{ fontSize: 13, color: '#2A160A', lineHeight: 1.6, margin: '0 0 14px', flex: 1, fontWeight: 500 }}>
                "{rev.comment}"
              </p>

              <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid rgba(18,7,3,0.08)', paddingTop: 10 }}>
                <button
                  onClick={() => handleLike(rev.id)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 700, color: '#5C3318' }}
                >
                  <ThumbsUp size={13} color="#C47E38" /> Helpful ({rev.likes})
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
