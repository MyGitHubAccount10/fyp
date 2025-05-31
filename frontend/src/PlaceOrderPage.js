import React, { useState, useEffect } from 'react';
import './Website.css'; // Main CSS file

// Assume images are in public/images/ directory
const logoImage = '/images/this-side-up-logo.png';
// Payment method logos (replace with actual paths or use an icon library)
const paypalLogo = '/images/payment-logos/paypal.png';
const applepayLogo = '/images/payment-logos/applepay.png';
const googlepayLogo = '/images/payment-logos/googlepay.png';
const alipayLogo = '/images/payment-logos/alipay.png';
const grabpayLogo = '/images/payment-logos/grabpay.png';
const enetsLogo = '/images/payment-logos/enets.png';
const creditcardLogo = '/images/payment-logos/creditcard.png'; // Generic credit card icon

// Simple SVG Icons for secondary navigation (black color is set via CSS or inline fill)
const TshirtIcon = () => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="black">
        <path d="M12,2C9.243,2,7,4.243,7,7v3H5c-1.103,0-2,0.897-2,2v8c0,1.103,0.897,2,2,2h14c1.103,0,2-0.897,2-2v-8c0-1.103-0.897-2-2-2h-2V7 C17,4.243,14.757,2,12,2z M10,7V6c0-1.103,0.897-2,2-2s2,0.897,2,2v1H10z"/>
    </svg>
);
const JacketIcon = () => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="black">
        <path d="M18 7h-2V5c0-1.103-.897-2-2-2h-4c-1.103 0-2 .897-2 2v2H6c-1.103 0-2 .897-2 2v10c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2V9c0-1.103-.897-2-2-2zm-8-2h4v2h-4V5zm6 14H8V9h8v10z"/>
        <path d="M10 12h4v2h-4zm0 15h4v2h-4z"/>
    </svg>
);
const BoardshortsIcon = () => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="black">
        <path d="M8 2v4H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4v-6h4v6h4c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-2V2h-8zm2 5h4v3h-4V7z"/>
    </svg>
);
const AccessoriesIcon = () => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="black">
        <path d="M21.41,11.59l-9-9C12.05,2.24,11.55,2,11,2H4C2.9,2,2,2.9,2,4v7c0,0.55,0.24,1.05,0.59,1.41l9,9 C11.95,21.76,12.45,22,13,22s1.05-0.24,1.41-0.59l7-7C22.17,13.66,22.17,12.34,21.41,11.59z M13,20L4,11V4h7l9,9L13,20z"/>
        <circle cx="6.5" cy="6.5" r="1.5"/>
    </svg>
);

function PlaceOrderPage() {
    const [shippingDetails, setShippingDetails] = useState({
        fullName: '',
        addressLine1: '',
        addressLine2: '',
        postalCode: '',
        phoneNumber: '',
        email: '',
    });

    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
    const [cardDetails, setCardDetails] = useState({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardHolderName: ''
    });

    const [orderSummary, setOrderSummary] = useState({
        items: [
            { id: 1, name: 'Skimboard Pro Model', quantity: 1, price: 250.00 },
            { id: 2, name: 'Board Wax', quantity: 2, price: 10.00 },
        ],
        subtotal: 270.00,
        shippingFee: 15.00,
        total: 285.00,
    });
    const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false); // New state

    const toggleProductDropdown = (e) => { // New handler
        e.preventDefault();
        setIsProductDropdownOpen(!isProductDropdownOpen);
    };

    const handleShippingChange = (e) => {
        const { name, value } = e.target;
        setShippingDetails(prev => ({ ...prev, [name]: value }));
    };

    const handleCardDetailsChange = (e) => {
        const { name, value } = e.target;
        setCardDetails(prev => ({ ...prev, [name]: value }));
    };

    const handlePaymentMethodSelect = (method) => {
        setSelectedPaymentMethod(method);
    };

    const handleSubmitOrder = (e) => {
        e.preventDefault();
        if (!selectedPaymentMethod) {
            alert('Please select a payment method.');
            return;
        }
        if (!shippingDetails.fullName || !shippingDetails.addressLine1 || !shippingDetails.postalCode || !shippingDetails.phoneNumber || !shippingDetails.email) {
            alert('Please fill in all required shipping details.');
            return;
        }
        if (selectedPaymentMethod === 'creditCard') {
            if (!cardDetails.cardNumber || !cardDetails.expiryDate || !cardDetails.cvv || !cardDetails.cardHolderName) {
                alert('Please fill in all credit card details.');
                return;
            }
        }
        console.log('Order Submitted:', {
            shippingDetails,
            paymentMethod: selectedPaymentMethod,
            ...(selectedPaymentMethod === 'creditCard' && { cardDetails }),
            orderSummary
        });
        alert(`Order placed successfully using ${selectedPaymentMethod}! (This is a demo)`);
    };

    useEffect(() => {
        const calculatedSubtotal = orderSummary.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const shipping = 15.00;
        setOrderSummary(prev => ({
            ...prev,
            subtotal: calculatedSubtotal,
            shippingFee: shipping,
            total: calculatedSubtotal + shipping
        }));
    }, []); // Removed orderSummary.items from dependencies to avoid loop with dummy data

    const paymentOptions = [
        { id: 'paypal', name: 'PayPal', logo: paypalLogo },
        { id: 'applePay', name: 'Apple Pay', logo: applepayLogo },
        { id: 'googlePay', name: 'Google Pay', logo: googlepayLogo },
        { id: 'aliPay', name: 'Alipay', logo: alipayLogo },
        { id: 'grabPay', name: 'GrabPay', logo: grabpayLogo },
        { id: 'eNETS', name: 'eNETS', logo: enetsLogo },
        { id: 'creditCard', name: 'Credit Card', logo: creditcardLogo },
    ];

    return (
        <>
            {/* --- UPDATED Header --- */}
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
                        <a href="#" onClick={toggleProductDropdown} className="product-dropdown-toggle">
                            Product
                            <svg className={`product-arrow ${isProductDropdownOpen ? 'up' : ''}`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </a>
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

            {isProductDropdownOpen && (
                <nav className="secondary-navbar">
                    <a href="#" className="secondary-navbar-item">
                        <TshirtIcon /> T-shirt
                    </a>
                    <a href="#" className="secondary-navbar-item">
                        <JacketIcon /> Jackets
                    </a>
                    <a href="#" className="secondary-navbar-item">
                        <BoardshortsIcon /> Boardshorts
                    </a>
                    <a href="#" className="secondary-navbar-item">
                        <AccessoriesIcon /> Accessories
                    </a>
                </nav>
            )}

            {/* --- Main Content --- */}
            <div className="container checkout-page-container">
                <h2>Checkout</h2>
                <form onSubmit={handleSubmitOrder} className="checkout-form">
                    <div className="checkout-layout">
                        {/* --- Shipping & Payment Column --- */}
                        <div className="checkout-main-content">
                            <section className="form-section">
                                <h3>Shipping Address (Singapore Only)</h3>
                                <div className="form-group">
                                    <label htmlFor="fullName">Full Name</label>
                                    <input type="text" id="fullName" name="fullName" value={shippingDetails.fullName} onChange={handleShippingChange} required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="addressLine1">Address Line 1</label>
                                    <input type="text" id="addressLine1" name="addressLine1" value={shippingDetails.addressLine1} onChange={handleShippingChange} required placeholder="Block/House No., Street Name" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="addressLine2">Address Line 2 (Optional)</label>
                                    <input type="text" id="addressLine2" name="addressLine2" value={shippingDetails.addressLine2} onChange={handleShippingChange} placeholder="Unit No., Building Name" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="postalCode">Postal Code</label>
                                    <input type="text" id="postalCode" name="postalCode" value={shippingDetails.postalCode} onChange={handleShippingChange} required pattern="\d{6}" title="Enter a 6-digit Singapore postal code" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="phoneNumber">Phone Number</label>
                                    <input type="tel" id="phoneNumber" name="phoneNumber" value={shippingDetails.phoneNumber} onChange={handleShippingChange} required pattern="[689]\d{7}" title="Enter a valid Singapore mobile or landline number (8 digits starting with 6, 8, or 9)" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">Email Address</label>
                                    <input type="email" id="email" name="email" value={shippingDetails.email} onChange={handleShippingChange} required />
                                </div>
                            </section>

                            <section className="form-section">
                                <h3>Payment Method</h3>
                                <div className="payment-options-grid">
                                    {paymentOptions.map(option => (
                                        <button
                                            type="button"
                                            key={option.id}
                                            className={`payment-option ${selectedPaymentMethod === option.id ? 'selected' : ''}`}
                                            onClick={() => handlePaymentMethodSelect(option.id)}
                                            aria-pressed={selectedPaymentMethod === option.id}
                                        >
                                            <img src={option.logo} alt={`${option.name} logo`} className="payment-logo" />
                                            <span>{option.name}</span>
                                        </button>
                                    ))}
                                </div>

                                {selectedPaymentMethod === 'creditCard' && (
                                    <div className="credit-card-form">
                                        <h4>Enter Credit Card Details</h4>
                                        <div className="form-group">
                                            <label htmlFor="cardHolderName">Cardholder Name</label>
                                            <input type="text" id="cardHolderName" name="cardHolderName" value={cardDetails.cardHolderName} onChange={handleCardDetailsChange} required />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="cardNumber">Card Number</label>
                                            <input type="text" id="cardNumber" name="cardNumber" value={cardDetails.cardNumber} onChange={handleCardDetailsChange} required pattern="\d{13,19}" title="Enter a valid card number (13-19 digits)" />
                                        </div>
                                        <div className="form-group form-group-inline">
                                            <div>
                                                <label htmlFor="expiryDate">Expiry Date (MM/YY)</label>
                                                <input type="text" id="expiryDate" name="expiryDate" value={cardDetails.expiryDate} onChange={handleCardDetailsChange} required pattern="(0[1-9]|1[0-2])\/\d{2}" title="MM/YY" placeholder="MM/YY" />
                                            </div>
                                            <div>
                                                <label htmlFor="cvv">CVV</label>
                                                <input type="text" id="cvv" name="cvv" value={cardDetails.cvv} onChange={handleCardDetailsChange} required pattern="\d{3,4}" title="3 or 4 digit CVV" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </section>
                        </div>

                        {/* --- Order Summary Column --- */}
                        <div className="checkout-order-summary">
                            <h3>Order Summary</h3>
                            <div className="summary-items-list">
                                {orderSummary.items.map(item => (
                                    <div className="summary-item" key={item.id}>
                                        <span>{item.name} (x{item.quantity})</span>
                                        <span>S${(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                            <hr className="summary-hr" />
                            <div className="summary-line">
                                <span>Subtotal</span>
                                <span>S${orderSummary.subtotal.toFixed(2)}</span>
                            </div>
                            <div className="summary-line">
                                <span>Shipping (Singapore)</span>
                                <span>S${orderSummary.shippingFee.toFixed(2)}</span>
                            </div>
                            <hr className="summary-hr" />
                            <div className="summary-line total-summary-line">
                                <strong>Total</strong>
                                <strong>S${orderSummary.total.toFixed(2)}</strong>
                            </div>
                            <button type="submit" className="complete-purchase-btn place-order-btn">
                                Place Order
                            </button>
                            <p className="checkout-terms">
                                By placing your order, you agree to our <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a>.
                            </p>
                        </div>
                    </div>
                </form>
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

export default PlaceOrderPage;