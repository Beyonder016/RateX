import React, { useState } from 'react';
import api from '../api';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', address: '' });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', form);
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      if (err.response?.data?.errors) {
        setError(err.response.data.errors[0].msg);
      } else {
        setError(err.response?.data?.message || 'Registration failed');
      }
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '0.8rem 1rem',
    fontSize: '0.92rem',
    border: '1.5px solid #e2e8f0',
    borderRadius: '10px',
    outline: 'none',
    fontFamily: 'Inter, sans-serif',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
    background: '#fff',
  };

  const authVisualStyle = {
    width: '45%',
    minWidth: '380px',
    backgroundColor: '#4f46e5',
    backgroundImage:
      "linear-gradient(135deg, rgba(15,23,42,0.18), rgba(79,70,229,0.14)), url('/login.jpg')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '3rem 2.5rem',
    position: 'relative',
    overflow: 'hidden',
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
      {/* ───── Left: Gradient Panel ───── */}
      <div style={authVisualStyle}>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(15,23,42,0.08), rgba(15,23,42,0.32))',
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.85rem', marginBottom: '0.75rem', fontWeight: 400 }}>
            Join thousands of users
          </p>
          <h1 style={{
            color: '#fff', fontSize: '2.6rem', fontWeight: 800,
            lineHeight: '1.15', letterSpacing: '-1px', margin: 0,
          }}>
            Create your<br />account today
          </h1>
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.75rem', marginBottom: '0.8rem' }}>
            Our partners
          </p>
          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', flexWrap: 'wrap' }}>
            {['Discord', 'Instagram', 'Spotify', 'YouTube', 'TikTok'].map((name) => (
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
        overflowY: 'auto',
      }}>
        <div style={{ width: '100%', maxWidth: '380px' }}>
          <h2 style={{
            fontSize: '1.85rem', fontWeight: 800, color: '#1e293b',
            marginBottom: '0.4rem', letterSpacing: '-0.5px',
          }}>
            Create Account
          </h2>
          <p style={{ color: '#94a3b8', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            Fill in your details to get started.
          </p>

          {error && (
            <div style={{
              background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626',
              padding: '0.7rem 1rem', borderRadius: '10px', marginBottom: '1rem',
              fontSize: '0.88rem', fontWeight: 500,
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '0.9rem' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '0.3rem' }}>
                Full Name
              </label>
              <input name="name" type="text" value={form.name} onChange={handleChange}
                placeholder="John Doe (20-60 characters)" required style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = '#6366f1')}
                onBlur={(e) => (e.target.style.borderColor = '#e2e8f0')}
              />
            </div>

            <div style={{ marginBottom: '0.9rem' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '0.3rem' }}>
                Email address
              </label>
              <input name="email" type="email" value={form.email} onChange={handleChange}
                placeholder="you@example.com" required style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = '#6366f1')}
                onBlur={(e) => (e.target.style.borderColor = '#e2e8f0')}
              />
            </div>

            <div style={{ marginBottom: '0.9rem' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '0.3rem' }}>
                Address
              </label>
              <input name="address" type="text" value={form.address} onChange={handleChange}
                placeholder="123 Main Street" required style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = '#6366f1')}
                onBlur={(e) => (e.target.style.borderColor = '#e2e8f0')}
              />
            </div>

            <div style={{ marginBottom: '1.3rem' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '0.3rem' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input name="password" type={showPw ? 'text' : 'password'} value={form.password}
                  onChange={handleChange} placeholder="Min 8, 1 upper, 1 special" required
                  style={{ ...inputStyle, paddingRight: '3rem' }}
                  onFocus={(e) => (e.target.style.borderColor = '#6366f1')}
                  onBlur={(e) => (e.target.style.borderColor = '#e2e8f0')}
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
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

            <button type="submit"
              style={{
                width: '100%', padding: '0.82rem', borderRadius: '12px', border: 'none',
                background: 'linear-gradient(135deg, #6366f1, #7c3aed)', color: '#fff',
                fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer',
                transition: 'all 0.25s ease', boxShadow: '0 4px 14px rgba(99,102,241,0.35)',
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
              Register
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#64748b', fontSize: '0.88rem' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#6366f1', fontWeight: 600, textDecoration: 'none' }}>
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
