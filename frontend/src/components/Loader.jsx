// src/components/Loader.jsx
import React from 'react';

const styles = {
  wrap: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
  },
  spinner: {
    width: '18px',
    height: '18px',
    border: '2px solid rgba(255,255,255,0.15)',
    borderTopColor: '#00d4ff',
    borderRadius: '50%',
    animation: 'spin 0.65s linear infinite',
  },
};

// Inject keyframes once
if (typeof document !== 'undefined' && !document.getElementById('loader-styles')) {
  const s = document.createElement('style');
  s.id = 'loader-styles';
  s.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
  document.head.appendChild(s);
}

export default function Loader({ text = 'Loading...' }) {
  return (
    <span style={styles.wrap}>
      <span style={styles.spinner} aria-hidden="true" />
      {text && <span>{text}</span>}
    </span>
  );
}
