import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartContext } from './hooks/useCartContext';
import './Website.css';
import Header from './Header';
import Footer from './Footer';
import { SHIPPING_FEE } from './shippingConstants'; // 1. Import the constant

function ShoppingCartPage() {
    const navigate = useNavigate();
    const { cartItems, dispatch } = useCartContext();

    const [subtotal, setSubtotal] = useState(0);
    const [savedItems, setSavedItems] = useState([]);

    useEffect(() => {
        const calculatedSubtotal = cartItems.reduce((acc, item) => {
            const itemPrice = typeof item.price === 'string' ? parseFloat(item.price.replace('$', '')) : item.price;
            return acc + item.quantity * itemPrice;
        }, 0);
        setSubtotal(calculatedSubtotal);
    }, [cartItems]);

    // ... (rest of the handlers are unchanged)
    const handleQuantityChange = (itemId, size, change) => {
        const item = cartItems.find(item => item.id === itemId && item.size === size);
        if (item) {
            cartItems
            .filter(cartItem => cartItem.id === itemId)
            .reduce((acc, cartItem) => acc + cartItem.quantity, 0);
            dispatch({
                type: 'UPDATE_QUANTITY',
                payload: { id: itemId, size: size, quantity: Math.max(1, item.quantity + change) }
            });
        }
    };

    const handleDeleteItem = (itemId, size) => {
        dispatch({ type: 'REMOVE_FROM_CART', payload: { id: itemId, size: size } });
    };

    const handleSaveForLater = (itemId, size) => {
        const item = cartItems.find(item => item.id === itemId && item.size === size);
        if (item) {
            setSavedItems(prev => [...prev, item]);
            dispatch({ type: 'REMOVE_FROM_CART', payload: { id: itemId, size: size } });
        }
    };

    const handleMoveToCart = (itemId, size) => {
        const item = savedItems.find(item => item.id === itemId && item.size === size);
        if (item) {
            dispatch({ type: 'ADD_TO_CART', payload: item });
            setSavedItems(prev => prev.filter(savedItem => savedItem.id !== itemId && savedItem.size !== size));
        }
    };

    const handleDeleteSavedItem = (itemId, size) => {
        setSavedItems(prev => prev.filter(item => item.id !== itemId && item.size !== size));
    };

    const handleCheckout = () => {
        navigate('/place-order');
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
                                <div className="cart-item" key={item.id}>
                                    <img src={imageUrl} alt={item.name} />
                                    <div className="item-info">
                                        <strong>{item.name}</strong>
                                        <span className="size-info">Size: {item.size}</span>
                                    </div>
                                    <div className="item-actions">
                                        <div className="quantity-controls">
                                            <button 
                                            onClick={() => handleQuantityChange(item.id, item.size, -1)} 
                                            disabled={item.quantity === 1}>
                                            <span style={{ opacity: item.quantity === 1 ? 0.5 : 1 }}>-</span>
                                            </button>
                                            <span>{item.quantity}</span>
                                            <button 
                                            onClick={() => handleQuantityChange(item.id, item.size, 1)} 
                                            disabled={cartItems
                                                    .filter(cartItem => cartItem.id === item.id)
                                                    .reduce((acc, cartItem) => acc + cartItem.quantity, 0) >= item.warehouse_quantity}>
                                            <span style={{ opacity: 
                                                cartItems
                                                    .filter(cartItem => cartItem.id === item.id)
                                                    .reduce((acc, cartItem) => acc + cartItem.quantity, 0) >= item.warehouse_quantity ? 0.5 : 1 }}>+</span>
                                            </button>
                                        </div>
                                        <button className="action-btn delete-btn" onClick={() => handleDeleteItem(item.id, item.size)}>Delete</button>
                                        <button className="action-btn save-btn" onClick={() => handleSaveForLater(item.id, item.size)}>Save for later</button>
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
                    {/* 2. Use the constant for display */}
                    <p><span>Shipment</span> <span>Shipping to Bedok ${SHIPPING_FEE.toFixed(2)}</span></p>
                    {/* 3. Use the constant for calculation */}
                    <p className="total-row"><strong>Total</strong> <strong>${(subtotal + SHIPPING_FEE).toFixed(2)}</strong></p>
                    <button className="complete-purchase-btn" onClick={handleCheckout}>Complete Purchase</button>
                </div>

                {/* Saved for Later section is unchanged */}
                <div className="saved-items">
                    <h3>Saved for Later</h3>
                    {savedItems.length === 0 ? (
                        <p>You have no items saved for later.</p>
                    ) : (
                        savedItems.map(item => {
                            const imageUrl = `/images/${item.image}`;
                            return (
                                <div className="saved-item-card" key={item.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '10px', marginBottom: '10px', backgroundColor: '#f9f9f9', width: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <img src={imageUrl} alt={item.name} style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '4px' }} />
                                    <div className="item-info" style={{ textAlign: 'center', marginTop: '10px' }}>
                                        <strong style={{ fontSize: '16px', color: '#333' }}>{item.name}</strong>
                                        <p style={{ fontSize: '14px', color: '#666' }}>In stock</p>
                                        <p style={{ fontSize: '14px', color: '#666' }}>Size: {item.size}</p>
                                        <p style={{ fontSize: '16px', color: '#333', fontWeight: 'bold' }}>${item.price}</p>
                                    </div>
                                    <div className="item-actions" style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                        <button className="action-btn move-btn" onClick={() => handleMoveToCart(item.id, item.size)} style={{ backgroundColor: '#ffcc00', border: 'none', borderRadius: '4px', padding: '5px 10px', cursor: 'pointer', flex: '1', marginRight: '5px' }}>Move to Cart</button>
                                        <button className="action-btn delete-btn" onClick={() => handleDeleteSavedItem(item.id, item.size)} style={{ backgroundColor: '#ff6666', border: 'none', borderRadius: '4px', padding: '5px 10px', cursor: 'pointer', flex: '1' }}>Delete</button>
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