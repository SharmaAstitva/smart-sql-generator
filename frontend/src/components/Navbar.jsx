// src/components/Navbar.jsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Navbar() {
  const { isConnected, dbInfo } = useApp();
  const navigate = useNavigate();

  const linkStyle = ({ isActive }) => ({
    textDecoration: 'none',
    fontSize: '0.875rem',
    fontWeight: 500,
    color: isActive ? '#00d4ff' : '#8892aa',
    transition: 'color 0.2s',
    padding: '0.25rem 0',
    borderBottom: isActive ? '1px solid #00d4ff' : '1px solid transparent',
  });

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 2.5rem',
      height: '64px',
      background: 'rgba(8,10,18,0.8)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
    }}>
      {/* Brand */}
      <button
        onClick={() => navigate('/')}
        style={{
          display: 'flex', alignItems: 'center', gap: '0.6rem',
          background: 'none', border: 'none', cursor: 'pointer',
          fontFamily: "'Sora', sans-serif",
        }}
      >
        <div style={{
          width: 32, height: 32,
          background: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
          borderRadius: 8,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1rem',
        }}>⚡</div>
        <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#eef0f8', letterSpacing: '-0.01em' }}>
          Smart SQL
        </span>
      </button>

      {/* Nav links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <NavLink to="/connect"  style={linkStyle}>Connect</NavLink>
        <NavLink to="/ask"      style={linkStyle}>Ask</NavLink>
        <NavLink to="/results"  style={linkStyle}>Results</NavLink>
        <NavLink to="/practice" style={({ isActive }) => ({
          textDecoration: 'none',
          fontSize: '0.875rem',
          fontWeight: 600,
          color: isActive ? '#a78bfa' : '#8892aa',
          transition: 'color 0.2s',
          padding: '0.25rem 0',
          borderBottom: isActive ? '1px solid #a78bfa' : '1px solid transparent',
          display: 'flex',
          alignItems: 'center',
          gap: '0.3rem',
        })}>
          🎯 Practice
        </NavLink>
      </div>

      {/* DB status badge */}
      <div style={{ minWidth: '140px', display: 'flex', justifyContent: 'flex-end' }}>
        {isConnected && dbInfo ? (
          <span style={{
            fontSize: '0.78rem',
            padding: '0.3rem 0.85rem',
            borderRadius: '999px',
            background: 'rgba(0,229,160,0.1)',
            color: '#00e5a0',
            border: '1px solid rgba(0,229,160,0.25)',
            fontWeight: 500,
          }}>
            ● {dbInfo.database}
          </span>
        ) : (
          <span style={{
            fontSize: '0.78rem',
            padding: '0.3rem 0.85rem',
            borderRadius: '999px',
            background: 'rgba(255,255,255,0.04)',
            color: '#4f566b',
            border: '1px solid rgba(255,255,255,0.07)',
          }}>
            Not connected
          </span>
        )}
      </div>
    </nav>
  );
}
