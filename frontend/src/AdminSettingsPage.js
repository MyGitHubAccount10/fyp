import React, { useState } from 'react';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('General');
  const [maintenanceEnabled, setMaintenanceEnabled] = useState(false);

  const tabs = ['General', 'Store Details', 'Payment', 'Shipping'];

  const containerStyle = {
    maxWidth: '700px',
    margin: '40px auto',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.05)',
    fontFamily: 'sans-serif',
    border: '1px solid #ddd'
  };

  const tabHeaderStyle = {
    display: 'flex',
    backgroundColor: '#f9f9f9',
    borderBottom: '1px solid #ddd',
    borderTopLeftRadius: '8px',
    borderTopRightRadius: '8px',
    overflow: 'hidden'
  };

  const tabStyle = (tab) => ({
    padding: '12px 20px',
    cursor: 'pointer',
    backgroundColor: activeTab === tab ? '#ffffff' : '#f3f4f6',
    fontWeight: activeTab === tab ? 'bold' : 'normal',
    borderBottom: activeTab === tab ? '2px solid #f97316' : '2px solid transparent',
    color: activeTab === tab ? '#f97316' : '#333',
    transition: 'all 0.2s ease',
    borderRight: '1px solid #ddd'
  });

  const labelStyle = {
    fontWeight: 'bold',
    marginTop: '20px',
    display: 'block',
    marginBottom: '6px'
  };

  const inputStyle = {
    width: '100%',
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: '4px'
  };

  return (
    <div style={containerStyle}>
      <div style={tabHeaderStyle}>
        {tabs.map((tab, index) => (
          <div
            key={index}
            style={{
              ...tabStyle(tab),
              borderTopLeftRadius: index === 0 ? '8px' : '0',
              borderTopRightRadius: index === tabs.length - 1 ? '8px' : '0'
            }}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </div>
        ))}
      </div>

      {activeTab === 'General' && (
        <div style={{ marginTop: '20px' }}>
          <h3 style={{ marginBottom: '10px' }}>Site Identity</h3>

          <label style={labelStyle}>Site Title</label>
          <input style={inputStyle} type="text" defaultValue="This Side Up" />

          <label style={labelStyle}>Tagline</label>
          <input style={inputStyle} type="text" defaultValue="Skimboards, Supplies, & Beach Apparel" />

          <label style={labelStyle}>Admin Email Address</label>
          <input style={inputStyle} type="email" defaultValue="admin@thissideup.com" />

          <label style={labelStyle}>Logo Upload</label>
          <input style={inputStyle} type="file" accept="image/*" />

          <label style={labelStyle}>Favicon Upload</label>
          <input style={inputStyle} type="file" accept="image/*" />

          <label style={{ ...labelStyle, marginTop: '30px' }}>Site Identity</label>
          <div style={{ marginBottom: '10px' }}>
            <input
              type="checkbox"
              checked={maintenanceEnabled}
              onChange={(e) => setMaintenanceEnabled(e.target.checked)}
            />{' '}
            Enable Maintenance Mode
            <div style={{ fontSize: '12px', color: '#555' }}>
              If enabled, your site displays a maintenance page to visitors. Admins can still access the site.
            </div>
          </div>

          <label style={labelStyle}>Maintenance Mode Message</label>
          <textarea
            style={{ ...inputStyle, height: '80px' }}
            defaultValue="We are currently performing scheduled maintenance. We should be back online shortly!"
          />
        </div>
      )}
    </div>
  );
}
