import React, { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';

/* ═══ Stat Card ═══ */
const StatCard = ({ label, value, sub, bg, accent }) => (
  <div style={{
    flex: 1, minWidth: '180px',
    background: bg, borderRadius: '18px',
    padding: '1.25rem 1.5rem',
    display: 'flex', flexDirection: 'column', gap: '0.6rem',
  }}>
    <span style={{
      fontSize: '0.72rem', fontWeight: 600, color: accent,
      background: `${accent}18`, padding: '0.2rem 0.65rem', borderRadius: '8px',
      alignSelf: 'flex-start',
    }}>● {label}</span>
    <p style={{ fontSize: '2rem', fontWeight: 800, color: '#1e293b', margin: 0, letterSpacing: '-1px' }}>{value}</p>
    <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>{sub}</p>
  </div>
);

const OwnerDashboard = () => {
  const { user } = useAuth();
  const [store, setStore] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [sortBy, setSortBy] = useState('createdAt');
  const [order, setOrder] = useState('desc');
  const [error, setError] = useState('');

  useEffect(() => { fetchStore(); }, []);
  useEffect(() => { if (store) fetchRatings(); }, [sortBy, order, store]);

  const fetchStore = async () => {
    try {
      const res = await api.get('/stores/owner');
      if (res.data.success) setStore(res.data.data);
      else setError('Could not load store data.');
    } catch (err) {
      setError(err.response?.data?.message || 'Store not found for this owner.');
    }
  };

  const fetchRatings = async () => {
    try {
      const res = await api.get(`/stores/owner/ratings?sortBy=${sortBy}&order=${order}&limit=500`);
      if (res.data.success) setRatings(res.data.data.ratings);
    } catch (err) {
      console.error('Failed to fetch ratings:', err);
    }
  };

  const handleSort = (key) => {
    if (sortBy === key) setOrder(order === 'asc' ? 'desc' : 'asc');
    else { setSortBy(key); setOrder('asc'); }
  };

  const sideItems = [
    { icon: '📊', label: 'Dashboard', active: true },
    { icon: '🏪', label: 'My Store' },
    { icon: '⭐', label: 'Ratings' },
    { icon: '📈', label: 'Analytics' },
    { icon: '⚙️', label: 'Settings' },
  ];

  const thStyle = {
    padding: '0.7rem 1rem', textAlign: 'left',
    fontSize: '0.78rem', fontWeight: 600, color: '#64748b',
    borderBottom: '1px solid #f1f5f9',
    cursor: 'pointer', userSelect: 'none',
  };
  const tdStyle = {
    padding: '0.7rem 1rem', fontSize: '0.85rem', color: '#334155',
    borderBottom: '1px solid #f8fafc',
  };

  if (!store && error) return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1rem',
      fontFamily: 'Inter, sans-serif',
    }}>
      <div style={{ fontSize: '3rem' }}>🏪</div>
      <h2 style={{ color: '#1e293b', fontWeight: 700, margin: 0 }}>No Store Found</h2>
      <p style={{ color: '#94a3b8', fontSize: '0.95rem', maxWidth: '400px', textAlign: 'center', lineHeight: 1.6 }}>
        {error}. Please contact the administrator to assign a store to your account.
      </p>
    </div>
  );

  if (!store) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <p style={{ color: '#94a3b8', fontSize: '1rem' }}>Loading store data...</p>
    </div>
  );

  // Calculate rating distribution
  const ratingDist = [5, 4, 3, 2, 1].map((star) => {
    const count = ratings.filter((r) => r.value === star).length;
    return { star, count, pct: ratings.length > 0 ? (count / ratings.length) * 100 : 0 };
  });

  return (
    <div style={{
      display: 'flex', gap: '0',
      fontFamily: 'Inter, sans-serif',
      minHeight: '85vh',
      background: '#f8fafc',
      borderRadius: '24px',
      overflow: 'hidden',
      border: '1px solid #e2e8f0',
    }}>
      {/* ═══ SIDEBAR ═══ */}
      <aside style={{
        width: '210px', flexShrink: 0,
        background: '#fff',
        borderRight: '1px solid #f1f5f9',
        padding: '1.5rem 0',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ padding: '0 1.5rem', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1e293b', margin: 0, letterSpacing: '-0.3px' }}>⭐ RateX</h2>
          </div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
            {sideItems.map((item) => (
              <div key={item.label} style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.7rem 1.5rem',
                background: item.active ? '#1e293b' : 'transparent',
                color: item.active ? '#fff' : '#64748b',
                borderRadius: item.active ? '12px' : '0',
                margin: item.active ? '0 0.75rem' : '0',
                fontWeight: item.active ? 700 : 500,
                fontSize: '0.88rem',
                cursor: 'pointer', transition: 'all 0.15s',
              }}>
                <span style={{ fontSize: '1rem' }}>{item.icon}</span>
                {item.label}
              </div>
            ))}
          </nav>
        </div>
        <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid #f1f5f9' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: 700, fontSize: '0.85rem',
            }}>{user?.name?.charAt(0) || 'O'}</div>
            <div>
              <p style={{ margin: 0, fontSize: '0.82rem', fontWeight: 700, color: '#1e293b' }}>{user?.name || 'Owner'}</p>
              <p style={{ margin: 0, fontSize: '0.7rem', color: '#94a3b8' }}>Store Owner</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ═══ MAIN CONTENT ═══ */}
      <main style={{ flex: 1, padding: '1.75rem 2rem', overflowY: 'auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b', margin: '0 0 0.2rem', letterSpacing: '-0.5px' }}>Dashboard</h1>
            <p style={{ color: '#94a3b8', fontSize: '0.82rem', margin: 0 }}>
              {new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '38px', height: '38px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: 700, fontSize: '0.85rem',
            }}>{user?.name?.charAt(0) || 'O'}</div>
            <div>
              <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 700, color: '#1e293b' }}>{user?.name}</p>
              <p style={{ margin: 0, fontSize: '0.72rem', color: '#94a3b8' }}>Store Owner</p>
            </div>
          </div>
        </div>

        {/* Stat Cards */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <StatCard label="Store Name" value={store.name} sub={store.email} bg="#f0fdf4" accent="#22c55e" />
          <StatCard label="Average Rating" value={`${store.averageRating ?? '—'} ★`} sub="Based on all reviews" bg="#eff6ff" accent="#3b82f6" />
          <StatCard label="Total Reviews" value={ratings.length} sub="From verified users" bg="#fef3c7" accent="#f59e0b" />
        </div>

        {/* Middle row: Rating Distribution + Store Info */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          {/* Rating Breakdown */}
          <div style={{
            flex: '1 1 55%', background: 'linear-gradient(135deg, #f5f3ff, #ede9fe)', borderRadius: '18px',
            border: '1px solid #e9e5ff', padding: '1.25rem 1.5rem',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, fontWeight: 700, fontSize: '1rem', color: '#1e293b' }}>Rating Breakdown</h3>
              <span style={{ fontSize: '0.72rem', background: '#e0e7ff', color: '#4f46e5', padding: '0.2rem 0.6rem', borderRadius: '8px', fontWeight: 600 }}>
                Details
              </span>
            </div>
            {ratingDist.map((d) => (
              <div key={d.star} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.55rem' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#1e293b', width: '20px' }}>{d.star}★</span>
                <div style={{ flex: 1, height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${d.pct}%`, height: '100%', borderRadius: '4px',
                    background: d.star >= 4 ? '#22c55e' : d.star === 3 ? '#f59e0b' : '#ef4444',
                    transition: 'width 0.5s ease',
                  }} />
                </div>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', width: '40px', textAlign: 'right' }}>{d.count}</span>
              </div>
            ))}
          </div>

          {/* Store Info Card */}
          <div style={{
            flex: '1 1 40%', borderRadius: '18px',
            background: 'linear-gradient(135deg, #1e293b, #334155)',
            padding: '1.5rem', color: '#fff',
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          }}>
            <div>
              <span style={{ fontSize: '0.72rem', background: 'rgba(255,255,255,0.15)', padding: '0.2rem 0.65rem', borderRadius: '8px', color: '#fff' }}>Store Details</span>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginTop: '0.75rem', color: '#fff' }}>{store.name}</h3>
              <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)', marginTop: '0.3rem' }}>{store.address}</p>
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '0.6rem 1rem', flex: 1, textAlign: 'center' }}>
                <p style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0 0 0.15rem', color: '#fff' }}>{store.averageRating ?? '—'}</p>
                <p style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.7)', margin: 0 }}>Avg Rating</p>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '0.6rem 1rem', flex: 1, textAlign: 'center' }}>
                <p style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0 0 0.15rem', color: '#fff' }}>{ratings.length}</p>
                <p style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.7)', margin: 0 }}>Reviews</p>
              </div>
            </div>
          </div>
        </div>

        {/* Ratings Table */}
        <div style={{
          background: 'linear-gradient(135deg, #f0fdfa, #ecfdf5)', borderRadius: '18px',
          border: '1px solid #d1fae5', overflow: 'hidden',
        }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #d1fae5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontWeight: 700, fontSize: '1rem', color: '#1e293b' }}>Users Who Rated Your Store</h3>
            <span style={{ fontSize: '0.75rem', background: '#f1f5f9', padding: '0.25rem 0.7rem', borderRadius: '8px', color: '#64748b', fontWeight: 600 }}>
              {ratings.length} total
            </span>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#fafbfc' }}>
                  <th style={thStyle}>User</th>
                  <th style={thStyle}>Email</th>
                  <th style={thStyle} onClick={() => handleSort('value')}>Rating {sortBy === 'value' ? (order === 'asc' ? '↑' : '↓') : ''}</th>
                  <th style={thStyle} onClick={() => handleSort('createdAt')}>Date {sortBy === 'createdAt' ? (order === 'asc' ? '↑' : '↓') : ''}</th>
                </tr>
              </thead>
              <tbody>
                {ratings.map((r) => (
                  <tr key={r.id} style={{ transition: 'background 0.15s' }}
                    onMouseOver={(e) => { e.currentTarget.style.background = '#f8fafc'; }}
                    onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{
                          width: '28px', height: '28px', borderRadius: '50%',
                          background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: '#6366f1', fontWeight: 700, fontSize: '0.7rem',
                        }}>{r.user?.name?.charAt(0)}</div>
                        <span style={{ fontWeight: 600 }}>{r.user?.name}</span>
                      </div>
                    </td>
                    <td style={tdStyle}>{r.user?.email}</td>
                    <td style={tdStyle}>
                      <span style={{
                        background: '#fef3c7', color: '#b45309',
                        padding: '0.2rem 0.55rem', borderRadius: '6px',
                        fontSize: '0.78rem', fontWeight: 700,
                      }}>{'★'.repeat(r.value)}{'☆'.repeat(5 - r.value)}</span>
                    </td>
                    <td style={tdStyle}>{new Date(r.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OwnerDashboard;
