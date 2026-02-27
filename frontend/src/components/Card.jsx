// src/components/Card.jsx
import React, { useState } from 'react';

export default function Card({
  children,
  onClick,
  accent = 'cyan',   // 'cyan' | 'purple' | 'green'
  style = {},
  hoverable = false,
}) {
  const [hovered, setHovered] = useState(false);

  const accentMap = {
    cyan:   { color: '#00d4ff', bg: 'rgba(0,212,255,0.08)',   border: 'rgba(0,212,255,0.2)' },
    purple: { color: '#9b5de5', bg: 'rgba(124,58,237,0.1)',   border: 'rgba(124,58,237,0.25)' },
    green:  { color: '#00e5a0', bg: 'rgba(0,229,160,0.08)',   border: 'rgba(0,229,160,0.2)' },
  };

  const a = accentMap[accent];
  const isClickable = !!onClick || hoverable;

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered && isClickable
          ? `linear-gradient(145deg, ${a.bg}, #131628)`
          : '#131628',
        border: `1px solid ${hovered && isClickable ? a.border : 'rgba(255,255,255,0.07)'}`,
        borderRadius: '20px',
        padding: '2rem 1.75rem',
        cursor: isClickable ? 'pointer' : 'default',
        transition: 'all 0.25s cubic-bezier(0.16,1,0.3,1)',
        transform: hovered && isClickable ? 'translateY(-4px)' : 'none',
        boxShadow: hovered && isClickable ? `0 12px 40px ${a.bg}` : 'none',
        ...style,
      }}
    >
      {children}
    </div>
  );
}
