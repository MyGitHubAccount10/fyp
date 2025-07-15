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

                            // ✅ FIX: The data mapping now correctly reads from the 'product_image' field
                            // that your backend is providing, instead of a non-existent 'images' array.
                            const formattedItems = itemsData.map(item => ({
                                ...item,
                                type: 'product',
                                // Safely access populated product data, with fallbacks
                                product_name: item.product_id ? item.product_id.product_name : 'Product Not Found',
                                // Use the 'product_image' field directly, with a fallback
                                product_image: item.product_id ? item.product_id.product_image : 'default.jpg'
                            }));
                            items = [...items, ...formattedItems];
                            }

                            if (customiseResponse.ok) {
                                const customiseData = await customiseResponse.json();

                                // Normalize to array: if it's not already an array, wrap it in one
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
                                            {order.items && order.items.length > 0 ? (
                                                order.items.map(item => (
                                                    <li key={item._id} className="order-item-detail">
                                                        { item.type === 'product' && (
                                                            <>
                                                                <img src={`${process.env.REACT_APP_API_URL}/images/${item.product_image}`} alt={item.product_name} className="order-item-image" />
                                                                <div className="order-item-info">
                                                                    <strong>{item.product_name}</strong>
                                                                    <span>Qty: {item.order_qty}</span>
                                                                    <span>Type: {item.order_type}</span>
                                                                    <span>Shape: {item.order_shape}</span>
                                                                    <span>Size: {item.order_size}</span>
                                                                    <span>Material: {item.order_material}</span>
                                                                    <span>Thickness: {item.order_thickness}</span>
                                                                    <span>Price: S${(item.order_unit_price * item.order_qty).toFixed(2)}</span>
                                                                </div>
                                                            </>
                                                        )}
                                                        { item.type === 'customise' && (
                                                            <>
                                                                <span>Top Image:</span> 
                                                                <img src={`${process.env.REACT_APP_API_URL}/images/customise/${item.top_image}`} alt="Top Customisation" className="order-item-image" />
                                                                <span>Bottom Image:</span> 
                                                                <img src={`${process.env.REACT_APP_API_URL}/images/customise/${item.bottom_image}`} alt="Bottom Customisation" className="order-item-image" />
                                                                <div className="order-item-info">
                                                                    <span>Board Type: {item.board_type}</span>
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