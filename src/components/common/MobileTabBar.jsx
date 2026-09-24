import React from 'react';
import { useOrbit } from '../../context/OrbitContext';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Receipt,
  Menu
} from 'lucide-react';

export const MobileTabBar = ({ onOpenMenu }) => {
  const { activeView, setActiveView, orders, inventory } = useOrbit();

  const ordersInProgress = orders.filter(o => ['placed', 'packed'].includes(o.status)).length;
  const lowStockCount = inventory.filter(i => (Number(i.totalAvailable) || 0) <= (Number(i.threshold) || 0)).length;

  const TABS = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    {
      id: 'orders',
      label: 'Orders',
      icon: ShoppingBag,
      badge: ordersInProgress > 0 ? ordersInProgress : null
    },
    {
      id: 'inventory',
      label: 'Stock',
      icon: Package,
      badge: lowStockCount > 0 ? lowStockCount : null
    },
    { id: 'accounting', label: 'Finance', icon: Receipt }
  ];

  return (
    <nav
      className="mobile-tab-bar glass-panel"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '62px',
        zIndex: 90,
        borderRadius: '0',
        borderTop: '1px solid var(--border-medium)',
        display: 'none', // Overridden to flex in @media (max-width: 768px)
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: '0 4px',
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.12)',
        background: 'var(--surface-raised)'
      }}
    >
      {TABS.map(tab => {
        const Icon = tab.icon;
        const isActive = activeView === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => setActiveView(tab.id)}
            style={{
              background: 'transparent',
              border: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '3px',
              padding: '6px 10px',
              flex: 1,
              position: 'relative',
              cursor: 'pointer',
              color: isActive ? 'var(--brand-gold)' : 'var(--ink-500)',
              transition: 'color 0.15s ease'
            }}
          >
            <div style={{ position: 'relative' }}>
              <Icon size={20} strokeWidth={isActive ? 2.4 : 1.8} />
              {tab.badge && (
                <span style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-8px',
                  background: 'var(--error-500)',
                  color: '#FFFFFF',
                  fontSize: '9px',
                  fontWeight: 700,
                  padding: '1px 4px',
                  borderRadius: '10px',
                  lineHeight: 1
                }}>
                  {tab.badge}
                </span>
              )}
            </div>

            <span style={{
              fontSize: '11px',
              fontWeight: isActive ? 700 : 500
            }}>
              {tab.label}
            </span>

            {isActive && (
              <span style={{
                position: 'absolute',
                top: 0,
                width: '28px',
                height: '3px',
                background: 'var(--brand-gold)',
                borderRadius: '0 0 3px 3px'
              }} />
            )}
          </button>
        );
      })}

      {/* Menu / All Nav Tab */}
      <button
        onClick={onOpenMenu}
        style={{
          background: 'transparent',
          border: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '3px',
          padding: '6px 10px',
          flex: 1,
          position: 'relative',
          cursor: 'pointer',
          color: 'var(--ink-500)',
          transition: 'color 0.15s ease'
        }}
        title="Open Full Menu"
      >
        <Menu size={20} strokeWidth={1.8} />
        <span style={{ fontSize: '11px', fontWeight: 500 }}>Menu</span>
      </button>
    </nav>
  );
};
