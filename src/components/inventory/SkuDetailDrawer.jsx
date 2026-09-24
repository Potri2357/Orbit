import React from 'react';
import { useOrbit } from '../../context/OrbitContext';
import {
  X,
  Package,
  Layers,
  TrendingDown,
  TrendingUp,
  History,
  AlertTriangle,
  Plus,
  RefreshCw,
  Clock,
  ArrowUpRight
} from 'lucide-react';

export const SkuDetailDrawer = () => {
  const { activeDrawer, setActiveDrawer, activePersona, addToast, updateSkuChannelStock } = useOrbit();

  if (!activeDrawer || activeDrawer.type !== 'sku' || !activeDrawer.data) return null;

  const sku = activeDrawer.data;
  const isLowStock = sku.totalAvailable <= sku.threshold;

  const handleQuickAdd = () => {
    updateSkuChannelStock(sku.id, 'pos', (sku.channels.pos || 0) + 10);
    addToast({
      type: 'success',
      title: 'Restock Quick Batch Added',
      message: `+10 units credited to ${sku.id} store stock.`,
      duration: 3500
    });
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(10, 10, 14, 0.5)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        zIndex: 999,
        display: 'flex',
        justifyContent: 'flex-end',
        animation: 'fadeIn 0.15s ease'
      }}
      onClick={() => setActiveDrawer(null)}
    >
      <div
        className="glass-panel orbit-drawer"
        style={{
          width: '520px',
          maxWidth: '92vw',
          height: '100%',
          borderRadius: '0',
          borderLeft: '1px solid var(--glass-border)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--glass-shadow)',
          background: 'var(--surface-raised)',
          animation: 'slideInRight 0.22s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="font-mono" style={{ fontSize: '16px', fontWeight: 700, color: 'var(--brand-gold)' }}>
              {sku.id}
            </span>
            <span className={`badge ${isLowStock ? 'badge-error' : 'badge-success'}`}>
              {isLowStock ? 'Low Stock Warning' : 'In Stock'}
            </span>
          </div>

          <button
            onClick={() => setActiveDrawer(null)}
            className="btn-ghost"
            style={{ padding: '6px', borderRadius: 'var(--radius-sm)' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Presence */}
        <div style={{
          padding: '8px 20px',
          background: 'var(--surface-sunken)',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '12px',
          color: 'var(--ink-700)'
        }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--brand-gold)', display: 'inline-block' }} />
          <span>Viewing product master audit & multi-channel allocation.</span>
        </div>

        {/* Scrollable Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Main Product Overview */}
          <div className="neu-card" style={{ padding: '16px', display: 'flex', gap: '16px' }}>
            <img
              src={sku.image}
              alt={sku.name}
              style={{ width: '84px', height: '84px', borderRadius: '10px', objectFit: 'cover' }}
            />
            <div style={{ flex: 1 }}>
              <h2 className="h2-title" style={{ fontSize: '16px', color: 'var(--ink-900)' }}>
                {sku.name}
              </h2>
              <div className="body-small" style={{ marginTop: '2px' }}>
                Category: <strong>{sku.category}</strong> • HSN: {sku.hsn} • GST: {sku.gstRate}%
              </div>
              <div style={{ display: 'flex', gap: '14px', marginTop: '10px', alignItems: 'baseline' }}>
                <span className="tabular-numbers" style={{ fontSize: '18px', fontWeight: 700, color: 'var(--ink-900)' }}>
                  ₹{sku.unitPrice.toLocaleString('en-IN')}
                </span>
                <span className="body-small font-mono">
                  Cost: ₹{sku.costPrice.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* Channel Stock Breakdown & Source of Truth */}
          <div className="neu-card" style={{ padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div className="label-caps">Stock Allocation by Channel</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                <span className="body-small">Total Available:</span>
                <span className="tabular-numbers" style={{
                  fontSize: '16px',
                  fontWeight: 700,
                  color: isLowStock ? 'var(--error-500)' : 'var(--ink-900)'
                }}>
                  {sku.totalAvailable}
                </span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
              <div className="neu-inset-container" style={{ padding: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span className="channel-dot shopify" />
                  <span style={{ fontSize: '12px', fontWeight: 600 }}>Shopify</span>
                </div>
                <div className="tabular-numbers" style={{ fontSize: '18px', fontWeight: 700, marginTop: '4px' }}>
                  {sku.channels.shopify} units
                </div>
              </div>

              <div className="neu-inset-container" style={{ padding: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span className="channel-dot instagram" />
                  <span style={{ fontSize: '12px', fontWeight: 600 }}>Instagram</span>
                </div>
                <div className="tabular-numbers" style={{ fontSize: '18px', fontWeight: 700, marginTop: '4px' }}>
                  {sku.channels.instagram} units
                </div>
              </div>

              <div className="neu-inset-container" style={{ padding: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span className="channel-dot marketplace" />
                  <span style={{ fontSize: '12px', fontWeight: 600 }}>Amazon / Mkt</span>
                </div>
                <div className="tabular-numbers" style={{ fontSize: '18px', fontWeight: 700, marginTop: '4px' }}>
                  {sku.channels.marketplace} units
                </div>
              </div>

              <div className="neu-inset-container" style={{ padding: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span className="channel-dot pos" />
                  <span style={{ fontSize: '12px', fontWeight: 600 }}>Retail Flagship</span>
                </div>
                <div className="tabular-numbers" style={{ fontSize: '18px', fontWeight: 700, marginTop: '4px' }}>
                  {sku.channels.pos} units
                </div>
              </div>
            </div>

            {/* Threshold Health Bar */}
            <div style={{ marginTop: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '6px' }}>
                <span style={{ color: 'var(--ink-500)' }}>Safety Reorder Threshold: {sku.threshold} units</span>
                <span style={{ color: isLowStock ? 'var(--error-500)' : 'var(--success-500)', fontWeight: 600 }}>
                  {sku.totalAvailable <= sku.threshold ? 'Critical Deficit' : 'Safe Stock'}
                </span>
              </div>
              <div style={{
                height: '6px',
                borderRadius: 'var(--radius-full)',
                background: 'var(--surface-sunken)',
                overflow: 'hidden'
              }}>
                <div style={{
                  height: '100%',
                  width: `${Math.min(100, (sku.totalAvailable / (sku.threshold * 2)) * 100)}%`,
                  background: isLowStock
                    ? 'linear-gradient(90deg, var(--error-500), var(--warning-500))'
                    : 'var(--success-500)'
                }} />
              </div>
            </div>
          </div>

          {/* Real-time Stock Movement Timeline (PRD §8.3) */}
          <div className="neu-card" style={{ padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <History size={16} color="var(--brand-gold)" />
              <h3 className="h3-title" style={{ fontSize: '14px' }}>Stock Movement Audit Timeline</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {sku.movements && sku.movements.map((m) => {
                const isPositive = m.delta > 0;
                let dotClass = 'shopify';
                if (m.channel === 'instagram') dotClass = 'instagram';
                if (m.channel === 'marketplace') dotClass = 'marketplace';
                if (m.channel === 'pos') dotClass = 'pos';

                return (
                  <div
                    key={m.id}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '10px',
                      padding: '8px 10px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--surface-sunken)'
                    }}
                  >
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: isPositive ? 'var(--success-subtle)' : 'var(--error-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: isPositive ? 'var(--success-500)' : 'var(--error-500)',
                      flexShrink: 0,
                      marginTop: '2px'
                    }}>
                      {isPositive ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink-900)' }}>
                          {m.reason}
                        </span>
                        <span className="tabular-numbers" style={{
                          fontWeight: 700,
                          fontSize: '13px',
                          color: isPositive ? 'var(--success-500)' : 'var(--error-500)'
                        }}>
                          {isPositive ? `+${m.delta}` : m.delta}
                        </span>
                      </div>

                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '11px',
                        color: 'var(--ink-500)',
                        marginTop: '2px'
                      }}>
                        <span className={`channel-dot ${dotClass}`} style={{ width: '6px', height: '6px' }} />
                        <span>{m.channel.toUpperCase()}</span>
                        <span>•</span>
                        <span>{m.staff}</span>
                        <span>•</span>
                        <span className="font-mono">{m.timestamp}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div style={{
          padding: '16px 20px',
          borderTop: '1px solid var(--border-subtle)',
          background: 'var(--surface-raised)',
          display: 'flex',
          gap: '10px'
        }}>
          <button
            onClick={handleQuickAdd}
            className="btn-primary"
            style={{ flex: 1, fontSize: '12px' }}
          >
            <Plus size={14} />
            <span>Intake Restock (+10)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
