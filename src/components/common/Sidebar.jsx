import React from 'react';
import { useOrbit } from '../../context/OrbitContext';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Receipt,
  Share2,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  Radio,
  AlertTriangle
} from 'lucide-react';

export const Sidebar = () => {
  const {
    activeView,
    setActiveView,
    sidebarCollapsed,
    setSidebarCollapsed,
    orders,
    inventory,
    channels,
    activePersona
  } = useOrbit();

  const ordersInProgress = orders.filter(o => ['placed', 'packed'].includes(o.status)).length;
  const lowStockCount = inventory.filter(i => i.totalAvailable <= i.threshold).length;

  const NAV_ITEMS = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    {
      id: 'orders',
      label: 'Orders',
      icon: ShoppingBag,
      badge: ordersInProgress > 0 ? ordersInProgress : null,
      badgeType: 'warning'
    },
    {
      id: 'inventory',
      label: 'Inventory',
      icon: Package,
      badge: lowStockCount > 0 ? lowStockCount : null,
      badgeType: 'error'
    },
    { id: 'accounting', label: 'Accounting', icon: Receipt },
    {
      id: 'channels',
      label: 'Channels',
      icon: Share2,
      badge: `${channels.filter(c => c.status === 'connected').length} Active`,
      badgeType: 'success'
    },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <aside
      className="glass-panel"
      style={{
        width: sidebarCollapsed ? '76px' : '240px',
        minWidth: sidebarCollapsed ? '76px' : '240px',
        margin: '12px 0 12px 16px',
        padding: '16px 10px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'width 0.25s cubic-bezier(0.16, 1, 0.3, 1), min-width 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        zIndex: 30,
        height: 'calc(100vh - 24px)',
        position: 'sticky',
        top: '12px'
      }}
    >
      <div>
        {/* Brand / Logo */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '4px 8px 16px 8px',
          borderBottom: '1px solid var(--border-subtle)',
          marginBottom: '16px'
        }}>
          {/* Logo Mark */}
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'var(--surface-sunken)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--neu-raised-sm)',
            border: '1px solid var(--brand-gold-border)',
            flexShrink: 0
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="var(--brand-gold)" strokeWidth="2" strokeDasharray="3 2" />
              <circle cx="12" cy="12" r="4.5" fill="var(--brand-gold)" />
              <circle cx="18" cy="8" r="2.2" fill="#F2E782" />
            </svg>
          </div>

          {!sidebarCollapsed && (
            <div style={{ overflow: 'hidden' }}>
              <div style={{
                fontSize: '17px',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                color: 'var(--ink-900)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                Orbit
                <span style={{
                  fontSize: '9px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  background: 'var(--brand-gold-subtle)',
                  color: 'var(--brand-gold)',
                  padding: '2px 5px',
                  borderRadius: '4px',
                  border: '1px solid var(--brand-gold-border)'
                }}>
                  D2C
                </span>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--ink-500)', whiteSpace: 'nowrap' }}>
                Aura Studios • Ops
              </div>
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={isActive ? 'btn-primary' : 'btn-ghost'}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: sidebarCollapsed ? '10px' : '9px 12px',
                  borderRadius: 'var(--radius-md)',
                  width: '100%',
                  justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                  position: 'relative',
                  background: isActive ? 'var(--brand-gold)' : 'transparent',
                  color: isActive ? '#14141A' : 'var(--ink-700)',
                  boxShadow: isActive ? '0 2px 8px rgba(217, 167, 46, 0.35)' : 'none',
                  transition: 'all 0.15s ease'
                }}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <Icon size={18} strokeWidth={isActive ? 2.2 : 1.8} />

                {!sidebarCollapsed && (
                  <span style={{
                    fontSize: '13px',
                    fontWeight: isActive ? 600 : 500,
                    flex: 1,
                    textAlign: 'left'
                  }}>
                    {item.label}
                  </span>
                )}

                {!sidebarCollapsed && item.badge && (
                  <span
                    className={`badge badge-${item.badgeType}`}
                    style={{
                      fontSize: '10px',
                      padding: '1px 6px',
                      fontWeight: 700
                    }}
                  >
                    {item.badge}
                  </span>
                )}

                {sidebarCollapsed && item.badge && (
                  <span style={{
                    position: 'absolute',
                    top: '4px',
                    right: '4px',
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    backgroundColor: item.badgeType === 'error' ? 'var(--error-500)' : 'var(--warning-500)'
                  }} />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Area: Channel Status Strip & Collapse Toggle */}
      <div>
        {/* Channel Health Mini Indicator */}
        {!sidebarCollapsed ? (
          <div
            className="neu-inset-container"
            style={{
              padding: '10px',
              marginBottom: '10px',
              fontSize: '11px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="label-caps" style={{ fontSize: '10px' }}>Channels Realtime</span>
              <span style={{ color: 'var(--success-500)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span className="channel-dot shopify" style={{ width: '6px', height: '6px' }} />
                4 / 4 Live
              </span>
            </div>

            <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
              <span className="channel-pill shopify" style={{ fontSize: '9px', padding: '1px 5px' }}>Shopify</span>
              <span className="channel-pill instagram" style={{ fontSize: '9px', padding: '1px 5px' }}>IG</span>
              <span className="channel-pill marketplace" style={{ fontSize: '9px', padding: '1px 5px' }}>Mkt</span>
              <span className="channel-pill pos" style={{ fontSize: '9px', padding: '1px 5px' }}>POS</span>
            </div>
          </div>
        ) : null}

        {/* User Presence & Collapse Button */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: sidebarCollapsed ? 'center' : 'space-between',
          paddingTop: '8px',
          borderTop: '1px solid var(--border-subtle)'
        }}>
          {!sidebarCollapsed && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
              <div style={{ position: 'relative' }}>
                <img
                  src={activePersona.avatar}
                  alt={activePersona.name}
                  style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <span style={{
                  position: 'absolute',
                  bottom: '-1px',
                  right: '-1px',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: 'var(--success-500)',
                  border: '1.5px solid var(--surface-raised)'
                }} />
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--ink-900)', whiteSpace: 'nowrap' }}>
                  {activePersona.name}
                </div>
                <div style={{ fontSize: '10px', color: 'var(--ink-500)' }}>
                  {activePersona.role.split('/')[0]}
                </div>
              </div>
            </div>
          )}

          <button
            onClick={() => setSidebarCollapsed(prev => !prev)}
            className="btn-ghost"
            style={{ padding: '6px', borderRadius: 'var(--radius-sm)' }}
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>
      </div>
    </aside>
  );
};
