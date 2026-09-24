import React, { useState } from 'react';
import { useOrbit } from '../../context/OrbitContext';
import {
  Receipt,
  Download,
  CheckCircle2,
  AlertTriangle,
  FileText,
  DollarSign,
  ArrowUpRight,
  Filter,
  Search,
  ExternalLink,
  ShieldCheck,
  Plus
} from 'lucide-react';

export const AccountingView = () => {
  const { invoices, addToast } = useOrbit();
  const [tab, setTab] = useState('invoices'); // 'invoices' | 'reconciliation' | 'gst'
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // GST calculations
  const totalTaxableTurnover = invoices.reduce((sum, inv) => sum + inv.subtotal, 0);
  const totalCGST = invoices.reduce((sum, inv) => sum + inv.cgst, 0);
  const totalSGST = invoices.reduce((sum, inv) => sum + inv.sgst, 0);
  const totalIGST = invoices.reduce((sum, inv) => sum + inv.igst, 0);
  const totalGSTCollected = totalCGST + totalSGST + totalIGST;

  // Filter invoices
  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.customer.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleExportGSTR1 = () => {
    addToast({
      type: 'success',
      title: 'GSTR-1 JSON Package Prepared',
      message: 'Government GST portal compatible schema generated with HSN summaries.',
      duration: 4000
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="h1-title" style={{ color: 'var(--ink-900)' }}>Accounting & Tax Compliance</h1>
          <p className="body-small">Automated GST calculations, multi-gateway reconciliation, and audit trails</p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={handleExportGSTR1} className="btn-secondary" style={{ fontSize: '13px' }}>
            <Download size={14} />
            <span>Export GSTR-1</span>
          </button>
          <button
            onClick={() => {
              addToast({
                type: 'info',
                title: 'New Manual Invoice',
                message: 'Custom B2B corporate invoice draft initialized.',
                duration: 3500
              });
            }}
            className="btn-primary"
            style={{ fontSize: '13px' }}
          >
            <Plus size={14} />
            <span>Create Invoice</span>
          </button>
        </div>
      </div>

      {/* GST Summary KPI Cards (PRD §8.4) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px'
      }}>
        <div className="neu-card" style={{ padding: '18px' }}>
          <span className="label-caps">Taxable Turnover</span>
          <div className="display-title tabular-numbers" style={{ fontSize: '28px', marginTop: '6px', color: 'var(--ink-900)' }}>
            ₹{totalTaxableTurnover.toLocaleString('en-IN')}
          </div>
          <div className="body-small" style={{ marginTop: '8px' }}>
            Sales across 4 channels
          </div>
        </div>

        <div className="neu-card" style={{ padding: '18px' }}>
          <span className="label-caps">Total GST Collected</span>
          <div className="display-title tabular-numbers" style={{ fontSize: '28px', marginTop: '6px', color: 'var(--brand-gold)' }}>
            ₹{totalGSTCollected.toLocaleString('en-IN')}
          </div>
          <div className="body-small" style={{ marginTop: '8px' }}>
            CGST + SGST + IGST combined
          </div>
        </div>

        <div className="neu-card" style={{ padding: '18px' }}>
          <span className="label-caps">Intra-State GST (KA)</span>
          <div className="display-title tabular-numbers" style={{ fontSize: '28px', marginTop: '6px', color: 'var(--ink-900)' }}>
            ₹{(totalCGST + totalSGST).toLocaleString('en-IN')}
          </div>
          <div className="body-small font-mono" style={{ marginTop: '8px', fontSize: '11px' }}>
            CGST: ₹{totalCGST} | SGST: ₹{totalSGST}
          </div>
        </div>

        <div className="neu-card" style={{ padding: '18px' }}>
          <span className="label-caps">Inter-State (IGST)</span>
          <div className="display-title tabular-numbers" style={{ fontSize: '28px', marginTop: '6px', color: 'var(--info-500)' }}>
            ₹{totalIGST.toLocaleString('en-IN')}
          </div>
          <div className="body-small" style={{ marginTop: '8px' }}>
            Pan-India dispatches (MH, DL, RJ)
          </div>
        </div>
      </div>

      {/* Tabs Switcher: Invoices vs Reconciliation Audit */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '2px' }}>
        <button
          onClick={() => setTab('invoices')}
          className="btn-ghost"
          style={{
            borderBottom: tab === 'invoices' ? '2px solid var(--brand-gold)' : '2px solid transparent',
            borderRadius: '0',
            fontWeight: tab === 'invoices' ? 700 : 500,
            color: tab === 'invoices' ? 'var(--brand-gold)' : 'var(--ink-700)'
          }}
        >
          Invoices Directory ({invoices.length})
        </button>

        <button
          onClick={() => setTab('reconciliation')}
          className="btn-ghost"
          style={{
            borderBottom: tab === 'reconciliation' ? '2px solid var(--brand-gold)' : '2px solid transparent',
            borderRadius: '0',
            fontWeight: tab === 'reconciliation' ? 700 : 500,
            color: tab === 'reconciliation' ? 'var(--brand-gold)' : 'var(--ink-700)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <span>Payment Gateway Reconciliation</span>
          <span className="badge badge-warning" style={{ fontSize: '10px' }}>1 Mismatch</span>
        </button>
      </div>

      {tab === 'invoices' ? (
        /* Invoices Directory Table */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="glass-panel" style={{
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div className="neu-inset-container" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 12px',
              width: '320px',
              borderRadius: 'var(--radius-md)'
            }}>
              <Search size={15} color="var(--ink-500)" />
              <input
                type="text"
                placeholder="Search invoice #, customer..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  outline: 'none',
                  fontSize: '13px',
                  fontFamily: 'DM Sans, sans-serif',
                  color: 'var(--ink-900)',
                  width: '100%'
                }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="input-neu"
                style={{ padding: '6px 10px', fontSize: '12px', width: 'auto' }}
              >
                <option value="all">All States</option>
                <option value="Draft">Draft</option>
                <option value="Sent">Sent</option>
                <option value="Reconciled">Reconciled</option>
              </select>
            </div>
          </div>

          <div className="orbit-table-wrapper">
            <table className="orbit-table">
              <thead>
                <tr>
                  <th>Invoice #</th>
                  <th>Order Ref</th>
                  <th>Customer</th>
                  <th>Channel</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Taxable</th>
                  <th>Total Amount</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map(inv => {
                  let badgeClass = 'badge-neutral';
                  if (inv.status === 'Draft') badgeClass = 'badge-warning';
                  if (inv.status === 'Sent') badgeClass = 'badge-info';
                  if (inv.status === 'Reconciled') badgeClass = 'badge-success';

                  return (
                    <tr key={inv.id}>
                      <td>
                        <span className="font-mono" style={{ fontWeight: 600, color: 'var(--ink-900)' }}>
                          {inv.invoiceNumber}
                        </span>
                      </td>

                      <td>
                        <span className="font-mono body-small" style={{ color: 'var(--brand-gold)', fontWeight: 600 }}>
                          {inv.orderNumber}
                        </span>
                      </td>

                      <td style={{ fontWeight: 500, color: 'var(--ink-900)' }}>
                        {inv.customer}
                      </td>

                      <td>
                        <span className={`channel-pill ${inv.channel}`}>
                          {inv.channel}
                        </span>
                      </td>

                      <td className="font-mono body-small">
                        {inv.date}
                      </td>

                      <td>
                        <span className={`badge ${badgeClass}`}>
                          {inv.status}
                        </span>
                      </td>

                      <td className="tabular-numbers">
                        ₹{inv.subtotal.toLocaleString('en-IN')}
                      </td>

                      <td>
                        <span className="tabular-numbers" style={{ fontWeight: 700, color: 'var(--ink-900)' }}>
                          ₹{inv.total.toLocaleString('en-IN')}
                        </span>
                      </td>

                      <td style={{ textAlign: 'right' }}>
                        <button
                          onClick={() => {
                            addToast({
                              type: 'success',
                              title: `PDF Downloaded`,
                              message: `Invoice ${inv.invoiceNumber} saved to downloads.`,
                              duration: 3000
                            });
                          }}
                          className="btn-ghost"
                          style={{ padding: '6px', borderRadius: 'var(--radius-sm)' }}
                          title="Download PDF"
                        >
                          <Download size={15} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Payment Gateway Reconciliation View (PRD §8.4) */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="glass-panel" style={{ padding: '16px 20px', borderLeft: '4px solid var(--warning-500)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <AlertTriangle size={20} color="var(--warning-500)" />
              <div>
                <div style={{ fontWeight: 600, color: 'var(--ink-900)', fontSize: '14px' }}>
                  Gateway Settlement Reconciliation Audit
                </div>
                <div className="body-small">
                  Every settlement payout from Razorpay, Meta Commerce, Amazon, and PineLabs is cross-checked against invoice taxables. Mismatches are flagged immediately.
                </div>
              </div>
            </div>
          </div>

          <div className="orbit-table-wrapper">
            <table className="orbit-table">
              <thead>
                <tr>
                  <th>Invoice Ref</th>
                  <th>Order #</th>
                  <th>Gateway Reference</th>
                  <th>Expected Amount</th>
                  <th>Reconciled Status</th>
                  <th>Audit Notes / Discrepancy</th>
                  <th style={{ textAlign: 'right' }}>Resolution</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map(inv => {
                  const hasDiscrepancy = inv.reconciliationStatus === 'Discrepancy';

                  return (
                    <tr
                      key={inv.id}
                      style={{
                        backgroundColor: hasDiscrepancy ? 'var(--warning-subtle)' : 'transparent'
                      }}
                    >
                      <td className="font-mono" style={{ fontWeight: 600 }}>
                        {inv.invoiceNumber}
                      </td>

                      <td className="font-mono body-small" style={{ color: 'var(--brand-gold)' }}>
                        {inv.orderNumber}
                      </td>

                      <td className="font-mono body-small">
                        {inv.gatewayRef}
                      </td>

                      <td className="tabular-numbers" style={{ fontWeight: 600 }}>
                        ₹{inv.total.toLocaleString('en-IN')}
                      </td>

                      <td>
                        <span className={`badge ${hasDiscrepancy ? 'badge-error' : 'badge-success'}`}>
                          {hasDiscrepancy ? <AlertTriangle size={12} /> : <CheckCircle2 size={12} />}
                          {inv.reconciliationStatus}
                        </span>
                      </td>

                      <td>
                        {hasDiscrepancy ? (
                          <div style={{ color: 'var(--error-500)', fontSize: '12px', fontWeight: 600 }}>
                            {inv.discrepancyReason} ({inv.discrepancyAmount > 0 ? `+₹${inv.discrepancyAmount}` : `-₹${Math.abs(inv.discrepancyAmount)}`})
                          </div>
                        ) : (
                          <div style={{ color: 'var(--success-500)', fontSize: '12px' }}>
                            Zero variance • Settled to HDFC Current A/C
                          </div>
                        )}
                      </td>

                      <td style={{ textAlign: 'right' }}>
                        {hasDiscrepancy ? (
                          <button
                            onClick={() => {
                              inv.reconciliationStatus = 'Matched';
                              addToast({
                                type: 'success',
                                title: 'Discrepancy Reconciled',
                                message: '₹85 TDS variance marked as verified tax deduction.',
                                duration: 4000
                              });
                            }}
                            className="btn-primary"
                            style={{ padding: '4px 10px', fontSize: '11px' }}
                          >
                            Accept & Reconcile
                          </button>
                        ) : (
                          <span className="body-small" style={{ color: 'var(--ink-500)' }}>
                            Verified
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
