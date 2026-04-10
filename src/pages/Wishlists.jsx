import React, { useEffect, useState } from 'react';
import api from '../api';
import { NeoCard, NeoInput } from '../components/NeoUI';
import { useNavigate } from 'react-router-dom';

const Wishlists = () => {
  const [stores, setStores] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchWishlists();
  }, []);

  const fetchWishlists = async () => {
    const res = await api.get('/wishlists');
    if (res.data.success) {
      setStores(res.data.data.stores);
    }
  };

  const toggleWishlist = async (e, storeId) => {
    e.stopPropagation();
    try {
      await api.post('/wishlists/toggle', { storeId });
      fetchWishlists();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1 style={{ color: 'var(--text-color)', marginBottom: '2rem' }}>Your Wishlists</h1>

      <div className="grid-3">
        {stores.map(store => (
          <NeoCard key={store.id} onClick={() => navigate(`/stores/${store.id}`)} style={{ padding: '1.25rem', borderRadius: '24px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.06)' }}>
            <div style={{ width: '100%', height: '220px', marginBottom: '1rem' }}>
              <img 
                src={store.imageUrl || 'https://via.placeholder.com/400x200'} 
                alt={store.name} 
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '16px' }}
              />
            </div>
            
            <div>
              <div className="flex-between" style={{ alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <h3 style={{ margin: 0, color: '#111827', fontSize: '1.2rem', fontWeight: '500' }}>{store.name}</h3>
                <button 
                  onClick={(e) => toggleWishlist(e, store.id)}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: '#ef4444', fontSize: '1.5rem',
                    padding: 0, lineHeight: 1, transition: 'transform 0.1s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  ♥
                </button>
              </div>
              
              <div className="flex-between" style={{ alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#6b7280' }}>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '16px', height: '16px' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  <span style={{ fontSize: '0.9rem' }}>{store.address.split(',')[0]}</span>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <span style={{ color: '#fbbf24', fontSize: '1.1rem' }}>★</span>
                  <span style={{ color: '#6b7280', fontSize: '0.9rem', fontWeight: '500' }}>{store.averageRating.toFixed(1)} <span style={{ opacity: 0.7 }}>(Reviews)</span></span>
                </div>
              </div>
            </div>
          </NeoCard>
        ))}
      </div>
      {stores.length === 0 && <h2 style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '4rem' }}>Your wishlist is empty.</h2>}
    </div>
  );
};

export default Wishlists;
