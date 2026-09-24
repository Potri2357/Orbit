import React, { useState } from 'react';
import { useOrbit } from '../../context/OrbitContext';
import { Settings, Building, MapPin, Bell, Key, CheckCircle, Save } from 'lucide-react';

export const SettingsView = () => {
  const { addToast } = useOrbit();
  const [activeTab, setActiveTab] = useState('general');

  const [companyName, setCompanyName] = useState('Aura Studios Lifestyle Pvt Ltd');
  const [gstin, setGstin] = useState('29AABCS1429B1Z0');
  const [primaryWarehouse, setPrimaryWarehouse] = useState('Bengaluru Main Hub (Whitefield)');

  const handleSave = (e) => {
    e.preventDefault();
    addToast({
      type: 'success',
      title: 'Settings Saved',
      message: 'Workspace configurations updated and propagated to all endpoints.',
      duration: 3500
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h1 className="h1-title" style={{ color: 'var(--ink-900)' }}>Platform Settings & Infrastructure</h1>
        <p className="body-small">Brand identity, warehouse nodes, GST taxation rules, and API authentication</p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 2fr)',
        gap: '20px'
      }}>
        {/* Left Settings Nav */}
        <div className="glass-panel" style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '4px', height: 'fit-content' }}>
          <button
            onClick={() => setActiveTab('general')}
            className={activeTab === 'general' ? 'btn-primary' : 'btn-ghost'}
            style={{ width: '100%', justifyContent: 'flex-start', padding: '10px 14px' }}
          >
            <Building size={16} />
            <span>Brand & Legal Entity</span>
          </button>

          <button
            onClick={() => setActiveTab('warehouses')}
            className={activeTab === 'warehouses' ? 'btn-primary' : 'btn-ghost'}
            style={{ width: '100%', justifyContent: 'flex-start', padding: '10px 14px' }}
          >
            <MapPin size={16} />
            <span>Warehouse Locations (3)</span>
          </button>

          <button
            onClick={() => setActiveTab('api')}
            className={activeTab === 'api' ? 'btn-primary' : 'btn-ghost'}
            style={{ width: '100%', justifyContent: 'flex-start', padding: '10px 14px' }}
          >
            <Key size={16} />
            <span>API Keys & Frappe Backend</span>
          </button>
        </div>

        {/* Right Tab Content */}
        <div className="neu-card" style={{ padding: '24px' }}>
          {activeTab === 'general' && (
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h2 className="h2-title" style={{ fontSize: '18px' }}>Brand & GST Entity Profile</h2>

              <div>
                <label className="label-caps" style={{ display: 'block', marginBottom: '6px' }}>Registered Legal Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  className="input-neu"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label className="label-caps" style={{ display: 'block', marginBottom: '6px' }}>GSTIN Number</label>
                  <input
                    type="text"
                    value={gstin}
                    onChange={e => setGstin(e.target.value)}
                    className="input-neu font-mono"
                  />
                </div>

                <div>
                  <label className="label-caps" style={{ display: 'block', marginBottom: '6px' }}>State Jurisdiction</label>
                  <input
                    type="text"
                    defaultValue="Karnataka (KA - 29)"
                    readOnly
                    className="input-neu"
                  />
                </div>
              </div>

              <div>
                <label className="label-caps" style={{ display: 'block', marginBottom: '6px' }}>Support & Ops Email</label>
                <input
                  type="email"
                  defaultValue="ops@aurastudios.in"
                  className="input-neu"
                />
              </div>

              <div style={{ marginTop: '12px' }}>
                <button type="submit" className="btn-primary" style={{ padding: '8px 20px' }}>
                  <Save size={15} />
                  <span>Save Profile</span>
                </button>
              </div>
            </form>
          )}

          {activeTab === 'warehouses' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h2 className="h2-title" style={{ fontSize: '18px' }}>Active Warehouse Nodes</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div className="neu-inset-container" style={{ padding: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontWeight: 600, color: 'var(--ink-900)' }}>Bengaluru Central Fulfillment Hub</div>
                    <span className="badge badge-success">Primary Hub</span>
                  </div>
                  <div className="body-small" style={{ marginTop: '4px' }}>
                    Plot 44, Hoodi Industrial Area, Whitefield, Bengaluru 560048 • 18,000 sqft
                  </div>
                </div>

                <div className="neu-inset-container" style={{ padding: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontWeight: 600, color: 'var(--ink-900)' }}>Mumbai Sub-Hub (Bhiwandi)</div>
                    <span className="badge badge-neutral">Secondary</span>
                  </div>
                  <div className="body-small" style={{ marginTop: '4px' }}>
                    Bldg 3, Renaissance Logistic Park, Bhiwandi, MH 421302 • 8,500 sqft
                  </div>
                </div>

                <div className="neu-inset-container" style={{ padding: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontWeight: 600, color: 'var(--ink-900)' }}>Indiranagar 100ft Flagship Store & Mini-Hub</div>
                    <span className="badge badge-neutral">POS Store Stock</span>
                  </div>
                  <div className="body-small" style={{ marginTop: '4px' }}>
                    100 Feet Rd, HAL 2nd Stage, Indiranagar, Bengaluru 560038
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'api' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h2 className="h2-title" style={{ fontSize: '18px' }}>Frappe Engine & API Integrations</h2>
              
              <div>
                <label className="label-caps" style={{ display: 'block', marginBottom: '6px' }}>Frappe Core API Host</label>
                <input
                  type="text"
                  readOnly
                  defaultValue="https://frappe.aurastudios.orbitops.io"
                  className="input-neu font-mono"
                />
              </div>

              <div>
                <label className="label-caps" style={{ display: 'block', marginBottom: '6px' }}>Production API Key</label>
                <input
                  type="password"
                  readOnly
                  defaultValue="orb_live_9941a87b12d88e01923c"
                  className="input-neu font-mono"
                />
              </div>

              <div style={{ padding: '12px', borderRadius: 'var(--radius-md)', background: 'var(--surface-sunken)', fontSize: '12px' }}>
                WebSocket realtime connection is authenticated using JWT with SHA256 payload signing.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
