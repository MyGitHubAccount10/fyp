import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartContext } from './hooks/useCartContext';
import { useAuthContext } from './hooks/useAuthContext'; // Import AuthContext
import './Website.css';
import Header from './Header';
import Footer from './Footer';
import { SHIPPING_FEE } from './shippingConstants';
import { GST_RATE } from './taxConstants';

function ShoppingCartPage() {
    const navigate = useNavigate();
    const { cartItems, dispatch } = useCartContext();
    const { user } = useAuthContext(); // Get user from context

    const [subtotal, setSubtotal] = useState(0);
    const [gst, setGst] = useState(0);
    const [savedItems, setSavedItems] = useState([]);

    useEffect(() => {
        const calculatedSubtotal = cartItems.reduce((acc, item) => {
            const itemPrice = typeof item.price === 'string' ? parseFloat(item.price.replace('$', '')) : item.price;
            return acc + item.quantity * itemPrice;
        }, 0);
        
        const calculatedGst = calculatedSubtotal * GST_RATE;

        setSubtotal(calculatedSubtotal);
        setGst(calculatedGst);

    }, [cartItems]);

    const handleQuantityChange = (itemId, type, shape, size, change) => {
        const item = cartItems.find(item => 
            item.id === itemId &&
            item.type === type &&
            item.shape === shape &&
            item.size === size);
        if (item) {
            dispatch({
                type: 'UPDATE_QUANTITY',
                payload: { id: itemId, type, shape, size, quantity: Math.max(1, item.quantity + change) }
            });
        }
    };

    const handleDeleteItem = (itemId, type, shape, size) => {
        dispatch({ type: 'REMOVE_FROM_CART', payload: { id: itemId, type, shape, size } });
    };

    const handleSaveForLater = (itemId, type, shape, size) => {
        const item = cartItems.find(item => 
            item.id === itemId &&
            item.type === type &&
            item.shape === shape &&
            item.size === size);
        if (item) {
            setSavedItems(prev => [...prev, item]);
            dispatch({ type: 'REMOVE_FROM_CART', payload: { id: itemId, type, shape, size } });
        }
    };

    const handleMoveToCart = (itemId, size) => {
        const item = savedItems.find(item => item.id === itemId && item.size === size);
        if (item) {
            dispatch({ type: 'ADD_TO_CART', payload: item });
            setSavedItems(prev => prev.filter(savedItem => savedItem.id !== itemId || savedItem.size !== size));
        }
    };

    const handleDeleteSavedItem = (itemId, size) => {
        setSavedItems(prev => prev.filter(item => item.id !== itemId || item.size !== size));
    };

    // --- CORRECTED LOGIC FOR SCENARIO 1 ---
    const handleCheckout = () => {
        if (user) {
            navigate('/place-order');
        } else {
            // User isn't logged in. Redirect to login, and tell the login page
            // to send the user to the PLACE ORDER page when they are done.
            navigate('/login', { state: { from: '/place-order' } });
        }
    };

    return (
        <>
            <Header />
            <div className="container">
                <h2>Shopping Cart</h2>
                <div className="main-cart-items">
                    {cartItems.length === 0 ? (
                        <p>Your shopping cart is empty.</p>
                    ) : (
                        cartItems.map(item => {
                            const itemPrice = typeof item.price === 'string' ? parseFloat(item.price.replace('$', '')) : item.price;
                            const imageUrl = `/images/${item.image}`;
                            return (
                                <div className="cart-item" key={`${item.id}-${item.size}`}>
                                    <img src={imageUrl} alt={item.name} />
                                    <div className="item-info">
                                        <strong>{item.name}</strong>
                                        <span>Type: {item.type}</span>
                                        <span>Shape: {item.shape}</span>
                                        <span>Size: {item.size}</span>
                                    </div>
                                    <div className="item-actions">
                                        <div className="quantity-controls">
                                            <button 
                                            onClick={() => handleQuantityChange(item.id, item.type, item.shape, item.size, -1)} 
                                            disabled={item.quantity === 1}
                                            style={{
                                                pointerEvents: item.quantity === 1 ? 'none' : 'auto', 
                                                opacity: item.quantity === 1 ? 0.5 : 1 }}>
                                            <span>-</span>
                                            </button>
                                            <span>{item.quantity}</span>
                                            <button 
                                            onClick={() => handleQuantityChange(item.id, item.type, item.shape, item.size, 1)} 
                                            disabled={cartItems
                                                    .filter(cartItem => cartItem.id === item.id)
                                                    .reduce((acc, cartItem) => acc + cartItem.quantity, 0) >= item.warehouse_quantity}
                                            style={{
                                                pointerEvents: cartItems
                                                .filter(cartItem => cartItem.id === item.id)
                                                .reduce((acc, cartItem) => acc + cartItem.quantity, 0) >= item.warehouse_quantity ? 'none' : 'auto',
                                                opacity: cartItems
                                                .filter(cartItem => cartItem.id === item.id)
                                                .reduce((acc, cartItem) => acc + cartItem.quantity, 0) >= item.warehouse_quantity ? 0.5 : 1 }}>
                                            <span>+</span>
                                            </button>
                                        </div>
                                        <button className="action-btn delete" onClick={() => 
                                            handleDeleteItem(item.id, item.type, item.shape, item.size)}>Delete
                                        </button>
                                        <button className="action-btn save" onClick={() => 
                                            handleSaveForLater(item.id, item.type, item.shape, item.size)}>Save for later
                                        </button>
                                    </div>
                                    <div className="price-tag">
                                        <span className="item-price-display">${(item.quantity * itemPrice).toFixed(2)}</span>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                <div className="cart-total">
                    <h3>Cart Total</h3>
                    <p><span>Subtotal</span> <span>${subtotal.toFixed(2)}</span></p>
                    <p><span>Shipment</span> <span>${SHIPPING_FEE.toFixed(2)}</span></p>
                    <p><span>GST ({(GST_RATE * 100).toFixed(0)}%)</span> <span>${gst.toFixed(2)}</span></p>
                    <p className="total-row"><strong>Total</strong> <strong>${(subtotal + SHIPPING_FEE + gst).toFixed(2)}</strong></p>
                    <button 
                    className="complete-purchase-btn" 
                    onClick={handleCheckout}
                    disabled={cartItems.length === 0}
                    style={{ 
                        pointerEvents: cartItems.length === 0 ? 'none' : 'auto', 
                        opacity: cartItems.length === 0 ? 0.5 : 1 }}>Complete Purchase</button>
                </div>

                <div className="saved-items">
                    <h3>Saved for Later</h3>
                    {savedItems.length === 0 ? (
                        <p>You have no items saved for later.</p>
                    ) : (
                        savedItems.map(item => {
                            const imageUrl = `/images/${item.image}`;
                            return (
                                <div className="saved-item-card" key={`${item.id}-${item.size}`} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '10px', marginBottom: '10px', backgroundColor: '#f9f9f9', width: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <img src={imageUrl} alt={item.name} style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '4px' }} />
                                    <div className="item-info" style={{ textAlign: 'center', marginTop: '10px' }}>
                                        <strong style={{ fontSize: '16px', color: '#333' }}>{item.name}</strong>
                                        <p style={{ fontSize: '14px', color: '#666' }}>In stock</p>
                                        <p style={{ fontSize: '14px', color: '#666' }}>Size: {item.size}</p>
                                        <p style={{ fontSize: '16px', color: '#333', fontWeight: 'bold' }}>${item.price}</p>
                                    </div>
                                    <div className="item-actions" style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                        <button className="action-btn move-to-cart-later" onClick={() => handleMoveToCart(item.id, item.size)} style={{ backgroundColor: '#ffcc00', border: 'none', borderRadius: '4px', padding: '5px 10px', cursor: 'pointer', flex: '1', marginRight: '5px' }}>Move to Cart</button>
                                        <button className="action-btn delete-later" onClick={() => handleDeleteSavedItem(item.id, item.size)} style={{ backgroundColor: '#ff6666', border: 'none', borderRadius: '4px', padding: '5px 10px', cursor: 'pointer', flex: '1' }}>Delete</button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
}

export default ShoppingCartPage;