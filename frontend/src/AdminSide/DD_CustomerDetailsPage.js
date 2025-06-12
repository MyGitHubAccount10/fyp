import React, { useState } from 'react';

const CustomerDetailsPage = () => {
    const [activeTab, setActiveTab] = useState('history'); // 'history' or 'activity'
    const [isEditing, setIsEditing] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Placeholder data (can be managed with state if editing was functional)
    const customer = {
        id: 'CUST-001',
        fullName: 'Johnathan Doe',
        email: 'john.doe@example.com',
        password: 'ThinkNoodles1427!48H', // Example password for edit mode
        phone: '(555) 123-4567',
        shippingAddress: {
            name: 'Johnathan Doe',
            street: '123 Beach Ave',
            city: 'Surf City',
            state: 'CA',
            zip: '90210',
            country: 'USA'
        },
        billingAddress: {
            name: 'Johnathan Doe',
            street: '123 Beach Ave',
            city: 'Surf City',
            state: 'CA',
            zip: '90210',
            country: 'USA'
        }
    };

    const accountActivity = [
        { type: 'Admin Note', content: 'Customer called asking about custom board options. Seemed very interested.', timestamp: 'Admin User - Oct 20, 2023, 11:30 AM' },
        { type: 'Customer changed password', content: '', timestamp: 'System - Sep 05, 2023, 02:15 PM' },
        { type: 'Customer created account', content: '', timestamp: 'System - Jan 15, 2023, 09:00 AM' },
    ];

    const orderHistory = [
        { id: '#TSU-1001', date: '2023-10-26', status: 'Shipped', items: 3, total: 175.50 },
        { id: '#TSU-952', date: '2023-09-10', status: 'Delivered', items: 1, total: 50.25 },
        // Add more dummy data if needed
    ];

    const totalOrderValue = orderHistory.reduce((sum, order) => sum + order.total, 0).toFixed(2);


    // Dummy handlers
    const handleBackClick = () => {
        alert('Navigate back to Customers list');
    };

    const handleBanAccount = () => {
        alert('Ban Account clicked');
    };

    const handleEditProfile = () => {
        setIsEditing(true);
        alert('Edit Customer Profile clicked');
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        alert('Cancel Edit clicked');
        // Reset form fields if they were managed by state
    };

    const handleSaveChanges = () => {
        alert('Save Changes clicked');
        // Implement save logic here
        // setIsEditing(false); // Uncomment to exit edit mode after saving
    };

    const handleSaveNote = () => {
        alert('Save Note clicked');
        // Add logic to save the note
    };

    const handleViewOrderDetails = (orderId) => {
        alert(`View details for order ${orderId}`);
        // Navigate to order details page
    };

     const handleViewAllOrders = () => {
        alert('View all orders for this customer clicked');
        // Navigate to filtered orders list page
     };

     const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
     };


    return (
        // Note: This component assumes it is rendered within the main content area
        // of the admin layout (e.g., inside a div with class .admin-main-content)
        <div className="customer-details-page"> {/* Add a specific class for this page if needed for overrides */}
        

            {/* Page Header Section */}
            <div className="page-header-section">
                <h1 className="page-title">Customer: {customer.fullName}</h1>
                <button className="btn-back-to-products" onClick={handleBackClick}>
                    {/* SVG for back arrow */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                    </svg>
                    Back to All Customers
                </button>
            </div>

            {/* Action Buttons */}
            <div className="customer-actions">
                 <button className="btn-ban" onClick={handleBanAccount}>
                    {/* SVG for Ban icon (e.g., stop sign or minus circle) */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                    Ban Account
                 </button>
                 {isEditing ? (
                    <>
                        <button className="btn-cancel-edit" onClick={handleCancelEdit}>
                            {/* SVG for Cancel icon (e.g., X or slash) */}
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Cancel
                        </button>
                        <button className="btn-save-changes" onClick={handleSaveChanges}>
                            {/* SVG for Save icon (e.g., checkmark or floppy disk) */}
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Save Changes
                        </button>
                    </>
                 ) : (
                    <button className="btn-edit-profile" onClick={handleEditProfile}>
                        {/* SVG for Edit icon (e.g., pencil) */}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 2.276a2.25 2.25 0 013.122 3.122L17.5 10.5l-4.122-4.122L16.862 2.276zm0 0L19.5 5M13.5 10.5L10.5 13.5m-4.122-4.122L2.276 16.862a2.25 2.25 0 003.122 3.122l5.25-5.25-4.122-4.122z" />
                        </svg>
                        Edit Customer Profile
                    </button>
                 )}
            </div>

            {/* Top Cards Layout */}
            <div className="customer-info-addresses-layout">
                {/* Customer Information Card */}
                <div className="form-section-card">
                    <h3 className="section-card-title">{isEditing ? 'Edit Customer Information' : 'Customer Information'}</h3>
                    <div className="customer-info customer-edit-form"> {/* Add customer-edit-form class for input styles */}
                        <div className="form-group">
                            <label>Customer ID:</label>
                            {isEditing ? (
                                <input type="text" value={customer.id} disabled /> // ID is usually not editable
                            ) : (
                                <p><strong>Customer ID:</strong> {customer.id}</p>
                            )}
                        </div>
                        <div className="form-group">
                            <label htmlFor="fullName">Full Name:</label>
                            {isEditing ? (
                                <input type="text" id="fullName" defaultValue={customer.fullName} />
                            ) : (
                                <p><strong>Full Name:</strong> {customer.fullName}</p>
                            )}
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email:</label>
                            {isEditing ? (
                                <input type="email" id="email" defaultValue={customer.email} />
                            ) : (
                                <p><strong>Email:</strong> <a href={`mailto:${customer.email}`}>{customer.email}</a></p>
                            )}
                        </div>
                         <div className="form-group">
                            <label htmlFor="password">Password:</label>
                            {isEditing ? (
                                <div className="password-input-wrapper">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        defaultValue={customer.password}
                                    />
                                    <span className="password-toggle-icon" onClick={togglePasswordVisibility}>
                                        {/* SVG for eye icon (open/closed) */}
                                        {showPassword ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.774 3.162 10.066 7.5-.091.376-.232.73-.407 1.068M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        )}
                                    </span>
                                </div>
                            ) : (
                                <p><strong>Password:</strong> ****************</p> // Always masked in view mode
                            )}
                        </div>
                        <div className="form-group">
                            <label htmlFor="phone">Phone:</label>
                            {isEditing ? (
                                <input type="tel" id="phone" defaultValue={customer.phone} />
                            ) : (
                                <p><strong>Phone:</strong> {customer.phone}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Addresses Card */}
                <div className="form-section-card">
                    <h3 className="section-card-title">{isEditing ? 'Edit Addresses' : 'Addresses'}</h3>
                    <div className="customer-info customer-edit-form"> {/* Add customer-edit-form class */}
                        <div className="form-group">
                            <label htmlFor="shippingAddress">Default Shipping Address:</label>
                            {isEditing ? (
                                <textarea id="shippingAddress" className="address-textarea" defaultValue={`${customer.shippingAddress.name}\n${customer.shippingAddress.street}\n${customer.shippingAddress.city}, ${customer.shippingAddress.state} ${customer.shippingAddress.zip}\n${customer.shippingAddress.country}`}></textarea>
                            ) : (
                                <p>
                                    <strong>Default Shipping Address</strong><br/>
                                    {customer.shippingAddress.name}<br/>
                                    {customer.shippingAddress.street}<br/>
                                    {customer.shippingAddress.city}, {customer.shippingAddress.state} {customer.shippingAddress.zip}<br/>
                                    {customer.shippingAddress.country}
                                </p>
                            )}
                        </div>
                         <div className="form-group">
                            <label htmlFor="billingAddress">Billing Address:</label>
                            {isEditing ? (
                                <textarea id="billingAddress" className="address-textarea" defaultValue={`${customer.billingAddress.name}\n${customer.billingAddress.street}\n${customer.billingAddress.city}, ${customer.billingAddress.state} ${customer.billingAddress.zip}\n${customer.billingAddress.country}`}></textarea>
                            ) : (
                                <p>
                                    <strong>Billing Address:</strong><br/>
                                    {customer.billingAddress.name}<br/>
                                    {customer.billingAddress.street}<br/>
                                    {customer.billingAddress.city}, {customer.billingAddress.state} {customer.billingAddress.zip}<br/>
                                    {customer.billingAddress.country}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Section (Tabs) */}
            <div className="form-section-card"> {/* Card wrapper for the tabbed content */}
                 <div className="tab-container">
                    <button
                        className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
                        onClick={() => setActiveTab('history')}
                    >
                        Order History
                    </button>
                    <button
                        className={`tab-button ${activeTab === 'activity' ? 'active' : ''}`}
                        onClick={() => setActiveTab('activity')}
                    >
                        Account Activity
                    </button>
                 </div>

                 <div className="tab-content">
                    {activeTab === 'history' && (
                        <div className="order-history-tab"> {/* Specific class for this tab */}
                            {/* Content for Order History Tab */}
                            <h3 className="section-card-title">Customer Order History ({orderHistory.length} Orders - Total ${totalOrderValue})</h3>
                            <div className="orders-table-container"> {/* Use the container for overflow-x */}
                                <table className="customer-order-history-table"> {/* Use specific table class */}
                                    <thead>
                                        <tr>
                                            <th>Order ID</th>
                                            <th>Date</th>
                                            <th>Status</th>
                                            <th>Items</th>
                                            <th>Total</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orderHistory.map(order => (
                                            <tr key={order.id}>
                                                <td>{order.id}</td>
                                                <td>{order.date}</td>
                                                {/* Use status classes if available, otherwise just text */}
                                                <td className={`status-${order.status.toLowerCase()}`}>{order.status}</td>
                                                <td>{order.items}</td>
                                                <td>${order.total.toFixed(2)}</td>
                                                <td>
                                                    <button className="link-button" onClick={() => handleViewOrderDetails(order.id)}>
                                                        View Orders
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="section-footer-link"> {/* Use this class for alignment */}
                                <a href="#" className="view-all-link" onClick={(e) => { e.preventDefault(); handleViewAllOrders(); }}>
                                    View all orders for this Customer →
                                </a>
                            </div>
                        </div>
                    )}

                    {activeTab === 'activity' && (
                        <div className="account-activity-tab">
                            {/* Content for Account Activity Tab */}
                            <h3 className="section-card-title">Account Activity & Notes</h3>
                            <div className="activity-list">
                                {accountActivity.map((activity, index) => (
                                    <div key={index} className="activity-entry">
                                        <p>
                                            <strong>{activity.type}:</strong> {activity.content}
                                            <em>{activity.timestamp}</em>
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {/* Add Internal Note Form */}
                            <div className="add-note-form">
                                <div className="form-group">
                                    <label htmlFor="internalNote">Add Internal Note:</label>
                                    <textarea id="internalNote" placeholder="Enter your note for this customer..."></textarea>
                                </div>
                                <div className="form-actions"> {/* Using specific form-actions for this section */}
                                    <button className="btn-save-note" onClick={handleSaveNote}>Save Note</button>
                                </div>
                            </div>
                        </div>
                    )}
                 </div>
            </div>

        </div>
    );
};

export default CustomerDetailsPage;