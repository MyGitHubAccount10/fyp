import React, { useState, useEffect, useRef } from 'react';
import AdminHeader from '../AdminHeader'; 
import { useNavigate, useLocation } from 'react-router-dom';

import { MdEdit } from "react-icons/md";


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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isRestoringState, setIsRestoringState] = useState(false);
    const Navigate = useNavigate();
    const location = useLocation();
    
    // Track previous filter values to detect actual changes
    const prevFilters = useRef({
        searchTerm: '',
        selectedStatus: 'All Statuses',
        startDate: '',
        endDate: ''
    });

    // Get the page number and filters from location state when returning from edit page
    useEffect(() => {
        if (location.state?.returnToPage) {
            setCurrentPage(location.state.returnToPage);
        }
        if (location.state?.filters) {
            setIsRestoringState(true);
            const { searchTerm: savedSearchTerm, selectedStatus: savedStatus, startDate: savedStartDate, endDate: savedEndDate } = location.state.filters;
            setSearchTerm(savedSearchTerm);
            setSelectedStatus(savedStatus);
            setStartDate(savedStartDate);
            setEndDate(savedEndDate);
        }
        // Reset the flag after a brief delay to allow state restoration to complete
        if (location.state?.returnToPage || location.state?.filters) {
            setTimeout(() => setIsRestoringState(false), 100);
        }
    }, [location.state]);

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
                    fetch(`${process.env.REACT_APP_API_URL}/api/orders/admin/all`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${adminUser.token}`,
                            'Content-Type': 'application/json'
                        }
                    }),
                    fetch(`${process.env.REACT_APP_API_URL}/api/status`, {
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

    // Reset to page 1 whenever filters change (auto-filtering)
    // But don't reset if we're currently restoring state from navigation
    useEffect(() => {
        const currentFilters = { searchTerm, selectedStatus, startDate, endDate };
        
        // Check if any filter actually changed (not just state restoration)
        const filtersChanged = 
            prevFilters.current.searchTerm !== searchTerm ||
            prevFilters.current.selectedStatus !== selectedStatus ||
            prevFilters.current.startDate !== startDate ||
            prevFilters.current.endDate !== endDate;
        
        if (filtersChanged && !isRestoringState) {
            setCurrentPage(1);
        }
        
        // Update previous filters
        prevFilters.current = currentFilters;
    }, [searchTerm, selectedStatus, startDate, endDate, isRestoringState]);

    // Filtered orders based on current filters
    const filteredOrders = allOrders.filter(order => {        const matchesSearch = searchTerm.toLowerCase() === '' ||
                              order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              (order.user_id && 
                               (order.user_id.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
    const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);    

    const handleResetFilters = () => {
        console.log("Resetting filters");
        setSearchTerm('');
        setSelectedStatus('All Statuses');
        setStartDate('');
        setEndDate('');
        setCurrentPage(1); // Reset to first page
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
            case 'Order Placed': return 'adminstatus-processing';
            case 'Processing': return 'adminstatus-processing';
            case 'In Transit': return 'adminstatus-in-transit';
            case 'Delivered': return 'adminstatus-delivered';
            case 'Cancelled': return 'adminstatus-cancelled';
            case 'Rejected': return 'adminstatus-declined';
            case 'Returned to Sender': return 'adminstatus-declined';
            case 'Attempted Delivery': return 'adminstatus-declined';
            default: return 'adminstatus-processing';
        }
    };

    // Handler for 'View Details' link
    const handleViewDetails = (orderId) => {
        console.log("Viewing details for order:", orderId);
        Navigate(`/order-details/${orderId}`, {
            state: { 
                returnToPage: currentPage,
                filters: {
                    searchTerm,
                    selectedStatus,
                    startDate,
                    endDate
                }
            }
        });
    };

    return (
        <div>
            <div style={{ position: 'sticky', top: 0, zIndex: 1000}}>
                <AdminHeader />
            </div>
        <div className='manage-products-page'>
            <h2>Orders</h2>

            {/* Filter Bar */}
            <div className='card'>
                <div className="card-input">
                    <input
                        type="text"
                        placeholder="Search by Order ID or Customer Name"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        style={{
                            flex: '1',
                            padding: '10px',
                            borderRadius: '6px',
                            border: '1px solid #ccc'
                        }}
                    >
                        <option value="All Statuses">All Statuses</option>
                        {availableStatuses.map(status => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </select>

                    {/* Date Inputs */}
                    <input
                        type="date" 
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        style={{
                            flex: '1',
                            padding: '10px',
                            borderRadius: '6px',
                            border: '1px solid #ccc'
                        }}
                    />
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        style={{
                            flex: '1',
                            padding: '10px',
                            borderRadius: '6px',
                            border: '1px solid #ccc'
                        }}
                    />
                    <button 
                        onClick={handleResetFilters} 
                        style={{
                            padding: '10px 20px',
                            borderRadius: '6px',
                            border: '1px solid #ccc',
                            backgroundColor: '#f8f9fa',
                            cursor: 'pointer'
                        }}
                    >
                        Reset Filters
                    </button>
                </div>
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
    </button>
  </div>
</div>

            {/* Orders Table */}
            <div className='card'>
                <table className="my-table">
                    <thead>
                        <tr>
                            <th className="order-id-col">Order ID</th>
                            <th className="date-col">Date</th>
                            <th className="customer-col">Customer</th>
                            <th className="total-col">Total</th>
                            <th className="payment-col">Payment Method</th>
                            <th className="status-col">Order Status</th>
                            <th className="action-col">Actions</th>
                        </tr>
                    </thead>
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
                                        <td className="order-id-col">#{order._id.slice(-8)}</td>
                                        <td className="date-col">{new Date(order.order_date || order.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short', 
                                            day: '2-digit',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}</td>
                                        <td className="customer-col">{order.user_id ? order.user_id.full_name : 'Unknown Customer'}</td>
                                        <td className="total-col">${parseFloat(order.total_amount || 0).toFixed(2)}</td>
                                        <td className="payment-col">{order.payment_method || 'N/A'}</td>
                                        <td className={`status-col ${getOrderStatusClass(order.status_id?.status_name || 'Processing')}`}>
                                            {order.status_id?.status_name || 'Processing'}
                                        </td>
                                        <td className="action-col">
                                            <div className="actionButton">
                                                <button className="editbutton" onClick={() => handleViewDetails(order._id)}><MdEdit size={24} /></button>
                                            </div>
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
        </div>
    );
}

export default AllOrdersPage;