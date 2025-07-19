// src/OrderHistoryPage.js

import React, { useState, useEffect } from 'react';
import { useAuthContext } from './hooks/useAuthContext';
import './Website.css';
import Header from './Header';
import Footer from './Footer';

// Use the correct ID for the "Cancelled" status
const CANCELLED_STATUS_ID = '687f3a5b6c7d8e9f0a1b2c3d'; 

function OrderHistoryPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuthContext();
    const [expandedOrderId, setExpandedOrderId] = useState(null);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [orderToCancelId, setOrderToCancelId] = useState(null);
    const [isCancelling, setIsCancelling] = useState(false);


    useEffect(() => {
        // ... (this useEffect hook remains unchanged) ...
        const fetchFullOrderDetails = async () => {
            if (!user) {
                setError('User is not authenticated');
                setLoading(false);
                return;
            }

            try {
                const ordersResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/orders`, {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                });
                if (!ordersResponse.ok) throw new Error('Failed to fetch orders');
                const ordersData = await ordersResponse.json();

                const detailedOrders = await Promise.all(
                    ordersData.map(async (order) => {
                        try {
                            const statusResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/status/${order.status_id}`, {
                                headers: { 'Authorization': `Bearer ${user.token}` }
                            });
                            const statusData = statusResponse.ok ? await statusResponse.json() : { status_name: 'Unknown' };

                            const [itemsResponse, customiseResponse] = await Promise.all([
                                fetch(`${process.env.REACT_APP_API_URL}/api/order-products/by-order/${order._id}`, {
                                    headers: { 'Authorization': `Bearer ${user.token}` }
                                }),
                                fetch(`${process.env.REACT_APP_API_URL}/api/customise/by-order/${order._id}`, {
                                    headers: { 'Authorization': `Bearer ${user.token}` }
                                })
                            ]);

                            let items = [];
                            if (itemsResponse.ok) {
                                const itemsData = await itemsResponse.json();
                                const formattedItems = itemsData.map(item => ({
                                    ...item,
                                    type: 'product',
                                    product_name: item.product_id ? item.product_id.product_name : 'Product Not Found',
                                    product_image: item.product_id ? item.product_id.product_image : 'default.jpg'
                                }));
                                items = [...items, ...formattedItems];
                            }

                            if (customiseResponse.ok) {
                                const customiseData = await customiseResponse.json();
                                if (customiseData.length > 0) {
                                    const formattedCustomiseItems = customiseData.map(item => ({
                                        ...item,
                                        type: 'customise',
                                        top_image: item.top_image || 'default_top.jpg',
                                        bottom_image: item.bottom_image || 'default_bottom.jpg',
                                        board_type: item.board_type || 'Unknown',
                                        board_shape: item.board_shape || 'Unknown',
                                        board_size: item.board_size || 'Unknown',
                                        material: item.material || 'Unknown',
                                        thickness: item.thickness || 'Unknown',
                                    }));
                                    items = [...items, ...formattedCustomiseItems];
                                }
                            }

                            return {
                                ...order,
                                status: statusData.status_name,
                                items: items,
                            };
                        } catch (err) {
                            console.error(`Failed to process details for order ${order._id}:`, err);
                            return { ...order, status: 'Error loading details', items: [] };
                        }
                    })
                );
                setOrders(detailedOrders);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchFullOrderDetails();
        }
    }, [user]);

    const toggleOrderDetails = (orderId) => {
        setExpandedOrderId(prevId => (prevId === orderId ? null : orderId));
    };

    const handleOpenCancelModal = (orderId) => {
        setOrderToCancelId(orderId);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setOrderToCancelId(null);
    };

    const handleConfirmCancel = async () => {
        if (!orderToCancelId) return;

        setIsCancelling(true);
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/orders/${orderToCancelId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ status_id: CANCELLED_STATUS_ID })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to cancel the order.');
            }

            // ✅ FIX 1: Update the order's status in the state instead of removing it.
            // This uses .map() to create a new array with the modified order.
            setOrders(prevOrders => prevOrders.map(order => 
                order._id === orderToCancelId 
                    ? { ...order, status: 'Cancelled' } // If this is the order, update its status
                    : order // Otherwise, keep the order as is
            ));
            
            handleCloseModal();
            alert('Order cancelled'); // The alert now happens *after* the UI state has been updated.

        } catch (error) {
            alert(`Error: ${error.message}`);
            console.error('Cancellation failed:', error);
        } finally {
            setIsCancelling(false);
        }
    };

    const getStatusClass = (status) => {
        if (!status) return '';
        switch (status.toLowerCase()) {
            case 'delivered': return 'status-delivered';
            case 'shipped': return 'status-shipped';
            case 'processing': return 'status-processing';
            case 'pending': return 'status-placed';
            case 'order placed': return 'status-placed';
            case 'cancelled': return 'status-cancelled';
            default: return '';
        }
    };
    
    const cancellableStatuses = ['Order Placed', 'Processing', 'Pending'];

    if (loading) return <div>Loading order history...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <>
            <Header />
            <div className="container order-history-container">
                <h2>Order History</h2>
                {orders.length === 0 ? (
                    <p className="no-orders-message">You have no past orders.</p>
                ) : (
                    <div className="order-list">
                        {orders.map(order => (
                            // ✅ FIX 2: Add a conditional class for cancelled orders
                            <div 
                                className={`order-card ${order.status === 'Cancelled' ? 'cancelled-order' : ''}`} 
                                key={order._id}
                            >
                                <div className="order-card-header" onClick={() => toggleOrderDetails(order._id)} role="button" tabIndex="0" aria-expanded={expandedOrderId === order._id}>
                                    <div className="order-info-left">
                                        <span className={`order-status ${getStatusClass(order.status)}`}>{order.status}</span>
                                        <span className="order-total">S${order.total_amount.toFixed(2)}</span>
                                    </div>
                                    <div className="order-info-center">
                                        <span className="order-id">Order ID: {order._id}</span>
                                        <span className="order-date">Date: {new Date(order.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <div className="order-info-right">
                                        <span className={`details-arrow ${expandedOrderId === order._id ? 'expanded' : ''}`}>▲</span>
                                    </div>
                                </div>
                                {expandedOrderId === order._id && (
                                    <div className="order-card-details">
                                        <p><strong>Shipping Address:</strong> {order.shipping_address}</p>
                                        <strong>Items:</strong>
                                        <ul className="order-items-list">
                                            {/* ... (items list mapping remains the same) ... */}
                                            {order.items && order.items.length > 0 ? (
                                                order.items.map(item => (
                                                    <li key={item._id} className="order-item-detail">
                                                        {item.type === 'product' && (
                                                            <>
                                                                <img src={`${process.env.REACT_APP_API_URL}/images/${item.product_image}`} alt={item.product_name} className="order-item-image" />
                                                                <div className="order-item-info">
                                                                    <strong>{item.product_name}</strong>
                                                                    <span>Type: {item.order_type}</span>
                                                                    <span>Shape: {item.order_shape}</span>
                                                                    <span>Size: {item.order_size}</span>
                                                                    <span>Material: {item.order_material}</span>
                                                                    <span>Thickness: {item.order_thickness}</span>
                                                                    <span>Qty: {item.order_qty}</span>
                                                                    <span>Price: S${(item.order_unit_price * item.order_qty).toFixed(2)}</span>
                                                                </div>
                                                            </>
                                                        )}
                                                        {item.type === 'customise' && (
                                                            <>
                                                                <span>Top Image:</span> 
                                                                <img src={`${process.env.REACT_APP_API_URL}/images/customise/${item.top_image}`} alt="Top Customisation" className="order-item-image" />
                                                                <span>Bottom Image:</span> 
                                                                <img src={`${process.env.REACT_APP_API_URL}/images/customise/${item.bottom_image}`} alt="Bottom Customisation" className="order-item-image" />
                                                                <div className="order-item-info">
                                                                    <span>Type: {item.board_type}</span>
                                                                    <span>Shape: {item.board_shape}</span>
                                                                    <span>Size: {item.board_size}</span>
                                                                    <span>Material: {item.material}</span>
                                                                    <span>Thickness: {item.thickness}</span>
                                                                    <span>Qty: {item.customise_qty}</span>
                                                                    <span>Price: S${item.customise_price * item.customise_qty}</span>
                                                                </div>
                                                            </>
                                                        )}
                                                    </li>
                                                ))
                                            ) : (
                                                <li>Items could not be loaded for this order.</li>
                                            )}
                                        </ul>
                                        {/* The cancel button will now automatically disappear when status changes */}
                                        {cancellableStatuses.includes(order.status) && (
                                            <div className="order-actions-footer">
                                                <button 
                                                    className="btn-cancel"
                                                    onClick={() => handleOpenCancelModal(order._id)}
                                                    disabled={isCancelling}
                                                >
                                                    Cancel Order
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer />

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Confirm Cancellation</h3>
                        <p>Are you sure you want to cancel this order? The items will be returned to stock and this action cannot be undone.</p>
                        <div className="modal-actions">
                            <button className="btn-secondary" onClick={handleCloseModal} disabled={isCancelling}>
                                Go Back
                            </button>
                            <button className="btn-cancel" onClick={handleConfirmCancel} disabled={isCancelling}>
                                {isCancelling ? 'Cancelling...' : 'Yes, Cancel Order'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default OrderHistoryPage;