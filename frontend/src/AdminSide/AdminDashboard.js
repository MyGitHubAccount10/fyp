import React from 'react';
import AdminHeader from '../AdminHeader';
// AdminStyles.css is imported in AdminLayout.js and/or App.js, so no need to import here

// Placeholder Icons (reusing some from AdminSidebar/ManageProducts, adding new ones)
const DashboardIcon = () => <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 3H20C20.5304 3 21.0391 3.21071 21.4142 3.58579C21.7893 3.96086 22 4.46957 22 5V19C22 19.5304 21.7893 20.0391 21.4142 20.4142C21.0391 20.7893 20.5304 21 20 21H4C3.46957 21 2.96086 20.7893 2.58579 20.4142C2.21071 20.0391 2 19.5304 2 19V5C2 4.46957 2.21071 3.96086 2.58579 3.58579C2.96086 3.21071 3.46957 3 4 3H10ZM10 3V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const MoneyIcon = ({ color = "currentColor", size = 24 }) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width={size} height={size}>
        <path d="M12 1V23M17 5H9.5C8.70435 5 7.94759 5.31607 7.39194 5.87172C6.83629 6.42738 6.52022 7.18413 6.52022 7.97985C6.52022 8.77557 6.83629 9.53232 7.39194 10.0879C7.94759 10.6436 8.70435 10.9597 9.5 10.9597H14.5C15.2956 10.9597 16.0524 11.2758 16.6081 11.8315C17.1637 12.3871 17.4798 13.1439 17.4798 13.9396C17.4798 14.7353 17.1637 15.4921 16.6081 16.0477C16.0524 16.6034 15.2956 16.9195 14.5 16.9195H7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);
const NewStarIcon = ({ color = "currentColor", size = 24 }) => (
    <svg viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg" width={size} height={size}>
         {/* Simple star/burst shape */}
        <path d="M12 1L15 8L22 9L17 14L18 21L12 17L6 21L7 14L2 9L9 8L12 1Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);
const ClockIcon = ({ color = "currentColor", size = 24 }) => (
     <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width={size} height={size}>
        <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2"/>
        <path d="M12 6V12H16.5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);
const AlertTriangleIcon = ({ color = "currentColor", size = 24 }) => (
     <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width={size} height={size}>
        <path d="M10.29 3.86L1.82 18.01C1.63 18.34 1.54 18.72 1.57 19.1C1.59 19.48 1.73 19.84 1.96 20.14C2.2 20.44 2.53 20.68 2.91 20.81C3.29 20.94 3.71 21 4.12 21H19.88C20.29 21 20.71 20.94 21.09 20.81C21.47 20.68 21.8 20.44 22.04 20.14C22.27 19.84 22.4 19.48 22.43 19.1C22.46 18.72 22.37 18.34 22.18 18.01L13.71 3.86C13.53 3.53 13.28 3.25 12.97 3.07C12.67 2.89 12.33 2.8 12 2.8C11.67 2.8 11.33 2.89 11.03 3.07C10.72 3.25 10.47 3.53 10.29 3.86V3.86Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 9V13" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 17H12.01" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

// Quick Action Icons
const PlusCircleIcon = ({ color = "currentColor", size = 18 }) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width={size} height={size}>
        <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2"/>
        <path d="M12 8V16" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8 12H16" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);
const EyeIcon = ({ color = "currentColor", size = 18 }) => (
     <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width={size} height={size}>
        <path d="M1 12S5 4 12 4C19 4 23 12 23 12S19 20 12 20C5 20 1 12 1 12Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="12" cy="12" r="3" stroke={color} strokeWidth="2"/>
    </svg>
);
const HomeIcon = ({ color = "currentColor", size = 18 }) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width={size} height={size}>
        <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9 22V12H15V22" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);
const PencilIcon = ({ size = 18, color = "currentColor" }) => (
    <svg viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg" width={size} height={size}>
        <path d="M17 3C17.2626 2.7374 17.5893 2.52942 17.9573 2.38285C18.3253 2.23629 18.7259 2.15325 19.1365 2.13815C19.5471 2.12304 19.9576 2.17623 20.3485 2.29581C20.7394 2.41539 21.1013 2.59878 21.4142 2.91168C21.7271 3.22458 21.9795 3.5865 22.0991 3.97744C22.2187 4.36838 22.2719 4.77888 22.2568 5.18947C22.2418 5.60006 22.1587 6.00066 22.0121 6.36867C21.8656 6.73668 21.6576 7.0634 21.395 7.326L10.35 18.36L2 22L5.64 13.65L17 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

// Dummy Data
const salesData = {
    totalSalesMonth: 12583,
    newOrdersToday: 15,
    pendingFulfillment: 8,
    lowStockItems: 3,
    outOfStockItems: 5, // Assuming this is the fifth card
};

const recentOrders = [
    { id: 'TSU1024', customer: 'Jane Doe', date: '2026-5-18', total: 189.99, status: 'Shipped' },
    { id: 'TSU1023', customer: 'Rob Banks', date: '2026-5-18', total: 75.50, status: 'Processing' },
    { id: 'TSU1022', customer: 'Tom Holland', date: '2024-3-21', total: 250.00, status: 'Order Complete' },
     // Add more dummy orders if needed to fill the table
];

function AdminDashboard() {
    // In a real application, you would fetch data here using useEffect

    // Function to get status class (reusing or similar to ManageProductsPage)
    const getStatusClass = (status) => {
        switch (status) {
            case 'Shipped': return 'status-shipped';
            case 'Processing': return 'status-processing';
            case 'Order Complete': return 'status-complete'; // New status class
            default: return '';
        }
    };

     // Simple handlers for quick action buttons (replace with actual routing/logic)
     const handleAddProduct = () => { console.log("Navigate to Add New Product"); /* navigate('/admin/products/new') */ };
     const handleViewOrders = () => { console.log("Navigate to All Orders"); /* navigate('/admin/orders') */ };
     const handleManageInventory = () => { console.log("Navigate to Manage Inventory"); /* navigate('/admin/inventory') */ };
     const handleReviewDesigns = () => { console.log("Navigate to Review Custom Designs"); /* navigate('/admin/custom-designs') */ };
     const handleViewFullSales = () => { console.log("Navigate to Full Sales Report"); /* navigate('/admin/sales-reports') */ };


    return (
        <div className="admin-dashboard-page"> {/* Page-specific class */}
        <AdminHeader />
            <h2 className="page-title">Admin Dashboard</h2> {/* Reuse page-title class */}

            <div className="dashboard-stats">
                <div className="stat-card">
                    <div className="stat-icon icon-sales"><MoneyIcon color="white" size={30} /></div>
                    <div className="stat-info">
                        <div className="stat-label">Total Sales (Month)</div>
                        <div className="stat-value">${salesData.totalSalesMonth.toLocaleString()}</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon icon-new-orders"><NewStarIcon color="white" size={30} /></div>
                    <div className="stat-info">
                         <div className="stat-label">New Orders (Today)</div>
                        <div className="stat-value">{salesData.newOrdersToday}</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon icon-fulfillment"><ClockIcon color="white" size={30} /></div>
                    <div className="stat-info">
                        <div className="stat-label">Pending Fulfillment</div>
                        <div className="stat-value">{salesData.pendingFulfillment}</div>
                    </div>
                </div>
                <div className="stat-card stat-warning"> {/* Added warning class for alert icons */}
                    <div className="stat-icon icon-low-stock"><AlertTriangleIcon color="white" size={30} /></div>
                    <div className="stat-info">
                        <div className="stat-label">Low Stock Items</div>
                        <div className="stat-value">{salesData.lowStockItems}</div>
                    </div>
                </div>
                 <div className="stat-card stat-danger"> {/* Added danger class for potentially critical alerts */}
                    <div className="stat-icon icon-out-stock"><AlertTriangleIcon color="white" size={30} /></div>
                    <div className="stat-info">
                        <div className="stat-label">Out of Stock Items</div>
                        <div className="stat-value">{salesData.outOfStockItems}</div>
                    </div>
                </div>
                 {/* Add more stat cards if they exist beyond the visible area */}
            </div>

            <div className="dashboard-section quick-actions">
                <h3 className="section-title">Quick Actions</h3>
                <div className="quick-action-buttons">
                    <button className="btn-quick-action btn-add-product" onClick={handleAddProduct}>
                        <PlusCircleIcon color="white" /> Add New Product
                    </button>
                    <button className="btn-quick-action btn-view-orders" onClick={handleViewOrders}>
                         <EyeIcon color="white" /> View All Orders
                    </button>
                    <button className="btn-quick-action btn-manage-inventory" onClick={handleManageInventory}>
                         <HomeIcon color="white" /> Manage Inventory
                    </button>
                     <button className="btn-quick-action btn-review-designs" onClick={handleReviewDesigns}>
                         <PencilIcon color="white" /> Review Custom Designs
                    </button>
                </div>
            </div>

            <div className="dashboard-section recent-orders">
                 <h3 className="section-title">Recent Orders</h3>
                 <div className="table-container"> {/* Wrap table for potential overflow */}
                    <table className="recent-orders-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Date</th>
                                <th>Total</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentOrders.map(order => (
                                <tr key={order.id}>
                                    <td>{order.id}</td>
                                    <td>{order.customer}</td>
                                    <td>{order.date}</td>
                                    <td>${order.total.toFixed(2)}</td>
                                    <td className={getStatusClass(order.status)}>{order.status}</td>
                                </tr>
                            ))}
                             {/* Add placeholder rows if needed */}
                             {recentOrders.length < 3 && Array.from({ length: 3 - recentOrders.length }).map((_, i) => (
                                <tr key={`order-placeholder-${i}`}>
                                    <td>-</td>
                                    <td>-</td>
                                    <td>-</td>
                                    <td>-</td>
                                    <td>-</td>
                                </tr>
                             ))}
                        </tbody>
                    </table>
                 </div>
                 <div className="section-footer-link">
                    <a href="#" className="view-all-link" onClick={(e) => {e.preventDefault(); handleViewOrders();}}>
                        View All Orders {">"}
                    </a>
                 </div>
            </div>

            <div className="dashboard-section sales-snapshot">
                 <h3 className="section-title">Sales Snapshot (Last 7 Days)</h3>
                 <div className="sales-chart-placeholder">
                    [Sales Chart Placeholder]
                 </div>
                  <div className="section-footer-link">
                    <a href="#" className="view-all-link" onClick={(e) => {e.preventDefault(); handleViewFullSales();}}>
                        View Full Sales Report {">"}
                    </a>
                 </div>
            </div>

             {/* Add other dashboard sections here */}

        </div>
    );
}

export default AdminDashboard;