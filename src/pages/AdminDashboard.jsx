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

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');

  const [userSortBy, setUserSortBy] = useState('createdAt');
  const [userOrder, setUserOrder] = useState('desc');
  const [storeSortBy, setStoreSortBy] = useState('createdAt');
  const [storeOrder, setStoreOrder] = useState('desc');

  useEffect(() => {
    fetchStats();
    fetchUsers();
    fetchStores();
  }, [search, userSortBy, userOrder, storeSortBy, storeOrder]);

  const fetchStats = async () => {
    const res = await api.get('/admin/dashboard');
    if (res.data.success) setStats(res.data.data);
  };

  const fetchUsers = async () => {
    const res = await api.get(`/admin/users?search=${search}&sortBy=${userSortBy}&order=${userOrder}&limit=500`);
    if (res.data.success) setUsers(res.data.data.users);
  };

  const fetchStores = async () => {
    const res = await api.get(`/admin/stores?search=${search}&sortBy=${storeSortBy}&order=${storeOrder}&limit=500`);
    if (res.data.success) setStores(res.data.data.stores);
  };

  const handleUserSort = (key) => {
    if (userSortBy === key) setUserOrder(userOrder === 'asc' ? 'desc' : 'asc');
    else { setUserSortBy(key); setUserOrder('asc'); }
  };

  const handleStoreSort = (key) => {
    if (storeSortBy === key) setStoreOrder(storeOrder === 'asc' ? 'desc' : 'asc');
    else { setStoreSortBy(key); setStoreOrder('asc'); }
  };

  // Derived data
  const normalUsers = users.filter((u) => u.role === 'NORMAL');
  const ownerUsers = users.filter((u) => u.role === 'STORE_OWNER');
  const adminUsers = users.filter((u) => u.role === 'ADMIN');

  const sideItems = [
    { icon: '📊', label: 'Dashboard', key: 'dashboard' },
    { icon: '👥', label: 'Users', key: 'users' },
    { icon: '🏪', label: 'Stores', key: 'stores' },
    { icon: '👔', label: 'Owners', key: 'owners' },
    { icon: '⭐', label: 'Ratings', key: 'ratings' },
    { icon: '⚙️', label: 'Settings', key: 'settings' },
  ];

  const thStyle = {
    padding: '0.7rem 1rem', textAlign: 'left',
    fontSize: '0.78rem', fontWeight: 600, color: '#64748b',
    borderBottom: '1px solid #f1f5f9',
    cursor: 'pointer', userSelect: 'none',
    whiteSpace: 'nowrap',
  };
  const tdStyle = {
    padding: '0.7rem 1rem', fontSize: '0.85rem', color: '#334155',
    borderBottom: '1px solid #f8fafc',
  };

  const roleBadge = (role) => {
    const map = {
      ADMIN: { bg: '#fef3c7', color: '#b45309' },
      STORE_OWNER: { bg: '#e0e7ff', color: '#4f46e5' },
      NORMAL: { bg: '#f0fdf4', color: '#15803d' },
    };
    const s = map[role] || map.NORMAL;
    return (
      <span style={{
        fontSize: '0.72rem', padding: '0.2rem 0.55rem', borderRadius: '6px', fontWeight: 600,
        background: s.bg, color: s.color,
      }}>{role}</span>
    );
  };

  const renderUserTable = (data, showRole = true) => (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ background: '#fafbfc' }}>
          <th style={thStyle} onClick={() => handleUserSort('name')}>Name {userSortBy === 'name' ? (userOrder === 'asc' ? '↑' : '↓') : ''}</th>
          <th style={thStyle} onClick={() => handleUserSort('email')}>Email {userSortBy === 'email' ? (userOrder === 'asc' ? '↑' : '↓') : ''}</th>
          {showRole && <th style={thStyle} onClick={() => handleUserSort('role')}>Role {userSortBy === 'role' ? (userOrder === 'asc' ? '↑' : '↓') : ''}</th>}
          <th style={thStyle}>Address</th>
        </tr>
      </thead>
      <tbody>
        {data.map((u) => (
          <tr key={u.id} style={{ transition: 'background 0.15s' }}
            onMouseOver={(e) => { e.currentTarget.style.background = '#f8fafc'; }}
            onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; }}
          >
            <td style={tdStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#6366f1', fontWeight: 700, fontSize: '0.7rem', flexShrink: 0,
                }}>{u.name?.charAt(0)}</div>
                <span style={{ fontWeight: 600 }}>{u.name}</span>
              </div>
            </td>
            <td style={tdStyle}>{u.email}</td>
            {showRole && <td style={tdStyle}>{roleBadge(u.role)}</td>}
            <td style={tdStyle}>{u.address}</td>
          </tr>
        ))}
        {data.length === 0 && (
          <tr><td colSpan={showRole ? 4 : 3} style={{ ...tdStyle, textAlign: 'center', color: '#94a3b8' }}>No records found</td></tr>
        )}
      </tbody>
    </table>
  );

  const renderStoreTable = () => (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ background: '#fafbfc' }}>
          <th style={thStyle} onClick={() => handleStoreSort('name')}>Store Name {storeSortBy === 'name' ? (storeOrder === 'asc' ? '↑' : '↓') : ''}</th>
          <th style={thStyle} onClick={() => handleStoreSort('email')}>Email {storeSortBy === 'email' ? (storeOrder === 'asc' ? '↑' : '↓') : ''}</th>
          <th style={thStyle}>Owner</th>
          <th style={thStyle}>Address</th>
          <th style={thStyle} onClick={() => handleStoreSort('averageRating')}>Rating {storeSortBy === 'averageRating' ? (storeOrder === 'asc' ? '↑' : '↓') : ''}</th>
        </tr>
      </thead>
      <tbody>
        {stores.map((s) => (
          <tr key={s.id} style={{ transition: 'background 0.15s' }}
            onMouseOver={(e) => { e.currentTarget.style.background = '#f8fafc'; }}
            onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; }}
          >
            <td style={tdStyle}><span style={{ fontWeight: 600 }}>{s.name}</span></td>
            <td style={tdStyle}>{s.email}</td>
            <td style={tdStyle}>{s.owner?.name}</td>
            <td style={tdStyle}>{s.address}</td>
            <td style={tdStyle}>
              <span style={{
                background: '#fef3c7', color: '#b45309',
                padding: '0.2rem 0.55rem', borderRadius: '6px',
                fontSize: '0.78rem', fontWeight: 700,
              }}>⭐ {s.averageRating != null ? Number(s.averageRating).toFixed(1) : '—'}</span>
            </td>
          </tr>
        ))}
        {stores.length === 0 && (
          <tr><td colSpan={5} style={{ ...tdStyle, textAlign: 'center', color: '#94a3b8' }}>No stores found</td></tr>
        )}
      </tbody>
    </table>
  );

  const renderOwnersTable = () => (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ background: '#fafbfc' }}>
          <th style={thStyle}>Owner Name</th>
          <th style={thStyle}>Email</th>
          <th style={thStyle}>Store</th>
          <th style={thStyle}>Store Rating</th>
        </tr>
      </thead>
      <tbody>
        {ownerUsers.map((owner) => {
          const ownerStore = stores.find((s) => s.owner?.email === owner.email || s.owner?.name === owner.name);
          return (
            <tr key={owner.id} style={{ transition: 'background 0.15s' }}
              onMouseOver={(e) => { e.currentTarget.style.background = '#f8fafc'; }}
              onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; }}
            >
              <td style={tdStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#6366f1', fontWeight: 700, fontSize: '0.7rem', flexShrink: 0,
                  }}>{owner.name?.charAt(0)}</div>
                  <span style={{ fontWeight: 600 }}>{owner.name}</span>
                </div>
              </td>
              <td style={tdStyle}>{owner.email}</td>
              <td style={tdStyle}>{ownerStore?.name || <span style={{ color: '#94a3b8' }}>No store</span>}</td>
              <td style={tdStyle}>
                {ownerStore ? (
                  <span style={{
                    background: '#fef3c7', color: '#b45309',
                    padding: '0.2rem 0.55rem', borderRadius: '6px',
                    fontSize: '0.78rem', fontWeight: 700,
                  }}>⭐ {Number(ownerStore.averageRating).toFixed(1)}</span>
                ) : '—'}
              </td>
            </tr>
          );
        })}
        {ownerUsers.length === 0 && (
          <tr><td colSpan={4} style={{ ...tdStyle, textAlign: 'center', color: '#94a3b8' }}>No owners found</td></tr>
        )}
      </tbody>
    </table>
  );

  // Get the current table title and data count
  const getTableInfo = () => {
    switch (activeTab) {
      case 'users': return { title: 'All Users', count: normalUsers.length };
      case 'stores': return { title: 'All Stores', count: stores.length };
      case 'owners': return { title: 'Store Owners', count: ownerUsers.length };
      case 'ratings': return { title: 'All Users (with Ratings View)', count: users.length };
      default: return { title: 'All Users', count: users.length };
    }
  };

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
              <div
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  padding: '0.7rem 1.5rem',
                  background: activeTab === item.key ? '#1e293b' : 'transparent',
                  color: activeTab === item.key ? '#fff' : '#64748b',
                  borderRadius: activeTab === item.key ? '12px' : '0',
                  margin: activeTab === item.key ? '0 0.75rem' : '0',
                  fontWeight: activeTab === item.key ? 700 : 500,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                <span style={{ fontSize: '1rem' }}>{item.icon}</span>
                {item.label}
              </div>
            ))}
          </nav>
        </div>
        {/* Bottom user info */}
        <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid #f1f5f9' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: 700, fontSize: '0.85rem',
            }}>{user?.name?.charAt(0) || 'A'}</div>
            <div>
              <p style={{ margin: 0, fontSize: '0.82rem', fontWeight: 700, color: '#1e293b' }}>{user?.name || 'Admin'}</p>
              <p style={{ margin: 0, fontSize: '0.7rem', color: '#94a3b8' }}>Administrator</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ═══ MAIN CONTENT ═══ */}
      <main style={{ flex: 1, padding: '1.75rem 2rem', overflowY: 'auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b', margin: '0 0 0.2rem', letterSpacing: '-0.5px' }}>
              {activeTab === 'dashboard' ? 'Dashboard' : sideItems.find(i => i.key === activeTab)?.label || 'Dashboard'}
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '0.82rem', margin: 0 }}>
              {new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              style={{
                padding: '0.55rem 1rem', border: '1px solid #e2e8f0', borderRadius: '12px',
                fontSize: '0.82rem', outline: 'none', width: '200px', fontFamily: 'Inter, sans-serif',
              }}
            />
            <div style={{
              width: '38px', height: '38px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: 700, fontSize: '0.85rem',
            }}>{user?.name?.charAt(0) || 'A'}</div>
          </div>
        </div>

        {/* Dashboard overview — stat cards */}
        {activeTab === 'dashboard' && (
          <>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              <StatCard label="Total Users" value={stats.totalUsers} sub="All registered accounts" bg="#f0fdf4" accent="#22c55e" />
              <StatCard label="Total Stores" value={stats.totalStores} sub="Active on platform" bg="#eff6ff" accent="#3b82f6" />
              <StatCard label="Total Ratings" value={stats.totalRatings} sub="Reviews submitted" bg="#fef3c7" accent="#f59e0b" />
              <StatCard label="Owners" value={ownerUsers.length} sub="Store owners" bg="#fdf2f8" accent="#ec4899" />
            </div>

            {/* Quick overview tables */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
              {/* Recent Users */}
              <div style={{ flex: 1, background: 'linear-gradient(135deg, #eff6ff, #dbeafe)', borderRadius: '18px', border: '1px solid #bfdbfe', overflow: 'hidden' }}>
                <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #bfdbfe', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ margin: 0, fontWeight: 700, fontSize: '0.95rem', color: '#1e293b' }}>Recent Users</h3>
                  <button onClick={() => setActiveTab('users')} style={{ fontSize: '0.72rem', background: '#e0e7ff', color: '#4f46e5', padding: '0.2rem 0.6rem', borderRadius: '8px', fontWeight: 600, border: 'none', cursor: 'pointer' }}>View All</button>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  {renderUserTable(users.slice(0, 5))}
                </div>
              </div>
            </div>

            {/* Recent Stores */}
            <div style={{ background: 'linear-gradient(135deg, #f0fdfa, #ccfbf1)', borderRadius: '18px', border: '1px solid #99f6e4', overflow: 'hidden' }}>
              <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #99f6e4', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontWeight: 700, fontSize: '0.95rem', color: '#1e293b' }}>Recent Stores</h3>
                <button onClick={() => setActiveTab('stores')} style={{ fontSize: '0.72rem', background: '#e0e7ff', color: '#4f46e5', padding: '0.2rem 0.6rem', borderRadius: '8px', fontWeight: 600, border: 'none', cursor: 'pointer' }}>View All</button>
              </div>
              <div style={{ overflowX: 'auto' }}>
                {renderStoreTable()}
              </div>
            </div>
          </>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div style={{ background: 'linear-gradient(135deg, #f5f3ff, #ede9fe)', borderRadius: '18px', border: '1px solid #e9e5ff', overflow: 'hidden' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e9e5ff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontWeight: 700, fontSize: '1rem', color: '#1e293b' }}>All Users</h3>
              <span style={{ fontSize: '0.75rem', background: '#e0e7ff', padding: '0.25rem 0.7rem', borderRadius: '8px', color: '#4f46e5', fontWeight: 600 }}>
                {users.length} total
              </span>
            </div>
            <div style={{ overflowX: 'auto' }}>{renderUserTable(users)}</div>
          </div>
        )}

        {/* Stores Tab */}
        {activeTab === 'stores' && (
          <div style={{ background: 'linear-gradient(135deg, #eff6ff, #dbeafe)', borderRadius: '18px', border: '1px solid #bfdbfe', overflow: 'hidden' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #bfdbfe', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontWeight: 700, fontSize: '1rem', color: '#1e293b' }}>All Stores</h3>
              <span style={{ fontSize: '0.75rem', background: '#dbeafe', padding: '0.25rem 0.7rem', borderRadius: '8px', color: '#2563eb', fontWeight: 600 }}>
                {stores.length} total
              </span>
            </div>
            <div style={{ overflowX: 'auto' }}>{renderStoreTable()}</div>
          </div>
        )}

        {/* Owners Tab */}
        {activeTab === 'owners' && (
          <div style={{ background: 'linear-gradient(135deg, #fdf2f8, #fce7f3)', borderRadius: '18px', border: '1px solid #f9a8d4', overflow: 'hidden' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f9a8d4', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontWeight: 700, fontSize: '1rem', color: '#1e293b' }}>Store Owners</h3>
              <span style={{ fontSize: '0.75rem', background: '#fce7f3', padding: '0.25rem 0.7rem', borderRadius: '8px', color: '#db2777', fontWeight: 600 }}>
                {ownerUsers.length} total
              </span>
            </div>
            <div style={{ overflowX: 'auto' }}>{renderOwnersTable()}</div>
          </div>
        )}

        {/* Ratings Tab — show all users with roles */}
        {activeTab === 'ratings' && (
          <div style={{ background: 'linear-gradient(135deg, #fffbeb, #fef3c7)', borderRadius: '18px', border: '1px solid #fde68a', overflow: 'hidden' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #fde68a' }}>
              <h3 style={{ margin: 0, fontWeight: 700, fontSize: '1rem', color: '#1e293b' }}>Ratings Overview</h3>
              <p style={{ margin: '0.3rem 0 0', fontSize: '0.8rem', color: '#92400e' }}>Total ratings on the platform: {stats.totalRatings}</p>
            </div>
            <div style={{ padding: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {stores.map((s) => (
                <div key={s.id} style={{
                  flex: '1 1 200px', maxWidth: '250px',
                  background: 'rgba(255,255,255,0.7)', borderRadius: '14px',
                  padding: '1rem', border: '1px solid #fde68a',
                }}>
                  <p style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1e293b', margin: '0 0 0.3rem' }}>{s.name}</p>
                  <p style={{ fontSize: '0.78rem', color: '#92400e', margin: '0 0 0.5rem' }}>{s.address}</p>
                  <span style={{
                    background: '#fef3c7', color: '#b45309',
                    padding: '0.2rem 0.55rem', borderRadius: '6px',
                    fontSize: '0.82rem', fontWeight: 700,
                  }}>⭐ {s.averageRating != null ? Number(s.averageRating).toFixed(1) : '0.0'}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div style={{ background: '#fff', borderRadius: '18px', border: '1px solid #f1f5f9', padding: '2rem', textAlign: 'center' }}>
            <p style={{ color: '#94a3b8', fontSize: '1rem' }}>⚙️ Settings panel coming soon</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
