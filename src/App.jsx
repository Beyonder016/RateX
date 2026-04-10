import React, { useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import LandingPage from './pages/LandingPage.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import NormalDashboard from './pages/NormalDashboard.jsx';
import OwnerDashboard from './pages/OwnerDashboard.jsx';
import StoreDetails from './pages/StoreDetails.jsx';
import Wishlists from './pages/Wishlists.jsx';

/* ────────── SVG Filter for Liquid Glass distortion ────────── */
const LiquidGlassSVGFilter = () => (
  <svg style={{ display: 'none' }} xmlns="http://www.w3.org/2000/svg">
    {/* Full-scale for cards/containers */}
    <filter id="liquid-glass">
      <feTurbulence type="fractalNoise" baseFrequency="0.01 0.02" numOctaves="2" seed="5" result="turbulence" />
      <feDisplacementMap in="SourceGraphic" in2="turbulence" scale="40" xChannelSelector="R" yChannelSelector="G" />
    </filter>
    {/* Smaller scale for cursor */}
    <filter id="liquid-glass-cursor">
      <feTurbulence type="fractalNoise" baseFrequency="0.03 0.06" numOctaves="2" seed="5" result="turbulence" />
      <feDisplacementMap in="SourceGraphic" in2="turbulence" scale="6" xChannelSelector="R" yChannelSelector="G" />
    </filter>
  </svg>
);

/* ────────── Liquid Glass Cursor (Global) ────────── */
const LiquidGlassCursor = () => {
  const cursorRef = useRef(null);
  const posRef = useRef({ x: -100, y: -100 });
  const targetRef = useRef({ x: -100, y: -100 });
  const isPointerRef = useRef(false);
  const rafRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const onMove = (e) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
      const el = e.target;
      const style = window.getComputedStyle(el);
      const tag = el.tagName;
      isPointerRef.current =
        style.cursor === 'pointer' ||
        tag === 'BUTTON' || tag === 'A' || tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' ||
        el.closest('button') || el.closest('a') ||
        el.getAttribute('role') === 'button' ||
        el.onclick != null;
    };

    const animate = () => {
      const lerp = 0.16;
      posRef.current.x += (targetRef.current.x - posRef.current.x) * lerp;
      posRef.current.y += (targetRef.current.y - posRef.current.y) * lerp;

      const size = isPointerRef.current ? 18 : 34;
      cursor.style.width = `${size}px`;
      cursor.style.height = `${size}px`;
      cursor.style.transform = `translate(${posRef.current.x - size / 2}px, ${posRef.current.y - size / 2}px)`;

      rafRef.current = requestAnimationFrame(animate);
    };

    document.addEventListener('mousemove', onMove);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '34px', height: '34px',
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: 99999,
        overflow: 'hidden',
        transition: 'width 0.22s cubic-bezier(.4,0,.2,1), height 0.22s cubic-bezier(.4,0,.2,1)',
        willChange: 'transform, width, height',
      }}
    >
      {/* Morph layer — the real liquid glass distortion */}
      <div style={{
        position: 'absolute', inset: 0,
        backdropFilter: 'blur(2px)',
        WebkitBackdropFilter: 'blur(2px)',
        filter: 'url(#liquid-glass-cursor)',
        borderRadius: 'inherit',
        background: 'rgba(30, 41, 59, 0.12)',
      }} />
      {/* Corner shadow */}
      <div style={{
        position: 'absolute', inset: 0,
        boxShadow: '0 4px 4px rgba(0,0,0,0.15), 0 0 12px rgba(0,0,0,0.08)',
        borderRadius: 'inherit',
      }} />
      {/* Inner border glow */}
      <div style={{
        position: 'absolute', inset: 0,
        boxShadow: 'inset 2px 2px 2px 0 rgba(255,255,255,0.2), inset -2px -2px 2px 0 rgba(255,255,255,0.2)',
        borderRadius: 'inherit',
      }} />
    </div>
  );
};

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <div>Unauthorized. You do not have the required role.</div>;
  }
  return children;
};

/* Transparent header — only displayed on contained pages */
const Header = () => {
  const { user, logout } = useAuth();
  if (!user) return null;
  return (
    <div style={{
      padding: '1.25rem 2.5rem',
      background: 'transparent',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'relative',
      zIndex: 100,
    }}>
      <Link to="/home" style={{ textDecoration: 'none' }}>
        <h2 style={{ margin: 0, color: 'var(--primary)', fontWeight: 800, letterSpacing: '-0.5px' }}>RateX</h2>
      </Link>
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        {user.role === 'NORMAL' && (
          <Link to="/wishlists" style={{ textDecoration: 'none' }}>
            {/* Liquid glass wishlist button with blue tint */}
            <div style={{
              position: 'relative',
              padding: '0.45rem 1.2rem',
              borderRadius: '10px',
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'transform 0.2s ease',
            }}
              onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.04)'; }}
              onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
            >
              {/* Morph layer */}
              <div style={{
                position: 'absolute', inset: 0, zIndex: 0,
                backdropFilter: 'blur(2px)',
                WebkitBackdropFilter: 'blur(2px)',
                filter: 'url(#liquid-glass)',
                borderRadius: 'inherit',
                background: 'rgba(99, 130, 255, 0.08)',
              }} />
              {/* Corner shadow */}
              <div style={{
                position: 'absolute', inset: 0, zIndex: 1,
                boxShadow: '0 4px 4px rgba(0,0,0,0.1), 0 0 12px rgba(0,0,0,0.06)',
                borderRadius: 'inherit',
              }} />
              {/* Inner border */}
              <div style={{
                position: 'absolute', inset: 0, zIndex: 2,
                boxShadow: 'inset 2px 2px 2px 0 rgba(120,160,255,0.2), inset -2px -2px 2px 0 rgba(120,160,255,0.15)',
                borderRadius: 'inherit',
              }} />
              <span style={{
                position: 'relative', zIndex: 3,
                fontWeight: 600, fontSize: '0.9rem',
                color: '#3b6cf5',
                textShadow: '0 0 5px rgba(59,108,245,0.1)',
              }}>
                Wishlists
              </span>
            </div>
          </Link>
        )}
        {/* Liquid glass logout button with red tint */}
        <div
          onClick={logout}
          style={{
            position: 'relative',
            padding: '0.45rem 1.2rem',
            borderRadius: '10px',
            overflow: 'hidden',
            cursor: 'pointer',
            transition: 'transform 0.2s ease',
          }}
          onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.04)'; }}
          onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
        >
          {/* Morph layer */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: 0,
            backdropFilter: 'blur(2px)',
            WebkitBackdropFilter: 'blur(2px)',
            filter: 'url(#liquid-glass)',
            borderRadius: 'inherit',
            background: 'rgba(255, 100, 100, 0.08)',
          }} />
          {/* Corner shadow */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: 1,
            boxShadow: '0 4px 4px rgba(0,0,0,0.1), 0 0 12px rgba(0,0,0,0.06)',
            borderRadius: 'inherit',
          }} />
          {/* Inner border */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: 2,
            boxShadow: 'inset 2px 2px 2px 0 rgba(255,120,120,0.2), inset -2px -2px 2px 0 rgba(255,120,120,0.15)',
            borderRadius: 'inherit',
          }} />
          <span style={{
            position: 'relative', zIndex: 3,
            fontWeight: 600, fontSize: '0.9rem',
            color: '#dc2626',
            textShadow: '0 0 5px rgba(220,38,38,0.1)',
          }}>
            Logout
          </span>
        </div>
      </div>
    </div>
  );
};

function App() {
  const { user } = useAuth();

  return (
    <Router>
      <LiquidGlassSVGFilter />
      <LiquidGlassCursor />
      <Routes>
        {/* Full-bleed pages — no header, no container */}
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/home" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/home" />} />

        {/* All other pages wrapped with header + container */}
        <Route path="/*" element={
          <>
            <Header />
            <div className="container">
              <Routes>
                <Route path="/" element={<Navigate to={user ? '/home' : '/login'} />} />
                <Route path="/home" element={
                  <ProtectedRoute allowedRoles={['NORMAL', 'ADMIN', 'STORE_OWNER']}>
                    <LandingPage />
                  </ProtectedRoute>
                } />
                <Route path="/admin" element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/stores" element={
                  <ProtectedRoute allowedRoles={['NORMAL', 'ADMIN', 'STORE_OWNER']}>
                    <NormalDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/stores/:id" element={
                  <ProtectedRoute allowedRoles={['NORMAL', 'ADMIN', 'STORE_OWNER']}>
                    <StoreDetails />
                  </ProtectedRoute>
                } />
                <Route path="/wishlists" element={
                  <ProtectedRoute allowedRoles={['NORMAL']}>
                    <Wishlists />
                  </ProtectedRoute>
                } />
                <Route path="/owner" element={
                  <ProtectedRoute allowedRoles={['STORE_OWNER']}>
                    <OwnerDashboard />
                  </ProtectedRoute>
                } />
              </Routes>
            </div>
          </>
        } />
      </Routes>
    </Router>
  );
}

export default App;
