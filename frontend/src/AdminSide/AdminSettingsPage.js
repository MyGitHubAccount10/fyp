import React, { useState } from 'react';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('Store Details'); // Changed default to 'Store Details' for demonstration
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
    flex: 1, // Add flex: 1 to distribute space evenly (as seen in image)
    textAlign: 'center', // Center text in tabs
    padding: '12px 20px',
    cursor: 'pointer',
    backgroundColor: activeTab === tab ? '#ffffff' : '#f3f4f6',
    fontWeight: activeTab === tab ? 'bold' : 'normal',
    borderBottom: activeTab === tab ? '2px solid #f97316' : '2px solid transparent',
    color: activeTab === tab ? '#f97316' : '#333',
    transition: 'all 0.2s ease',
    borderRight: tab !== tabs[tabs.length - 1] ? '1px solid #ddd' : 'none', // Add borderRight except for the last tab
    whiteSpace: 'nowrap' // Prevent text wrapping
  });

  const labelStyle = {
    fontWeight: 'bold',
    marginTop: '20px',
    display: 'block',
    marginBottom: '6px',
    fontSize: '14px' // Adjusted font size slightly
  };

  const inputStyle = {
    width: '100%',
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    boxSizing: 'border-box', // Ensure padding doesn't add to width
    fontSize: '14px' // Adjusted font size slightly
  };

  const sectionHeadingStyle = {
    marginBottom: '10px',
    marginTop: '20px',
    fontSize: '18px',
    fontWeight: 'bold',
    paddingBottom: '8px',
    borderBottom: '1px solid #eee' // Separator line
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

      {/* Content Area */}
      <div style={{ marginTop: '20px' }}>
        {activeTab === 'General' && (
          <div>
            <h3 style={sectionHeadingStyle}>Site Identity</h3>

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

            <h3 style={{ ...sectionHeadingStyle, marginTop: '30px' }}>Maintenance Mode</h3> {/* Corrected heading */}
            <div style={{ marginBottom: '10px' }}>
              <label style={{ fontWeight: 'normal', display: 'inline' }}> {/* Adjust label for checkbox */}
                <input
                  type="checkbox"
                  checked={maintenanceEnabled}
                  onChange={(e) => setMaintenanceEnabled(e.target.checked)}
                  style={{ marginRight: '5px' }} // Add some space
                />
                Enable Maintenance Mode
              </label>
              <div style={{ fontSize: '12px', color: '#555', marginTop: '4px' }}>
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

        {activeTab === 'Store Details' && (
          <div>
            {/* Store Address Section */}
            <h3 style={sectionHeadingStyle}>Store Address</h3>

            <label style={labelStyle}>Store Name</label>
            <input style={inputStyle} type="text" defaultValue="This Side Up HQ" />

            <label style={labelStyle}>Address Line 1</label>
            <input style={inputStyle} type="text" defaultValue="" />

            <label style={labelStyle}>Address Line 2</label>
            {/* Note: The image shows an email here, replicating as seen */}
            <input style={inputStyle} type="text" defaultValue="admin@thissideup.com" />

            <label style={labelStyle}>City</label>
            <input style={inputStyle} type="text" defaultValue="Singapore" />

            <label style={labelStyle}>Country</label>
            <input style={inputStyle} type="text" defaultValue="Singapore" />

            <label style={labelStyle}>ZIP / Postal code</label>
            <input style={inputStyle} type="text" defaultValue="543190" />

            {/* Contact Information Section (Image shows "Store Address" again) */}
            <h3 style={sectionHeadingStyle}>Store Address</h3> {/* Replicating image title */}
            {/* Or perhaps better: <h3 style={sectionHeadingStyle}>Contact Information</h3> */}

            <label style={labelStyle}>Store Phone</label>
            <input style={inputStyle} type="text" defaultValue="+65 9341 5124" />

            <label style={labelStyle}>Customer Service Email</label>
            {/* Note: The image shows a phone number here, replicating as seen */}
            <input style={inputStyle} type="email" defaultValue="+65 9341 5124" />
          </div>
        )}

        {activeTab === 'Payment' && (
          <div>
            {/* Content for Payment tab */}
            <p>Payment settings would go here.</p>
          </div>
        )}

        {activeTab === 'Shipping' && (
          <div>
            {/* Content for Shipping tab */}
            <p>Shipping settings would go here.</p>
          </div>
        )}
      </div>
    </div>
  );
}