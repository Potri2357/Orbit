import React from 'react';
import { OrbitProvider, useOrbit } from './context/OrbitContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { ToastContainer } from './components/common/ToastContainer';
import { CommandPalette } from './components/common/CommandPalette';
import { KeyboardShortcutsModal } from './components/common/KeyboardShortcutsModal';
import { DashboardView } from './components/dashboard/DashboardView';
import { OrdersView } from './components/orders/OrdersView';
import { InventoryView } from './components/inventory/InventoryView';
import { AccountingView } from './components/accounting/AccountingView';
import { ChannelsView } from './components/channels/ChannelsView';
import { TeamView } from './components/team/TeamView';
import { SettingsView } from './components/settings/SettingsView';
import { WarehouseMobileView } from './components/warehouse/WarehouseMobileView';

const MainLayout = () => {
  const { activeView, isWarehouseMobileMode } = useOrbit();

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView />;
      case 'orders':
        return <OrdersView />;
      case 'inventory':
        return <InventoryView />;
      case 'accounting':
        return <AccountingView />;
      case 'channels':
        return <ChannelsView />;
      case 'team':
        return <TeamView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%', position: 'relative' }}>
      {/* Persistent Left Navigation Rail */}
      <Sidebar />

      {/* Main Workspace Column */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
        height: '100vh',
        overflowY: 'auto'
      }}>
        <Header />

        <main style={{
          flex: 1,
          padding: '20px 24px 48px 24px',
          maxWidth: '1600px',
          width: '100%'
        }}>
          {renderActiveView()}
        </main>
      </div>

      {/* Ravi's Dedicated Warehouse Mode Overlay */}
      {isWarehouseMobileMode && <WarehouseMobileView />}

      {/* Global Interactive Overlays */}
      <CommandPalette />
      <KeyboardShortcutsModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <OrbitProvider>
      <MainLayout />
    </OrbitProvider>
  );
}
