import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/* ────────── Footer ────────── */
const Footer = () => (
  <footer style={{
    background: '#f8fafc',
    borderTop: '1px solid #e2e8f0',
    borderRadius: '24px 24px 0 0',
    padding: '3rem 3.5rem 1.5rem',
    margin: '4rem auto 0',
    width: '96%',
  }}>
    <div style={{
      display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 1.3fr', gap: '2rem',
    }}>
      <div>
        <h3 style={{ color: '#1e293b', fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.75rem' }}>⭐ RateX</h3>
        <p style={{ color: '#64748b', fontSize: '0.82rem', lineHeight: 1.7 }}>
          Your destination for discovering and rating the best stores. Quality reviews, trusted community.
        </p>
      </div>
      <div>
        <h4 style={{ color: '#1e293b', fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.75rem' }}>Quick Links</h4>
        {['Home', 'Browse Stores', 'Wishlists', 'My Reviews'].map((l) => (
          <p key={l} style={{ color: '#64748b', fontSize: '0.82rem', margin: '0.4rem 0' }}>{l}</p>
        ))}
      </div>
      <div>
        <h4 style={{ color: '#1e293b', fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.75rem' }}>Support</h4>
        {['Contact Us', 'FAQ', 'Terms of Service', 'Privacy Policy'].map((l) => (
          <p key={l} style={{ color: '#64748b', fontSize: '0.82rem', margin: '0.4rem 0' }}>{l}</p>
        ))}
      </div>
      <div>
        <h4 style={{ color: '#1e293b', fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.75rem' }}>Stay Connected</h4>
        <p style={{ color: '#64748b', fontSize: '0.82rem', lineHeight: 1.6, marginBottom: '0.8rem' }}>
          Subscribe to our newsletter for exclusive offers and updates.
        </p>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input type="email" placeholder="Your email address" style={{
            flex: 1, padding: '0.55rem 0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px',
            fontSize: '0.8rem', outline: 'none', fontFamily: 'Inter, sans-serif',
          }} />
          <button style={{
            padding: '0.55rem 0.85rem', background: 'linear-gradient(135deg, #6366f1, #7c3aed)',
            border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem',
          }}>→</button>
        </div>
        <p style={{ color: '#64748b', fontSize: '0.78rem', marginTop: '0.6rem' }}>✉ support@ratex.com</p>
      </div>
    </div>
    <div style={{
      marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    }}>
      <p style={{ color: '#94a3b8', fontSize: '0.78rem' }}>© 2026 RateX. All rights reserved.</p>
      <div style={{ display: 'flex', gap: '1.25rem' }}>
        <span style={{ color: '#94a3b8', fontSize: '0.78rem' }}>Privacy Policy</span>
        <span style={{ color: '#cbd5e1' }}>|</span>
        <span style={{ color: '#94a3b8', fontSize: '0.78rem' }}>Terms of Service</span>
      </div>
    </div>
  </footer>
);

/* ────────── Landing Page ────────── */
const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const getDashboardPath = () => {
    if (user.role === 'ADMIN') return '/admin';
    if (user.role === 'STORE_OWNER') return '/owner';
    return '/stores';
  };

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>

      {/* ═══════════════ SECTION 1: HERO IMAGE ═══════════════ */}
      <div style={{
        width: '96%',
        margin: '0 auto 3rem',
        borderRadius: '24px',
        overflow: 'hidden',
        position: 'relative',
        height: '520px',
      }}>
        <img src="/hero.jfif" alt="Shopping district" style={{
          width: '100%', height: '100%', objectFit: 'cover', display: 'block',
        }} />
        {/* Dark overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.55) 100%)',
        }} />

        {/* Top nav bar inside hero (like reference) */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          padding: '1.5rem 2.5rem',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          zIndex: 2,
        }}>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            {['Home', 'Stores', 'Reviews'].map((l) => (
              <span key={l} style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', fontWeight: 500 }}>{l}</span>
            ))}
          </div>
          <h2 style={{ color: '#fff', fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.5px', margin: 0 }}>RATEX</h2>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            {['About', 'Pricing', 'Account'].map((l) => (
              <span key={l} style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', fontWeight: 500 }}>{l}</span>
            ))}
          </div>
        </div>

        {/* Hero text — top left */}
        <div style={{
          position: 'absolute', top: '30%', left: '3.5rem',
          zIndex: 2, maxWidth: '520px',
        }}>
          <h1 style={{
            color: '#fff', fontSize: '3.8rem', fontWeight: 900,
            lineHeight: 1.05, letterSpacing: '-2px', margin: '0 0 1.5rem',
            textShadow: '0 4px 20px rgba(0,0,0,0.3)',
          }}>
            Discover an<br />Amazing Store<br />Experience
          </h1>
          <button
            onClick={() => navigate('/stores')}
            style={{
              padding: '0.7rem 1.6rem', borderRadius: '30px',
              background: '#fff', color: '#1e293b', border: 'none',
              fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
              transition: 'transform 0.2s',
            }}
            onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.03)'; }}
            onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
          >
            Get in Touch ↗
          </button>
        </div>

        {/* Bottom right description text */}
        <div style={{
          position: 'absolute', bottom: '5rem', right: '3.5rem',
          maxWidth: '380px', zIndex: 2,
        }}>
          <p style={{
            color: 'rgba(255,255,255,0.85)', fontSize: '0.82rem',
            lineHeight: 1.65, textShadow: '0 1px 4px rgba(0,0,0,0.3)',
          }}>
            Explore The Best Stores And Connect With Real Reviews. Experience Premium Shopping And Rate Your Favorites — All In One Platform.
          </p>
        </div>

        {/* Bottom category tags */}
        <div style={{
          position: 'absolute', bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)',
          display: 'flex', gap: '0.6rem', zIndex: 2,
        }}>
          {['Fashion', 'Electronics', 'Food', 'Lifestyle'].map((tag) => (
            <span key={tag} style={{
              padding: '0.45rem 1.2rem', borderRadius: '20px',
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.25)',
              color: '#fff', fontSize: '0.78rem', fontWeight: 500,
            }}>{tag}</span>
          ))}
        </div>

        {/* Carousel dots (decorative) */}
        <div style={{
          position: 'absolute', bottom: '1.75rem', left: '3.5rem',
          display: 'flex', gap: '0.4rem', zIndex: 2,
        }}>
          <div style={{ width: '24px', height: '4px', borderRadius: '2px', background: '#fff' }} />
          <div style={{ width: '8px', height: '4px', borderRadius: '2px', background: 'rgba(255,255,255,0.4)' }} />
          <div style={{ width: '8px', height: '4px', borderRadius: '2px', background: 'rgba(255,255,255,0.4)' }} />
        </div>
      </div>


      {/* ═══════════════ SECTION 3: ACTION CARDS ═══════════════ */}
      <div style={{
        width: '96%', margin: '0 auto 2rem',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.4rem', letterSpacing: '-0.5px' }}>
              Explore What's Next
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.85rem', maxWidth: '450px', lineHeight: 1.5 }}>
              Browse stores with curated reviews, explore ratings, and find the best experiences near you.
            </p>
          </div>
          <button
            onClick={() => navigate('/stores')}
            style={{
              padding: '0.55rem 1.4rem', borderRadius: '20px', border: '1.5px solid #1e293b',
              background: '#fff', color: '#1e293b', fontWeight: 600, fontSize: '0.82rem',
              cursor: 'pointer', transition: 'all 0.2s',
            }}
            onMouseOver={(e) => { e.currentTarget.style.background = '#1e293b'; e.currentTarget.style.color = '#fff'; }}
            onMouseOut={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#1e293b'; }}
          >
            Learn more →
          </button>
        </div>

        <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
          {/* Dashboard card — admin / owner only */}
          {user.role !== 'NORMAL' && (
            <div onClick={() => navigate(getDashboardPath())} style={{
              flex: '1 1 280px', maxWidth: '360px', height: '220px',
              borderRadius: '20px', overflow: 'hidden', position: 'relative', cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              transition: 'transform 0.25s, box-shadow 0.25s',
            }}
              onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.14)'; }}
              onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)'; }}
            >
              <div style={{ position: 'absolute', inset: 0 }}>
                {/* Placeholder image — replace src with your own dashboard card image */}
                <img src="/dashboard.jpg" alt="Dashboard" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.55))' }} />
              </div>
              <div style={{ position: 'relative', zIndex: 1, padding: '1.5rem', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontSize: '0.7rem', background: 'rgba(255,255,255,0.15)', padding: '0.25rem 0.6rem', borderRadius: '8px', color: 'rgba(255,255,255,0.7)' }}>
                    {user.role === 'ADMIN' ? 'Admin' : 'Owner'}
                  </span>
                  <h3 style={{ color: '#fff', fontSize: '1.35rem', fontWeight: 800, marginTop: '0.6rem' }}>Dashboard</h3>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', margin: 0 }}>Manage your workspace</p>
                  <span style={{ background: 'rgba(255,255,255,0.15)', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.9rem' }}>↗</span>
                </div>
              </div>
            </div>
          )}

          {/* Browse Stores card */}
          <div onClick={() => navigate('/stores')} style={{
            flex: '1 1 280px', maxWidth: '360px', height: '220px',
            borderRadius: '20px', overflow: 'hidden', position: 'relative', cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            transition: 'transform 0.25s, box-shadow 0.25s',
          }}
            onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.14)'; }}
            onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)'; }}
          >
            <img src="/stores.jfif" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.55))' }} />
            <div style={{ position: 'relative', zIndex: 1, padding: '1.5rem', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '0.7rem', background: 'rgba(255,255,255,0.2)', padding: '0.25rem 0.6rem', borderRadius: '8px', color: 'rgba(255,255,255,0.85)' }}>
                  Explore
                </span>
                <h3 style={{ color: '#fff', fontSize: '1.35rem', fontWeight: 800, marginTop: '0.6rem' }}>Browse Stores</h3>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.8rem', margin: 0 }}>Explore & rate stores</p>
                <span style={{ background: 'rgba(255,255,255,0.2)', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.9rem' }}>↗</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default LandingPage;
