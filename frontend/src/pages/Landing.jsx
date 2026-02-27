// src/pages/Landing.jsx
import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';

/* ── Inline styles object ── */
const s = {
  root: {
    minHeight: '100vh',
    background: '#080a12',
    fontFamily: "'Sora', sans-serif",
    overflow: 'hidden',
    position: 'relative',
  },
  // Mesh gradient backdrop
  mesh: {
    position: 'fixed',
    inset: 0,
    zIndex: 0,
    background: `
      radial-gradient(ellipse 60% 50% at 70% 10%, rgba(124,58,237,0.18) 0%, transparent 60%),
      radial-gradient(ellipse 50% 60% at 10% 80%, rgba(0,212,255,0.14) 0%, transparent 60%),
      radial-gradient(ellipse 40% 40% at 50% 50%, rgba(0,0,0,0) 0%, #080a12 100%)
    `,
    pointerEvents: 'none',
  },
  gridOverlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 0,
    backgroundImage: `
      linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
    `,
    backgroundSize: '60px 60px',
    pointerEvents: 'none',
  },

  // Navbar
  nav: {
    position: 'relative',
    zIndex: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1.25rem 3rem',
  },
  brand: {
    display: 'flex', alignItems: 'center', gap: '0.6rem',
    fontWeight: 700, fontSize: '1rem', color: '#eef0f8',
    textDecoration: 'none', letterSpacing: '-0.01em',
  },
  logo: {
    width: 34, height: 34,
    background: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
    borderRadius: 9, display: 'flex', alignItems: 'center',
    justifyContent: 'center', fontSize: '1.05rem',
  },
  navLinks: {
    display: 'flex', alignItems: 'center', gap: '2rem', listStyle: 'none',
  },
  navLink: {
    textDecoration: 'none', fontSize: '0.875rem',
    fontWeight: 500, color: '#8892aa', transition: 'color 0.2s',
  },

  // Hero
  hero: {
    position: 'relative',
    zIndex: 2,
    maxWidth: '860px',
    margin: '0 auto',
    padding: '7rem 2rem 5rem',
    textAlign: 'center',
  },
  badge: {
    display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
    padding: '0.38rem 1rem',
    border: '1px solid rgba(0,212,255,0.25)',
    borderRadius: '999px',
    fontSize: '0.78rem', color: '#8892aa',
    background: 'rgba(0,212,255,0.06)',
    marginBottom: '2rem',
    animation: 'fadeUp 0.5s ease both',
  },
  headline: {
    fontSize: 'clamp(2.8rem, 6vw, 5rem)',
    fontWeight: 800,
    lineHeight: 1.08,
    letterSpacing: '-0.04em',
    marginBottom: '1.25rem',
    animation: 'fadeUp 0.5s 0.1s ease both',
  },
  accentWord: { color: '#00d4ff' },
  sub: {
    fontSize: '1.05rem',
    color: '#8892aa',
    lineHeight: 1.7,
    maxWidth: '520px',
    margin: '0 auto 2.5rem',
    fontWeight: 400,
    animation: 'fadeUp 0.5s 0.2s ease both',
  },
  ctaGroup: {
    display: 'flex', gap: '1rem', justifyContent: 'center',
    flexWrap: 'wrap',
    animation: 'fadeUp 0.5s 0.3s ease both',
  },

  // Cards section
  cardsSection: {
    position: 'relative', zIndex: 2,
    maxWidth: '900px', margin: '0 auto',
    padding: '0 2rem 6rem',
  },
  cardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '1.25rem',
  },
  cardIcon: {
    width: 56, height: 56, borderRadius: 14,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    marginBottom: '1.25rem',
    fontSize: '1.6rem',
  },
  cardTitle: {
    fontSize: '1.1rem', fontWeight: 700,
    marginBottom: '0.5rem', letterSpacing: '-0.01em',
  },
  cardDesc: {
    fontSize: '0.875rem', color: '#8892aa',
    lineHeight: 1.6, fontWeight: 400,
  },
  cardArrow: {
    marginTop: '1.25rem', fontSize: '0.82rem',
    color: '#4f566b', display: 'flex', alignItems: 'center', gap: '4px',
  },

  // Footer strip
  footer: {
    position: 'relative', zIndex: 2,
    textAlign: 'center', paddingBottom: '3rem',
    color: '#4f566b', fontSize: '0.8rem',
  },
};

const cards = [
  {
    route: '/connect',
    accent: 'cyan',
    icon: '🗄️',
    iconBg: 'rgba(0,212,255,0.1)',
    title: 'Auto-Schema',
    desc: 'Instant extraction from .sql or live MySQL. No manual setup.',
    arrow: 'Connect DB →',
  },
  {
    route: '/ask',
    accent: 'purple',
    icon: '✍️',
    iconBg: 'rgba(124,58,237,0.12)',
    title: 'Smart SQL',
    desc: 'Ask in plain English. Get complex JOINs and window functions.',
    arrow: 'Ask question →',
  },
  {
    route: '/results',
    accent: 'green',
    icon: '🧠',
    iconBg: 'rgba(0,229,160,0.1)',
    title: 'AI Analysis',
    desc: 'Step-by-step breakdown of every clause, JOIN type, and NULL behavior.',
    arrow: 'View results →',
  },
];

export default function Landing() {
  const navigate = useNavigate();
  const rootRef = useRef(null);

  // Subtle mouse parallax on orbs
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const onMove = (e) => {
      const x = (e.clientX / window.innerWidth  - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      el.style.setProperty('--mx', `${x}px`);
      el.style.setProperty('--my', `${y}px`);
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <div style={s.root} ref={rootRef}>
      <div style={s.mesh} />
      <div style={s.gridOverlay} />

      {/* Keyframes */}
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes floatOrb {
          0%, 100% { transform: translateY(0) scale(1); }
          50%       { transform: translateY(-18px) scale(1.05); }
        }
      `}</style>

      {/* ── Navbar ── */}
      <nav style={s.nav}>
        <div style={s.brand}>
          <div style={s.logo}>⚡</div>
          Smart SQL Generator
        </div>
        <ul style={s.navLinks}>
          <li><button onClick={() => navigate('/connect')} style={{ ...s.navLink, background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Sora', sans-serif" }}>Features</button></li>
          <li><button onClick={() => navigate('/connect')} style={{ ...s.navLink, background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Sora', sans-serif" }}>Connect</button></li>
        </ul>
        <Button variant="subtle" onClick={() => navigate('/connect')} style={{ fontSize: '0.83rem', padding: '0.4rem 1rem' }}>
          Get Started
        </Button>
      </nav>

      {/* ── Hero ── */}
      <section style={s.hero}>
        <div style={s.badge}>
          <span style={{ color: '#00d4ff' }}>⚡</span>
          Powered by Groq Llama 3.3 · FastAPI
        </div>

        <h1 style={s.headline}>
          Talk to your{' '}
          <span style={s.accentWord}>Data.</span>
        </h1>

        <p style={s.sub}>
          Upload your schema, ask questions in plain English, and get
          LeetCode-style SQL solutions with deep structural explanations.
        </p>

        <div style={s.ctaGroup}>
          <Button variant="primary" onClick={() => navigate('/connect')} style={{ fontSize: '0.95rem', padding: '0.8rem 2rem' }}>
            Start Generating
          </Button>
          <Button variant="ghost" onClick={() => navigate('/ask')} style={{ fontSize: '0.95rem', padding: '0.8rem 2rem' }}>
            View Demo
          </Button>
        </div>
      </section>

      {/* ── Feature Cards ── */}
      <section style={s.cardsSection}>
        <div style={s.cardsGrid}>
          {cards.map((c) => (
            <Card key={c.route} accent={c.accent} onClick={() => navigate(c.route)} hoverable>
              <div style={{ ...s.cardIcon, background: c.iconBg }}>
                {c.icon}
              </div>
              <div style={s.cardTitle}>{c.title}</div>
              <div style={s.cardDesc}>{c.desc}</div>
              <div style={s.cardArrow}>
                <span style={{ color: c.accent === 'cyan' ? '#00d4ff' : c.accent === 'purple' ? '#9b5de5' : '#00e5a0' }}>
                  {c.arrow}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <div style={s.footer}>
        Built with FastAPI · React · Groq LLM
      </div>
    </div>
  );
}
