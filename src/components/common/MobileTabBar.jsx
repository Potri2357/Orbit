import React, { useRef, useState, useEffect } from 'react';
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
  const [isHovered, setIsHovered] = useState(false);

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

  // Magnetic cursor & touch tracking
  const handlePointerMove = (e) => {
    if (!dockRef.current) return;
    const rect = dockRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    setPointerX(clientX - rect.left);
    setIsHovered(true);
  };

  const handlePointerLeave = () => {
    setPointerX(null);
    setIsHovered(false);
  };

  return (
    <nav
      ref={dockRef}
      onMouseMove={handlePointerMove}
      onMouseLeave={handlePointerLeave}
      onTouchMove={handlePointerMove}
      onTouchEnd={handlePointerLeave}
      className="mobile-tab-bar bento-dock"
      aria-label="Mobile Navigation Dock"
    >
      <div className="bento-dock-inner">
        {TABS.map((tab, idx) => {
          const Icon = tab.icon;
          const isActive = activeView === tab.id;

          // Compute magnetic magnification based on pointer proximity
          let scale = 1;
          let translateY = 0;
          let magneticX = 0;

          if (pointerX !== null && dockRef.current) {
            const dockWidth = dockRef.current.offsetWidth;
            const itemWidth = dockWidth / TABS.length;
            const itemCenterX = (idx + 0.5) * itemWidth;
            const distance = Math.abs(pointerX - itemCenterX);
            const maxDistance = itemWidth * 1.5;

            if (distance < maxDistance) {
              const proximity = Math.cos((distance / maxDistance) * (Math.PI / 2));
              scale = 1 + 0.28 * proximity;
              translateY = -6 * proximity;
              magneticX = ((pointerX - itemCenterX) / maxDistance) * 4 * proximity;
            }
          }

          return (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id)}
              className={`bento-dock-item ${isActive ? 'active' : ''}`}
              style={{
                transform: `scale(${scale}) translateY(${translateY}px) translateX(${magneticX}px)`,
                transition: isHovered
                  ? 'transform 0.08s cubic-bezier(0.2, 0.8, 0.4, 1), background-color 0.18s ease'
                  : 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), background-color 0.18s ease'
              }}
              title={tab.label}
            >
              {/* Bento Active Pill Highlight */}
              {isActive && <div className="bento-dock-pill-bg" />}

              {/* Icon Container with Badge */}
              <div className="bento-icon-wrapper">
                <Icon
                  size={20}
                  strokeWidth={isActive ? 2.3 : 1.8}
                  color={isActive ? 'var(--brand-gold)' : 'var(--ink-500)'}
                />

                {tab.badge && (
                  <span
                    className="bento-badge"
                    style={{ backgroundColor: tab.badgeColor || 'var(--error-500)' }}
                  >
                    {tab.badge}
                  </span>
                )}
              </div>

              {/* Label */}
              <span className={`bento-dock-label ${isActive ? 'active-text' : ''}`}>
                {tab.label}
              </span>

              {/* Micro Bento Dot Glow Indicator */}
              {isActive && <span className="bento-active-dot" />}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
