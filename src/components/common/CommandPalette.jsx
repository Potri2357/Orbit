import React, { useState, useEffect, useRef } from 'react';
import { useOrbit } from '../../context/OrbitContext';
import {
  Search,
  ShoppingBag,
  Package,
  Receipt,
  LayoutDashboard,
  Zap,
  RefreshCw,
  Moon,
  Sun,
  Smartphone,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const CommandPalette = () => {
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    orders,
    inventory,
    setActiveView,
    setActiveDrawer,
    simulateIncomingSale,
    syncAllChannels,
    toggleTheme,
    theme
  } = useOrbit();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  // Filter items
  const cleanQ = query.trim().toLowerCase();

  // Navigation pages
  const pages = [
    { type: 'nav', id: 'dashboard', title: 'Go to Dashboard', icon: LayoutDashboard, category: 'Navigation' },
    { type: 'nav', id: 'orders', title: 'Go to Orders (List & Kanban)', icon: ShoppingBag, category: 'Navigation' },
    { type: 'nav', id: 'inventory', title: 'Go to Inventory (Multi-channel)', icon: Package, category: 'Navigation' },
    { type: 'nav', id: 'accounting', title: 'Go to Accounting & GST', icon: Receipt, category: 'Navigation' },
    { type: 'nav', id: 'channels', title: 'Go to Channels & Webhooks', icon: Zap, category: 'Navigation' }
  ].filter(p => !cleanQ || p.title.toLowerCase().includes(cleanQ));

  // Quick actions
  const actions = [
    {
      type: 'action',
      id: 'simulate_sale',
      title: 'Simulate Realtime Order Event',
      subtitle: 'Simulates incoming Shopify/IG order & tests live stock pulse',
      icon: Zap,
      action: () => simulateIncomingSale()
    },
    {
      type: 'action',
      id: 'sync_channels',
      title: 'Force Synchronize All Channels',
      subtitle: 'Triggers multi-channel stock reconciliation',
      icon: RefreshCw,
      action: () => syncAllChannels()
    },

    {
      type: 'action',
      id: 'toggle_theme',
      title: `Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`,
      subtitle: 'Instantly toggle theme aesthetic',
      icon: theme === 'light' ? Moon : Sun,
      action: () => toggleTheme()
    }
  ].filter(a => !cleanQ || a.title.toLowerCase().includes(cleanQ) || a.subtitle.toLowerCase().includes(cleanQ));

  // Matching Orders
  const matchingOrders = orders
    .filter(o => !cleanQ || o.orderNumber.toLowerCase().includes(cleanQ) || o.customer.name.toLowerCase().includes(cleanQ) || o.id.toLowerCase().includes(cleanQ))
    .slice(0, 4)
    .map(o => ({
      type: 'order',
      id: o.id,
      title: `Order ${o.orderNumber} — ${o.customer.name}`,
      subtitle: `₹${o.total.toLocaleString('en-IN')} • ${o.channel.toUpperCase()} • ${o.status.toUpperCase()}`,
      icon: ShoppingBag,
      data: o
    }));

  // Matching SKUs
  const matchingSkus = inventory
    .filter(i => !cleanQ || i.name.toLowerCase().includes(cleanQ) || i.id.toLowerCase().includes(cleanQ) || i.category.toLowerCase().includes(cleanQ))
    .slice(0, 4)
    .map(i => ({
      type: 'sku',
      id: i.id,
      title: `${i.name} (${i.id})`,
      subtitle: `${i.totalAvailable} in stock • ₹${i.unitPrice.toLocaleString('en-IN')}`,
      icon: Package,
      data: i
    }));

  const allItems = [...pages, ...actions, ...matchingOrders, ...matchingSkus];

  const handleSelect = (item) => {
    if (!item) return;

    if (item.type === 'nav') {
      setActiveView(item.id);
    } else if (item.type === 'action') {
      item.action();
    } else if (item.type === 'order') {
      setActiveView('orders');
      setActiveDrawer({ type: 'order', data: item.data });
    } else if (item.type === 'sku') {
      setActiveView('inventory');
      setActiveDrawer({ type: 'sku', data: item.data });
    }

    setIsCommandPaletteOpen(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % Math.max(1, allItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + allItems.length) % Math.max(1, allItems.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      handleSelect(allItems[selectedIndex]);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(10, 10, 14, 0.65)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '12vh'
      }}
      onClick={() => setIsCommandPaletteOpen(false)}
    >
      <div
        className="glass-panel"
        style={{
          width: '600px',
          maxWidth: '92vw',
          maxHeight: '75vh',
          borderRadius: 'var(--radius-xl)',
          boxShadow: '0 24px 60px rgba(0,0,0,0.3), var(--neu-raised)',
          border: '1px solid var(--glass-border)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          animation: 'modalSlideDown 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Box */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '16px 20px',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'var(--surface-raised)'
        }}>
          <Search size={20} color="var(--brand-gold)" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a command, search order #, customer, or SKU..."
            style={{
              flex: 1,
              border: 'none',
              background: 'transparent',
              fontSize: '16px',
              fontFamily: 'DM Sans, sans-serif',
              color: 'var(--ink-900)',
              outline: 'none'
            }}
          />
          <kbd style={{
            background: 'var(--surface-sunken)',
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '11px',
            color: 'var(--ink-500)',
            fontFamily: 'DM Mono, monospace'
          }}>
            ESC to close
          </kbd>
        </div>

        {/* Results List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
          {allItems.length === 0 ? (
            <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--ink-500)' }}>
              No results found for "{query}".
            </div>
          ) : (
            allItems.map((item, index) => {
              const isSelected = index === selectedIndex;
              const Icon = item.icon;

              return (
                <div
                  key={item.id + '-' + index}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    background: isSelected ? 'var(--brand-gold-subtle)' : 'transparent',
                    borderLeft: isSelected ? '3px solid var(--brand-gold)' : '3px solid transparent',
                    cursor: 'pointer',
                    transition: 'all 0.12s ease'
                  }}
                >
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: 'var(--radius-sm)',
                    background: isSelected ? 'var(--surface-raised)' : 'var(--surface-sunken)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 'var(--neu-raised-sm)',
                    flexShrink: 0
                  }}>
                    <Icon size={16} color={isSelected ? 'var(--brand-gold)' : 'var(--ink-700)'} />
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: isSelected ? 600 : 500,
                      color: 'var(--ink-900)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {item.title}
                    </div>
                    {item.subtitle && (
                      <div style={{
                        fontSize: '12px',
                        color: 'var(--ink-500)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {item.subtitle}
                      </div>
                    )}
                  </div>

                  {isSelected && (
                    <ArrowRight size={16} color="var(--brand-gold)" />
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div style={{
          padding: '10px 16px',
          background: 'var(--surface-sunken)',
          borderTop: '1px solid var(--border-subtle)',
          fontSize: '11px',
          color: 'var(--ink-500)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            Use <kbd style={{ padding: '1px 4px', background: 'var(--surface-raised)', borderRadius: '3px' }}>↑</kbd> <kbd style={{ padding: '1px 4px', background: 'var(--surface-raised)', borderRadius: '3px' }}>↓</kbd> to navigate, <kbd style={{ padding: '1px 4px', background: 'var(--surface-raised)', borderRadius: '3px' }}>↵</kbd> to execute
          </div>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Sparkles size={12} color="var(--brand-gold)" />
            Realtime Omnisearch
          </span>
        </div>
      </div>
    </div>
  );
};
