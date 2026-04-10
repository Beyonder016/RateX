import React, { useEffect, useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const LoadingCard = () => (
  <div style={{
    borderRadius: '20px',
    overflow: 'hidden',
    background: '#fff',
    border: '1px solid #f1f5f9',
    boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
  }}>
    <div style={{ padding: '0.6rem 0.6rem 0' }}>
      <div style={{
        width: '100%',
        height: '200px',
        borderRadius: '14px',
        background: 'linear-gradient(90deg, #f8fafc 25%, #eef2f7 37%, #f8fafc 63%)',
        backgroundSize: '400% 100%',
        animation: 'shimmer 1.4s ease infinite',
      }} />
    </div>
    <div style={{ padding: '0.9rem 1.15rem 1.15rem' }}>
      <div style={{
        width: '58%',
        height: '18px',
        borderRadius: '999px',
        background: '#e2e8f0',
        marginBottom: '0.9rem',
      }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{
          width: '42%',
          height: '14px',
          borderRadius: '999px',
          background: '#e2e8f0',
        }} />
        <div style={{
          width: '54px',
          height: '26px',
          borderRadius: '8px',
          background: '#fef3c7',
        }} />
      </div>
    </div>
  </div>
);

const NormalDashboard = () => {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  async function fetchStores() {
    setLoading(true);

    try {
      const res = await api.get(`/stores?search=${encodeURIComponent(search)}&sortBy=name&order=asc&limit=50&includeTotal=false`);
      if (res.data.success) {
        setStores(res.data.data.stores);
      }
    } catch (err) {
      console.error('Failed to fetch stores:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchStores();
  }, [search]);

  const toggleWishlist = async (e, storeId) => {
    e.stopPropagation();
    try {
      await api.post('/wishlists/toggle', { storeId });
      fetchStores();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      {/* Full-page pearl gradient background */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: -1,
        background: 'linear-gradient(160deg, #FFF7E6 0%, #FFE8CC 25%, #FFF1DB 50%, #FFF7E6 75%, #FFECD2 100%)',
      }} />

      <div style={{ fontFamily: 'Inter, sans-serif' }}>
        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: '2rem',
        }}>
          <div>
            <h1 style={{
              color: '#102E4A', fontSize: '2rem', fontWeight: 800,
              margin: '0 0 0.3rem', letterSpacing: '-0.5px',
            }}>Explore Stores</h1>
            <p style={{ color: '#7a6e5d', fontSize: '0.85rem', margin: 0 }}>
              Discover and rate your favorite places
            </p>
            {loading && stores.length > 0 && (
              <p style={{ color: '#94a3b8', fontSize: '0.75rem', margin: '0.35rem 0 0' }}>
                Refreshing stores...
              </p>
            )}
          </div>
          <div style={{ position: 'relative' }}>
            <input
              placeholder="Search stores..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                padding: '0.65rem 1rem 0.65rem 2.5rem',
                borderRadius: '14px',
                border: '1.5px solid rgba(16,46,74,0.15)',
                background: 'rgba(255,255,255,0.6)',
                backdropFilter: 'blur(8px)',
                fontSize: '0.9rem',
                outline: 'none',
                width: '280px',
                fontFamily: 'Inter, sans-serif',
                color: '#102E4A',
                transition: 'border-color 0.2s, box-shadow 0.2s',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#102E4A';
                e.target.style.boxShadow = '0 0 0 3px rgba(16,46,74,0.08)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(16,46,74,0.15)';
                e.target.style.boxShadow = 'none';
              }}
            />
            <span style={{
              position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)',
              fontSize: '1rem', color: '#7a6e5d', pointerEvents: 'none',
            }}>🔍</span>
          </div>
        </div>

        {/* Store Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '1.25rem',
        }}>
          {loading && stores.length === 0 && Array.from({ length: 6 }).map((_, index) => (
            <LoadingCard key={index} />
          ))}

          {stores.map(store => (
            <div
              key={store.id}
              onClick={() => navigate(`/stores/${store.id}`)}
              style={{
                borderRadius: '20px',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                background: '#fff',
                border: '1px solid #f1f5f9',
                boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.12)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)';
              }}
            >
              {/* Store Image with padding and rounded corners */}
              <div style={{ padding: '0.6rem 0.6rem 0' }}>
                <div style={{
                  width: '100%', height: '200px', overflow: 'hidden',
                  borderRadius: '14px',
                }}>
                  <img
                    src={store.imageUrl || 'https://via.placeholder.com/400x200'}
                    alt={store.name}
                    style={{
                      width: '100%', height: '100%', objectFit: 'cover',
                      display: 'block',
                      borderRadius: '14px',
                      transition: 'transform 0.35s ease',
                    }}
                    onMouseOver={(e) => { e.target.style.transform = 'scale(1.05)'; }}
                    onMouseOut={(e) => { e.target.style.transform = 'scale(1)'; }}
                  />
                </div>
              </div>

              {/* Card Content */}
              <div style={{ padding: '0.9rem 1.15rem 1.15rem' }}>
                {/* Name + Wishlist */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <h3 style={{
                    margin: 0, color: '#1e293b', fontSize: '1.15rem', fontWeight: 700,
                    letterSpacing: '-0.3px',
                  }}>{store.name}</h3>
                  <button
                    onClick={(e) => toggleWishlist(e, store.id)}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: store.isWishlisted ? '#ef4444' : '#d1d5db',
                      fontSize: '1.4rem', padding: 0, lineHeight: 1,
                      transition: 'transform 0.15s, color 0.2s',
                      filter: store.isWishlisted ? 'drop-shadow(0 0 4px rgba(239,68,68,0.4))' : 'none',
                    }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.15)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    {store.isWishlisted ? '♥' : '♡'}
                  </button>
                </div>

                {/* Address + Rating */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#94a3b8' }}>
                    <span style={{ fontSize: '0.85rem' }}>📍</span>
                    <span style={{ fontSize: '0.85rem' }}>{store.address.split(',')[0]}</span>
                  </div>

                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '0.3rem',
                    background: '#fef3c7',
                    padding: '0.2rem 0.55rem',
                    borderRadius: '8px',
                  }}>
                    <span style={{ color: '#f59e0b', fontSize: '0.9rem' }}>★</span>
                    <span style={{ color: '#92400e', fontSize: '0.82rem', fontWeight: 700 }}>
                      {store.averageRating.toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {stores.length === 0 && !loading && (
          <div style={{ textAlign: 'center', marginTop: '5rem' }}>
            <p style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🔍</p>
            <h2 style={{ color: '#102E4A', fontWeight: 700 }}>No stores found</h2>
            <p style={{ color: '#7a6e5d' }}>Try adjusting your search terms</p>
          </div>
        )}

        <style>{`
          @keyframes shimmer {
            0% { background-position: 100% 0; }
            100% { background-position: -100% 0; }
          }
        `}</style>
      </div>
    </>
  );
};

export default NormalDashboard;
