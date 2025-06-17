import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthContext } from './hooks/useAuthContext';
import { useCartContext } from './hooks/useCartContext';
import './Website.css';
import Header from './Header';
import Footer from './Footer';
import { SHIPPING_FEE } from './shippingConstants'; // 1. Import the constant

const paymentOptions = [
    { id: 'paypal', name: 'PayPal', logo: '/images/payment-logos/paypal.png' },
    { id: 'applePay', name: 'Apple Pay', logo: '/images/payment-logos/applepay.png' },
    { id: 'googlePay', name: 'Google Pay', logo: '/images/payment-logos/googlepay.png' },
    { id: 'aliPay', name: 'Alipay', logo: '/images/payment-logos/alipay.png' },
    { id: 'grabPay', name: 'GrabPay', logo: '/images/payment-logos/grabpay.png' },
    { id: 'eNETS', name: 'eNETS', logo: '/images/payment-logos/enets.png' },
];

function PlaceOrderPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuthContext();
    const { cartItems, dispatch } = useCartContext();

    // ... (debug useEffects and getUserIdFromToken are unchanged)
    useEffect(() => {
        const logState = () => {
            if (cartItems && cartItems.length > 0) {
                cartItems.forEach((item, index) => {});
            }
        };
        logState();
    }, [user, cartItems]);

    const getUserIdFromToken = (token) => {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const payload = JSON.parse(window.atob(base64));
            return payload._id;
        } catch (error) {
            console.error('Error decoding token:', error);
            return null;
        }
    };

    useEffect(() => {
        if (!user || !user.token) {
            navigate('/login', { state: { from: location.pathname } });
        }
    }, [user, navigate, location]);

    const [shippingDetails, setShippingDetails] = useState({
        fullName: '',
        shippingAddress: '',
        postalCode: '',
    });

    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
    const [orderSummary, setOrderSummary] = useState({
        items: [],
        subtotal: 0,
        shippingFee: SHIPPING_FEE, // 2. Use the constant for initial state
        total: 0,
    });

    useEffect(() => {
        const passedItems = location.state?.items || cartItems;
        const calculatedSubtotal = passedItems.reduce((sum, item) => {
            const itemPrice = typeof item.price === 'string' ? parseFloat(item.price.replace('$', '')) : item.price;
            return sum + item.quantity * itemPrice;
        }, 0);

        setOrderSummary({
            items: passedItems,
            subtotal: calculatedSubtotal,
            shippingFee: SHIPPING_FEE, // 3. Use the constant here as well
            total: calculatedSubtotal + SHIPPING_FEE, // And here for calculation
        });
    }, [location.state, cartItems]);

    // ... (the rest of the file is unchanged)
    const handleShippingChange = (e) => {
        const { name, value } = e.target;
        setShippingDetails(prev => ({ ...prev, [name]: value }));
    };

    const handlePaymentMethodSelect = (method) => {
        setSelectedPaymentMethod(method);
    };
    
    const handleSubmitOrder = async (e) => {
        e.preventDefault();

        if (!user || !user.token) {
            alert('You must be logged in to place an order');
            navigate('/login');
            return;
        }

        const userId = getUserIdFromToken(user.token);
        if (!userId) {
            alert('Authentication error. Please try logging in again.');
            navigate('/login');
            return;
        }

        if (!selectedPaymentMethod) {
            alert('Please select a payment method.');
            return;
        }

        if (!shippingDetails.fullName || !shippingDetails.shippingAddress || !shippingDetails.postalCode) {
            alert('Please fill in all required shipping details.');
            return;
        }

        if (!/^\d{6}$/.test(shippingDetails.postalCode)) {
            alert('Postal code must be exactly 6 digits.');
            return;
        }

        try {
            const orderData = {
                user_id: userId,
                status_id: '684d00b7df30da21ceb3e551',
                payment_method: selectedPaymentMethod,
                shipping_address: shippingDetails.shippingAddress,
                postal_code: shippingDetails.postalCode,
                order_date: new Date().toISOString(),
                total_amount: parseFloat(orderSummary.total)
            };

            const orderResponse = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}`},
                body: JSON.stringify(orderData)
            });

            const orderResult = await orderResponse.json();
            if (!orderResponse.ok) throw new Error(orderResult.error || 'Failed to create order');

            const orderId = orderResult._id;
            for (const item of cartItems) {
                const itemPrice = typeof item.price === 'string' ? parseFloat(item.price.replace(/[$,]/g, '')) : parseFloat(item.price);
                const productId = item.id || item.product_id || item._id;
                if (!productId) throw new Error('Missing product ID for item');

                const orderProductData = {
                    order_id: orderId,
                    product_id: productId,
                    order_qty: parseInt(item.quantity, 10),
                    order_unit_price: parseFloat(itemPrice.toFixed(2)),
                    order_size: item.size || 'N/A'
                };
                
                const orderProductResponse = await fetch('/api/order-products', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}`},
                    body: JSON.stringify(orderProductData)
                });
                if (!orderProductResponse.ok) {
                   const errorText = await orderProductResponse.text();
                   try { const errorJson = JSON.parse(errorText); throw new Error(errorJson.error || 'Failed to create order product'); }
                   catch (e) { throw new Error(`Failed to create order product: ${errorText}`); }
                }
            }

            dispatch({ type: 'CLEAR_CART' });
            alert('Order placed successfully!');
            navigate('/order-history');
        } catch (error) {
            console.error('Error placing order:', error);
            alert(`Failed to place order: ${error.message}`);
        }
    };


    return (
        <>
            <Header />
            <div className="container checkout-page-container">
                <h2>Checkout</h2>
                <form onSubmit={handleSubmitOrder} className="checkout-form">
                    <div className="checkout-layout">
                        <div className="checkout-main-content">
                            <section className="form-section">
                                <h3>Shipping Address (Singapore Only)</h3>
                                <div className="form-group">
                                    <label htmlFor="fullName">Full Name</label>
                                    <input type="text" id="fullName" name="fullName" value={shippingDetails.fullName} onChange={handleShippingChange} required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="shippingAddress">Shipping Address</label>
                                    <input type="text" id="shippingAddress" name="shippingAddress" value={shippingDetails.shippingAddress} onChange={handleShippingChange} required placeholder="Block/House No., Street Name, Unit No., Building Name" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="postalCode">Postal Code</label>
                                    <input type="text" id="postalCode" name="postalCode" value={shippingDetails.postalCode} onChange={handleShippingChange} required pattern="\d{6}" title="Enter a 6-digit Singapore postal code" />
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
                            </section>
                        </div>

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