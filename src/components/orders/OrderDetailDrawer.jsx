import React, { useState } from 'react';
import { useOrbit } from '../../context/OrbitContext';
import {
  X,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  Printer,
  Download,
  MessageSquare,
  User,
  MapPin,
  CreditCard,
  AlertCircle,
  ExternalLink
} from 'lucide-react';

export const OrderDetailDrawer = () => {
  const { activeDrawer, setActiveDrawer, updateOrderStatus, activePersona, addToast } = useOrbit();
  const [isGeneratingLabel, setIsGeneratingLabel] = useState(false);

  if (!activeDrawer || activeDrawer.type !== 'order' || !activeDrawer.data) return null;

  const order = activeDrawer.data;

  const STATUSES = ['placed', 'packed', 'shipped', 'delivered', 'returned'];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'placed':
        return <span className="badge badge-warning">Placed</span>;
      case 'packed':
        return <span className="badge badge-info">Packed</span>;
      case 'shipped':
        return <span className="badge badge-gold">Shipped</span>;
      case 'delivered':
        return <span className="badge badge-success">Delivered</span>;
      case 'returned':
        return <span className="badge badge-error">Returned</span>;
      default:
        return <span className="badge badge-neutral">{status}</span>;
    }
  };

  const handlePrintSlip = () => {
    addToast({
      type: 'info',
      title: `Packing Slip Generated`,
      message: `Thermal 4x6" label sent to warehouse network printer.`,
      duration: 3500
    });
  };

  const handleDownloadInvoice = () => {
    addToast({
      type: 'success',
      title: `Tax Invoice Downloaded`,
      message: `GST compliant PDF generated for Order ${order.orderNumber}.`,
      duration: 3500
    });
  };

  const handleGenerateAWB = () => {
    setIsGeneratingLabel(true);
    setTimeout(() => {
      setIsGeneratingLabel(false);
      const trackingCode = 'DELHIVERY_EXP_' + Math.floor(100000 + Math.random() * 900000);
      order.tracking = trackingCode;
      updateOrderStatus(order.id, 'shipped');
      addToast({
        type: 'success',
        title: 'AWB Created & Assigned',
        message: `Waybill ${trackingCode} registered with carrier.`,
        duration: 4000
      });
    }, 700);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(10, 10, 14, 0.5)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        zIndex: 999,
        display: 'flex',
        justifyContent: 'flex-end',
        animation: 'fadeIn 0.15s ease'
      }}
      onClick={() => setActiveDrawer(null)}
    >
      <div
        className="glass-panel"
        style={{
          width: '520px',
          maxWidth: '92vw',
          height: '100%',
          borderRadius: '0',
          borderLeft: '1px solid var(--glass-border)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--glass-shadow)',
          background: 'var(--surface-raised)',
          animation: 'slideInRight 0.22s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="display-title font-mono" style={{ fontSize: '20px', color: 'var(--ink-900)' }}>
              {order.orderNumber}
            </span>
            <span className={`channel-pill ${order.channel}`}>{order.channel}</span>
            {getStatusBadge(order.status)}
          </div>

          <button
            onClick={() => setActiveDrawer(null)}
            className="btn-ghost"
            style={{ padding: '6px', borderRadius: 'var(--radius-sm)' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Presence notification (PRD §9) */}
        <div style={{
          padding: '8px 20px',
          background: 'var(--surface-sunken)',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '12px',
          color: 'var(--ink-700)'
        }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success-500)', display: 'inline-block' }} />
          <span>
            <strong>{activePersona.name}</strong> is actively inspecting this order.
          </span>
        </div>

        {/* Scrollable Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Status Progression Bar */}
          <div className="neu-card" style={{ padding: '16px' }}>
            <div className="label-caps" style={{ marginBottom: '10px' }}>Fulfillment Pipeline</div>
            <div style={{ display: 'flex', gap: '6px' }}>
              {STATUSES.map((st) => {
                const isCurrent = order.status === st;
                return (
                  <button
                    key={st}
                    onClick={() => updateOrderStatus(order.id, st)}
                    className={isCurrent ? 'btn-primary' : 'btn-secondary'}
                    style={{
                      flex: 1,
                      padding: '7px 4px',
                      fontSize: '11px',
                      textTransform: 'capitalize',
                      borderRadius: 'var(--radius-sm)'
                    }}
                  >
                    {st}
                  </button>
                );
              })}
            </div>

            {/* Tracking pill if available */}
            {order.tracking ? (
              <div style={{
                marginTop: '12px',
                padding: '8px 12px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--surface-sunken)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Truck size={14} color="var(--brand-gold)" />
                  <span className="font-mono">{order.tracking}</span>
                </div>
                <span className="badge badge-success" style={{ fontSize: '10px' }}>In Transit</span>
              </div>
            ) : (
              <div style={{ marginTop: '12px' }}>
                <button
                  onClick={handleGenerateAWB}
                  className="btn-secondary"
                  disabled={isGeneratingLabel}
                  style={{ width: '100%', fontSize: '12px', justifyContent: 'center' }}
                >
                  <Truck size={14} />
                  <span>{isGeneratingLabel ? 'Connecting to Delhivery...' : 'Generate Delhivery Shipping Waybill'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Customer & Shipping info */}
          <div className="neu-card" style={{ padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <User size={16} color="var(--brand-gold)" />
              <h3 className="h3-title" style={{ fontSize: '14px' }}>Customer & Destination</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px' }}>
              <div style={{ fontWeight: 600, color: 'var(--ink-900)' }}>{order.customer.name}</div>
              <div style={{ color: 'var(--ink-700)' }}>{order.customer.email} • {order.customer.phone}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--ink-500)', marginTop: '4px' }}>
                <MapPin size={13} />
                <span>{order.customer.city} — Pincode: {order.customer.pincode}</span>
              </div>
            </div>

            <div style={{
              marginTop: '12px',
              paddingTop: '10px',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '12px'
            }}>
              <span style={{ color: 'var(--ink-500)' }}>Payment via {order.paymentMethod}</span>
              <span className="badge badge-success">{order.paymentStatus}</span>
            </div>
          </div>

          {/* Items Table */}
          <div className="neu-card" style={{ padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Package size={16} color="var(--brand-gold)" />
              <h3 className="h3-title" style={{ fontSize: '14px' }}>Order Items ({order.items.length})</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {order.items.map((item, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--surface-sunken)'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink-900)' }}>
                      {item.name}
                    </div>
                    <div className="body-small font-mono" style={{ fontSize: '11px' }}>
                      {item.sku} • Qty: {item.qty}
                    </div>
                  </div>

                  <div className="tabular-numbers" style={{ fontSize: '14px', fontWeight: 600 }}>
                    ₹{(item.price * item.qty).toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
            </div>

            {/* Financial Totals */}
            <div style={{
              marginTop: '14px',
              paddingTop: '10px',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              fontSize: '12px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--ink-700)' }}>
                <span>Subtotal</span>
                <span className="tabular-numbers">₹{order.subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--ink-700)' }}>
                <span>GST (Inclusive 12%)</span>
                <span className="tabular-numbers">₹{order.gst.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--ink-700)' }}>
                <span>Shipping</span>
                <span>{order.shipping === 0 ? 'FREE' : `₹${order.shipping}`}</span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontWeight: 700,
                fontSize: '15px',
                color: 'var(--ink-900)',
                marginTop: '4px',
                paddingTop: '6px',
                borderTop: '1px solid var(--border-subtle)'
              }}>
                <span>Total Amount</span>
                <span className="tabular-numbers">₹{order.total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div style={{
          padding: '16px 20px',
          borderTop: '1px solid var(--border-subtle)',
          background: 'var(--surface-raised)',
          display: 'flex',
          gap: '10px'
        }}>
          <button
            onClick={handlePrintSlip}
            className="btn-secondary"
            style={{ flex: 1, fontSize: '12px' }}
          >
            <Printer size={14} />
            <span>Print Slip</span>
          </button>
          <button
            onClick={handleDownloadInvoice}
            className="btn-primary"
            style={{ flex: 1, fontSize: '12px' }}
          >
            <Download size={14} />
            <span>Tax Invoice</span>
          </button>
        </div>
      </div>
    </div>
  );
};
