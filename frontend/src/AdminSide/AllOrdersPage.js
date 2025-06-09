import React, { useState } from 'react';
import AdminHeader from '../AdminHeader'; 
import './AdminStyles.css'; 
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

// Dummy order data
const dummyOrders = [
    { id: 'TSU-1001', date: '2023-10-26 14:30', customer: 'John Doe', total: 175.50, paymentStatus: 'Paid', orderStatus: 'Shipped' },
    { id: 'TSU-1002', date: '2023-10-26 14:30', customer: 'Jane Smith', total: 89.99, paymentStatus: 'Paid', orderStatus: 'Processing' },
    { id: 'TSU-1003', date: '2023-10-26 14:30', customer: 'Mike Brown', total: 210.10, paymentStatus: 'Pending', orderStatus: 'Pending Payment' },
    { id: 'TSU-1004', date: '2023-10-25 11:00', customer: 'Alice Wonderland', total: 55.00, paymentStatus: 'Cancelled', orderStatus: 'Cancelled' },
    { id: 'TSU-1005', date: '2023-10-25 09:15', customer: 'Bob The Builder', total: 300.00, paymentStatus: 'Paid', orderStatus: 'Delivered' },
    { id: 'TSU-1006', date: '2023-10-24 18:00', customer: 'Charlie Chaplin', total: 120.75, paymentStatus: 'Paid', orderStatus: 'Shipped' },
    { id: 'TSU-1007', date: '2023-10-24 10:30', customer: 'David Bowie', total: 99.00, paymentStatus: 'Pending', orderStatus: 'Processing' },
     // Add more dummy orders to test pagination
     ...Array.from({ length: 15 }).map((_, i) => ({ // Add 15 more orders
         id: `TSU-10${i + 8 < 100 ? '0' : ''}${i + 8}`,
         date: `2023-10-${23 - Math.floor(i/3)} 0${(i%3)+1}:00`,
         customer: `Dummy Customer ${i + 1}`,
         total: (i + 1) * 10 + 0.50,
         paymentStatus: i % 2 === 0 ? 'Paid' : 'Pending',
         orderStatus: i % 3 === 0 ? 'Delivered' : (i % 3 === 1 ? 'Shipped' : 'Processing'),
     }))
];

function AllOrdersPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('All Statuses');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [ordersPerPage] = useState(10); // Fixed number of orders per page

    // Filtered orders based on current filters (client-side demo)
    const filteredOrders = dummyOrders.filter(order => {
        const matchesSearch = searchTerm.toLowerCase() === '' ||
                              order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              order.customer.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = selectedStatus === 'All Statuses' || order.orderStatus === selectedStatus;

        // Basic date filtering (assuming date strings are comparable)
        const matchesStartDate = startDate === '' || new Date(order.date).getTime() >= new Date(startDate).getTime();
        const matchesEndDate = endDate === '' || new Date(order.date).getTime() <= new Date(endDate).getTime();


        return matchesSearch && matchesStatus && matchesStartDate && matchesEndDate;
    });

    // Pagination Logic based on filtered orders
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
    const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

    const handleApplyFilters = () => {
        console.log("Applying filters:", { searchTerm, selectedStatus, startDate, endDate });
        // In a real app, this would trigger an API call with these parameters
        setCurrentPage(1); // Reset to first page on new filter
        // The filtering logic above already updates filteredOrders,
        // so no need to set state here if doing client-side filtering.
        // If doing server-side, you'd fetch data here.
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
    };

     // Function to get order status class (reusing from Dashboard)
    const getOrderStatusClass = (status) => {
        switch (status) {
            case 'Shipped': return 'status-shipped';
            case 'Processing': return 'status-processing';
            case 'Delivered': return 'status-delivered'; // Assuming Delivered exists
            case 'Cancelled': return 'status-cancelled'; // Assuming Cancelled exists
            case 'Pending Payment': return 'status-pending'; // Assuming Pending Payment exists
            // Add other statuses as needed
            default: return '';
        }
    };
    const navigate = useNavigate();



    // Handler for 'View Details' link (placeholder)
    const handleViewDetails = (orderId) => {
        console.log("Viewing details for order:", orderId);
        // In a real app, navigate to a specific order details page
        // navigate(`/admin/orders/${orderId}`);
        navigate(`/order-details`);
    };

    return (<>
              <AdminHeader />
        <div className="all-orders-page" style={{ paddingLeft: "100px",paddingRight:"100px" }}> {/* Page-specific class */}
            {/* Page Title will come from AdminLayout */}
            <h2 >All Orders</h2>

            {/* Filter Bar */}
            <div className="filter-bar">
                <input
                    type="text"
                    placeholder="Search"
                    className="filter-input search-input" // Reuse search-input style if applicable
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select
                    className="filter-input status-select"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                >
                    <option value="All Statuses">All Statuses</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Processing">Processing</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Pending Payment">Pending Payment</option>
                    {/* Add other statuses dynamically */}
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
                 </div>


                <button onClick={handleApplyFilters} className="btn-apply-filters">
                    Apply Filters
                </button>
            </div>
                        {/* Pagination Controls */}
            <div className="pagination-controls" style={{ padding: "10px 0" }}> {/* Reusing pagination-controls style */}
                <span style={{ marginRight: "10px" }}>Page {currentPage} of {totalPages}</span>
                <button onClick={handlePrevPage} disabled={currentPage === 1}>{'<< Prev'}</button>
                <button onClick={handleNextPage} disabled={currentPage === totalPages}>{'Next >>'}</button>
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
                            <th>Payment Status</th>
                            <th>Order Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentOrders.length > 0 ? (
                             currentOrders.map(order => (
                                <tr key={order.id}>
                                    <td>#{order.id}</td> {/* Add # as in image */}
                                    <td>{order.date}</td>
                                    <td>{order.customer}</td>
                                    <td>${order.total.toFixed(2)}</td> {/* Format price */}
                                    <td>{order.paymentStatus}</td>
                                    <td className={getOrderStatusClass(order.orderStatus)}>{order.orderStatus}</td>
                                    <td>
                                        <button onClick={() => handleViewDetails(order.id)} className="link-button">View Details</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>No orders found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    </>);
}

export default AllOrdersPage;