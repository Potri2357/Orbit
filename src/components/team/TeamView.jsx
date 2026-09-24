import React from 'react';
import { useOrbit } from '../../context/OrbitContext';
import { TEAM_MEMBERS } from '../../data/mockData';
import { Users, Shield, Check, Lock, Smartphone, Laptop, Radio } from 'lucide-react';

export const TeamView = () => {
  const { activePersona, setActivePersona, setIsWarehouseMobileMode, addToast } = useOrbit();

  const PERMISSION_MODULES = [
    { name: 'Dashboard & Founder KPIs', roles: ['Founder / CEO', 'Operations Manager', 'Head of Finance'] },
    { name: 'Order Processing & Kanban', roles: ['Founder / CEO', 'Operations Manager', 'Warehouse Lead'] },
    { name: 'Inventory Stock Matrix & Restock POs', roles: ['Founder / CEO', 'Operations Manager', 'Head of Finance'] },
    { name: 'Invoicing, GST & Bank Reconciliation', roles: ['Founder / CEO', 'Head of Finance'] },
    { name: 'Omnichannel Webhooks & API Keys', roles: ['Founder / CEO', 'Operations Manager'] },
    { name: 'Mobile Barcode Scanner & Rapid Packing', roles: ['Operations Manager', 'Warehouse Lead'] }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div>
        <h1 className="h1-title" style={{ color: 'var(--ink-900)' }}>Team, Personas & Role Access</h1>
        <p className="body-small">Multi-user access control designed for specialized D2C operational personas</p>
      </div>

      {/* Team Members Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '16px'
      }}>
        {TEAM_MEMBERS.map(member => {
          const isCurrent = member.id === activePersona.id;

          return (
            <div
              key={member.id}
              className="neu-card"
              style={{
                padding: '20px',
                border: isCurrent ? '2px solid var(--brand-gold)' : '1px solid var(--border-subtle)',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '16px'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ position: 'relative' }}>
                    <img
                      src={member.avatar}
                      alt={member.name}
                      style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <span style={{
                      position: 'absolute',
                      bottom: '0',
                      right: '0',
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      background: member.status === 'online' ? 'var(--success-500)' : 'var(--warning-500)',
                      border: '2px solid var(--surface-raised)'
                    }} />
                  </div>

                  <div>
                    <h3 className="h3-title" style={{ fontSize: '15px', color: 'var(--ink-900)' }}>
                      {member.name}
                    </h3>
                    <div style={{ fontSize: '12px', color: 'var(--brand-gold)', fontWeight: 600 }}>
                      {member.role}
                    </div>
                  </div>
                </div>

                <div className="body-small font-mono" style={{ fontSize: '11px', marginTop: '12px' }}>
                  {member.email}
                </div>

                <div className="neu-inset-container" style={{ padding: '8px 10px', marginTop: '12px', fontSize: '12px' }}>
                  <div className="label-caps" style={{ fontSize: '9px', marginBottom: '2px' }}>Real-time Focus</div>
                  <div style={{ color: 'var(--ink-700)', fontWeight: 500 }}>
                    {member.currentFocus}
                  </div>
                </div>
              </div>

              <div style={{ paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
                <button
                  onClick={() => {
                    setActivePersona(member);
                    if (member.id === 'u-4') {
                      setIsWarehouseMobileMode(true);
                    }
                    addToast({
                      type: 'info',
                      title: `Active Persona Switched`,
                      message: `Now operating as ${member.name} (${member.role}).`,
                      duration: 3500
                    });
                  }}
                  className={isCurrent ? 'btn-primary' : 'btn-secondary'}
                  style={{ width: '100%', fontSize: '12px', justifyContent: 'center' }}
                >
                  {isCurrent ? 'Current Active User' : 'Operate As This Role'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Permissions Matrix */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <Shield size={18} color="var(--brand-gold)" />
          <h2 className="h2-title" style={{ fontSize: '16px' }}>Role-Based Access Control (RBAC) Matrix</h2>
        </div>

        <div className="orbit-table-wrapper">
          <table className="orbit-table">
            <thead>
              <tr>
                <th>Operations Module</th>
                <th style={{ textAlign: 'center' }}>Founder (Priya)</th>
                <th style={{ textAlign: 'center' }}>Ops Manager (Arjun)</th>
                <th style={{ textAlign: 'center' }}>Finance (Meera)</th>
                <th style={{ textAlign: 'center' }}>Warehouse (Ravi)</th>
              </tr>
            </thead>
            <tbody>
              {PERMISSION_MODULES.map((mod, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 500, color: 'var(--ink-900)' }}>
                    {mod.name}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {mod.roles.includes('Founder / CEO') ? (
                      <Check size={16} color="var(--success-500)" style={{ margin: '0 auto' }} />
                    ) : (
                      <Lock size={14} color="var(--ink-300)" style={{ margin: '0 auto' }} />
                    )}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {mod.roles.includes('Operations Manager') ? (
                      <Check size={16} color="var(--success-500)" style={{ margin: '0 auto' }} />
                    ) : (
                      <Lock size={14} color="var(--ink-300)" style={{ margin: '0 auto' }} />
                    )}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {mod.roles.includes('Head of Finance') ? (
                      <Check size={16} color="var(--success-500)" style={{ margin: '0 auto' }} />
                    ) : (
                      <Lock size={14} color="var(--ink-300)" style={{ margin: '0 auto' }} />
                    )}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {mod.roles.includes('Warehouse Lead') ? (
                      <Check size={16} color="var(--success-500)" style={{ margin: '0 auto' }} />
                    ) : (
                      <Lock size={14} color="var(--ink-300)" style={{ margin: '0 auto' }} />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
