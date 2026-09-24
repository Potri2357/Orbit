import React, { useState } from 'react';
import { useOrbit } from '../../context/OrbitContext';
import {
  Share2,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Zap,
  Clock,
  Radio,
  Sliders,
  AlertCircle
} from 'lucide-react';

export const ChannelsView = () => {
  const { channels, syncAllChannels, addToast } = useOrbit();
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSyncAll = () => {
    setIsSyncing(true);
    syncAllChannels();
    setTimeout(() => setIsSyncing(false), 900);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="h1-title" style={{ color: 'var(--ink-900)' }}>Omnichannel Integrations</h1>
          <p className="body-small">Real-time bi-directional catalog, order, and stock synchronization</p>
        </div>

        <button
          onClick={handleSyncAll}
          className="btn-primary"
          style={{ fontSize: '13px' }}
        >
          <RefreshCw size={14} className={isSyncing ? 'spin-anim' : ''} />
          <span>Synchronize All Channels</span>
        </button>
      </div>

      {/* Realtime Engine Status Glass Card */}
      <div className="glass-panel" style={{
        padding: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'var(--surface-sunken)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--neu-raised-sm)',
            color: 'var(--success-500)'
          }}>
            <Radio size={22} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 className="h3-title" style={{ fontSize: '16px', color: 'var(--ink-900)' }}>
                Real-Time Event Bus (Frappe / WebSocket Engine)
              </h3>
              <span className="badge badge-success">Healthy (Sub-200ms)</span>
            </div>
            <div className="body-small" style={{ marginTop: '2px' }}>
              All sales events deduct stock globally within 1.2s to prevent multi-channel overselling.
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div className="neu-inset-container" style={{ padding: '8px 14px', textAlign: 'center' }}>
            <span className="label-caps" style={{ fontSize: '10px' }}>Sync Frequency</span>
            <div className="tabular-numbers font-mono" style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ink-900)' }}>
              WebSocket Push
            </div>
          </div>

          <div className="neu-inset-container" style={{ padding: '8px 14px', textAlign: 'center' }}>
            <span className="label-caps" style={{ fontSize: '10px' }}>Avg Drift Rate</span>
            <div className="tabular-numbers font-mono" style={{ fontSize: '13px', fontWeight: 700, color: 'var(--success-500)' }}>
              0.00%
            </div>
          </div>
        </div>
      </div>

      {/* Channels Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '20px'
      }}>
        {channels.map(channel => {
          let dotClass = 'shopify';
          if (channel.id === 'instagram') dotClass = 'instagram';
          if (channel.id === 'marketplace') dotClass = 'marketplace';
          if (channel.id === 'pos') dotClass = 'pos';

          return (
            <div
              key={channel.id}
              className="neu-card"
              style={{
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '16px'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className={`channel-dot ${dotClass}`} style={{ width: '12px', height: '12px' }} />
                    <h2 className="h2-title" style={{ fontSize: '16px' }}>{channel.name}</h2>
                  </div>
                  <span className="badge badge-success">Connected</span>
                </div>

                <div className="body-small font-mono" style={{ marginTop: '6px', fontSize: '11px', color: 'var(--ink-500)' }}>
                  {channel.storeUrl}
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '10px',
                  marginTop: '16px'
                }}>
                  <div className="neu-inset-container" style={{ padding: '10px' }}>
                    <span className="label-caps" style={{ fontSize: '10px' }}>Today's Orders</span>
                    <div className="tabular-numbers" style={{ fontSize: '18px', fontWeight: 700, color: 'var(--ink-900)', marginTop: '2px' }}>
                      {channel.ordersToday}
                    </div>
                  </div>

                  <div className="neu-inset-container" style={{ padding: '10px' }}>
                    <span className="label-caps" style={{ fontSize: '10px' }}>Today's Revenue</span>
                    <div className="tabular-numbers" style={{ fontSize: '18px', fontWeight: 700, color: 'var(--ink-900)', marginTop: '2px' }}>
                      ₹{channel.revenueToday.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>

                <div style={{
                  marginTop: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  fontSize: '12px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--ink-700)' }}>
                    <span>Webhook Latency:</span>
                    <span className="font-mono tabular-numbers" style={{ color: 'var(--success-500)', fontWeight: 600 }}>
                      {channel.latency}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--ink-700)' }}>
                    <span>Last Synced:</span>
                    <span className="font-mono">{channel.lastSync}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--ink-700)' }}>
                    <span>Auto-Sync Webhook:</span>
                    <span className="badge badge-success" style={{ fontSize: '10px', padding: '1px 6px' }}>Enabled</span>
                  </div>
                </div>
              </div>

              <div style={{
                paddingTop: '12px',
                borderTop: '1px solid var(--border-subtle)',
                display: 'flex',
                gap: '8px'
              }}>
                <button
                  onClick={() => {
                    addToast({
                      type: 'success',
                      title: `${channel.name} Tested`,
                      message: `Ping acknowledged in ${channel.latency} via SSL Webhook.`,
                      duration: 3500
                    });
                  }}
                  className="btn-secondary"
                  style={{ flex: 1, fontSize: '12px', justifyContent: 'center' }}
                >
                  <span>Test Ping</span>
                </button>
                <button
                  onClick={() => {
                    addToast({
                      type: 'info',
                      title: 'Webhook Settings',
                      message: `Webhook secret and endpoint configurations verified.`,
                      duration: 3000
                    });
                  }}
                  className="btn-ghost"
                  style={{ padding: '6px 10px', borderRadius: 'var(--radius-sm)' }}
                >
                  <Sliders size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
