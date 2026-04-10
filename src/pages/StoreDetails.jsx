import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

/* ────────────────── Rate & Review Modal ────────────────── */
const RateReviewModal = ({ currentRating, currentReview, onSubmit, onCancel }) => {
  const [hoveredStar, setHoveredStar] = useState(0);
  const [selectedRating, setSelectedRating] = useState(currentRating || 0);
  const [review, setReview] = useState(currentReview || '');

  const starStyle = (index) => {
    const active = hoveredStar >= index || (!hoveredStar && selectedRating >= index);
    return {
      fontSize: '2.5rem',
      cursor: 'pointer',
      color: active ? '#2dd4bf' : '#cbd5e1',
      transition: 'color 0.15s ease, transform 0.15s ease',
      transform: active ? 'scale(1.15)' : 'scale(1)',
      userSelect: 'none',
    };
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.45)',
        backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        animation: 'fadeIn 0.25s ease',
      }}
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#fff',
          borderRadius: '20px',
          padding: '2.5rem 2rem 2rem',
          width: '100%',
          maxWidth: '420px',
          boxShadow: '0 25px 60px rgba(0,0,0,0.18)',
          animation: 'slideUp 0.3s ease',
        }}
      >
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem', color: '#1e293b' }}>
          Rate and review
        </h2>

        <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.6rem', fontWeight: 500 }}>
          Rating ({selectedRating}/5)
        </p>
        <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '1.5rem' }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              style={starStyle(star)}
              onMouseEnter={() => setHoveredStar(star)}
              onMouseLeave={() => setHoveredStar(0)}
              onClick={() => setSelectedRating(star)}
            >
              ★
            </span>
          ))}
        </div>

        <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.6rem', fontWeight: 500 }}>
          Review
        </p>
        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Share your experience with this store..."
          style={{
            width: '100%',
            minHeight: '130px',
            padding: '1rem',
            borderRadius: '14px',
            border: '2px solid #e2e8f0',
            outline: 'none',
            fontSize: '0.95rem',
            fontFamily: 'Inter, sans-serif',
            resize: 'vertical',
            transition: 'border-color 0.2s ease',
            boxSizing: 'border-box',
          }}
          onFocus={(e) => (e.target.style.borderColor = '#a78bfa')}
          onBlur={(e) => (e.target.style.borderColor = '#e2e8f0')}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem' }}>
          <button
            onClick={onCancel}
            style={{
              padding: '0.65rem 1.8rem',
              borderRadius: '10px',
              border: '1px solid #e2e8f0',
              background: 'transparent',
              color: '#64748b',
              fontWeight: 600,
              fontSize: '0.95rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseOver={(e) => { e.currentTarget.style.background = '#f1f5f9'; }}
            onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; }}
          >
            Cancel
          </button>
          <button
            onClick={() => onSubmit(selectedRating, review)}
            disabled={selectedRating === 0}
            style={{
              padding: '0.65rem 2rem',
              borderRadius: '10px',
              border: 'none',
              background: selectedRating === 0 ? '#cbd5e1' : 'linear-gradient(135deg, #7c3aed, #6366f1)',
              color: '#fff',
              fontWeight: 600,
              fontSize: '0.95rem',
              cursor: selectedRating === 0 ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: selectedRating === 0 ? 'none' : '0 4px 14px rgba(99,102,241,0.4)',
            }}
            onMouseOver={(e) => {
              if (selectedRating !== 0) e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

/* ────────────────── Reviews Panel Modal ────────────────── */
const ReviewsPanel = ({ reviews, averageRating, totalRatings, onClose }) => {
  const renderStars = (rating) =>
    [1, 2, 3, 4, 5].map((i) => (
      <span key={i} style={{ color: i <= rating ? '#f59e0b' : '#e2e8f0', fontSize: '0.95rem' }}>★</span>
    ));

  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 30) return `${days}d ago`;
    return new Date(dateStr).toLocaleDateString();
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.45)',
        backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        animation: 'fadeIn 0.25s ease',
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#fff',
          borderRadius: '20px',
          width: '100%',
          maxWidth: '520px',
          maxHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 60px rgba(0,0,0,0.18)',
          animation: 'slideUp 0.3s ease',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '1.75rem 2rem 1.25rem',
          borderBottom: '1px solid #f1f5f9',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>
                Ratings & Reviews
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '0.6rem' }}>
                <span style={{ fontSize: '2rem', fontWeight: 800, color: '#1e293b' }}>
                  {averageRating.toFixed(1)}
                </span>
                <div>
                  <div style={{ display: 'flex', gap: '0.1rem' }}>
                    {renderStars(Math.round(averageRating))}
                  </div>
                  <p style={{ color: '#94a3b8', fontSize: '0.8rem', margin: '0.15rem 0 0' }}>
                    {totalRatings} {totalRatings === 1 ? 'review' : 'reviews'}
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                background: '#f1f5f9', border: 'none', width: '36px', height: '36px',
                borderRadius: '50%', fontSize: '1.1rem', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#64748b', transition: 'all 0.2s',
              }}
              onMouseOver={(e) => { e.currentTarget.style.background = '#e2e8f0'; }}
              onMouseOut={(e) => { e.currentTarget.style.background = '#f1f5f9'; }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Reviews List */}
        <div style={{
          overflowY: 'auto',
          padding: '0.5rem 2rem 1.5rem',
          flex: 1,
        }}>
          {reviews.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <p style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📝</p>
              <p style={{ color: '#94a3b8', fontWeight: 500 }}>No reviews yet</p>
              <p style={{ color: '#cbd5e1', fontSize: '0.85rem' }}>Be the first to share your experience!</p>
            </div>
          ) : (
            reviews.map((rev) => (
              <div
                key={rev.id}
                style={{
                  padding: '1.25rem 0',
                  borderBottom: '1px solid #f8fafc',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <div style={{
                      width: '36px', height: '36px', borderRadius: '50%',
                      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#fff', fontWeight: 700, fontSize: '0.85rem',
                      flexShrink: 0,
                    }}>
                      {rev.userName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: '0.95rem', color: '#1e293b', margin: 0 }}>
                        {rev.userName}
                      </p>
                      <p style={{ color: '#94a3b8', fontSize: '0.75rem', margin: '0.1rem 0 0' }}>
                        {timeAgo(rev.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.1rem' }}>
                    {renderStars(rev.value)}
                  </div>
                </div>
                {rev.review && (
                  <p style={{
                    color: '#475569',
                    fontSize: '0.9rem',
                    lineHeight: '1.6',
                    margin: '0.6rem 0 0 0',
                    paddingLeft: '3.1rem',
                  }}>
                    {rev.review}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

/* ────────────────── Store Details Page ────────────────── */
const StoreDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [store, setStore] = useState(null);
  const [showRateModal, setShowRateModal] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetchStore();
  }, [id]);

  const fetchStore = async () => {
    try {
      const res = await api.get(`/stores/${id}`);
      if (res.data.success) setStore(res.data.data);
    } catch (e) {
      console.error(e);
      navigate('/stores');
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await api.get(`/ratings/store/${id}`);
      if (res.data.success) setReviews(res.data.data);
    } catch (e) {
      console.error(e);
    }
  };

  const openReviews = async () => {
    await fetchReviews();
    setShowReviews(true);
  };

  const handleRateSubmit = async (value, review) => {
    if (value < 1 || value > 5) return alert('Rating must be 1-5');
    try {
      if (store.userRatingId) {
        await api.put(`/ratings/${store.userRatingId}`, { value, review });
      } else {
        await api.post('/ratings', { storeId: store.id, value, review });
      }
      setShowRateModal(false);
      fetchStore();
    } catch (e) {
      if (e.response?.data?.errors) {
        alert(e.response.data.errors[0].msg);
      } else {
        alert(e.response?.data?.message || 'Error updating rating');
      }
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) {
        stars.push(<span key={i} style={{ color: '#f59e0b', fontSize: '1.15rem' }}>★</span>);
      } else if (i - rating < 1 && i - rating > 0) {
        stars.push(<span key={i} style={{ color: '#f59e0b', fontSize: '1.15rem', opacity: 0.5 }}>★</span>);
      } else {
        stars.push(<span key={i} style={{ color: '#cbd5e1', fontSize: '1.15rem' }}>☆</span>);
      }
    }
    return stars;
  };

  if (!store) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '70vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px', height: '48px', border: '4px solid #e2e8f0',
            borderTopColor: '#6366f1', borderRadius: '50%',
            animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem',
          }} />
          <p style={{ color: '#94a3b8', fontWeight: 500 }}>Loading store details...</p>
        </div>
        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  const bgImage = store.imageUrl || 'https://via.placeholder.com/1200x800';

  return (
    <>
      {/* ── Full-page blurred background ── */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: -1,
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'blur(28px) brightness(0.45) saturate(1.3)',
        transform: 'scale(1.15)', /* prevent blur edge artifacts */
      }} />

      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        style={{
          background: 'none', border: 'none', color: 'rgba(255,255,255,0.85)',
          fontWeight: 600, cursor: 'pointer', fontSize: '1rem', padding: 0,
          marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem',
          textShadow: '0 1px 4px rgba(0,0,0,0.3)',
        }}
      >
        ← Back
      </button>

      {/* Main layout — left image + right liquid glass card */}
      <div style={{
        display: 'flex',
        gap: '0',
        borderRadius: '24px',
        overflow: 'hidden',
        position: 'relative',
        minHeight: '480px',
      }}>
        {/* ── Liquid Glass Morph Layer (SVG distortion) ── */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0,
          backdropFilter: 'blur(2px)',
          WebkitBackdropFilter: 'blur(2px)',
          filter: 'url(#liquid-glass)',
          borderRadius: 'inherit',
        }} />
        {/* Corner shadow */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1,
          boxShadow: '0 4px 4px rgba(0,0,0,0.15), 0 0 12px rgba(0,0,0,0.08)',
          borderRadius: 'inherit',
        }} />
        {/* Inner border glow */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 2,
          boxShadow: 'inset 2px 2px 2px 0 rgba(255,255,255,0.2), inset -2px -2px 2px 0 rgba(255,255,255,0.2)',
          borderRadius: 'inherit',
        }} />

        {/* ───── Left: Store Image ───── */}
        <div style={{
          flex: '1 1 50%',
          padding: '1.5rem',
          display: 'flex',
          alignItems: 'stretch',
          position: 'relative', zIndex: 3,
        }}>
          <div style={{
            width: '100%',
            borderRadius: '20px',
            overflow: 'hidden',
            position: 'relative',
            boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
          }}>
            <img
              src={bgImage}
              alt={store.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
            {/* Store name overlay on image */}
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
              padding: '2rem 1.5rem 1.2rem',
            }}>
              <h1 style={{ color: '#fff', fontSize: '2rem', margin: 0, textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>
                {store.name}
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.95rem', margin: '0.3rem 0 0' }}>
                📍 {store.address}
              </p>
            </div>
          </div>
        </div>

        {/* ───── Right: Liquid Glass Info Card ───── */}
        <div style={{
          flex: '1 1 50%',
          padding: '1.5rem 1.5rem 1.5rem 0',
          display: 'flex',
          alignItems: 'stretch',
          position: 'relative', zIndex: 3,
        }}>
          <div style={{
            width: '100%',
            borderRadius: '20px',
            /* Liquid glass effect */
            background: 'rgba(255, 255, 255, 0.12)',
            backdropFilter: 'blur(24px) saturate(1.6)',
            WebkitBackdropFilter: 'blur(24px) saturate(1.6)',
            border: '1px solid rgba(255, 255, 255, 0.22)',
            boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.2), inset 0 -1px 0 rgba(0,0,0,0.05), 0 8px 32px rgba(0,0,0,0.12)',
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}>

            {/* Description section */}
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', marginBottom: '0.75rem', textShadow: '0 1px 3px rgba(0,0,0,0.15)' }}>
                Description
              </h3>
              <p style={{
                color: 'rgba(255, 255, 255, 0.8)',
                lineHeight: '1.7',
                fontSize: '0.95rem',
              }}>
                {store.description || 'No description available for this store yet. Check back later for more details about what this store has to offer.'}
              </p>
            </div>

            {/* Bottom section: Questions + Rating, then Buttons */}
            <div>
              {/* Questions & Rating row */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.25rem',
                paddingTop: '1rem',
                borderTop: '1px solid rgba(255,255,255,0.12)',
              }}>
                <div>
                  <p style={{ color: 'rgba(255,255,255,0.9)', fontWeight: 600, fontSize: '0.9rem', margin: 0 }}>
                    Have Some Questions?
                  </p>
                  <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.8rem', margin: '0.15rem 0 0' }}>
                    Reach out to us anytime
                  </p>
                </div>
                {/* Clickable rating badge — opens reviews panel */}
                <div
                  onClick={openReviews}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: 'rgba(255,255,255,0.12)',
                    backdropFilter: 'blur(10px)',
                    padding: '0.45rem 0.85rem',
                    borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.2)',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.22)';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.12)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  title="Click to view all reviews"
                >
                  <div style={{ display: 'flex', gap: '0.1rem' }}>
                    {renderStars(store.averageRating)}
                  </div>
                  <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', fontWeight: 500 }}>
                    ({store.totalRatings ?? 0})
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  style={{
                    flex: 1,
                    padding: '0.85rem 1.5rem',
                    borderRadius: '14px',
                    border: '1.5px solid rgba(255,255,255,0.35)',
                    background: 'rgba(255,255,255,0.08)',
                    backdropFilter: 'blur(8px)',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '1rem',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    letterSpacing: '0.3px',
                    textShadow: '0 1px 2px rgba(0,0,0,0.1)',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.22)';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  Book Now
                </button>
                <button
                  onClick={() => setShowRateModal(true)}
                  style={{
                    flex: 1,
                    padding: '0.85rem 1.5rem',
                    borderRadius: '14px',
                    border: '1.5px solid rgba(255,255,255,0.35)',
                    background: 'rgba(255,255,255,0.08)',
                    backdropFilter: 'blur(8px)',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '1rem',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    letterSpacing: '0.3px',
                    textShadow: '0 1px 2px rgba(0,0,0,0.1)',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.22)';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  Rate Us
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rate & Review Modal */}
      {showRateModal && (
        <RateReviewModal
          currentRating={store.myRating}
          currentReview={store.myReview}
          onSubmit={handleRateSubmit}
          onCancel={() => setShowRateModal(false)}
        />
      )}

      {/* Reviews Panel Modal */}
      {showReviews && (
        <ReviewsPanel
          reviews={reviews}
          averageRating={store.averageRating}
          totalRatings={store.totalRatings ?? 0}
          onClose={() => setShowReviews(false)}
        />
      )}

      {/* Keyframe animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; } to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
};

export default StoreDetails;
