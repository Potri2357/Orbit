import React, { useState } from 'react';
import { OrbitProvider, useOrbit } from './context/OrbitContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { MobileTabBar } from './components/common/MobileTabBar';
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

const MainLayout = () => {
  const { activeView } = useOrbit();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    <div className="orbit-app-layout" style={{ display: 'flex', minHeight: '100vh', width: '100%', position: 'relative' }}>
      {/* Persistent Left Navigation Rail / Mobile Drawer */}
      <Sidebar
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Workspace Column */}
      <div className="orbit-main-column" style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
        height: '100vh',
        overflowY: 'auto'
      }}>
        <Header onToggleMobileSidebar={() => setIsMobileMenuOpen(prev => !prev)} />

        <main className="orbit-main-content" style={{
          flex: 1,
          padding: '20px 24px 48px 24px',
          maxWidth: '1600px',
          width: '100%'
        }}>
          {renderActiveView()}
        </main>
      </div>

      {/* Mobile Bottom Tab Bar */}
      <MobileTabBar />

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
