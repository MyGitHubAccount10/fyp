import React, { useState } from 'react';
import './Website.css';
import Header from './Header';
import Footer from './Footer';

const whiteShirtImage = '/images/white-shirt.jpg';
const blueShirtImage = '/images/blue-shirt.jpg';
const blueShirtGonImage = '/images/blue-shirt-gon.jpg';

function ShoppingCartPage() {
    // --- STATE ---
    const initialCartItemsData = [
        { id: 1, name: 'Normal White Shirt "Sacrilouge"', imageUrl: whiteShirtImage, stockStatus: 'In stock', size: 'empty', quantity: 1, price: 'S$246.77', dealLabel: 'Limited time Deal' },
        { id: 2, name: 'Blue', imageUrl: blueShirtImage, stockStatus: 'In stock', size: 'M', quantity: 1, price: 'S$381.99', dealLabel: 'Limited time Deal' },
    ];

    const initialRecommendedItemsData = [
        { id: 'rec1', name: 'Blue Shirt Gon', imageUrl: blueShirtGonImage, price: '$246.77', stockStatus: 'In stock', size: 'M' }
    ];

    const [cartItems, setCartItems] = useState(initialCartItemsData);
    const [recommendedItems, setRecommendedItems] = useState(initialRecommendedItemsData);

    // --- EVENT HANDLERS ---
    const handleQuantityChange = (itemId, change) => {
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === itemId ? { ...item, quantity: Math.max(1, item.quantity + change) } : item
            )
        );
    };

    const handleDeleteItem = (itemId) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
    };

    const handleSaveForLater = (itemId) => {
        const itemToSave = cartItems.find(item => item.id === itemId);
        if (itemToSave) {
            setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
            setRecommendedItems(prevRec => {
                if (!prevRec.find(rec => rec.name === itemToSave.name)) {
                    return [...prevRec, { ...itemToSave, id: `rec-${itemToSave.id}`, price: itemToSave.price.replace('S$', '$')}];
                }
                return prevRec;
            });
            console.log(`Saved item ${itemId} for later.`);
        }
    };

    const handleShareItem = (itemId) => {
        console.log(`Sharing item ${itemId}. Implement sharing logic here (e.g., navigator.share).`);
    };

    const handleMoveToCart = (recommendedItemId) => {
        const itemToMove = recommendedItems.find(item => item.id === recommendedItemId);
        if (itemToMove) {
            setRecommendedItems(prevRec => prevRec.filter(item => item.id !== recommendedItemId));
            setCartItems(prevCart => {
                if (!prevCart.find(cartItem => cartItem.name === itemToMove.name)) {
                    return [...prevCart, { ...itemToMove, id: `cart-${Date.now()}`, quantity: 1, price: itemToMove.price.replace('$', 'S$')}];
                }
                alert(`${itemToMove.name} is already in the cart or a similar item exists.`);
                return prevCart;
            });
            console.log(`Moved recommended item ${recommendedItemId} to cart.`);
        }
    };

    const handleDeleteRecommended = (recommendedItemId) => {
        setRecommendedItems(prevItems => prevItems.filter(item => item.id !== recommendedItemId));
    };

    // --- RENDER ---
    return (
        <> {/* React Fragment */}
            <Header />
            <div className="container">
                <h2>Shopping Cart</h2>

                <div className="main-cart-items">
                    {cartItems.length === 0 ? (
                        <p>Your shopping cart is empty.</p>
                    ) : (
                        cartItems.map(item => (
                            <div className="cart-item" key={item.id}>
                                <img src={item.imageUrl} alt={item.name} />
                                <div className="item-info">
                                    <strong>{item.name}</strong>
                                    <span className="stock-status">{item.stockStatus}</span>
                                    <span className="size-info">Size: {item.size}</span>
                                </div>
                                <div className="item-actions">
                                    <div className="quantity-controls">
                                        <button onClick={() => handleQuantityChange(item.id, -1)}>-</button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => handleQuantityChange(item.id, 1)}>+</button>
                                    </div>
                                    <button className="action-btn delete-btn" onClick={() => handleDeleteItem(item.id)}>Delete</button>
                                    <button className="action-btn save-btn" onClick={() => handleSaveForLater(item.id)}>Save for later</button>
                                    <button className="action-btn share-btn" onClick={() => handleShareItem(item.id)}>Share</button>
                                </div>
                                <div className="price-tag">
                                    {item.dealLabel && <span className="deal-label">{item.dealLabel}</span>}
                                    <span className="item-price-display">{item.price}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <button className="update-cart-btn">Update Cart</button>

                <div className="payment-trust-icons">
                    <span>○ ○ ○ ○</span>
                </div>

                <div className="cart-total">
                    <h3>Cart Total</h3>
                    <p><span>Subtotal</span> <span>$0</span></p> {/* TODO: Calculate subtotal */}
                    <p><span>Shipment</span> <span>Shipping to peninsula - Spain $24.53</span></p>
                    <p className="address-line">Sent to <strong>Malaysia</strong> <button className="change-address-btn">Change Address ✎</button></p>
                    <p className="total-row"><strong>Total</strong> <strong>$0</strong></p> {/* TODO: Calculate total */}
                    <button className="complete-purchase-btn">Complete Purchase</button>
                </div>

                <div className="recommended">
                    <h3>Saved for Later <span style={{ fontWeight: 'normal', color: '#777' }}>▼</span></h3>
                    {recommendedItems.length === 0 ? (
                        <p>You have no items saved for later.</p>
                    ) : (
                        recommendedItems.map(recItem => (
                            <div className="recommended-product-card" key={recItem.id}>
                                <img src={recItem.imageUrl} alt={recItem.name} className="recommended-product-image" />
                                <div className="recommended-product-content">
                                    <div className="recommended-product-info">
                                        <strong className="recommended-product-name">{recItem.name}</strong>
                                        <span className="recommended-product-price">{recItem.price}</span>
                                        <span className="recommended-product-stock">{recItem.stockStatus}</span>
                                        <span className="recommended-product-size">Size: {recItem.size}</span>
                                    </div>
                                    <div className="recommended-product-actions">
                                        <button className="btn-move-to-cart-later" onClick={() => handleMoveToCart(recItem.id)}>Move to Cart</button>
                                        <button className="btn-delete-later" onClick={() => handleDeleteRecommended(recItem.id)}>Delete</button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
}

export default ShoppingCartPage;