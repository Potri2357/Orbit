import React, { useState } from 'react';
import { useOrbit } from '../../context/OrbitContext';
import {
  TrendingUp,
  ShoppingBag,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Zap,
  Package,
  Layers,
  ExternalLink
} from 'lucide-react';

export const DashboardView = () => {
  const {
    orders,
    inventory,
    channels,
    activities,
    simulateIncomingSale,
    setActiveView,
    setActiveDrawer,
    lastLivePulse
  } = useOrbit();



  // Metrics with explicit numeric casting
  const totalRevenueToday = channels.reduce((sum, c) => sum + (Number(c.revenueToday) || 0), 0);
  const ordersInProgress = orders.filter(o => ['placed', 'packed'].includes(o.status)).length;
  const lowStockItems = inventory.filter(i => (Number(i.totalAvailable) || 0) <= (Number(i.threshold) || 0));
  const pendingFulfillmentAmount = orders
    .filter(o => ['placed', 'packed'].includes(o.status))
    .reduce((sum, o) => sum + (Number(o.total) || 0), 0);

  // Channel breakdown calculation
  const totalChannelOrders = channels.reduce((sum, c) => sum + (Number(c.ordersToday) || 0), 0) || 1;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Welcome Banner / Overview */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 className="h1-title" style={{ color: 'var(--ink-900)' }}>
            Operations Command Center
          </h1>
          <p className="body-small" style={{ marginTop: '2px', fontSize: '13px' }}>
            Aura Studios • Live inventory synchronization across 4 active commerce channels
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setActiveView('orders')}
            className="btn-secondary"
            style={{ fontSize: '13px' }}
          >
            <ShoppingBag size={15} />
            <span>View All Orders</span>
          </button>
          <button
            onClick={simulateIncomingSale}
            className="btn-primary"
            style={{ fontSize: '13px' }}
          >
            <Zap size={15} />
            <span>Simulate Live Order</span>
          </button>
        </div>
      </div>



      {/* Top Row: 4 Live KPI Cards (PRD §8.1) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '16px'
      }}>
        {/* KPI 1: Today's Revenue */}
        <div className="neu-card flash-updated" key={`rev-${lastLivePulse}`} style={{ padding: '20px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span className="label-caps">Today's Revenue</span>
            <div className="pulse-indicator">
              <span className="pulse-dot" />
              <span className="pulse-ring" />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '10px' }}>
            <span className="display-title tabular-numbers" style={{ fontSize: '32px', color: 'var(--ink-900)' }}>
              ₹{totalRevenueToday.toLocaleString('en-IN')}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--success-500)', fontSize: '12px', fontWeight: 600 }}>
              <ArrowUpRight size={14} />
              <span>+18.4% vs yesterday</span>
            </div>

            {/* Sparkline SVG */}
            <svg width="68" height="24" viewBox="0 0 68 24" fill="none">
              <path
                d="M2 18 L14 14 L26 19 L38 10 L50 12 L66 3"
                stroke="var(--brand-gold)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* KPI 2: Orders in Progress */}
        <div className="neu-card" style={{ padding: '20px', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span className="label-caps">Orders In Progress</span>
            <span className="badge badge-info" style={{ fontSize: '11px' }}>Active</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '10px' }}>
            <span className="display-title tabular-numbers" style={{ fontSize: '32px', color: 'var(--ink-900)' }}>
              {ordersInProgress}
            </span>
            <span className="body-small">parcels</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '14px' }}>
            <span className="body-small" style={{ fontSize: '12px' }}>
              {orders.filter(o => o.status === 'placed').length} Placed • {orders.filter(o => o.status === 'packed').length} Packed
            </span>

            {/* Sparkline */}
            <svg width="68" height="24" viewBox="0 0 68 24" fill="none">
              <path
                d="M2 12 L16 16 L30 8 L44 14 L56 6 L66 10"
                stroke="var(--info-500)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* KPI 3: Low-Stock Alerts */}
        <div
          className="neu-card"
          onClick={() => setActiveView('inventory')}
          style={{
            padding: '20px',
            position: 'relative',
            cursor: 'pointer',
            border: lowStockItems.length > 0 ? '1px solid var(--warning-border)' : '1px solid var(--border-subtle)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span className="label-caps">Low-Stock Alerts</span>
            <span className={`badge ${lowStockItems.length > 0 ? 'badge-error' : 'badge-success'}`}>
              <AlertTriangle size={12} />
              {lowStockItems.length > 0 ? 'Risk of Oversell' : 'Optimal'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '10px' }}>
            <span className="display-title tabular-numbers" style={{ fontSize: '32px', color: lowStockItems.length > 0 ? 'var(--error-500)' : 'var(--ink-900)' }}>
              {lowStockItems.length}
            </span>
            <span className="body-small">SKUs below safety limit</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '14px' }}>
            <span className="body-small" style={{ color: 'var(--ink-700)', fontSize: '12px' }}>
              {lowStockItems.map(i => i.id).join(', ') || 'No critical shortages'}
            </span>
            <span style={{ fontSize: '11px', color: 'var(--brand-gold)', fontWeight: 600 }}>Manage →</span>
          </div>
        </div>

        {/* KPI 4: Pending Fulfillment */}
        <div className="neu-card" style={{ padding: '20px', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span className="label-caps">Pending Fulfillment</span>
            <span className="badge badge-gold" style={{ fontSize: '11px' }}>Avg 18m pick</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '10px' }}>
            <span className="display-title tabular-numbers" style={{ fontSize: '32px', color: 'var(--ink-900)' }}>
              ₹{pendingFulfillmentAmount.toLocaleString('en-IN')}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--ink-500)', fontSize: '12px' }}>
              <Clock size={13} />
              <span>Target: dispatch by 2:00 PM</span>
            </div>

            <svg width="68" height="24" viewBox="0 0 68 24" fill="none">
              <path
                d="M2 20 L16 12 L30 15 L44 9 L58 11 L66 4"
                stroke="var(--success-500)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Main Grid: Channel Breakdown Chart & Activity Feed */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1.6fr) minmax(0, 1fr)',
        gap: '20px'
      }}>
        {/* Left: Channel Performance & Stock Distribution */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Channel Orders Stacked Bar Breakdown (PRD §8.1) */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h2 className="h2-title">Today's Orders by Channel</h2>
                <div className="body-small">Aggregated real-time volume across distributed stores</div>
              </div>
              <span className="badge badge-neutral tabular-numbers font-mono">
                {totalChannelOrders} Total Orders
              </span>
            </div>

            {/* Thin Accent Stacked Bar (PRD: "using the channel identity colors as thin accent bars, not full fills") */}
            <div style={{
              height: '10px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--surface-sunken)',
              overflow: 'hidden',
              display: 'flex',
              gap: '2px',
              padding: '2px',
              boxShadow: 'var(--neu-inset)'
            }}>
              {channels.map(channel => {
                const pct = (channel.ordersToday / totalChannelOrders) * 100;
                let bg = 'var(--channel-shopify)';
                if (channel.id === 'instagram') bg = 'var(--channel-instagram)';
                if (channel.id === 'marketplace') bg = 'var(--channel-marketplace)';
                if (channel.id === 'pos') bg = 'var(--channel-pos)';

                return (
                  <div
                    key={channel.id}
                    title={`${channel.name}: ${channel.ordersToday} orders (${Math.round(pct)}%)`}
                    style={{
                      width: `${pct}%`,
                      backgroundColor: bg,
                      borderRadius: 'var(--radius-full)',
                      transition: 'width 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                  />
                );
              })}
            </div>

            {/* Channel Metrics Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '12px',
              marginTop: '20px'
            }}>
              {channels.map(channel => {
                let dotClass = 'shopify';
                if (channel.id === 'instagram') dotClass = 'instagram';
                if (channel.id === 'marketplace') dotClass = 'marketplace';
                if (channel.id === 'pos') dotClass = 'pos';

                return (
                  <div
                    key={channel.id}
                    className="neu-inset-container"
                    style={{
                      padding: '12px 14px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className={`channel-dot ${dotClass}`} />
                        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink-900)' }}>
                          {channel.name}
                        </span>
                      </div>
                      <span className="body-small font-mono" style={{ fontSize: '11px' }}>
                        {channel.latency}
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '4px' }}>
                      <span className="tabular-numbers" style={{ fontSize: '18px', fontWeight: 700, color: 'var(--ink-900)' }}>
                        ₹{channel.revenueToday.toLocaleString('en-IN')}
                      </span>
                      <span className="body-small tabular-numbers">
                        {channel.ordersToday} orders
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Critical Stock Warning Panel */}
          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Package size={18} color="var(--warning-500)" />
                <h3 className="h3-title">Inventory Risk Monitor</h3>
              </div>
              <button
                onClick={() => setActiveView('inventory')}
                className="btn-ghost"
                style={{ fontSize: '12px', color: 'var(--brand-gold)', fontWeight: 600 }}
              >
                Stock Matrix →
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {inventory.slice(0, 3).map(item => {
                const ratio = Math.min(100, Math.round((item.totalAvailable / (item.threshold * 2)) * 100));
                const isCritical = item.totalAvailable <= item.threshold;

                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      setActiveView('inventory');
                      setActiveDrawer({ type: 'sku', data: item });
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--surface-raised)',
                      border: '1px solid var(--border-subtle)',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{ width: '36px', height: '36px', borderRadius: '6px', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink-900)' }}>
                          {item.name}
                        </div>
                        <div className="body-small font-mono">
                          {item.id} • {item.category}
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div className="tabular-numbers" style={{
                        fontSize: '15px',
                        fontWeight: 700,
                        color: isCritical ? 'var(--error-500)' : 'var(--ink-900)'
                      }}>
                        {item.totalAvailable} left
                      </div>
                      <div className="body-small" style={{ fontSize: '11px' }}>
                        Min {item.threshold} limit
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Activity Feed (PRD §8.1) */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h2 className="h2-title">Live Activity Feed</h2>
              <div className="body-small">Real-time sync events, orders & dispatches</div>
            </div>
            <div className="pulse-indicator">
              <span className="pulse-dot" />
            </div>
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            flex: 1,
            overflowY: 'auto',
            maxHeight: '520px',
            paddingRight: '4px'
          }}>
            {activities.map((act) => {
              let dotClass = 'shopify';
              if (act.channel === 'instagram') dotClass = 'instagram';
              if (act.channel === 'marketplace') dotClass = 'marketplace';
              if (act.channel === 'pos') dotClass = 'pos';

              return (
                <div
                  key={act.id}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    paddingBottom: '12px',
                    borderBottom: '1px solid var(--border-subtle)'
                  }}
                >
                  <div style={{ marginTop: '5px' }}>
                    <span className={`channel-dot ${dotClass}`} style={{ width: '10px', height: '10px' }} />
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink-900)' }}>
                        {act.title}
                      </div>
                      <span className="body-small font-mono" style={{ fontSize: '11px', whiteSpace: 'nowrap' }}>
                        {act.time}
                      </span>
                    </div>

                    <div style={{ fontSize: '12px', color: 'var(--ink-700)', marginTop: '2px', lineHeight: 1.4 }}>
                      {act.description}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{
            marginTop: '16px',
            paddingTop: '12px',
            borderTop: '1px solid var(--border-subtle)',
            textAlign: 'center'
          }}>
            <button
              onClick={simulateIncomingSale}
              className="btn-ghost"
              style={{ width: '100%', fontSize: '12px', color: 'var(--brand-gold)', fontWeight: 600 }}
            >
              + Generate Test Event
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
