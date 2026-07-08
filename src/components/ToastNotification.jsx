import React, { useEffect, useState } from 'react';
import { CheckCircle, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

const ICONS = {
  success: <CheckCircle size={18} />,
  warning: <AlertTriangle size={18} />,
  danger:  <AlertCircle size={18} />,
  info:    <Info size={18} />,
};

const COLORS = {
  success: { bg: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.5)', icon: '#10b981', bar: '#10b981' },
  warning: { bg: 'rgba(245,158,11,0.15)',  border: 'rgba(245,158,11,0.5)',  icon: '#f59e0b', bar: '#f59e0b' },
  danger:  { bg: 'rgba(239,68,68,0.18)',   border: 'rgba(239,68,68,0.6)',   icon: '#ef4444', bar: '#ef4444' },
  info:    { bg: 'rgba(0,229,255,0.12)',   border: 'rgba(0,229,255,0.4)',   icon: '#00e5ff', bar: '#00e5ff' },
};

const DURATION = 4500; // ms

const SingleToast = ({ toast, onRemove }) => {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(100);
  const c = COLORS[toast.type] || COLORS.info;

  useEffect(() => {
    // Trigger entry animation
    const enterTimer = setTimeout(() => setVisible(true), 20);

    // Progress bar countdown
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, 100 - (elapsed / DURATION) * 100);
      setProgress(remaining);
    }, 50);

    // Auto-dismiss
    const dismissTimer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onRemove(toast.id), 350);
    }, DURATION);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(dismissTimer);
      clearInterval(interval);
    };
  }, [toast.id, onRemove]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => onRemove(toast.id), 350);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        background: c.bg,
        border: `1px solid ${c.border}`,
        borderRadius: '12px',
        padding: '14px 16px 8px',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        boxShadow: `0 8px 32px rgba(0,0,0,0.35), 0 0 0 1px ${c.border}`,
        minWidth: '300px',
        maxWidth: '380px',
        transform: visible ? 'translateX(0) scale(1)' : 'translateX(110%) scale(0.95)',
        opacity: visible ? 1 : 0,
        transition: 'all 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        willChange: 'transform, opacity',
        overflow: 'hidden',
      }}
    >
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '8px' }}>
        <span style={{ color: c.icon, flexShrink: 0, marginTop: '1px' }}>{ICONS[toast.type]}</span>
        <span style={{
          flex: 1,
          fontFamily: 'Outfit, sans-serif',
          fontSize: '0.9rem',
          fontWeight: 500,
          color: 'var(--text-main)',
          lineHeight: 1.45,
        }}>
          {toast.message}
        </span>
        <button
          onClick={handleClose}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-muted)',
            padding: '2px',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            transition: 'color 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--text-main)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          <X size={14} />
        </button>
      </div>

      {/* Progress bar */}
      <div style={{ height: '3px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${progress}%`,
          background: c.bar,
          borderRadius: '2px',
          transition: 'width 0.05s linear',
          boxShadow: `0 0 6px ${c.bar}`,
        }} />
      </div>
    </div>
  );
};

const ToastNotification = ({ toasts, removeToast }) => {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 999999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        pointerEvents: 'none',
      }}
    >
      {toasts.map(toast => (
        <div key={toast.id} style={{ pointerEvents: 'all' }}>
          <SingleToast toast={toast} onRemove={removeToast} />
        </div>
      ))}
    </div>
  );
};

export default ToastNotification;
