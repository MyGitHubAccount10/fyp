// PlaceOrderPage.js:

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthContext } from './hooks/useAuthContext';
import { useCartContext } from './hooks/useCartContext';
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
    const location = useLocation();
    const { user } = useAuthContext();
    const { cartItems, dispatch } = useCartContext();

    // This state will hold the items for THIS checkout session, whether from "Buy Now" or the cart.
    const [checkoutItems, setCheckoutItems] = useState([]);
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isPayPalPopupVisible, setIsPayPalPopupVisible] = useState(false);

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

    // EFFECT 1: Determines which items to use for checkout and handles initial setup/redirects.
    useEffect(() => {
        if (isSubmitting) return;

        // Determine the source of items: "Buy Now" state or the general cart context.
        const buyNowFlowItems = location.state?.buyNowItem;
        const itemsToProcess = (buyNowFlowItems && buyNowFlowItems.length > 0) ? buyNowFlowItems : cartItems;

        // Redirect if not logged in, making sure to preserve the buyNowItem state for after login.
        if (!user) {
            navigate('/login', { state: { from: '/place-order', buyNowItem: buyNowFlowItems } });
            return;
        }

        // If, after all checks, there are no items, go back to the home page.
        if (itemsToProcess.length === 0) {
            navigate('/');
            return;
        }
        
        // Set the state which drives the rest of the page's logic.
        setCheckoutItems(itemsToProcess);

        // Populate shipping details from logged-in user's data.
        const userData = JSON.parse(localStorage.getItem('user'));
        if (userData) {
            setShippingDetails({
                fullName: userData.full_name || '',
                email: userData.email || '',
                phoneNumber: userData.phone_number || '',
                shippingAddress: userData.shipping_address || '',
            });
        }
    }, [user, cartItems, location.state, navigate, isSubmitting]);

    // EFFECT 2: Recalculates the order summary whenever the items for checkout change.
    useEffect(() => {
        if (checkoutItems.length === 0) return;

        const subtotal = checkoutItems.reduce((sum, item) => {
            const itemPrice = typeof item.price === 'string' ? parseFloat(item.price.replace(/[$,]/g, '')) : parseFloat(item.price);
            return sum + item.quantity * itemPrice;
        }, 0);
        
        const calculatedGst = subtotal * GST_RATE;
        const calculatedTotal = subtotal + SHIPPING_FEE + calculatedGst;

        setOrderSummary({
            items: checkoutItems,
            subtotal: subtotal,
            shippingFee: SHIPPING_FEE,
            gst: calculatedGst,
            total: calculatedTotal,
        });        
    }, [checkoutItems]);
    
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
    
    const executeOrderCreation = async () => {
        setIsSubmitting(true);
        if (isPayPalPopupVisible) {
            setIsPayPalPopupVisible(false);
        }

        const isBuyNowFlow = location.state?.buyNowItem && location.state.buyNowItem.length > 0;

        try {
            const userId = getUserIdFromToken(user.token);
            const orderData = {
                user_id: userId,
                status_id: '684d00b7df30da21ceb3e551',
                payment_method: selectedPaymentMethod,
                shipping_address: shippingDetails.shippingAddress,
                order_date: new Date().toISOString(),
                total_amount: parseFloat(orderSummary.total)
            };
            const orderResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}`},
                body: JSON.stringify(orderData)
            });
            const orderResult = await orderResponse.json();
            if (!orderResponse.ok) throw new Error(orderResult.error || 'Failed to create order');
            const orderId = orderResult._id;

            // Process all items for this checkout session
            for (const item of checkoutItems) {
                const isCustom = !item.id && (item.topImagePreview && item.bottomImagePreview);
                if (isCustom) { continue; } // Custom items are handled separately below
                
                const itemPrice = typeof item.price === 'string' ? parseFloat(item.price.replace(/[$,]/g, '')) : parseFloat(item.price);
                const productId = item.id || item.product_id || item._id;
                if (!productId) continue;

                const orderProductData = {
                    order_id: orderId,
                    product_id: productId,
                    order_qty: parseInt(item.quantity, 10),
                    order_unit_price: parseFloat(itemPrice.toFixed(2)),
                    order_type: item.type || 'N/A',
                    order_shape: item.shape || 'N/A',
                    order_size: item.size || 'N/A',
                    order_material: item.material || 'N/A',
                    order_thickness: item.thickness || 'N/A'
                };
                const orderProductResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/order-products`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}`},
                    body: JSON.stringify(orderProductData)
                });
                if (!orderProductResponse.ok) {
                    const errorResult = await orderProductResponse.json();
                    throw new Error(errorResult.error || 'Failed to add an item to the order.');
                }
            }
            
            const customItem = checkoutItems.filter(item => item.topImagePreview && item.bottomImagePreview);
            if (customItem.length > 0) {
                const dataURLtoFile = async (dataurl, filename) => {
                    const response = await fetch(dataurl);
                    const blob = await response.blob();
                    const mimeType = blob.type;
                    return new File([blob], filename, { type: mimeType });
                };
                
                for (const item of customItem) {
                    if (!item.topImagePreview) throw new Error('Custom item must have a top image file.');
                    if (!item.bottomImagePreview) throw new Error('Custom item must have a bottom image file.');
                    const customisePrice = typeof item.price === 'string' ? parseFloat(item.price.replace(/[$,]/g, '')) : parseFloat(item.price);
                    const topImageFile = await dataURLtoFile(item.topImagePreview, `top_custom_${Date.now()}.png`);
                    const bottomImageFile = await dataURLtoFile(item.bottomImagePreview, `bottom_custom_${Date.now()}.png`);
                    const customiseFormData = new FormData();
                    customiseFormData.append('order', orderId);
                    customiseFormData.append('board_type', item.type);
                    customiseFormData.append('board_shape', item.shape);
                    customiseFormData.append('board_size', item.size);
                    customiseFormData.append('material', item.material);
                    customiseFormData.append('thickness', item.thickness);
                    customiseFormData.append('customise_qty', item.quantity);
                    customiseFormData.append('customise_price', customisePrice.toFixed(2));
                    customiseFormData.append('top_image', topImageFile);
                    customiseFormData.append('bottom_image', bottomImageFile);
                    const customiseResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/customise`, {
                        method: 'POST',
                        headers: { 'Authorization': `Bearer ${user.token}`},
                        body: customiseFormData
                    });
                    if (!customiseResponse.ok) {
                        const errorResult = await customiseResponse.json();
                        throw new Error(errorResult.error || 'Failed to add the custom item to the order.');
                    }
                }
            }

            alert('Order placed successfully!');
            navigate('/order-history');
            
            // --- CRITICAL CHANGE: Only clear the cart if it was NOT a "Buy Now" flow ---
            if (!isBuyNowFlow) {
                dispatch({ type: 'CLEAR_CART' });
            }
            // If it was a "Buy Now" flow, the cart remains untouched.

        } catch (error) {
            console.error('Error placing order:', error);
            alert(`Failed to place order: ${error.message}`);
            setIsSubmitting(false);
        }
    };

    const handleSubmitOrder = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;
        if (!user || !user.token) {
            alert('You must be logged in to place an order');
            navigate('/login');
            return;
        }
        if (!getUserIdFromToken(user.token)) {
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

        if (selectedPaymentMethod === 'paypal') {
            window.open('https://www.jotform.com/form/251899086041464', '_blank', 'noopener,noreferrer');
            setIsPayPalPopupVisible(true);
        } else {
            await executeOrderCreation();
        }
    };

    // This guard prevents rendering while redirects are happening or data is loading.
    if (!user || checkoutItems.length === 0) {
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

                        <div className="checkout-order-summary">
                            <h3>Order Summary</h3>
                            <div className="summary-items-list">
                                {orderSummary.items.map(item => {
                                    const itemPrice = typeof item.price === 'string' ? parseFloat(item.price.replace('$', '')) : item.price;
                                    const uniqueKey = `${item.id || item.product_id}-${item.type}-${item.shape}-${item.size}-${item.material}-${item.thickness}-${item.topImagePreview}-${item.bottomImagePreview}`;
                                    return (
                                        <div key={uniqueKey}>
                                            {!item.topImagePreview && !item.bottomImagePreview &&(
                                               <div className="summary-line">
                                                <strong>{item.name}</strong>  
                                                </div>
                                            )}
                                            { item.topImagePreview && item.bottomImagePreview && (
                                                <>
                                                <div className="summary-line">
                                                    <strong>Customise Skimboard</strong>
                                                </div>
                                                <div className="summary-line">
                                                    <span>Top Image:</span>
                                                    <img src={item.topImagePreview} alt="Top" className="order-item-image" />
                                                    <span>Bottom Image:</span>
                                                    <img src={item.bottomImagePreview} alt="Bottom" className="order-item-image" />
                                                </div>
                                                </>
                                            )}
                                            <div className="summary-line">
                                                <span>Type: {item.type}</span>
                                            </div>
                                            <div className="summary-line">
                                                <span>Shape: {item.shape}</span>
                                            </div>
                                            <div className="summary-line">
                                                <span>Size: {item.size}</span>
                                            </div>
                                            <div className="summary-line">
                                                <span>Qty: {item.quantity}</span>
                                            </div>
                                            <div className="summary-line">
                                                <span>Material: {item.material}</span>
                                            </div>
                                            <div className="summary-line">
                                                <span>Thickness: {item.thickness}</span>
                                            </div>
                                            <div className="summary-line">
                                                <span>Price: S${(item.quantity * itemPrice).toFixed(2)}</span>
                                            </div>
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

            {/* --- NEW: PayPal Confirmation Popup --- */}
            {isPayPalPopupVisible && (
                <div className="paypal-popup-overlay">
                    <div className="paypal-popup-content">
                        <h3>Complete Your Payment</h3>
                        <p>
                            A new tab has been opened for you to complete your payment.
                            Once you have finished, please come back and click the button below to confirm your order.
                        </p>
                        <div className="paypal-popup-actions">
                            <button
                                onClick={executeOrderCreation}
                                className="btn-confirm-payment"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Confirming...' : 'Payment Complete, Confirm Order'}
                            </button>
                            <button
                                onClick={() => setIsPayPalPopupVisible(false)}
                                className="btn-cancel-payment"
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default PlaceOrderPage;