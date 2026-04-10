import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '0.85rem 1rem',
    fontSize: '0.95rem',
    border: '1.5px solid #e2e8f0',
    borderRadius: '10px',
    outline: 'none',
    fontFamily: 'Inter, sans-serif',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
    background: '#fff',
  };

  return (
    <div style={{
      display: 'flex',
      width: '100vw',
      height: '100vh',
      position: 'fixed',
      top: 0,
      left: 0,
      fontFamily: 'Inter, sans-serif',
      zIndex: 10,
    }}>
      {/* ───── Left: Gradient Panel (~45% width) ───── */}
      <div style={{
        width: '45%',
        minWidth: '380px',
        background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 25%, #6366f1 50%, #818cf8 75%, #4f46e5 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '3rem 2.5rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative blurred orbs */}
        <div style={{
          position: 'absolute', top: '-80px', left: '-80px',
          width: '350px', height: '350px', borderRadius: '50%',
          background: 'rgba(129,140,248,0.45)', filter: 'blur(90px)',
        }} />
        <div style={{
          position: 'absolute', bottom: '-60px', right: '-60px',
          width: '300px', height: '300px', borderRadius: '50%',
          background: 'rgba(99,102,241,0.5)', filter: 'blur(70px)',
        }} />
        <div style={{
          position: 'absolute', top: '35%', left: '25%',
          width: '250px', height: '250px', borderRadius: '50%',
          background: 'rgba(167,139,250,0.3)', filter: 'blur(80px)',
        }} />

        {/* Hero text */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.85rem', marginBottom: '0.75rem', fontWeight: 400 }}>
            You can easily
          </p>
          <h1 style={{
            color: '#fff', fontSize: '2.6rem', fontWeight: 800,
            lineHeight: '1.15', letterSpacing: '-1px', margin: 0,
          }}>
            Speed up your work<br />with our Web App
          </h1>
        </div>

        {/* Partners */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.75rem', marginBottom: '0.8rem' }}>
            Our partners
          </p>
          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', flexWrap: 'wrap' }}>
            {['Discord', 'Instagram', 'Spotify', 'YouTube'].map((name) => (
              <span key={name} style={{
                color: 'rgba(255,255,255,0.65)', fontSize: '0.8rem', fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: '0.3rem',
              }}>
                ● {name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ───── Right: Form Panel ───── */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 4rem',
        background: '#fff',
      }}>
        <div style={{ width: '100%', maxWidth: '380px' }}>
          <h2 style={{
            fontSize: '1.85rem', fontWeight: 800, color: '#1e293b',
            marginBottom: '0.4rem', letterSpacing: '-0.5px',
          }}>
            Get Started Now
          </h2>
          <p style={{ color: '#94a3b8', marginBottom: '2rem', fontSize: '0.9rem' }}>
            Please log in to your account to continue.
          </p>

          {error && (
            <div style={{
              background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626',
              padding: '0.7rem 1rem', borderRadius: '10px', marginBottom: '1.25rem',
              fontSize: '0.88rem', fontWeight: 500,
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom: '1.15rem' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="workmail@gmail.com"
                required
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = '#6366f1')}
                onBlur={(e) => (e.target.style.borderColor = '#e2e8f0')}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#334155' }}>
                  Password
                </label>
                <span style={{ fontSize: '0.78rem', color: '#6366f1', fontWeight: 500, cursor: 'pointer' }}>
                  Forgot Password?
                </span>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  required
                  style={{ ...inputStyle, paddingRight: '3rem' }}
                  onFocus={(e) => (e.target.style.borderColor = '#6366f1')}
                  onBlur={(e) => (e.target.style.borderColor = '#e2e8f0')}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  style={{
                    position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', color: '#94a3b8', fontSize: '1rem',
                    cursor: 'pointer', padding: '0.2rem',
                  }}
                >
                  {showPw ? '🙈' : '👁'}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '0.82rem',
                borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(135deg, #6366f1, #7c3aed)',
                color: '#fff',
                fontSize: '0.95rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                boxShadow: '0 4px 14px rgba(99,102,241,0.35)',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(99,102,241,0.45)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 14px rgba(99,102,241,0.35)';
              }}
            >
              Log in
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#64748b', fontSize: '0.88rem' }}>
            Have an account?{' '}
            <Link to="/register" style={{ color: '#6366f1', fontWeight: 600, textDecoration: 'none' }}>
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
