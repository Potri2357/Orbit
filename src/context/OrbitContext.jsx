import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  INITIAL_CHANNELS,
  INITIAL_INVENTORY,
  INITIAL_ORDERS,
  INITIAL_INVOICES,
  INITIAL_ACTIVITIES,
  TEAM_MEMBERS
} from '../data/mockData';
import {
  fetchDocType,
  updateDoc,
  callFrappeMethod,
  initWebSocket,
  getBackendUrl
} from '../api/frappeClient';

const OrbitContext = createContext(null);

export const OrbitProvider = ({ children }) => {
  // Theme State
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('orbit_theme') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('orbit_theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, []);

  // Active View & Navigation
  const [activeView, setActiveView] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Ravi Warehouse Mobile Mode
  const [isWarehouseMobileMode, setIsWarehouseMobileMode] = useState(false);

  // Active Persona
  const [activePersona, setActivePersona] = useState(TEAM_MEMBERS[1]); // Arjun (Ops Manager)

  // Core Data (Starts with fallback, populated by Frappe DB)
  const [channels, setChannels] = useState(INITIAL_CHANNELS);
  const [inventory, setInventory] = useState(INITIAL_INVENTORY);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [invoices, setInvoices] = useState(INITIAL_INVOICES);
  const [activities, setActivities] = useState(INITIAL_ACTIVITIES);

  // Backend connection status
  const [backendStatus, setBackendStatus] = useState('connecting'); // 'connected' | 'disconnected'
  const [isLiveSimulating, setIsLiveSimulating] = useState(true);
  const [lastLivePulse, setLastLivePulse] = useState(Date.now());

  // Bulk Selection
  const [selectedOrderIds, setSelectedOrderIds] = useState([]);

  // Drawers & Modals
  const [activeDrawer, setActiveDrawer] = useState(null);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);

  // Undo / Toast Stack
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ type = 'info', title, message, undoAction = null, duration = 5000 }) => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4);
    const newToast = { id, type, title, message, undoAction, duration, createdAt: Date.now() };

    setToasts(prev => [newToast, ...prev].slice(0, 5));

    if (duration > 0) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, duration);
    }
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const triggerUndo = useCallback((toastId) => {
    const toast = toasts.find(t => t.id === toastId);
    if (toast && typeof toast.undoAction === 'function') {
      toast.undoAction();
      removeToast(toastId);
      addToast({
        type: 'info',
        title: 'Action Undone',
        message: 'Your previous action was safely restored.',
        duration: 3000
      });
    }
  }, [toasts, addToast, removeToast]);

  const triggerPulse = useCallback(() => {
    setLastLivePulse(Date.now());
  }, []);

  // Fetch initial data from Frappe SQLite Backend
  const reloadDataFromBackend = useCallback(async () => {
    try {
      const [itemsData, ordersData, invoicesData, channelsData, activitiesData] = await Promise.all([
        fetchDocType('Item').catch(() => null),
        fetchDocType('Sales Order').catch(() => null),
        fetchDocType('Sales Invoice').catch(() => null),
        fetchDocType('Orbit Channel').catch(() => null),
        fetchDocType('Orbit Activity').catch(() => null)
      ]);

      if (itemsData) setInventory(itemsData);
      if (ordersData) setOrders(ordersData);
      if (invoicesData) setInvoices(invoicesData);
      if (channelsData) setChannels(channelsData);
      if (activitiesData && activitiesData.length > 0) setActivities(activitiesData);
      setBackendStatus('connected');
    } catch (err) {
      console.warn('Backend fetch failed, using fallback memory state:', err);
      setBackendStatus('disconnected');
    }
  }, []);

  // Initialize DB and WebSocket
  useEffect(() => {
    reloadDataFromBackend();

    const cleanupWs = initWebSocket(
      (msg) => {
        triggerPulse();
        console.log('[WebSocket Event Received]:', msg.event);

        if (msg.event === 'new_sale') {
          reloadDataFromBackend();
          addToast({
            type: 'info',
            title: `⚡ Live Order: ${msg.data.orderNumber}`,
            message: `${msg.data.customer} purchased via ${msg.data.channel.toUpperCase()} for ₹${msg.data.total.toLocaleString('en-IN')}`,
            duration: 6000
          });
        } else if (msg.event === 'order_updated' || msg.event === 'orders_bulk_updated') {
          reloadDataFromBackend();
        } else if (msg.event === 'stock_updated') {
          reloadDataFromBackend();
        } else if (msg.event === 'channels_synced') {
          reloadDataFromBackend();
        }
      },
      (status) => {
        setBackendStatus(status);
      }
    );

    return () => cleanupWs();
  }, [reloadDataFromBackend, triggerPulse, addToast]);

  // Update Order Status (Optimistic + Backend Persist)
  const updateOrderStatus = useCallback(async (orderId, newStatus) => {
    let previousOrder = null;

    setOrders(prevOrders => {
      return prevOrders.map(ord => {
        if (ord.id === orderId) {
          previousOrder = { ...ord };
          return { ...ord, status: newStatus };
        }
        return ord;
      });
    });

    triggerPulse();

    // Call Frappe backend
    try {
      await updateDoc('Sales Order', orderId, { status: newStatus });
    } catch (e) {
      console.warn('Backend update failed:', e);
    }

    if (previousOrder) {
      const prevStatus = previousOrder.status;
      addToast({
        type: 'success',
        title: `Order ${previousOrder.orderNumber} ${newStatus.toUpperCase()}`,
        message: `Status transitioned from ${prevStatus} to ${newStatus}.`,
        duration: 5000,
        undoAction: async () => {
          setOrders(ordersList =>
            ordersList.map(o => o.id === orderId ? { ...o, status: prevStatus } : o)
          );
          await updateDoc('Sales Order', orderId, { status: prevStatus }).catch(() => {});
          triggerPulse();
        }
      });
    }
  }, [addToast, triggerPulse]);

  // Bulk update orders
  const bulkUpdateOrdersStatus = useCallback(async (targetStatus) => {
    if (selectedOrderIds.length === 0) return;
    const count = selectedOrderIds.length;
    const previousSnapshot = [...orders];

    setOrders(prev => prev.map(o => selectedOrderIds.includes(o.id) ? { ...o, status: targetStatus } : o));
    setSelectedOrderIds([]);
    triggerPulse();

    try {
      await callFrappeMethod('orbit.bulk_update_orders', {
        orderIds: selectedOrderIds,
        targetStatus
      });
    } catch (e) {
      console.warn('Bulk update backend error:', e);
    }

    addToast({
      type: 'success',
      title: `${count} Orders marked ${targetStatus}`,
      message: `Bulk operation applied and synced to Frappe DB.`,
      duration: 5000,
      undoAction: () => {
        setOrders(previousSnapshot);
        triggerPulse();
      }
    });
  }, [selectedOrderIds, orders, addToast, triggerPulse]);

  // Inline edit SKU quantity
  const updateSkuChannelStock = useCallback(async (skuId, channelKey, newQty) => {
    const qtyVal = Math.max(0, parseInt(newQty, 10) || 0);

    setInventory(prev => prev.map(item => {
      if (item.id === skuId) {
        const updatedChannels = { ...item.channels, [channelKey]: qtyVal };
        const newTotal = Object.values(updatedChannels).reduce((a, b) => a + b, 0);

        return {
          ...item,
          channels: updatedChannels,
          totalAvailable: newTotal
        };
      }
      return item;
    }));

    triggerPulse();

    try {
      await callFrappeMethod('orbit.update_stock', {
        skuId,
        channelKey,
        newQty: qtyVal,
        staff: activePersona.name
      });
    } catch (e) {
      console.warn('Backend stock update failed:', e);
    }

    addToast({
      type: 'info',
      title: `Stock updated for ${skuId}`,
      message: `${channelKey} quantity adjusted to ${newQty}. Persisted to Frappe DB.`,
      duration: 3500
    });
  }, [activePersona.name, addToast, triggerPulse]);

  // Manual Channel Sync
  const syncAllChannels = useCallback(async () => {
    triggerPulse();

    try {
      await callFrappeMethod('orbit.sync_channels');
      await reloadDataFromBackend();
    } catch (e) {
      console.warn('Channel sync error:', e);
    }

    addToast({
      type: 'success',
      title: 'Multi-Channel Sync Complete',
      message: 'Zero stock drift across Shopify, Instagram, Marketplaces, and POS.',
      duration: 4000
    });
  }, [reloadDataFromBackend, addToast, triggerPulse]);

  // Simulate an incoming live order
  const simulateIncomingSale = useCallback(async () => {
    try {
      await callFrappeMethod('orbit.simulate_sale');
      triggerPulse();
    } catch (e) {
      console.warn('Backend sale simulation failed, using local simulation:', e);
    }
  }, [triggerPulse]);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      } else if (e.key === '?' && !['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
        e.preventDefault();
        setIsShortcutsModalOpen(prev => !prev);
      } else if (e.key === 'Escape') {
        setIsCommandPaletteOpen(false);
        setIsShortcutsModalOpen(false);
        setActiveDrawer(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const value = {
    theme,
    toggleTheme,
    activeView,
    setActiveView,
    sidebarCollapsed,
    setSidebarCollapsed,
    isWarehouseMobileMode,
    setIsWarehouseMobileMode,
    activePersona,
    setActivePersona,
    channels,
    inventory,
    orders,
    invoices,
    activities,
    backendStatus,
    backendUrl: getBackendUrl(),
    isLiveSimulating,
    setIsLiveSimulating,
    lastLivePulse,
    triggerPulse,
    selectedOrderIds,
    setSelectedOrderIds,
    activeDrawer,
    setActiveDrawer,
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    isShortcutsModalOpen,
    setIsShortcutsModalOpen,
    toasts,
    addToast,
    removeToast,
    triggerUndo,
    updateOrderStatus,
    bulkUpdateOrdersStatus,
    updateSkuChannelStock,
    syncAllChannels,
    simulateIncomingSale
  };

  return (
    <OrbitContext.Provider value={value}>
      {children}
    </OrbitContext.Provider>
  );
};

export const useOrbit = () => {
  const context = useContext(OrbitContext);
  if (!context) {
    throw new Error('useOrbit must be used within an OrbitProvider');
  }
  return context;
};
