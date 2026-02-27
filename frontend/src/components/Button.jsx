// src/components/Button.jsx
import React from 'react';
import Loader from './Loader';

const base = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  fontFamily: "'Sora', sans-serif",
  fontWeight: 600,
  fontSize: '0.92rem',
  border: 'none',
  borderRadius: '999px',
  cursor: 'pointer',
  transition: 'all 0.2s cubic-bezier(0.16,1,0.3,1)',
  padding: '0.72rem 1.6rem',
  textDecoration: 'none',
  whiteSpace: 'nowrap',
};

const variants = {
  primary: {
    background: '#00d4ff',
    color: '#000',
  },
  ghost: {
    background: 'transparent',
    color: '#eef0f8',
    border: '1px solid rgba(255,255,255,0.18)',
  },
  danger: {
    background: 'rgba(239,68,68,0.15)',
    color: '#f87171',
    border: '1px solid rgba(239,68,68,0.25)',
  },
  subtle: {
    background: 'rgba(0,212,255,0.1)',
    color: '#00d4ff',
    border: '1px solid rgba(0,212,255,0.25)',
  },
};

export default function Button({
  children,
  variant = 'primary',
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  style = {},
  as: Tag = 'button',
  ...rest
}) {
  const isDisabled = disabled || loading;

  const computedStyle = {
    ...base,
    ...variants[variant],
    opacity: isDisabled ? 0.55 : 1,
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    ...style,
  };

  return (
    <Tag
      type={Tag === 'button' ? type : undefined}
      style={computedStyle}
      disabled={Tag === 'button' ? isDisabled : undefined}
      onClick={isDisabled ? undefined : onClick}
      {...rest}
    >
      {loading ? <Loader text={typeof children === 'string' ? children : ''} /> : children}
    </Tag>
  );
}
