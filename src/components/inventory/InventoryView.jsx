import React, { useState } from 'react';
import { useOrbit } from '../../context/OrbitContext';
import {
  Package,
  Search,
  Filter,
  Plus,
  AlertTriangle,
  ArrowUpDown,
  Download,
  Check,
  Edit2,
  Eye,
  RefreshCw
} from 'lucide-react';
import { SkuDetailDrawer } from './SkuDetailDrawer';

export const InventoryView = () => {
  const {
    inventory,
    updateSkuChannelStock,
    setActiveDrawer,
    addToast
  } = useOrbit();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [onlyLowStock, setOnlyLowStock] = useState(false);
  const [editingCell, setEditingCell] = useState(null); // { skuId, channelKey, value }
  const [flashingCell, setFlashingCell] = useState(null); // `${skuId}-${channelKey}`

  // Filter products
  const filteredItems = inventory.filter(item => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesLowStock = !onlyLowStock || item.totalAvailable <= item.threshold;

    return matchesSearch && matchesCategory && matchesLowStock;
  });

  const categories = ['all', ...new Set(inventory.map(i => i.category))];

  // Inline editing commit
  const handleCellBlur = (skuId, channelKey) => {
    if (!editingCell) return;
    const val = parseInt(editingCell.value, 10);
    if (!isNaN(val) && val >= 0) {
      updateSkuChannelStock(skuId, channelKey, val);
      setFlashingCell(`${skuId}-${channelKey}`);
      setTimeout(() => setFlashingCell(null), 1200);
    }
    setEditingCell(null);
  };

  const handleCellKeyDown = (e, skuId, channelKey) => {
    if (e.key === 'Enter') {
      handleCellBlur(skuId, channelKey);
    } else if (e.key === 'Escape') {
      setEditingCell(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="h1-title" style={{ color: 'var(--ink-900)' }}>Unified Inventory & Stock Matrix</h1>
          <p className="body-small">Single source of truth synchronized across Shopify, Instagram, Amazon and POS</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => {
              addToast({
                type: 'info',
                title: 'New PO Draft Created',
                message: 'Purchase Order #PO-2024-091 initialized for linen mills.',
                duration: 3500
              });
            }}
            className="btn-primary"
            style={{ fontSize: '13px' }}
          >
            <Plus size={15} />
            <span>Create Purchase Order</span>
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
              placeholder="Search by SKU ID, product name, or category..."
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="input-neu"
            style={{ padding: '6px 10px', fontSize: '12px', width: 'auto' }}
          >
            {categories.map(c => (
              <option key={c} value={c}>
                {c === 'all' ? 'All Categories' : c}
              </option>
            ))}
          </select>

          {/* Low Stock Toggle */}
          <button
            onClick={() => setOnlyLowStock(prev => !prev)}
            className={onlyLowStock ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '6px 12px', fontSize: '12px', borderRadius: 'var(--radius-md)' }}
          >
            <AlertTriangle size={14} color={onlyLowStock ? '#14141A' : 'var(--warning-500)'} />
            <span>Low Stock Only</span>
          </button>
        </div>
      </div>

      {/* Stock Matrix Table (PRD §8.3) */}
      <div className="orbit-table-wrapper">
        <table className="orbit-table">
          <thead>
            <tr>
              <th>SKU / Product</th>
              <th>Category</th>
              <th>Unit Price</th>
              <th style={{ textAlign: 'center' }}>
                <span className="channel-pill shopify" style={{ fontSize: '10px' }}>Shopify</span>
              </th>
              <th style={{ textAlign: 'center' }}>
                <span className="channel-pill instagram" style={{ fontSize: '10px' }}>Instagram</span>
              </th>
              <th style={{ textAlign: 'center' }}>
                <span className="channel-pill marketplace" style={{ fontSize: '10px' }}>Marketplace</span>
              </th>
              <th style={{ textAlign: 'center' }}>
                <span className="channel-pill pos" style={{ fontSize: '10px' }}>Retail POS</span>
              </th>
              {/* Bold Total Available Column (PRD §8.3: "single 'Total Available' column visually distinct as the one source of truth") */}
              <th style={{
                textAlign: 'center',
                background: 'var(--brand-gold-subtle)',
                color: 'var(--ink-900)',
                fontWeight: 700
              }}>
                Total Available
              </th>
              <th style={{ textAlign: 'center' }}>Safety Limit</th>
              <th style={{ textAlign: 'right' }}>Audit</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan="10" style={{ textAlign: 'center', padding: '40px', color: 'var(--ink-500)' }}>
                  No inventory items match the current filters.
                </td>
              </tr>
            ) : (
              filteredItems.map(item => {
                const isLow = item.totalAvailable <= item.threshold;
                const ratio = Math.min(100, Math.round((item.totalAvailable / (item.threshold * 2)) * 100));

                return (
                  <tr
                    key={item.id}
                    style={{ position: 'relative', cursor: 'pointer' }}
                    onClick={() => setActiveDrawer({ type: 'sku', data: item })}
                  >
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--ink-900)', fontSize: '13px' }}>
                            {item.name}
                          </div>
                          <div className="font-mono body-small" style={{ fontSize: '11px', color: 'var(--ink-500)' }}>
                            {item.id} • HSN {item.hsn}
                          </div>
                        </div>
                      </div>

                      {/* Thin Low-Stock Indicator Bar (PRD §8.3) */}
                      <div style={{
                        marginTop: '6px',
                        height: '3px',
                        width: '100%',
                        borderRadius: 'var(--radius-full)',
                        background: 'var(--surface-sunken)',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          height: '100%',
                          width: `${ratio}%`,
                          background: isLow
                            ? 'linear-gradient(90deg, var(--error-500), var(--warning-500))'
                            : 'var(--success-500)'
                        }} />
                      </div>
                    </td>

                    <td>
                      <span className="badge badge-neutral" style={{ fontSize: '11px' }}>
                        {item.category}
                      </span>
                    </td>

                    <td>
                      <span className="tabular-numbers" style={{ fontWeight: 500 }}>
                        ₹{item.unitPrice.toLocaleString('en-IN')}
                      </span>
                    </td>

                    {/* Channel Columns with Inline Quantity Editing (PRD §8.3) */}
                    {['shopify', 'instagram', 'marketplace', 'pos'].map(channelKey => {
                      const cellId = `${item.id}-${channelKey}`;
                      const isEditing = editingCell && editingCell.skuId === item.id && editingCell.channelKey === channelKey;
                      const isFlashing = flashingCell === cellId;

                      return (
                        <td
                          key={channelKey}
                          style={{ textAlign: 'center' }}
                          onClick={e => {
                            e.stopPropagation();
                            setEditingCell({ skuId: item.id, channelKey, value: item.channels[channelKey] });
                          }}
                        >
                          {isEditing ? (
                            <input
                              type="number"
                              min="0"
                              autoFocus
                              value={editingCell.value}
                              onChange={e => setEditingCell(prev => ({ ...prev, value: e.target.value }))}
                              onBlur={() => handleCellBlur(item.id, channelKey)}
                              onKeyDown={e => handleCellKeyDown(e, item.id, channelKey)}
                              className="input-neu tabular-numbers"
                              style={{
                                width: '60px',
                                padding: '4px 6px',
                                textAlign: 'center',
                                fontSize: '13px',
                                fontWeight: 700
                              }}
                            />
                          ) : (
                            <span
                              className={`tabular-numbers ${isFlashing ? 'flash-updated' : ''}`}
                              title="Click to inline-edit quantity"
                              style={{
                                padding: '4px 8px',
                                borderRadius: '4px',
                                display: 'inline-block',
                                background: isFlashing ? 'rgba(30, 142, 90, 0.2)' : 'transparent',
                                border: '1px dashed transparent',
                                cursor: 'text',
                                fontWeight: 600,
                                color: 'var(--ink-900)'
                              }}
                              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--brand-gold)'}
                              onMouseLeave={e => e.currentTarget.style.borderColor = 'transparent'}
                            >
                              {item.channels[channelKey]}
                            </span>
                          )}
                        </td>
                      );
                    })}

                    {/* Total Available Column (Prominent source of truth) */}
                    <td style={{
                      textAlign: 'center',
                      background: 'var(--brand-gold-subtle)',
                      fontWeight: 700
                    }}>
                      <span className="tabular-numbers" style={{
                        fontSize: '15px',
                        color: isLow ? 'var(--error-500)' : 'var(--ink-900)'
                      }}>
                        {item.totalAvailable}
                      </span>
                    </td>

                    <td style={{ textAlign: 'center' }}>
                      <span className="body-small tabular-numbers font-mono" style={{ color: 'var(--ink-500)' }}>
                        {item.threshold} units
                      </span>
                    </td>

                    <td style={{ textAlign: 'right' }} onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => setActiveDrawer({ type: 'sku', data: item })}
                        className="btn-ghost"
                        style={{ padding: '6px', borderRadius: 'var(--radius-sm)' }}
                        title="View stock movement audit history"
                      >
                        <Eye size={15} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Detail Drawer */}
      <SkuDetailDrawer />
    </div>
  );
};
