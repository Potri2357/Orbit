import React from 'react';
import { useOrbit } from '../../context/OrbitContext';
import { X, Command } from 'lucide-react';

export const KeyboardShortcutsModal = () => {
  const { isShortcutsModalOpen, setIsShortcutsModalOpen } = useOrbit();

  if (!isShortcutsModalOpen) return null;

  const SHORTCUTS = [
    {
      category: 'General Navigation',
      items: [
        { keys: ['⌘', 'K'], label: 'Open Command Palette & Omnisearch' },
        { keys: ['?'], label: 'Open / Close this shortcuts cheat sheet' },
        { keys: ['Esc'], label: 'Close current modal or side drawer' },
        { keys: ['/'], label: 'Quick focus search bar' }
      ]
    },
    {
      category: 'Operations & Lists',
      items: [
        { keys: ['j'], label: 'Navigate to next row in Orders / Stock table' },
        { keys: ['k'], label: 'Navigate to previous row' },
        { keys: ['n'], label: 'Quick create new order / purchase order' },
        { keys: ['Space'], label: 'Select / Unselect current row for bulk actions' }
      ]
    },
    {
      category: 'Views & Workspace',
      items: [
        { keys: ['g', 'd'], label: 'Go to Dashboard' },
        { keys: ['g', 'o'], label: 'Go to Orders (List & Kanban)' },
        { keys: ['g', 'i'], label: 'Go to Inventory & Channel Stock' },
        { keys: ['g', 'a'], label: 'Go to Accounting & GST' },
        { keys: ['w'], label: 'Toggle Ravi’s Mobile Warehouse View' }
      ]
    }
  ];

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
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
      onClick={() => setIsShortcutsModalOpen(false)}
    >
      <div
        className="glass-panel"
        style={{
          width: '560px',
          maxWidth: '92vw',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--glass-shadow), var(--neu-raised)',
          overflow: 'hidden',
          animation: 'modalSlideDown 0.2s ease-out'
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'var(--surface-raised)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Command size={18} color="var(--brand-gold)" />
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--ink-900)' }}>
              Keyboard Shortcuts
            </h3>
          </div>
          <button
            onClick={() => setIsShortcutsModalOpen(false)}
            className="btn-ghost"
            style={{ padding: '4px', borderRadius: 'var(--radius-sm)' }}
          >
            <X size={16} />
          </button>
        </div>

        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {SHORTCUTS.map(section => (
            <div key={section.category}>
              <div className="label-caps" style={{ marginBottom: '8px' }}>
                {section.category}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {section.items.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '6px 8px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--surface-sunken)'
                    }}
                  >
                    <span style={{ fontSize: '13px', color: 'var(--ink-700)' }}>{item.label}</span>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {item.keys.map((k, kIdx) => (
                        <kbd
                          key={kIdx}
                          style={{
                            background: 'var(--surface-raised)',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: 600,
                            border: '1px solid var(--border-subtle)',
                            color: 'var(--ink-900)',
                            boxShadow: 'var(--neu-raised-sm)',
                            fontFamily: 'DM Mono, monospace'
                          }}
                        >
                          {k}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{
          padding: '12px 20px',
          background: 'var(--surface-sunken)',
          borderTop: '1px solid var(--border-subtle)',
          fontSize: '12px',
          color: 'var(--ink-500)',
          textAlign: 'center'
        }}>
          Designed for maximum muscle memory speed in daily warehouse & ops workflows.
        </div>
      </div>
    </div>
  );
};
