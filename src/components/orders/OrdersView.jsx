import React, { useState } from 'react';
import { useOrbit } from '../../context/OrbitContext';
import {
  List,
  Kanban,
  Search,
  Filter,
  Download,
  CheckCircle,
  Truck,
  RotateCcw,
  Eye,
  MoreVertical,
  CheckSquare,
  Square,
  ArrowUpDown,
  Plus
} from 'lucide-react';
import { OrderDetailDrawer } from './OrderDetailDrawer';

export const OrdersView = () => {
  const {
    orders,
    updateOrderStatus,
    bulkUpdateOrdersStatus,
    selectedOrderIds,
    setSelectedOrderIds,
    setActiveDrawer,
    addToast
  } = useOrbit();

  const [viewMode, setViewMode] = useState('table'); // 'table' | 'kanban'
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [channelFilter, setChannelFilter] = useState('all');
  const [draggedOrderId, setDraggedOrderId] = useState(null);

  const STATUS_COLUMNS = [
    { key: 'placed', label: 'Placed', color: 'var(--warning-500)' },
    { key: 'packed', label: 'Packed', color: 'var(--info-500)' },
    { key: 'shipped', label: 'Shipped', color: 'var(--brand-gold)' },
    { key: 'delivered', label: 'Delivered', color: 'var(--success-500)' },
    { key: 'returned', label: 'Returned', color: 'var(--error-500)' }
  ];

  // Filtering
  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some(i => i.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesChannel = channelFilter === 'all' || order.channel === channelFilter;

    return matchesSearch && matchesStatus && matchesChannel;
  });

  // Bulk selection handling
  const toggleSelectOrder = (id) => {
    setSelectedOrderIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedOrderIds.length === filteredOrders.length) {
      setSelectedOrderIds([]);
    } else {
      setSelectedOrderIds(filteredOrders.map(o => o.id));
    }
  };

  // Drag and drop for Kanban
  const handleDragStart = (e, orderId) => {
    setDraggedOrderId(orderId);
    e.dataTransfer.setData('text/plain', orderId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetStatus) => {
    e.preventDefault();
    const orderId = e.dataTransfer.getData('text/plain') || draggedOrderId;
    if (orderId) {
      updateOrderStatus(orderId, targetStatus);
    }
    setDraggedOrderId(null);
  };

  const handleExportSelected = () => {
    addToast({
      type: 'success',
      title: 'Orders Exported',
      message: `${selectedOrderIds.length || filteredOrders.length} orders exported to CSV for logistics audit.`,
      duration: 3500
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative' }}>
      {/* Top Header & Switcher */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="h1-title" style={{ color: 'var(--ink-900)' }}>Orders & Fulfillment</h1>
          <p className="body-small">Unified stream across Shopify, Instagram, Marketplaces and POS</p>
        </div>

        {/* View Mode Toggle: Table vs Kanban */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            className="neu-inset-container"
            style={{
              display: 'flex',
              padding: '3px',
              borderRadius: 'var(--radius-md)',
              gap: '2px'
            }}
          >
            <button
              onClick={() => setViewMode('table')}
              className={viewMode === 'table' ? 'btn-primary' : 'btn-ghost'}
              style={{
                padding: '6px 12px',
                fontSize: '12px',
                borderRadius: 'var(--radius-sm)',
                boxShadow: viewMode === 'table' ? 'var(--neu-raised-sm)' : 'none'
              }}
            >
              <List size={14} />
              <span>Table</span>
            </button>

            <button
              onClick={() => setViewMode('kanban')}
              className={viewMode === 'kanban' ? 'btn-primary' : 'btn-ghost'}
              style={{
                padding: '6px 12px',
                fontSize: '12px',
                borderRadius: 'var(--radius-sm)',
                boxShadow: viewMode === 'kanban' ? 'var(--neu-raised-sm)' : 'none'
              }}
            >
              <Kanban size={14} />
              <span>Kanban Board</span>
            </button>
          </div>

          <button onClick={handleExportSelected} className="btn-secondary" style={{ fontSize: '13px' }}>
            <Download size={14} />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel" style={{
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '260px' }}>
          <div className="neu-inset-container" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 12px',
            flex: 1,
            borderRadius: 'var(--radius-md)'
          }}>
            <Search size={15} color="var(--ink-500)" />
            <input
              type="text"
              placeholder="Search by order #, customer, city, or item name..."
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
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="input-neu"
            style={{ padding: '6px 10px', fontSize: '12px', width: 'auto' }}
          >
            <option value="all">All Statuses</option>
            <option value="placed">Placed</option>
            <option value="packed">Packed</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="returned">Returned</option>
          </select>

          {/* Channel Filter */}
          <select
            value={channelFilter}
            onChange={e => setChannelFilter(e.target.value)}
            className="input-neu"
            style={{ padding: '6px 10px', fontSize: '12px', width: 'auto' }}
          >
            <option value="all">All Channels</option>
            <option value="shopify">Shopify Storefront</option>
            <option value="instagram">Instagram Shop</option>
            <option value="marketplace">Amazon Marketplace</option>
            <option value="pos">Retail POS Store</option>
          </select>
        </div>
      </div>

      {/* Main View Area: Table or Kanban */}
      {viewMode === 'table' ? (
        /* Dense Table View (PRD §8.2) */
        <div className="orbit-table-wrapper">
          <table className="orbit-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}>
                  <button
                    onClick={toggleSelectAll}
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--ink-500)' }}
                  >
                    {selectedOrderIds.length > 0 && selectedOrderIds.length === filteredOrders.length ? (
                      <CheckSquare size={16} color="var(--brand-gold)" />
                    ) : (
                      <Square size={16} />
                    )}
                  </button>
                </th>
                <th>Order</th>
                <th>Channel</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Status</th>
                <th>Total</th>
                <th>Tracking</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '40px', color: 'var(--ink-500)' }}>
                    No orders match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map(order => {
                  const isSelected = selectedOrderIds.includes(order.id);
                  let statusBadge = 'badge-neutral';
                  if (order.status === 'placed') statusBadge = 'badge-warning';
                  if (order.status === 'packed') statusBadge = 'badge-info';
                  if (order.status === 'shipped') statusBadge = 'badge-gold';
                  if (order.status === 'delivered') statusBadge = 'badge-success';
                  if (order.status === 'returned') statusBadge = 'badge-error';

                  return (
                    <tr
                      key={order.id}
                      className={isSelected ? 'selected' : ''}
                      style={{ cursor: 'pointer' }}
                      onClick={() => setActiveDrawer({ type: 'order', data: order })}
                    >
                      <td onClick={e => { e.stopPropagation(); toggleSelectOrder(order.id); }}>
                        <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: isSelected ? 'var(--brand-gold)' : 'var(--ink-300)' }}>
                          {isSelected ? <CheckSquare size={16} /> : <Square size={16} />}
                        </button>
                      </td>

                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span className="font-mono" style={{ fontWeight: 600, color: 'var(--ink-900)' }}>
                            {order.orderNumber}
                          </span>
                          {order.presence && order.presence.length > 0 && (
                            <span
                              title={`Viewed by ${order.presence.join(', ')}`}
                              style={{
                                width: '7px',
                                height: '7px',
                                borderRadius: '50%',
                                backgroundColor: 'var(--success-500)'
                              }}
                            />
                          )}
                        </div>
                        <div className="body-small font-mono" style={{ fontSize: '11px' }}>
                          {order.placedAt}
                        </div>
                      </td>

                      <td>
                        <span className={`channel-pill ${order.channel}`}>
                          {order.channel}
                        </span>
                      </td>

                      <td>
                        <div style={{ fontWeight: 500, color: 'var(--ink-900)' }}>{order.customer.name}</div>
                        <div className="body-small">{order.customer.city}</div>
                      </td>

                      <td>
                        <div style={{ fontSize: '13px', color: 'var(--ink-900)' }}>
                          {order.items.map(i => `${i.qty}x ${i.name}`).join(', ')}
                        </div>
                        <div className="body-small">
                          {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                        </div>
                      </td>

                      <td>
                        <span className={`badge ${statusBadge}`} style={{ textTransform: 'capitalize' }}>
                          {order.status}
                        </span>
                      </td>

                      <td>
                        <span className="tabular-numbers" style={{ fontWeight: 600, color: 'var(--ink-900)' }}>
                          ₹{order.total.toLocaleString('en-IN')}
                        </span>
                        <div className="body-small" style={{ fontSize: '11px' }}>
                          {order.paymentMethod}
                        </div>
                      </td>

                      <td>
                        {order.tracking ? (
                          <span className="font-mono body-small" style={{ fontSize: '11px', color: 'var(--ink-700)' }}>
                            {order.tracking}
                          </span>
                        ) : (
                          <span className="body-small" style={{ color: 'var(--ink-300)' }}>—</span>
                        )}
                      </td>

                      <td style={{ textAlign: 'right' }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          <button
                            onClick={() => setActiveDrawer({ type: 'order', data: order })}
                            className="btn-ghost"
                            style={{ padding: '6px', borderRadius: 'var(--radius-sm)' }}
                            title="Inspect order details"
                          >
                            <Eye size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      ) : (
        /* Alternate Kanban Board View (PRD §8.2) */
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, minmax(240px, 1fr))',
          gap: '14px',
          overflowX: 'auto',
          paddingBottom: '16px'
        }}>
          {STATUS_COLUMNS.map(col => {
            const colOrders = filteredOrders.filter(o => o.status === col.key);

            return (
              <div
                key={col.key}
                onDragOver={handleDragOver}
                onDrop={e => handleDrop(e, col.key)}
                className="glass-panel"
                style={{
                  padding: '14px',
                  borderRadius: 'var(--radius-lg)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  minHeight: '520px',
                  background: 'var(--surface-sunken)'
                }}
              >
                {/* Column Header */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingBottom: '10px',
                  borderBottom: `2px solid ${col.color}`
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ink-900)' }}>
                      {col.label}
                    </span>
                    <span className="badge badge-neutral" style={{ fontSize: '11px', padding: '1px 6px' }}>
                      {colOrders.length}
                    </span>
                  </div>
                </div>

                {/* Cards List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
                  {colOrders.map(order => (
                    <div
                      key={order.id}
                      draggable
                      onDragStart={e => handleDragStart(e, order.id)}
                      onClick={() => setActiveDrawer({ type: 'order', data: order })}
                      className="neu-card"
                      style={{
                        padding: '12px',
                        cursor: 'grab',
                        borderLeft: `4px solid ${col.color}`,
                        borderRadius: 'var(--radius-md)',
                        position: 'relative'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span className="font-mono" style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ink-900)' }}>
                          {order.orderNumber}
                        </span>
                        <span className={`channel-pill ${order.channel}`} style={{ fontSize: '9px', padding: '1px 6px' }}>
                          {order.channel}
                        </span>
                      </div>

                      <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink-900)' }}>
                        {order.customer.name}
                      </div>

                      <div className="body-small" style={{ fontSize: '11px', marginTop: '2px' }}>
                        {order.items.length} items • {order.customer.city}
                      </div>

                      <div style={{
                        marginTop: '10px',
                        paddingTop: '8px',
                        borderTop: '1px solid var(--border-subtle)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <span className="tabular-numbers" style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ink-900)' }}>
                          ₹{order.total.toLocaleString('en-IN')}
                        </span>

                        {/* Quick Move Click Menu (Accessibility alternative) */}
                        <select
                          value={order.status}
                          onClick={e => e.stopPropagation()}
                          onChange={e => updateOrderStatus(order.id, e.target.value)}
                          className="input-neu"
                          style={{
                            padding: '2px 4px',
                            fontSize: '10px',
                            width: 'auto',
                            boxShadow: 'none'
                          }}
                        >
                          <option value="placed">Move: Placed</option>
                          <option value="packed">Move: Packed</option>
                          <option value="shipped">Move: Shipped</option>
                          <option value="delivered">Move: Delivered</option>
                          <option value="returned">Move: Returned</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Sticky Bottom Bulk Selection Action Bar (PRD §8.2) */}
      {selectedOrderIds.length > 0 && (
        <div
          className="glass-panel"
          style={{
            position: 'fixed',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 99,
            padding: '12px 24px',
            borderRadius: 'var(--radius-full)',
            boxShadow: '0 16px 40px rgba(0, 0, 0, 0.25), var(--neu-raised)',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            animation: 'modalSlideDown 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-gold font-mono" style={{ fontSize: '12px' }}>
              {selectedOrderIds.length} Selected
            </span>
            <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--ink-900)' }}>
              Bulk Actions:
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => bulkUpdateOrdersStatus('packed')}
              className="btn-primary"
              style={{ padding: '6px 14px', fontSize: '12px' }}
            >
              <CheckCircle size={14} />
              <span>Mark Packed</span>
            </button>

            <button
              onClick={() => bulkUpdateOrdersStatus('shipped')}
              className="btn-secondary"
              style={{ padding: '6px 14px', fontSize: '12px' }}
            >
              <Truck size={14} />
              <span>Mark Shipped</span>
            </button>

            <button
              onClick={handleExportSelected}
              className="btn-secondary"
              style={{ padding: '6px 14px', fontSize: '12px' }}
            >
              <Download size={14} />
              <span>Export CSV</span>
            </button>

            <button
              onClick={() => setSelectedOrderIds([])}
              className="btn-ghost"
              style={{ padding: '6px 12px', fontSize: '12px', color: 'var(--ink-500)' }}
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Slide-out Order Detail Drawer */}
      <OrderDetailDrawer />
    </div>
  );
};
