import React, { useState, useEffect } from 'react';
import './Website.css';
import Header from './Header';

// Example product images (replace with actual or dynamic images)
const skimboardImage1 = '/images/skimboard-pro.jpg';
const skimboardAccessoryImage = '/images/traction-pad.jpg';
const blueShirtImage = '/images/blue-shirt.jpg';


function OrderHistoryPage() {
    const [orders, setOrders] = useState([]);
    const [expandedOrderId, setExpandedOrderId] = useState(null);

    const dummyOrdersData = [
        {
            id: 'TSU-SG-00345',
            date: '2023-10-15',
            totalAmount: 'S$285.00',
            status: 'Delivered',
            shippingAddress: '123 Orchard Road, #05-12, Singapore 238879',
            items: [
                { id: 'prod1', name: 'Pro Skimboard "Azure"', quantity: 1, price: 'S$250.00', imageUrl: skimboardImage1 },
                { id: 'prod2', name: 'Premium Board Wax', quantity: 1, price: 'S$15.00', imageUrl: skimboardAccessoryImage },
                { id: 'prod3', name: 'This Side Up Tee (Blue)', quantity: 1, price: 'S$20.00', imageUrl: blueShirtImage },
            ]
        },
        {
            id: 'TSU-SG-00211',
            date: '2023-09-02',
            totalAmount: 'S$165.50',
            status: 'Shipped',
            shippingAddress: '456 Clementi Ave, #11-34, Singapore 120456',
            items: [
                { id: 'prod4', name: 'Beginner Skimboard "Sandy"', quantity: 1, price: 'S$150.00', imageUrl: skimboardImage1 },
                { id: 'prod5', name: 'Rash Guard (L)', quantity: 1, price: 'S$15.50', imageUrl: blueShirtImage },
            ]
        },
        {
            id: 'TSU-SG-00105',
            date: '2023-07-20',
            totalAmount: 'S$35.00',
            status: 'Processing',
            shippingAddress: '789 Pasir Ris Drive, #02-01, Singapore 510789',
            items: [
                { id: 'prod6', name: 'Sticker Pack "Coastal Vibes"', quantity: 2, price: 'S$10.00', imageUrl: skimboardAccessoryImage },
                { id: 'prod7', name: 'This Side Up Cap', quantity: 1, price: 'S$15.00', imageUrl: skimboardAccessoryImage },
            ]
        }
    ];

    useEffect(() => {
        setOrders(dummyOrdersData);
    }, []); // Added dummyOrdersData to dependency array for completeness, though it's constant here

    const toggleOrderDetails = (orderId) => {
        setExpandedOrderId(prevId => (prevId === orderId ? null : orderId));
    };

    const getStatusClass = (status) => {
        switch (status.toLowerCase()) {
            case 'delivered': return 'status-delivered';
            case 'shipped': return 'status-shipped';
            case 'processing': return 'status-processing';
            case 'cancelled': return 'status-cancelled';
            default: return '';
        }
    };

    return (
        <>
            <Header />
            {/* --- Main Content --- */}
            <div className="container order-history-container">
                <h2>Order History</h2>

                {orders.length === 0 ? (
                    <p className="no-orders-message">You have no past orders.</p>
                ) : (
                    <div className="order-list">
                        {orders.map(order => (
                            <div className="order-card" key={order.id}>
                                <div className="order-card-header" onClick={() => toggleOrderDetails(order.id)} role="button" tabIndex="0" aria-expanded={expandedOrderId === order.id}>
                                    <div className="order-info-main">
                                        <span className="order-id">Order ID: {order.id}</span>
                                        <span className="order-date">Date: {order.date}</span>
                                    </div>
                                    <div className="order-info-secondary">
                                        <span className={`order-status ${getStatusClass(order.status)}`}>{order.status}</span>
                                        <span className="order-total">{order.totalAmount}</span>
                                        <span className={`details-arrow ${expandedOrderId === order.id ? 'expanded' : ''}`}>▼</span>
                                    </div>
                                </div>
                                {expandedOrderId === order.id && (
                                    <div className="order-card-details">
                                        <p><strong>Shipping Address:</strong> {order.shippingAddress}</p>
                                        <strong>Items:</strong>
                                        <ul className="order-items-list">
                                            {order.items.map(item => (
                                                <li key={item.id} className="order-item-detail">
                                                    <img src={item.imageUrl} alt={item.name} className="order-item-image" />
                                                    <div className="order-item-info">
                                                        <span>{item.name} (Qty: {item.quantity})</span>
                                                        <span>{item.price}</span>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                        <div className="order-actions-footer">
                                            <button className="btn-order-action">Track Package</button>
                                            <button className="btn-order-action btn-secondary">Request Return</button>
                                            <button className="btn-order-action btn-secondary">View Invoice</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* --- Consistent Footer --- */}
            <footer className="footer">
                <div className="footer-column">
                    <strong>#THISSIDEUP</strong>
                    <div className="social-icons">
                        <a href="#" aria-label="Instagram"><img src="https://img.icons8.com/ios-filled/50/ffffff/instagram-new.png" alt="Instagram" /></a>
                        <a href="#" aria-label="TikTok"><img src="https://img.icons8.com/ios-filled/50/ffffff/tiktok--v1.png" alt="TikTok" /></a>
                    </div>
                </div>
                <div className="footer-column">
                    <strong>Customer Service</strong>
                    <a href="#">Contact</a><br />
                    <a href="#">FAQ</a><br />
                    <a href="#">About</a>
                </div>
                <div className="footer-column">
                    <strong>Handcrafted in Singapore</strong>
                    Here at This Side Up, we're a passionate, Singapore-based skimboard company committed to bringing the exhilarating rush of skimboarding to enthusiasts of every skill level. We specialize in crafting custom-designed skimboards, blending high-quality materials with your unique, personalized designs. The result? Boards that not only perform exceptionally but let your individual style shine on the shore. Rooted in Singapore's vibrant coastal culture, we aim to inspire a spirited community of adventure seekers and champion an active, sun-soaked lifestyle.
                </div>
            </footer>
        </>
    );
}

export default OrderHistoryPage;