import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from './hooks/useAuthContext';
import './Website.css';
import Header from './Header';
import Footer from './Footer';

function OrderHistoryPage() {
    const [orders, setOrders] = useState([]);
    const [expandedOrderId, setExpandedOrderId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuthContext();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchOrders = async () => {
            try {
                const ordersResponse = await fetch('/order', {
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                });

                if (!ordersResponse.ok) {
                    throw new Error('Failed to fetch orders');
                }

                const ordersData = await ordersResponse.json();

                const ordersWithProducts = await Promise.all(ordersData.map(async (order) => {
                    try {
                        const orderProductsResponse = await fetch(`/order-product/${order._id}`, {
                            headers: {
                                'Authorization': `Bearer ${user.token}`
                            }
                        });

                        if (!orderProductsResponse.ok) {
                            throw new Error('Failed to fetch order products');
                        }

                        const orderProducts = await orderProductsResponse.json();

                        const productsWithDetails = await Promise.all(orderProducts.map(async (op) => {
                            try {
                                const productResponse = await fetch(`/product/${op.product_id}`, {
                                    headers: {
                                        'Authorization': `Bearer ${user.token}`
                                    }
                                });

                                if (!productResponse.ok) {
                                    throw new Error('Failed to fetch product details');
                                }

                                const product = await productResponse.json();

                                return {
                                    id: op._id,
                                    product_id: op.product_id,
                                    name: product.name,
                                    quantity: op.order_qty,
                                    price: `S$${op.order_unit_price.toFixed(2)}`,
                                    size: op.order_size,
                                    imageUrl: product.image ? `/images/${product.image}` : '/images/placeholder.png'
                                };
                            } catch (error) {
                                console.error('Error fetching product:', error);
                                return {
                                    id: op._id,
                                    product_id: op.product_id,
                                    name: 'Product Not Found',
                                    quantity: op.order_qty,
                                    price: `S$${op.order_unit_price.toFixed(2)}`,
                                    size: op.order_size,
                                    imageUrl: '/images/placeholder.png'
                                };
                            }
                        }));

                        const statusResponse = await fetch(`/status/${order.status_id}`, {
                            headers: {
                                'Authorization': `Bearer ${user.token}`
                            }
                        });

                        if (!statusResponse.ok) {
                            throw new Error('Failed to fetch status details');
                        }

                        const statusData = await statusResponse.json();

                        return {
                            id: order._id,
                            date: new Date(order.order_date).toLocaleDateString('en-SG'),
                            totalAmount: `S$${order.total_amount.toFixed(2)}`,
                            status: statusData.status_name,
                            shippingAddress: `${order.shipping_address}, Singapore ${order.postal_code}`,
                            items: productsWithDetails,
                            payment_method: order.payment_method
                        };
                    } catch (error) {
                        console.error('Error processing order:', error);
                        return null;
                    }
                }));

                const validOrders = ordersWithProducts.filter(order => order !== null);
                setOrders(validOrders);
            } catch (error) {
                console.error('Error fetching orders:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user, navigate]);

    // ... rest of the component code remains the same ...
}

export default OrderHistoryPage;