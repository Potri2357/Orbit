import React, { useState } from 'react';
import { useOrbit } from '../../context/OrbitContext';
import confetti from 'canvas-confetti';
import {
  QrCode,
  Barcode,
  Package,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  X,
  Smartphone,
  Check,
  Search,
  Sparkles,
  Camera
} from 'lucide-react';

export const WarehouseMobileView = () => {
  const {
    orders,
    updateOrderStatus,
    setIsWarehouseMobileMode,
    addToast
  } = useOrbit();

  const [activeTab, setActiveTab] = useState('pack'); // 'pack' | 'scanner'
  const [scannedBarcode, setScannedBarcode] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scannedMatchedOrder, setScannedMatchedOrder] = useState(null);

  // Orders to pack today (task-first view)
  const ordersToPack = orders.filter(o => o.status === 'placed');
  const packedOrders = orders.filter(o => o.status === 'packed');

  const handleMarkPacked = (order) => {
    // Trigger confetti haptic celebration
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 }
    });

    updateOrderStatus(order.id, 'packed');

    addToast({
      type: 'success',
      title: `Order ${order.orderNumber} Packed!`,
      message: `Checked & verified by Ravi K. Shipping label ready for carrier dispatch.`,
      duration: 5000
    });
  };

  const handleFlagIssue = (order) => {
    addToast({
      type: 'warning',
      title: `Issue Flagged on ${order.orderNumber}`,
      message: `Arjun M. notified for item inspection in Bay 3.`,
      duration: 4000
    });
  };

  const simulateBarcodeScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      const targetOrder = ordersToPack[0] || orders[0];
      setScannedBarcode(targetOrder.orderNumber);
      setScannedMatchedOrder(targetOrder);

      // Play audio beep simulation via Web Audio API
      try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.frequency.value = 880; // A5 tone
        gain.gain.value = 0.1;
        osc.start();
        setTimeout(() => {
          osc.stop();
        }, 120);
      } catch (err) {
        // audio context optional
      }
    }, 800);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'var(--surface-base)',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        overflowY: 'auto',
        padding: '16px 12px 32px 12px'
      }}
    >
      {/* Mobile Device Frame Container (max-width 480px) */}
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '460px',
          minHeight: '94vh',
          borderRadius: 'var(--radius-2xl)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--neu-raised)',
          overflow: 'hidden',
          background: 'var(--surface-raised)',
          border: '1px solid var(--glass-border)'
        }}
      >
        {/* Top Mobile Bar */}
        <div style={{
          padding: '16px',
          background: 'var(--surface-sunken)',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'var(--brand-gold-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--brand-gold)'
            }}>
              <Package size={20} />
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--ink-900)' }}>
                Ravi's Packing Station
              </div>
              <div className="body-small" style={{ fontSize: '11px' }}>
                Warehouse Terminal #02 (Tablet / Mobile)
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsWarehouseMobileMode(false)}
            className="btn-secondary"
            style={{ padding: '6px 12px', fontSize: '12px', borderRadius: 'var(--radius-full)' }}
          >
            <X size={14} />
            <span>Exit</span>
          </button>
        </div>

        {/* View Switcher Tabs (Large touch targets: min 48px height) */}
        <div style={{
          display: 'flex',
          padding: '8px 12px',
          gap: '8px',
          background: 'var(--surface-raised)',
          borderBottom: '1px solid var(--border-subtle)'
        }}>
          <button
            onClick={() => setActiveTab('pack')}
            className={activeTab === 'pack' ? 'btn-primary' : 'btn-secondary'}
            style={{
              flex: 1,
              minHeight: '46px',
              fontSize: '13px',
              borderRadius: 'var(--radius-md)'
            }}
          >
            <Package size={17} />
            <span>Orders to Pack ({ordersToPack.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('scanner')}
            className={activeTab === 'scanner' ? 'btn-primary' : 'btn-secondary'}
            style={{
              flex: 1,
              minHeight: '46px',
              fontSize: '13px',
              borderRadius: 'var(--radius-md)'
            }}
          >
            <Barcode size={17} />
            <span>Barcode Scanner</span>
          </button>
        </div>

        {/* Tab 1: Orders to Pack Queue */}
        {activeTab === 'pack' && (
          <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px', flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="label-caps">Priority Packing Queue</span>
              <span className="badge badge-warning">{ordersToPack.length} Pending</span>
            </div>

            {ordersToPack.length === 0 ? (
              <div style={{
                padding: '40px 16px',
                textAlign: 'center',
                color: 'var(--ink-500)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px'
              }}>
                <CheckCircle size={44} color="var(--success-500)" />
                <div style={{ fontWeight: 600, color: 'var(--ink-900)' }}>All Orders Packed!</div>
                <div className="body-small">No pending parcels in this batch queue.</div>
              </div>
            ) : (
              ordersToPack.map(order => (
                <div
                  key={order.id}
                  className="neu-card"
                  style={{
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    borderLeft: '4px solid var(--warning-500)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="font-mono" style={{ fontSize: '16px', fontWeight: 700, color: 'var(--ink-900)' }}>
                      {order.orderNumber}
                    </span>
                    <span className={`channel-pill ${order.channel}`}>{order.channel}</span>
                  </div>

                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--ink-900)' }}>
                      {order.customer.name}
                    </div>
                    <div className="body-small">
                      {order.customer.city} • Pincode: {order.customer.pincode}
                    </div>
                  </div>

                  {/* Packing items checklist */}
                  <div className="neu-inset-container" style={{ padding: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div className="label-caps" style={{ fontSize: '9px' }}>Items to verify & pack:</div>
                    {order.items.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                        <span style={{ fontWeight: 500 }}>{item.qty}x {item.name}</span>
                        <span className="font-mono body-small">{item.sku}</span>
                      </div>
                    ))}
                  </div>

                  {/* Swipe Actions Simulation (PRD §8.5: "Swipe-right = mark packed, swipe-left = flag issue") */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 2fr',
                    gap: '10px',
                    marginTop: '4px'
                  }}>
                    <button
                      onClick={() => handleFlagIssue(order)}
                      className="btn-secondary"
                      style={{
                        minHeight: '48px',
                        justifyContent: 'center',
                        color: 'var(--error-500)',
                        fontSize: '12px'
                      }}
                      title="Flag issue / missing stock"
                    >
                      <AlertTriangle size={16} />
                      <span>Flag Issue</span>
                    </button>

                    <button
                      onClick={() => handleMarkPacked(order)}
                      className="btn-primary"
                      style={{
                        minHeight: '48px',
                        justifyContent: 'center',
                        fontSize: '13px',
                        fontWeight: 700
                      }}
                      title="Mark packed with haptic confirmation"
                    >
                      <Check size={18} />
                      <span>Pack & Scan AWB →</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: Optical Barcode / QR Scanner Simulator */}
        {activeTab === 'scanner' && (
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
            <div style={{ textAlign: 'center' }}>
              <h3 className="h3-title" style={{ fontSize: '16px' }}>Instant Barcode Scanner</h3>
              <p className="body-small">Point camera or laser scanner at order pick-list barcode</p>
            </div>

            {/* Viewfinder simulator */}
            <div
              className="neu-inset-container"
              style={{
                height: '240px',
                borderRadius: 'var(--radius-xl)',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                background: '#0B0B0E'
              }}
            >
              {/* Laser animation */}
              <div style={{
                position: 'absolute',
                left: '20px',
                right: '20px',
                height: '2px',
                background: '#FF3B30',
                boxShadow: '0 0 12px #FF3B30',
                top: isScanning ? '50%' : '20%',
                animation: isScanning ? 'none' : 'shimmer 2s infinite alternate',
                transition: 'top 0.3s ease'
              }} />

              {/* Viewfinder corners */}
              <div style={{
                width: '180px',
                height: '140px',
                border: '2px solid rgba(255, 255, 255, 0.4)',
                borderRadius: '12px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                color: 'rgba(255, 255, 255, 0.8)'
              }}>
                <Camera size={28} />
                <span style={{ fontSize: '11px', fontFamily: 'DM Mono, monospace' }}>
                  {isScanning ? 'Decoding...' : 'Align Barcode'}
                </span>
              </div>
            </div>

            {/* Scan Trigger Button */}
            <button
              onClick={simulateBarcodeScan}
              disabled={isScanning}
              className="btn-primary"
              style={{
                minHeight: '50px',
                fontSize: '14px',
                fontWeight: 700,
                borderRadius: 'var(--radius-md)'
              }}
            >
              <Barcode size={20} />
              <span>{isScanning ? 'Reading Optical Code...' : 'Simulate Laser Barcode Scan'}</span>
            </button>

            {/* Matched Order Result */}
            {scannedMatchedOrder && (
              <div className="neu-card flash-updated" style={{ padding: '16px', borderLeft: '4px solid var(--success-500)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle size={18} color="var(--success-500)" />
                    <span className="font-mono" style={{ fontSize: '15px', fontWeight: 700 }}>
                      {scannedMatchedOrder.orderNumber}
                    </span>
                  </div>
                  <span className="badge badge-success">Matched</span>
                </div>

                <div style={{ marginTop: '8px', fontSize: '13px' }}>
                  <div style={{ fontWeight: 600 }}>{scannedMatchedOrder.customer.name}</div>
                  <div className="body-small">{scannedMatchedOrder.items.map(i => `${i.qty}x ${i.name}`).join(', ')}</div>
                </div>

                <div style={{ marginTop: '12px' }}>
                  <button
                    onClick={() => {
                      handleMarkPacked(scannedMatchedOrder);
                      setScannedMatchedOrder(null);
                    }}
                    className="btn-primary"
                    style={{ width: '100%', minHeight: '44px', justifyContent: 'center' }}
                  >
                    Confirm Pack & Print AWB
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
