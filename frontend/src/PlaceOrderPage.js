import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from './hooks/useAuthContext';
import { useCartContext } from './hooks/useCartContext';
import { useCustomiseContext } from './hooks/useCustomiseContext';
import './Website.css';
import Header from './Header';
import Footer from './Footer';
import { SHIPPING_FEE } from './shippingConstants';
import { GST_RATE } from './taxConstants';

const paymentOptions = [
    { id: 'paypal', name: 'PayPal', logo: '/images/paypal.png' },
    { id: 'applePay', name: 'Apple Pay', logo: '/images/applepay.png' },
    { id: 'googlePay', name: 'Google Pay', logo: '/images/googlepay.png' },
    { id: 'aliPay', name: 'Alipay', logo: '/images/alipay.png' },
    { id: 'grabPay', name: 'GrabPay', logo: '/images/grabpay.png' },
    { id: 'eNETS', name: 'eNETS', logo: '/images/enets.png' },
];

function PlaceOrderPage() {
    const navigate = useNavigate();
    const { user } = useAuthContext();
    const { cartItems, dispatch } = useCartContext();
    const {customItem, dispatch: customiseDispatch} = useCustomiseContext();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [shippingDetails, setShippingDetails] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        shippingAddress: '',
    });

    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');

    const [orderSummary, setOrderSummary] = useState({
        items: [],
        subtotal: 0,
        shippingFee: SHIPPING_FEE,
        gst: 0,
        total: 0,
    });

    const [topImagePreview, setTopImagePreview] = useState(null);
    const [bottomImagePreview, setBottomImagePreview] = useState(null);
    const alertShown = useRef(false);

    useEffect(() => {
        if (isSubmitting) {
            return;
        }

        if (!user) {
            navigate('/login', { state: { from: '/place-order' } });
            return;
        }

        if (cartItems.length === 0 && !customItem) {
            navigate('/');
            return;
        }

        if (cartItems.length > 0 && customItem && !alertShown.current) {
            alertShown.current = true;
            dispatch({ type: 'CLEAR_CART' });
            customiseDispatch({ type: 'CLEAR_CUSTOM_ITEM' });
            alert('Your cart and custom skimboard have been cleared due to a conflict. Please order separately.');
            navigate('/');
            return;
        }

        const userData = JSON.parse(localStorage.getItem('user'));
        if (userData) {
            setShippingDetails({
                fullName: userData.full_name || '',
                email: userData.email || '',
                phoneNumber: userData.phone_number || '',
                shippingAddress: userData.shipping_address || '',
            });
        }
    }, [user, cartItems, customItem, navigate, dispatch, customiseDispatch, isSubmitting]);

    useEffect(() => {
        if (!customItem && cartItems.length > 0) {
            const calculatedSubtotal = cartItems.reduce((sum, item) => {
                const itemPrice = typeof item.price === 'string' ? parseFloat(item.price.replace('$', '')) : item.price;
                return sum + item.quantity * itemPrice;
            }, 0);

            const calculatedGst = calculatedSubtotal * GST_RATE;
            const calculatedTotal = calculatedSubtotal + SHIPPING_FEE + calculatedGst;

            setOrderSummary({
                items: cartItems,
                subtotal: calculatedSubtotal,
                shippingFee: SHIPPING_FEE,
                gst: calculatedGst,
                total: calculatedTotal,
            });
        }

        else if (customItem && cartItems.length === 0) {
            const customPrice = typeof customItem.customise_price === 'string' ? parseFloat(customItem.customise_price.replace('$', '')) : customItem.customise_price;
            const calculatedSubtotal = customPrice;
            const calculatedGst = customPrice * GST_RATE;
            const calculatedTotal = customPrice + SHIPPING_FEE + calculatedGst;

            if (customItem.top_image) {
                setTopImagePreview(URL.createObjectURL(customItem.top_image));
            }

            if (customItem.bottom_image) {
                setBottomImagePreview(URL.createObjectURL(customItem.bottom_image));
            }
            setOrderSummary({
                items: [customItem],
                subtotal: calculatedSubtotal,
                shippingFee: SHIPPING_FEE,
                gst: calculatedGst,
                total: calculatedTotal,
            });
        }

        return () => {
            if (topImagePreview) {
                URL.revokeObjectURL(topImagePreview);
            }
            if (bottomImagePreview) {
                URL.revokeObjectURL(bottomImagePreview);
            }
        };
        // --- FIX: Added missing dependencies as requested by the linter ---
    }, [cartItems, customItem, topImagePreview, bottomImagePreview]);
    
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

    const handleShippingChange = (e) => {
        setShippingDetails(prev => ({ ...prev, shippingAddress: e.target.value }));
    };

    const handlePaymentMethodSelect = (method) => {
        setSelectedPaymentMethod(method);
    };
    
    const handleSubmitOrder = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (!user || !user.token) {
            alert('You must be logged in to place an order');
            setIsSubmitting(false);
            navigate('/login');
            return;
        }

        if (!getUserIdFromToken(user.token)) {
            alert('Authentication error. Please try logging in again.');
            setIsSubmitting(false);
            return;
        }

        if (!selectedPaymentMethod) {
            alert('Please select a payment method.');
            setIsSubmitting(false);
            return;
        }

        if (!shippingDetails.shippingAddress) {
            alert('Please fill in your shipping address.');
            setIsSubmitting(false);
            return;
        }

        try {
            // ... (API call logic is correct and remains the same) ...
            const userId = getUserIdFromToken(user.token);
            const orderData = {
                user_id: userId,
                status_id: '684d00b7df30da21ceb3e551',
                payment_method: selectedPaymentMethod,
                shipping_address: shippingDetails.shippingAddress,
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
                    const errorResult = await orderProductResponse.json();
                    throw new Error(errorResult.error || 'Failed to add an item to the order.');
                }
            }
            if (customItem && cartItems.length === 0) {
                const customisePrice = typeof customItem.customise_price === 'string' ? parseFloat(customItem.customise_price.replace(/[$,]/g, '')) : parseFloat(customItem.customise_price);
                const customiseFormData = new FormData();
                customiseFormData.append('order', orderId);
                customiseFormData.append('board_type', customItem.board_type);
                customiseFormData.append('board_shape', customItem.board_shape);
                customiseFormData.append('board_size', customItem.board_size);
                customiseFormData.append('material', customItem.material);
                customiseFormData.append('thickness', customItem.thickness);
                customiseFormData.append('customise_price', customisePrice.toFixed(2));
                if (customItem.top_image) customiseFormData.append('top_image', customItem.top_image);
                if (customItem.bottom_image) customiseFormData.append('bottom_image', customItem.bottom_image);
                const customiseResponse = await fetch('/api/customise', {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${user.token}`},
                    body: customiseFormData
                });
                if (!customiseResponse.ok) {
                    const errorResult = await customiseResponse.json();
                    throw new Error(errorResult.error || 'Failed to add the custom item to the order.');
                }
                const customiseResult = await customiseResponse.json();
                customiseDispatch({ type: 'SET_CUSTOM_ITEM', payload: customiseResult });
            }

            alert('Order placed successfully!');
            navigate('/order-history');
            dispatch({ type: 'CLEAR_CART' });
            customiseDispatch({ type: 'CLEAR_CUSTOM_ITEM' });
            
        } catch (error) {
            console.error('Error placing order:', error);
            alert(`Failed to place order: ${error.message}`);
            setIsSubmitting(false);
        }
    };

    if (!user || (cartItems.length === 0 && !customItem)) {
        return null; 
    }

    return (
        <>
            <Header />
            <div className="container checkout-page-container">
                <div style={{ textAlign: 'left', marginBottom: '20px' }}>
                    <button
                        type="button"
                        className="update-cart-btn"
                        onClick={() => navigate('/cart')}
                        style={{ display: 'inline-block', margin: 0, marginTop: 0 }}
                    >
                        ← Back to Cart
                    </button>
                </div>
                <h2>Checkout</h2>
                <form onSubmit={handleSubmitOrder} className="checkout-form">
                    <div className="checkout-layout">
                        {/* --- FIX: Restored the JSX for the main content area --- */}
                        <div className="checkout-main-content">
                            <section className="form-section">
                                <h3>Shipping Details (Singapore Only)</h3>
                                <div className="form-group">
                                    <label htmlFor="fullName">Full Name</label>
                                    <input type="text" id="fullName" name="fullName" value={shippingDetails.fullName} disabled />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">Email</label>
                                    <input type="email" id="email" name="email" value={shippingDetails.email} disabled />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="phoneNumber">Phone Number</label>
                                    <input type="tel" id="phoneNumber" name="phoneNumber" value={shippingDetails.phoneNumber} disabled />
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

                        {/* --- FIX: Restored the JSX for the order summary --- */}
                        <div className="checkout-order-summary">
                            <h3>Order Summary</h3>
                            <div className="summary-items-list">
                                {orderSummary.items.map(item => {
                                    const itemPrice = typeof item.price === 'string' ? parseFloat(item.price.replace('$', '')) : item.price;
                                    const uniqueKey = `${item.id || item.product_id}-${item.size}`;
                                    if (cartItems.length > 0) {
                                        return (
                                            <div className="summary-item" key={uniqueKey}>
                                                <span>{item.name} (Size: {item.size}, x{item.quantity})</span>
                                                <span>S${(item.quantity * itemPrice).toFixed(2)}</span>
                                            </div>
                                        );
                                    }
                                    // Added a return null for the map function to avoid potential issues.
                                    return null;
                                })}
                                {customItem && (
                                    <>
                                        <div className="summary-line">
                                            <span>Type: {customItem.board_type}</span>
                                        </div>
                                        <div className="summary-line">
                                            <span>Shape: {customItem.board_shape}</span>
                                        </div>
                                        <div className="summary-line">
                                            <span>Size: {customItem.board_size}</span>
                                        </div>
                                        <div className="summary-line">
                                            <span>Material: {customItem.material}</span>
                                        </div>
                                        <div className="summary-line">
                                            <span>Thickness: {customItem.thickness}</span>
                                        </div>
                                        <div className="summary-line">
                                            <span>Top Layer Image</span>
                                            {topImagePreview && <img className="order-item-image" src={topImagePreview} alt="Top Customisation" />}
                                        </div>
                                        <div className="summary-line">
                                            <span>Bottom Layer Image</span>
                                            {bottomImagePreview && <img className="order-item-image" src={bottomImagePreview} alt="Bottom Customisation" />}
                                        </div>
                                    </>
                                )}
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
                            <button type="submit" className="complete-purchase-btn place-order-btn" disabled={isSubmitting}>
                                {isSubmitting ? 'Placing Order...' : 'Place Order'}
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