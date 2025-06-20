import React, { useState, useEffect } from 'react';
import AdminHeader from '../AdminHeader'; 
import { useNavigate } from 'react-router-dom';

// Placeholder Icons
const CalendarIcon = ({ color = "currentColor", size = 18 }) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width={size} height={size}>
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="16" y1="2" x2="16" y2="6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="8" y1="2" x2="8" y2="6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="3" y1="10" x2="21" y2="10" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

function AllOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [allOrders, setAllOrders] = useState([]);
    const [availableStatuses, setAvailableStatuses] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('All Statuses');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [ordersPerPage] = useState(10); // Fixed number of orders per page
    const [loading, setLoading] = useState(true);    const [error, setError] = useState('');
    const Navigate = useNavigate();

    // Fetch orders from API
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                
                // Get admin user token
                const adminUser = JSON.parse(localStorage.getItem('admin_user'));
                if (!adminUser || !adminUser.token) {
                    throw new Error('No admin user found');
                }                // Fetch orders and statuses in parallel
                const [ordersResponse, statusesResponse] = await Promise.all([
                    fetch('http://localhost:4000/api/order/admin/all', {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${adminUser.token}`,
                            'Content-Type': 'application/json'
                        }
                    }),
                    fetch('http://localhost:4000/api/status', {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                ]);                if (!ordersResponse.ok) {
                    console.error('Orders fetch failed:', ordersResponse.status, ordersResponse.statusText);
                    throw new Error('Failed to fetch orders');
                }
                if (!statusesResponse.ok) {
                    console.error('Statuses fetch failed:', statusesResponse.status, statusesResponse.statusText);
                    throw new Error('Failed to fetch statuses');
                }                const orderData = await ordersResponse.json();
                const statusData = await statusesResponse.json();
                
                setOrders(orderData);
                setAllOrders(orderData);
                
                // Set available statuses from the status collection
                setAvailableStatuses(statusData.map(status => status.status_name));
                  setError('');            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to load data. Please try again.');
                setOrders([]);
                setAllOrders([]);
                setAvailableStatuses([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Filtered orders based on current filters
    const filteredOrders = allOrders.filter(order => {
        const matchesSearch = searchTerm.toLowerCase() === '' ||
                              order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              (order.user_id && 
                               (order.user_id.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                order.user_id.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                order.user_id.email?.toLowerCase().includes(searchTerm.toLowerCase())));

        const orderStatus = order.status_id?.status_name || 'Unknown';
        const matchesStatus = selectedStatus === 'All Statuses' || orderStatus === selectedStatus;        // Basic date filtering
        const orderDate = new Date(order.order_date || order.createdAt);
        const matchesStartDate = startDate === '' || orderDate >= new Date(startDate);
        const matchesEndDate = endDate === '' || orderDate <= new Date(endDate);

        return matchesSearch && matchesStatus && matchesStartDate && matchesEndDate;
    });

    // Pagination Logic based on filtered orders
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
    const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);    const handleApplyFilters = () => {
        console.log("Applying filters:", { searchTerm, selectedStatus, startDate, endDate });
        setCurrentPage(1); // Reset to first page on new filter
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };     // Function to get order status class
    const getOrderStatusClass = (status) => {
        switch (status) {
            case 'Shipped': return 'status-shipped';
            case 'Processing': return 'status-processing';
            case 'Delivered': return 'status-delivered';
            case 'Cancelled': return 'status-cancelled';
            case 'Pending Payment': return 'status-pending';
            case 'Pending': return 'status-pending';
            case 'Completed': return 'status-delivered';
            case 'In Transit': return 'status-shipped';
            default: return 'status-processing';
        }
    };

    // Handler for 'View Details' link (placeholder)
    const handleViewDetails = (orderId) => {
        console.log("Viewing details for order:", orderId);
        // In a real app, navigate to a specific order details page
        // navigate(`/admin/orders/${orderId}`);
        Navigate(`/order-details`);
    };

    return (<>
              <AdminHeader />
        <div className='manage-products-page'>
            <h2 >All Orders</h2>

            {/* Filter Bar */}
            <div className="filter-bar">
                <input
                    type="text"
                    placeholder="Search"
                    className="filter-input search-input" // Reuse search-input style if applicable
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />                <select
                    className="filter-input status-select"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                >
                    <option value="All Statuses">All Statuses</option>
                    {availableStatuses.map(status => (
                        <option key={status} value={status}>{status}</option>
                    ))}
                </select>

                {/* Date Inputs */}
                 <div className="filter-input date-input-wrapper">
                    <input
                        type="date" // Use date type for calendar icon
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                         // placeholder="dd/mm/yy" // Placeholder doesn't show for type="date"
                        className="date-input"
                    />
                     {/* Calendar icon is typically part of the native date input */}
                     {/* If you need a custom icon, wrap input and icon in a div and style */}
                 </div>
                 <div className="filter-input date-input-wrapper">
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                         // placeholder="dd/mm/yy"
                        className="date-input"
                    />
                 </div>                <button onClick={handleApplyFilters} className="btn-apply-filters">
                    Apply Filters
                </button>
            </div>

            {/* Orders Summary */}
            <div className="orders-summary" style={{ margin: '20px 0', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '1.2em', color: '#333' }}>Orders Overview</h3>
                <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
                    <div>
                        <strong>Total Orders:</strong> <span style={{ color: '#007bff' }}>{allOrders.length}</span>
                    </div>
                    <div>
                        <strong>Filtered Results:</strong> <span style={{ color: '#28a745' }}>{filteredOrders.length}</span>
                    </div>
                    <div>
                        <strong>Current Page:</strong> <span style={{ color: '#6c757d' }}>{currentOrders.length}</span>
                    </div>
                </div>
            </div>
{/* Pagination Controls */}
<div
  className="pagination-controls"
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 0",
    flexWrap: "wrap",
    gap: "12px",
  }}
>
  <span style={{ fontSize: "16px" }}>
    Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
  </span>
  <div style={{ display: "flex", gap: "10px" }}>
    <button
      onClick={handlePrevPage}
      disabled={currentPage === 1}
      className="pagination-button"
    >
      {'<< Prev'}
    </button>
    <button
      onClick={handleNextPage}
      disabled={currentPage === totalPages}
      className="pagination-button"
    >
      {'Next >>'}
    </button>  </div>
</div>

            {/* Orders Table */}
            <div className="orders-table-container">
                <table className="orders-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Date</th>
                            <th>Customer</th>
                            <th>Total</th>
                            <th>Payment Method</th>
                            <th>Order Status</th>
                            <th>Actions</th>
                        </tr>                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>Loading orders...</td>
                            </tr>
                        ) : error ? (
                            <tr>
                                <td colSpan="7" style={{ textAlign: 'center', padding: '20px', color: 'red' }}>{error}</td>
                            </tr>
                        ) : currentOrders.length > 0 ? (
                             currentOrders.map(order => (
                                <tr key={order._id}>
                                    <td>#{order._id.slice(-8)}</td> {/* Display last 8 characters of ID */}
                                    <td>{new Date(order.order_date || order.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short', 
                                        day: '2-digit',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}</td>
                                    <td>{order.user_id ? `${order.user_id.first_name} ${order.user_id.last_name}` : 'Unknown Customer'}</td>
                                    <td>${parseFloat(order.total_amount || 0).toFixed(2)}</td>
                                    <td>{order.payment_method || 'N/A'}</td>
                                    <td className={getOrderStatusClass(order.status_id?.status_name || 'Processing')}>
                                        {order.status_id?.status_name || 'Processing'}
                                    </td>
                                    <td>
                                        <button onClick={() => handleViewDetails(order._id)} className="link-button">View Details</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>
                                    {filteredOrders.length === 0 && allOrders.length > 0 
                                        ? 'No orders match your current filters.' 
                                        : 'No orders found in the system.'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    </>);
}

export default AllOrdersPage;