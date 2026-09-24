import React, { useState } from 'react';
import { useOrbit } from '../../context/OrbitContext';
import { TEAM_MEMBERS } from '../../data/mockData';
import {
  Search,
  Moon,
  Sun,
  Zap,
  HelpCircle,
  Smartphone,
  ChevronDown,
  RefreshCw,
  Bell,
  Sliders,
  CheckCircle2
} from 'lucide-react';

export const Header = () => {
  const {
    theme,
    toggleTheme,
    activePersona,
    setActivePersona,
    isWarehouseMobileMode,
    setIsWarehouseMobileMode,
    isLiveSimulating,
    setIsLiveSimulating,
    simulateIncomingSale,
    syncAllChannels,
    setIsCommandPaletteOpen,
    setIsShortcutsModalOpen,
    lastLivePulse
  } = useOrbit();

  const [isPersonaMenuOpen, setIsPersonaMenuOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleManualSync = () => {
    setIsSyncing(true);
    syncAllChannels();
    setTimeout(() => setIsSyncing(false), 900);
  };

  return (
    <header className="glass-panel" style={{
      margin: '12px 16px 0 16px',
      padding: '10px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '16px',
      zIndex: 40,
      position: 'relative'
    }}>
      {/* Left: Global Search / Command Bar Trigger */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, maxWidth: '440px' }}>
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="neu-inset-container"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            width: '100%',
            padding: '7px 12px',
            cursor: 'pointer',
            border: 'none',
            color: 'var(--ink-500)',
            fontSize: '13px',
            borderRadius: 'var(--radius-md)'
          }}
          title="Open Command Palette (⌘K)"
        >
          <Search size={16} color="var(--ink-500)" />
          <span style={{ flex: 1, textAlign: 'left' }}>Search orders, SKUs, customers, actions...</span>
          <kbd style={{
            background: 'var(--surface-raised)',
            padding: '2px 6px',
            borderRadius: '4px',
            fontSize: '11px',
            border: '1px solid var(--border-subtle)',
            color: 'var(--ink-700)',
            boxShadow: 'var(--neu-raised-sm)',
            fontFamily: 'DM Mono, monospace'
          }}>
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Center: Live Sync Pulse Status & Frappe Backend Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div
          className="glass-pill"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '5px 12px',
            fontSize: '12px',
            color: 'var(--ink-700)',
            boxShadow: 'var(--neu-raised-sm)'
          }}
        >
          <div className="pulse-indicator">
            <span className="pulse-dot" />
            <span className="pulse-ring" />
          </div>
          <span style={{ fontWeight: 500 }}>Frappe DB :8000</span>
          <span style={{ color: 'var(--ink-300)' }}>•</span>
          <span className="tabular-numbers" style={{ color: 'var(--success-500)', fontWeight: 600 }}>Live Realtime</span>
        </div>

        {/* Quick Sync Button */}
        <button
          onClick={handleManualSync}
          className="btn-ghost"
          style={{
            padding: '6px 10px',
            fontSize: '12px',
            borderRadius: 'var(--radius-md)'
          }}
          title="Force verify inventory across all 4 channels"
        >
          <RefreshCw size={14} className={isSyncing ? 'spin-anim' : ''} />
          <span>Sync</span>
        </button>

        {/* Real-time Order Simulation Trigger */}
        <button
          onClick={simulateIncomingSale}
          className="btn-primary"
          style={{
            padding: '6px 12px',
            fontSize: '12px',
            fontWeight: 600,
            borderRadius: 'var(--radius-md)'
          }}
          title="Trigger a simulated real-time order from Shopify/Instagram to test live pulse & inventory decrement"
        >
          <Zap size={14} />
          <span>Simulate Sale</span>
        </button>
      </div>

      {/* Right: Controls & Persona Switcher */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Warehouse Mobile View Mode Toggle */}
        <button
          onClick={() => setIsWarehouseMobileMode(prev => !prev)}
          className={isWarehouseMobileMode ? 'btn-primary' : 'btn-secondary'}
          style={{
            padding: '6px 12px',
            fontSize: '12px',
            borderRadius: 'var(--radius-md)'
          }}
          title="Switch to Ravi's mobile/tablet warehouse packing & scanner view (PRD §8.5)"
        >
          <Smartphone size={14} />
          <span>{isWarehouseMobileMode ? 'Exit Mobile' : 'Warehouse Mobile'}</span>
        </button>

        {/* Theme Toggle (Light / Dark) */}
        <button
          onClick={toggleTheme}
          className="btn-secondary"
          style={{
            padding: '6px 10px',
            borderRadius: 'var(--radius-md)',
            color: 'var(--ink-700)'
          }}
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
        >
          {theme === 'light' ? <Moon size={15} /> : <Sun size={15} color="var(--brand-gold)" />}
        </button>

        {/* Shortcuts Help */}
        <button
          onClick={() => setIsShortcutsModalOpen(true)}
          className="btn-ghost"
          style={{ padding: '6px', borderRadius: 'var(--radius-md)' }}
          title="Keyboard shortcuts (?)"
        >
          <HelpCircle size={17} />
        </button>

        <div style={{ width: '1px', height: '22px', background: 'var(--border-subtle)', margin: '0 2px' }} />

        {/* Persona Switcher Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setIsPersonaMenuOpen(prev => !prev)}
            className="neu-card"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 10px 4px 4px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border-subtle)',
              cursor: 'pointer',
              background: 'var(--surface-raised)'
            }}
          >
            <img
              src={activePersona.avatar}
              alt={activePersona.name}
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                objectFit: 'cover'
              }}
            />
            <div style={{ textAlign: 'left', lineHeight: 1.15 }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--ink-900)' }}>
                {activePersona.name.split(' ')[0]}
              </div>
              <div style={{ fontSize: '10px', color: 'var(--ink-500)' }}>
                {activePersona.role.split('/')[0]}
              </div>
            </div>
            <ChevronDown size={14} color="var(--ink-500)" />
          </button>

          {/* Persona Menu Overlay */}
          {isPersonaMenuOpen && (
            <>
              <div
                style={{ position: 'fixed', inset: 0, zIndex: 50 }}
                onClick={() => setIsPersonaMenuOpen(false)}
              />
              <div
                className="glass-panel"
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '100%',
                  marginTop: '8px',
                  width: '260px',
                  zIndex: 51,
                  padding: '8px',
                  boxShadow: 'var(--glass-shadow)',
                  borderRadius: 'var(--radius-lg)'
                }}
              >
                <div style={{
                  padding: '6px 10px 8px 10px',
                  borderBottom: '1px solid var(--border-subtle)',
                  marginBottom: '6px'
                }}>
                  <div className="label-caps">Switch Active Persona</div>
                  <div className="body-small" style={{ fontSize: '11px', marginTop: '2px' }}>
                    Experience Orbit from different team roles:
                  </div>
                </div>

                {TEAM_MEMBERS.map(member => {
                  const isSelected = member.id === activePersona.id;
                  return (
                    <button
                      key={member.id}
                      onClick={() => {
                        setActivePersona(member);
                        setIsPersonaMenuOpen(false);
                        if (member.id === 'u-4') {
                          setIsWarehouseMobileMode(true);
                        }
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        width: '100%',
                        padding: '8px 10px',
                        borderRadius: 'var(--radius-md)',
                        border: 'none',
                        background: isSelected ? 'var(--brand-gold-subtle)' : 'transparent',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'background 0.15s ease'
                      }}
                    >
                      <img
                        src={member.avatar}
                        alt={member.name}
                        style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink-900)' }}>
                          {member.name}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--ink-500)' }}>
                          {member.role}
                        </div>
                      </div>
                      {isSelected && <CheckCircle2 size={16} color="var(--brand-gold)" />}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
