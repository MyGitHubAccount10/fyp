import React, { useState, useEffect } from 'react';
import './Website.css'; // Main CSS file

// Assume images are in public/images/ directory
const logoImage = '/images/this-side-up-logo.png';
// Example product images (replace with actual or dynamic images)
const skimboardImage1 = '/images/skimboard-pro.jpg';
const skimboardAccessoryImage = '/images/traction-pad.jpg';
const blueShirtImage = '/images/blue-shirt.jpg';


function OrderHistoryPage() {
    const [orders, setOrders] = useState([]);
    const [expandedOrderId, setExpandedOrderId] = useState(null); // To track which order details are shown

    // --- Dummy Order Data ---
    // In a real app, this would be fetched from a backend API
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
        // Simulate fetching orders
        setOrders(dummyOrdersData);
    }, []);

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
            {/* --- Consistent Header --- */}
            <header>
                <div className="header-left-content">
                    <button className="burger-btn" aria-label="Menu" title="Menu">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 12H21" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M3 6H21" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M3 18H21" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                    <a href="/" className="header-logo-link">
                        <img src={logoImage} alt="This Side Up Logo" className="header-logo-img" />
                    </a>
                    <nav className="header-nav-links">
                        <a href="#">About</a>
                        <a href="#">Contact</a>
                        <a href="#">FAQ</a>
                    </nav>
                </div>
                <div className="header-right-content">
                    <form className="search-bar" role="search" onSubmit={(e) => e.preventDefault()}>
                        <input type="search" placeholder="Search" aria-label="Search site" />
                        <button type="submit" aria-label="Submit search" title="Search">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M21 21L16.65 16.65" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                    </form>
                    <a href="#" aria-label="Shopping Cart" className="header-icon-link" title="Shopping Cart">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 2L3 6V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 21.7893 20.2107 21.4142 20.5858 21.0391C20.9609 20.664 21.1716 20.1554 21.1716 19.625V6L18 2H6Z" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" transform="scale(0.9) translate(1.2, 1.2)"/>
                            <path d="M3 6H21" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" transform="scale(0.9) translate(1.2, 1.2)"/>
                            <path d="M16 10C16 11.0609 15.5786 12.0783 14.8284 12.8284C14.0783 13.5786 13.0609 14 12 14C10.9391 14 9.92172 13.5786 9.17157 12.8284C8.42143 12.0783 8 11.0609 8 10" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" transform="scale(0.9) translate(1.2, 1.2)"/>
                        </svg>
                    </a>
                    <a href="#" aria-label="User Account" className="header-icon-link" title="User Account">
                         <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </a>
                    <span className="header-separator"></span>
                    <div className="header-social-icons">
                        <a href="#" aria-label="Instagram" title="Instagram"><img src="https://img.icons8.com/ios-glyphs/30/000000/instagram-new.png" alt="Instagram" /></a>
                        <a href="#" aria-label="TikTok" title="TikTok"><img src="https://img.icons8.com/ios-glyphs/30/000000/tiktok.png" alt="TikTok" /></a>
                    </div>
                </div>
            </header>

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