import React, { useEffect, useState } from 'react';
import { useOrbit } from '../../context/OrbitContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, RotateCcw, X } from 'lucide-react';

const ToastItem = ({ toast, onUndo, onClose }) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!toast.duration || toast.duration <= 0) return;
    const intervalTime = 50;
    const step = (intervalTime / toast.duration) * 100;

    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev <= step) {
          clearInterval(timer);
          return 0;
        }
        return prev - step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [toast.duration]);

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle2 size={18} color="var(--success-500)" />;
      case 'warning':
        return <AlertTriangle size={18} color="var(--warning-500)" />;
      case 'error':
        return <AlertCircle size={18} color="var(--error-500)" />;
      default:
        return <Info size={18} color="var(--info-500)" />;
    }
  };

  return (
    <div
      className="glass-panel"
      style={{
        width: '360px',
        padding: '12px 14px',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--neu-raised)',
        border: '1px solid var(--glass-border)',
        position: 'relative',
        overflow: 'hidden',
        animation: 'slideInToast 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
        <div style={{ marginTop: '2px', flexShrink: 0 }}>
          {getIcon()}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: '13px',
            fontWeight: 600,
            color: 'var(--ink-900)',
            lineHeight: 1.3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <span>{toast.title}</span>
          </div>

          {toast.message && (
            <div style={{
              fontSize: '12px',
              color: 'var(--ink-700)',
              marginTop: '3px',
              lineHeight: 1.4
            }}>
              {toast.message}
            </div>
          )}

          {toast.undoAction && (
            <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={() => onUndo(toast.id)}
                className="btn-primary"
                style={{
                  padding: '4px 10px',
                  fontSize: '11px',
                  fontWeight: 600,
                  borderRadius: 'var(--radius-sm)',
                  boxShadow: 'none'
                }}
              >
                <RotateCcw size={12} />
                <span>Undo (5s)</span>
              </button>
              <span className="body-small" style={{ fontSize: '11px' }}>
                Optimistic change active
              </span>
            </div>
          )}
        </div>

        <button
          onClick={() => onClose(toast.id)}
          className="btn-ghost"
          style={{ padding: '3px', borderRadius: 'var(--radius-sm)', color: 'var(--ink-500)' }}
          title="Dismiss"
        >
          <X size={14} />
        </button>
      </div>

      {/* Progress Bar for Auto-dismiss */}
      {toast.duration > 0 && (
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: 'var(--border-subtle)'
        }}>
          <div
            style={{
              height: '100%',
              width: `${progress}%`,
              backgroundColor: toast.undoAction ? 'var(--brand-gold)' : 'var(--info-500)',
              transition: 'width 0.05s linear'
            }}
          />
        </div>
      )}
    </div>
  );
};

export const ToastContainer = () => {
  const { toasts, removeToast, triggerUndo } = useOrbit();

  if (toasts.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        zIndex: 9999,
        pointerEvents: 'auto'
      }}
    >
      {toasts.map(toast => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onUndo={triggerUndo}
          onClose={removeToast}
        />
      ))}
    </div>
  );
};
