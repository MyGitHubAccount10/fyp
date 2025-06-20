import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthContext } from './hooks/useAuthContext';
import { useCartContext } from './hooks/useCartContext';
import './Website.css';
import Header from './Header';
import Footer from './Footer';
import { SHIPPING_FEE } from './shippingConstants';
import { GST_RATE } from './taxConstants'; // Import the GST rate

// MODIFIED: Corrected the logo paths to match the file structure in the /public/images directory
const paymentOptions = [
    { id: 'paypal', name: 'PayPal', logo: '/images/paypal.png' },
    { id: 'applePay', name: 'Apple Pay', logo: '/images/applepay.png' },
    { id: 'googlePay', name: 'Google Pay', logo: '/images/googlepay.png' }, // Assuming it's in /images
    { id: 'aliPay', name: 'Alipay', logo: '/images/alipay.png' },       // Assuming it's in /images
    { id: 'grabPay', name: 'GrabPay', logo: '/images/grabpay.png' },     // Assuming it's in /images
    { id: 'eNETS', name: 'eNETS', logo: '/images/enets.png' },           // Assuming it's in /images
];

function PlaceOrderPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuthContext();
    const { cartItems, dispatch } = useCartContext();

    const [shippingDetails, setShippingDetails] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        shippingAddress: '',
    });

    // ✅ FIX: Re-added the state declaration that was accidentally omitted
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');

    // MODIFIED: State now includes GST
    const [orderSummary, setOrderSummary] = useState({
        items: [],
        subtotal: 0,
        shippingFee: SHIPPING_FEE,
        gst: 0,
        total: 0,
    });

    // ✅ FIX: Re-added the function definition that was accidentally omitted
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

    // useEffect to pre-populate user details into the form
    useEffect(() => {
        if (!user || !user.token) {
            navigate('/login', { state: { from: location.pathname } });
            return;
        }

        const userData = JSON.parse(localStorage.getItem('user'));
        if (userData) {
            setShippingDetails({
                firstName: userData.first_name || '',
                lastName: userData.last_name || '',
                email: userData.email || '',
                phoneNumber: userData.phone_number || '',
                shippingAddress: userData.shipping_address || '',
            });
        }
    }, [user, navigate, location]);

    // useEffect to calculate order summary, now with GST
    useEffect(() => {
        const passedItems = location.state?.items || cartItems;
        const calculatedSubtotal = passedItems.reduce((sum, item) => {
            const itemPrice = typeof item.price === 'string' ? parseFloat(item.price.replace('$', '')) : item.price;
            return sum + item.quantity * itemPrice;
        }, 0);

        const calculatedGst = calculatedSubtotal * GST_RATE;
        const calculatedTotal = calculatedSubtotal + SHIPPING_FEE + calculatedGst;

        setOrderSummary({
            items: passedItems,
            subtotal: calculatedSubtotal,
            shippingFee: SHIPPING_FEE,
            gst: calculatedGst,
            total: calculatedTotal,
        });
    }, [location.state, cartItems]);
    
    const handleShippingChange = (e) => {
        setShippingDetails(prev => ({ ...prev, shippingAddress: e.target.value }));
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
            return;
        }

        if (!selectedPaymentMethod) {
            alert('Please select a payment method.');
            return;
        }

        if (!shippingDetails.shippingAddress) {
            alert('Please fill in your shipping address.');
            return;
        }

        try {
            const orderData = {
                user_id: userId,
                status_id: '684d00b7df30da21ceb3e551', // 'Pending' status
                payment_method: selectedPaymentMethod,
                shipping_address: shippingDetails.shippingAddress,
                order_date: new Date().toISOString(),
                total_amount: parseFloat(orderSummary.total) // This total now includes GST
            };

            const orderResponse = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}`},
                body: JSON.stringify(orderData)
            });

            const orderResult = await orderResponse.json();
            if (!orderResponse.ok) throw new Error(orderResult.error || 'Failed to create order');

            const orderId = orderResult._id;
            
            // 🧠 NOTE: This loop creates order items one by one. If an item in the middle of the cart fails (e.g., out of stock),
            // the previous items are already committed to the database. A more robust solution would use a backend transaction
            // to process the entire cart in one atomic operation. This implementation adds error checking to stop the process
            // as soon as a failure is detected.
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
                
                // MODIFIED: Capture and check the response of the fetch call
                const orderProductResponse = await fetch('/api/order-products', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}`},
                    body: JSON.stringify(orderProductData)
                });

                // ✅ 1. Check if the response was successful
                if (!orderProductResponse.ok) {
                    const errorResult = await orderProductResponse.json();
                    // ✅ 2. Throw an error with the specific message from the backend
                    throw new Error(errorResult.error || 'Failed to add an item to the order.');
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
                                <h3>Shipping Details (Singapore Only)</h3>
                                <div className="form-group">
                                    <label htmlFor="firstName">First Name</label>
                                    <input type="text" id="firstName" name="firstName" value={shippingDetails.firstName} disabled className="disabled-input" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="lastName">Last Name</label>
                                    <input type="text" id="lastName" name="lastName" value={shippingDetails.lastName} disabled className="disabled-input" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">Email</label>
                                    <input type="email" id="email" name="email" value={shippingDetails.email} disabled className="disabled-input" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="phoneNumber">Phone Number</label>
                                    <input type="tel" id="phoneNumber" name="phoneNumber" value={shippingDetails.phoneNumber} disabled className="disabled-input" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="shippingAddress">Shipping Address</label>
                                    <input type="text" id="shippingAddress" name="shippingAddress" value={shippingDetails.shippingAddress} onChange={handleShippingChange} required />
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
                                    const uniqueKey = `${item.id || item.product_id}-${item.size}`;
                                    return (
                                        <div className="summary-item" key={uniqueKey}>
                                            <span>{item.name} (Size: {item.size}, x{item.quantity})</span>
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
                                <span>Shipping to {shippingDetails.shippingAddress}</span>
                                <span>S${orderSummary.shippingFee.toFixed(2)}</span>
                            </div>
                            <div className="summary-line">
                                <span>GST ({(GST_RATE * 100).toFixed(0)}%)</span>
                                <span>S${orderSummary.gst.toFixed(2)}</span>
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