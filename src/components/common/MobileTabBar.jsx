import React, { useRef, useState } from 'react';
import { useOrbit } from '../../context/OrbitContext';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Receipt,
  Share2
} from 'lucide-react';

export const MobileTabBar = () => {
  const { activeView, setActiveView, orders, inventory, channels } = useOrbit();
  const dockRef = useRef(null);
  const [pointerX, setPointerX] = useState(null);
  const [isInteracting, setIsInteracting] = useState(false);

  const ordersInProgress = orders.filter(o => ['placed', 'packed'].includes(o.status)).length;
  const lowStockCount = inventory.filter(i => (Number(i.totalAvailable) || 0) <= (Number(i.threshold) || 0)).length;
  const activeChannelsCount = channels.filter(c => c.status === 'connected').length;

  const TABS = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    {
      id: 'orders',
      label: 'Orders',
      icon: ShoppingBag,
      badge: ordersInProgress > 0 ? ordersInProgress : null,
      badgeColor: 'var(--warning-500)'
    },
    {
      id: 'inventory',
      label: 'Stock',
      icon: Package,
      badge: lowStockCount > 0 ? lowStockCount : null,
      badgeColor: 'var(--error-500)'
    },
    { id: 'accounting', label: 'Finance', icon: Receipt },
    {
      id: 'channels',
      label: 'Channels',
      icon: Share2,
      badge: activeChannelsCount > 0 ? `${activeChannelsCount}` : null,
      badgeColor: 'var(--success-500)'
    }
  ];

  // Magnetic proximity tracking for cursor and touch glide
  const handlePointerMove = (e) => {
    if (!dockRef.current) return;
    const rect = dockRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    setPointerX(clientX - rect.left);
    setIsInteracting(true);
  };

  const handlePointerLeave = () => {
    setPointerX(null);
    setIsInteracting(false);
  };

  return (
    <div className="dynamic-island-dock-container">
      <nav
        ref={dockRef}
        onMouseMove={handlePointerMove}
        onMouseLeave={handlePointerLeave}
        onTouchMove={handlePointerMove}
        onTouchEnd={handlePointerLeave}
        onTouchCancel={handlePointerLeave}
        className="dynamic-island-dock"
        aria-label="Dynamic Island Navigation Dock"
      >
        <div className="dynamic-island-track">
          {TABS.map((tab, idx) => {
            const Icon = tab.icon;
            const isActive = activeView === tab.id;

            // Proximity calculation for magnetic magnification
            let scale = 1;
            let translateY = 0;
            let magneticX = 0;

            if (pointerX !== null && dockRef.current) {
              const dockWidth = dockRef.current.offsetWidth;
              const approxItemWidth = dockWidth / TABS.length;
              const itemCenterX = (idx + 0.5) * approxItemWidth;
              const dist = Math.abs(pointerX - itemCenterX);
              const maxDist = approxItemWidth * 1.35;

              if (dist < maxDist) {
                const proximity = Math.cos((dist / maxDist) * (Math.PI / 2));
                scale = 1 + 0.18 * proximity;
                translateY = -5 * proximity;
                magneticX = ((pointerX - itemCenterX) / maxDist) * 3 * proximity;
              }
            }

            return (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id)}
                className={`island-tab ${isActive ? 'island-tab-active' : 'island-tab-inactive'}`}
                style={{
                  transform: `scale(${scale}) translateY(${translateY}px) translateX(${magneticX}px)`,
                  transition: isInteracting
                    ? 'transform 0.08s cubic-bezier(0.2, 0.8, 0.4, 1), background-color 0.25s ease, width 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)'
                    : 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), background-color 0.25s ease, width 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
                }}
                title={tab.label}
              >
                {/* Active Tab Glow Pill */}
                {isActive && <div className="island-active-glow" />}

                {/* Tab Icon with notification badge */}
                <div className="island-icon-box">
                  <Icon
                    size={isActive ? 19 : 18}
                    strokeWidth={isActive ? 2.4 : 1.8}
                    color={isActive ? 'var(--brand-gold)' : 'var(--ink-500)'}
                    className="island-icon"
                  />

                  {tab.badge && (
                    <span
                      className="island-badge"
                      style={{ backgroundColor: tab.badgeColor || 'var(--error-500)' }}
                    >
                      {tab.badge}
                    </span>
                  )}
                </div>

                {/* Expanded Label (Visible when active) */}
                <div className={`island-label-wrapper ${isActive ? 'expanded' : ''}`}>
                  <span className="island-label">
                    {tab.label}
                  </span>
                </div>

                {/* Subtle Active Indicator Dot */}
                {isActive && <span className="island-active-spark" />}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
