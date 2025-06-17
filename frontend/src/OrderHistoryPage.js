import React, { useState, useEffect } from 'react';
import { useAuthContext } from './hooks/useAuthContext';
import './Website.css';
import Header from './Header';
import Footer from './Footer';

function OrderHistoryPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuthContext();
    const [expandedOrderId, setExpandedOrderId] = useState(null);

    useEffect(() => {
        const fetchFullOrderDetails = async () => {
            if (!user) {
                setError('User is not authenticated');
                setLoading(false);
                return;
            }

            try {
                const ordersResponse = await fetch('/api/orders', {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                });
                if (!ordersResponse.ok) throw new Error('Failed to fetch orders');
                const ordersData = await ordersResponse.json();

                const detailedOrders = await Promise.all(
                    ordersData.map(async (order) => {
                        try {
                            const statusResponse = await fetch(`/api/status/${order.status_id}`, {
                                headers: { 'Authorization': `Bearer ${user.token}` }
                            });
                            const statusData = statusResponse.ok ? await statusResponse.json() : { status_name: 'Unknown' };

                            const itemsResponse = await fetch(`/api/order-products/by-order/${order._id}`, {
                                headers: { 'Authorization': `Bearer ${user.token}` }
                            });
                            if (!itemsResponse.ok) throw new Error('Failed to fetch order items');
                            const itemsData = await itemsResponse.json();

                            const itemsWithProductDetails = await Promise.all(
                                itemsData.map(async (item) => {
                                    const productResponse = await fetch(`/api/product/${item.product_id}`);
                                    const productData = productResponse.ok ? await productResponse.json() : { product_name: 'Product not found', product_image: 'default.jpg' };
                                    return { ...item, ...productData };
                                })
                            );

                            return {
                                ...order,
                                status: statusData.status_name,
                                items: itemsWithProductDetails
                            };
                        } catch (err) {
                            console.error(`Failed to process details for order ${order._id}:`, err);
                            return { ...order, status: 'Error', items: [] };
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

    const getStatusClass = (status) => {
        if (!status) return '';
        switch (status.toLowerCase()) {
            case 'delivered': return 'status-delivered';
            case 'shipped': return 'status-shipped';
            case 'processing': return 'status-processing';
            case 'order placed': return 'status-placed';
            case 'cancelled': return 'status-cancelled';
            default: return '';
        }
    };

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
                            <div className="order-card" key={order._id}>
                                <div className="order-card-header" onClick={() => toggleOrderDetails(order._id)} role="button" tabIndex="0" aria-expanded={expandedOrderId === order._id}>
                                    {/* --- NEW LAYOUT: Left section for status and total --- */}
                                    <div className="order-info-left">
                                        <span className={`order-status ${getStatusClass(order.status)}`}>{order.status}</span>
                                        <span className="order-total">S${order.total_amount.toFixed(2)}</span>
                                    </div>
                                    {/* --- NEW LAYOUT: Center section for ID and date --- */}
                                    <div className="order-info-center">
                                        <span className="order-id">Order ID: {order._id}</span>
                                        <span className="order-date">Date: {new Date(order.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    {/* --- NEW LAYOUT: Right section for arrow --- */}
                                    <div className="order-info-right">
                                        <span className={`details-arrow ${expandedOrderId === order._id ? 'expanded' : ''}`}>▲</span>
                                    </div>
                                </div>
                                {expandedOrderId === order._id && (
                                    <div className="order-card-details">
                                        <p><strong>Shipping Address:</strong> {order.shipping_address}, Singapore {order.postal_code}</p>
                                        <strong>Items:</strong>
                                        <ul className="order-items-list">
                                            {order.items.map(item => (
                                                <li key={item._id} className="order-item-detail">
                                                    <img src={`/images/${item.product_image}`} alt={item.product_name} className="order-item-image" />
                                                    <div className="order-item-info">
                                                        <span>{item.product_name} (Qty: {item.order_qty}, Size: {item.order_size || 'N/A'})</span>
                                                        {/* --- FIX: Price now multiplies by quantity --- */}
                                                        <span>S${(item.order_unit_price * item.order_qty).toFixed(2)}</span>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
}

export default OrderHistoryPage;