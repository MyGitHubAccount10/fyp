import React, { useState, useEffect } from 'react';
import AdminHeader from '../AdminHeader';
import { useNavigate } from 'react-router-dom';
// AdminStyles.css is imported in AdminLayout.js and/or App.js, so no need to import here





// Placeholder Icons (reusing some from AdminSidebar/ManageProducts, adding new ones)
const DashboardIcon = () => <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 3H20C20.5304 3 21.0391 3.21071 21.4142 3.58579C21.7893 3.96086 22 4.46957 22 5V19C22 19.5304 21.7893 20.0391 21.4142 20.4142C21.0391 20.7893 20.5304 21 20 21H4C3.46957 21 2.96086 20.7893 2.58579 20.4142C2.21071 20.0391 2 19.5304 2 19V5C2 4.46957 2.21071 3.96086 2.58579 3.58579C2.96086 3.21071 3.46957 3 4 3H10ZM10 3V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const MoneyIcon = ({ color = "currentColor", size = 24 }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 1V23M17 5H9.5C8.7 5 7.95 5.32 7.39 5.87C6.84 6.43 6.52 7.18 6.52 7.98C6.52 8.78 6.84 9.53 7.39 10.09C7.95 10.64 8.7 10.96 9.5 10.96H14.5C15.3 10.96 16.05 11.28 16.61 11.83C17.16 12.39 17.48 13.14 17.48 13.94C17.48 14.74 17.16 15.49 16.61 16.05C16.05 16.6 15.3 16.92 14.5 16.92H7"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
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
        <path d="M16 5L19 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

// Dummy Data - will be replaced with real data
const initialSalesData = {
    totalSalesMonth: 0,
    newOrdersToday: 0,
    pendingFulfillment: 0,
    lowStockItems: 0,
    outOfStockItems: 0,
    dailySales: [],
};

const initialRecentOrders = [];

function AdminDashboard() {
    const navigate = useNavigate();
    const [salesData, setSalesData] = useState(initialSalesData);
    const [recentOrders, setRecentOrders] = useState(initialRecentOrders);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch dashboard data on component mount
    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            
            // Get admin user token
            const adminUser = JSON.parse(localStorage.getItem('admin_user'));
            if (!adminUser || !adminUser.token) {
                throw new Error('No admin authentication found');
            }

            // Fetch orders data
            const ordersResponse = await fetch('/api/orders/admin/all', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${adminUser.token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!ordersResponse.ok) {
                throw new Error('Failed to fetch orders data');
            }

            const ordersData = await ordersResponse.json();

            // Try to fetch products data (optional)
            let productsData = [];
            try {
                const productsResponse = await fetch('/api/product', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (productsResponse.ok) {
                    productsData = await productsResponse.json();
                }
            } catch (productError) {
                console.warn('Failed to fetch products data:', productError);
                // Continue without products data
            }

            // Process the data
            processOrders(ordersData);
            processProducts(productsData);
            setError('');
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setError('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const processOrders = (ordersData) => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        // Calculate total sales for this month
        const thisMonthOrders = ordersData.filter(order => {
            const orderDate = new Date(order.createdAt);
            return orderDate >= thisMonth;
        });
        const totalSalesMonth = thisMonthOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0);

        // Calculate new orders today
        const todayOrders = ordersData.filter(order => {
            const orderDate = new Date(order.createdAt);
            return orderDate >= today;
        });
        const newOrdersToday = todayOrders.length;

        // Calculate pending fulfillment
        const pendingOrders = ordersData.filter(order => 
            order.status_id?.status_name === 'Pending' || 
            order.status_id?.status_name === 'Processing' ||
            order.status_id?.status_name === 'Confirmed'
        );
        const pendingFulfillment = pendingOrders.length;

        setSalesData({
            totalSalesMonth: Math.round(totalSalesMonth),
            newOrdersToday,
            pendingFulfillment,
            lowStockItems: 0, // Will be updated by processProducts
            outOfStockItems: 0, // Will be updated by processProducts
        });

        // Set recent orders (last 5 orders)
        const recentOrdersData = ordersData
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5)
            .map(order => ({
                id: order._id?.slice(-8) || 'N/A',
                customer: order.user_id?.full_name || order.user_id?.username || 'N/A',
                date: new Date(order.createdAt).toLocaleDateString(),
                total: order.total_amount || 0,
                status: order.status_id?.status_name || 'Pending'
            }));

        setRecentOrders(recentOrdersData);
        
        // Generate daily sales data for chart
        generateDailySalesChart(ordersData);
    };

    const generateDailySalesChart = (ordersData) => {
        const dailyData = {};
        const last7Days = [];
        
        // Create array of last 7 days
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            last7Days.push(dateStr);
            dailyData[dateStr] = 0;
        }
        
        // Aggregate sales by date
        ordersData.forEach(order => {
            const orderDate = new Date(order.createdAt).toISOString().split('T')[0];
            if (dailyData.hasOwnProperty(orderDate)) {
                dailyData[orderDate] += order.total_amount || 0;
            }
        });
        
        const chartData = last7Days.map(date => ({
            date,
            amount: dailyData[date]
        }));
        
        setSalesData(prev => ({ ...prev, dailySales: chartData }));
    };

    const processProducts = (productsData) => {
        setProducts(productsData);
        
        // Helper function to get product status (same logic as AllProductsPage)
        const getProductStatus = (product) => {
            if (product.warehouse_quantity === 0) return 'Out of Stock';
            if (product.warehouse_quantity <= (product.threshold || 10)) return 'Limited Stock';
            return 'In Stock';
        };
        
        // Calculate low stock and out of stock items using the same logic as AllProductsPage
        const outOfStockItems = productsData.filter(product => 
            getProductStatus(product) === 'Out of Stock'
        ).length;
        
        const lowStockItems = productsData.filter(product => 
            getProductStatus(product) === 'Limited Stock'
        ).length;

        // Debug logging
        console.log('Products data:', productsData.length);
        console.log('Out of stock items:', outOfStockItems);
        console.log('Low stock items:', lowStockItems);

        setSalesData(prev => ({
            ...prev,
            lowStockItems,
            outOfStockItems
        }));
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount || 0);
    };
    // Function to get status class (reusing or similar to ManageProductsPage)
    const getStatusClass = (status) => {
        switch (status) {
            case 'Delivered':
            case 'Completed': return 'status-shipped';
            case 'Processing':
            case 'Confirmed': return 'status-processing';
            case 'Pending': return 'status-complete';
            default: return '';
        }
    };

     // Simple handlers for quick action buttons (replace with actual routing/logic)
     const handleAddProduct = () => { navigate('/add-product'); };
     const handleViewOrders = () => { navigate('/all-orders'); };
     const handleManageInventory = () => { navigate('/all-products'); };
     const handleReviewDesigns = () => { navigate('/admin/custom-designs'); };
     const handleViewFullSales = () => { navigate('/sales-report'); };

    if (loading) {
        return (
            <div className="admin-dashboard-page">
                <AdminHeader />
                <div className="manage-products-page">
                    <div style={{ textAlign: 'center', padding: '50px' }}>
                        Loading dashboard...
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="admin-dashboard-page">
                <AdminHeader />
                <div className="manage-products-page">
                    <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
                        {error}
                        <br />
                        <button 
                            onClick={fetchDashboardData}
                            style={{ 
                                marginTop: '10px', 
                                padding: '10px 20px', 
                                backgroundColor: '#FA704C',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }



    return (
        <div className="admin-dashboard-page"> {/* Page-specific class */}
        <AdminHeader />
            <div className="manage-products-page"> {/* Container for padding */}
                <h2 className="page-title">Admin Dashboard</h2> {/* Reuse page-title class */}

                <div className="dashboard-stats">

                    <div className="stat-card" onClick={() => navigate('/sales-report')}>
                        <div className="stat-icon icon-sales"><MoneyIcon color="white" size={30} /></div>
                        <div className="stat-info">
                            <div className="stat-label">Total Sales (Month)</div>
                            <div className="stat-value">{formatCurrency(salesData.totalSalesMonth)}</div>
                        </div>
                    </div>
                    <div className="stat-card" onClick={() => navigate('/all-orders')}>
                        <div className="stat-icon icon-new-orders"><NewStarIcon color="white" size={30} /></div>
                        <div className="stat-info">
                            <div className="stat-label">New Orders (Today)</div>
                            <div className="stat-value">{salesData.newOrdersToday}</div>
                        </div>
                    </div>
                    <div className="stat-card"  onClick={() => navigate('/all-orders')}>
                        <div className="stat-icon icon-fulfillment"><ClockIcon color="white" size={30} /></div>
                        <div className="stat-info">
                            <div className="stat-label">Pending Fulfillment</div>
                            <div className="stat-value">{salesData.pendingFulfillment}</div>
                        </div>
                    </div>
                    <div className="stat-card stat-warning" onClick={() => navigate('/all-products')} title={`${salesData.lowStockItems} products with limited stock`}> {/* Added warning class for alert icons */}
                        <div className="stat-icon icon-low-stock"><AlertTriangleIcon color="white" size={30} /></div>
                        <div className="stat-info">
                            <div className="stat-label">Low Stock Items</div>
                            <div className="stat-value">{salesData.lowStockItems}</div>
                        </div>
                    </div>
                    <div className="stat-card stat-danger" onClick={() => navigate('/all-products')} title={`${salesData.outOfStockItems} products are out of stock`}> {/* Added danger class for potentially critical alerts */}
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
                            <PlusCircleIcon color="#FA704C" /> Add New Product
                        </button>
                        <button className="btn-quick-action btn-view-orders" onClick={handleViewOrders}>
                            <EyeIcon color="#FA704C" /> View All Orders
                        </button>
                        <button className="btn-quick-action btn-manage-inventory" onClick={handleManageInventory}>
                            <HomeIcon color="#FA704C" /> Manage Products
                        </button>
                        {/* <button className="btn-quick-action btn-review-designs" onClick={handleReviewDesigns}>
                            <PencilIcon color="#FA704C" /> Review Custom Designs
                        </button> */}
                        {/* <button className="btn-quick-action btn-view-sales" onClick={handleViewFullSales}>
                            <MoneyIcon  size={32} /> View Full Sales Report
                        </button> */}

                        
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
                                {recentOrders.length > 0 ? (
                                    recentOrders.map(order => (
                                        <tr key={order.id}>
                                            <td>{order.id}</td>
                                            <td>{order.customer}</td>
                                            <td>{order.date}</td>
                                            <td>{formatCurrency(order.total)}</td>
                                            <td className={getStatusClass(order.status)}>{order.status}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                                            No recent orders found
                                        </td>
                                    </tr>
                                )}
                                {/* Add placeholder rows if needed */}
                                {recentOrders.length > 0 && recentOrders.length < 3 && Array.from({ length: 3 - recentOrders.length }).map((_, i) => (
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
                    <div style={{ height: '200px', display: 'flex', alignItems: 'end', gap: '10px', padding: '20px 0' }}>
                        {salesData.dailySales && salesData.dailySales.length > 0 ? (
                            salesData.dailySales.map((day, index) => {
                                const maxAmount = Math.max(...salesData.dailySales.map(d => d.amount));
                                const height = maxAmount > 0 ? (day.amount / maxAmount) * 150 : 0;
                                return (
                                    <div key={index} style={{ 
                                        display: 'flex', 
                                        flexDirection: 'column', 
                                        alignItems: 'center',
                                        flex: 1
                                    }}>
                                        <div style={{
                                            backgroundColor: '#FA704C',
                                            width: '100%',
                                            height: `${height}px`,
                                            borderRadius: '4px 4px 0 0',
                                            marginBottom: '5px',
                                            minHeight: '2px'
                                        }}></div>
                                        <div style={{ fontSize: '12px', color: '#666', textAlign: 'center' }}>
                                            {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                        </div>
                                        <div style={{ fontSize: '11px', color: '#999', textAlign: 'center' }}>
                                            ${day.amount.toFixed(0)}
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                width: '100%', 
                                height: '100%',
                                color: '#666'
                            }}>
                                No sales data available
                            </div>
                        )}
                    </div>
                    <div className="section-footer-link">
                        <a href="#" className="view-all-link" onClick={(e) => {e.preventDefault(); handleViewFullSales();}}>
                            View Full Sales Report {">"}
                        </a>
                    </div>
                </div>

                {/* Add other dashboard sections here */}

            </div>
        </div>
    );
}

export default AdminDashboard;