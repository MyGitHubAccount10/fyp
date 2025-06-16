import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthContext } from './hooks/useAuthContext';
import { useCartContext } from './hooks/useCartContext';
import './Website.css';
import Header from './Header';
import Footer from './Footer';

const paymentOptions = [
    { id: 'paypal', name: 'PayPal', logo: '/images/payment-logos/paypal.png' },
    { id: 'applePay', name: 'Apple Pay', logo: '/images/payment-logos/applepay.png' },
    { id: 'googlePay', name: 'Google Pay', logo: '/images/payment-logos/googlepay.png' },
    { id: 'aliPay', name: 'Alipay', logo: '/images/payment-logos/alipay.png' },
    { id: 'grabPay', name: 'GrabPay', logo: '/images/payment-logos/grabpay.png' },
    { id: 'eNETS', name: 'eNETS', logo: '/images/payment-logos/enets.png' },
    { id: 'creditCard', name: 'Credit Card', logo: '/images/payment-logos/creditcard.png' },
];

function PlaceOrderPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuthContext();
    const { cartItems } = useCartContext();

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
        items: [],
        subtotal: 0,
        shippingFee: 15.00,
        total: 0,
    });

    useEffect(() => {
        const passedItems = location.state?.items || cartItems;
        const calculatedSubtotal = passedItems.reduce((sum, item) => {
            const itemPrice = typeof item.price === 'string' ? parseFloat(item.price.replace('$', '')) : item.price;
            return sum + item.quantity * itemPrice;
        }, 0);
        const shipping = 15.00;

        setOrderSummary({
            items: passedItems,
            subtotal: calculatedSubtotal,
            shippingFee: shipping,
            total: calculatedSubtotal + shipping,
        });
    }, [location.state, cartItems]);

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

    const handleSubmitOrder = async (e) => {
        e.preventDefault();

        // Check if user is logged in
        if (!user) {
            alert('You must be logged in to place an order');
            navigate('/login');
            return;
        }

        // Form validation
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

        try {
            // Format shipping address
            const formattedAddress = `${shippingDetails.fullName}, ${shippingDetails.addressLine1}${shippingDetails.addressLine2 ? ', ' + shippingDetails.addressLine2 : ''}, ${shippingDetails.postalCode}`;

            // Create the order
            const orderData = {
                user: user._id,
                status: "1", // Assuming 1 is your pending status ID
                payment_method: selectedPaymentMethod,
                shipping_address: formattedAddress
            };

            const orderResponse = await fetch('/api/order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify(orderData)
            });

            if (!orderResponse.ok) {
                throw new Error('Failed to create order');
            }

            const orderResult = await orderResponse.json();

            // Create order products for each item
            for (const item of orderSummary.items) {
                const orderProductData = {
                    order: orderResult._id,
                    product: item.id,
                    order_quantity: item.quantity,
                    order_unit_price: (item.price * item.quantity).toFixed(2) // Total for this item
                };

                const orderProductResponse = await fetch('/api/order-product', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user.token}`
                    },
                    body: JSON.stringify(orderProductData)
                });

                if (!orderProductResponse.ok) {
                    throw new Error('Failed to create order product');
                }
            }

            // If everything is successful
            alert('Order placed successfully!');
            navigate('/order-history');

        } catch (error) {
            console.error('Error placing order:', error);
            alert('Failed to place order. Please try again.');
        }
    };

    return (
        <>
            <Header />
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
                                {orderSummary.items.map(item => {
                                    const itemPrice = typeof item.price === 'string' ? parseFloat(item.price.replace('$', '')) : item.price;
                                    return (
                                        <div className="summary-item" key={item.id}>
                                            <span>{item.name} (x{item.quantity})</span>
                                            <span>S${(item.quantity * itemPrice).toFixed(2)}</span>
                                        </div>
                                    );
                                })}
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
            <Footer />
        </>
    );
}

export default PlaceOrderPage;