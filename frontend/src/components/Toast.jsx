// src/components/Toast.jsx
// Lightweight self-contained toast system (no external lib needed)
import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

let toastId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const toast = {
    success: (msg) => addToast(msg, 'success'),
    error:   (msg) => addToast(msg, 'error'),
    info:    (msg) => addToast(msg, 'info'),
  };

  const typeStyles = {
    success: { bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.3)', icon: '✅', color: '#34d399' },
    error:   { bg: 'rgba(239,68,68,0.12)',  border: 'rgba(239,68,68,0.3)',  icon: '❌', color: '#f87171' },
    info:    { bg: 'rgba(0,212,255,0.1)',   border: 'rgba(0,212,255,0.25)', icon: 'ℹ️', color: '#67e8f9' },
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {/* Toast container */}
      <div style={{
        position: 'fixed',
        bottom: '1.5rem',
        right: '1.5rem',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.6rem',
        maxWidth: '380px',
        width: '100%',
      }}>
        {toasts.map((t) => {
          const s = typeStyles[t.type];
          return (
            <div key={t.id} style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.6rem',
              padding: '0.85rem 1.1rem',
              background: s.bg,
              border: `1px solid ${s.border}`,
              borderRadius: '12px',
              backdropFilter: 'blur(12px)',
              color: '#eef0f8',
              fontSize: '0.88rem',
              fontFamily: "'Sora', sans-serif",
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              animation: 'toastIn 0.3s cubic-bezier(0.16,1,0.3,1) both',
            }}>
              <span style={{ fontSize: '1rem', flexShrink: 0 }}>{s.icon}</span>
              <span style={{ lineHeight: 1.45 }}>{t.message}</span>
            </div>
          );
        })}
      </div>
      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateY(12px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside ToastProvider');
  return ctx;
}
