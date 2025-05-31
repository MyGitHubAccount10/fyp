import React, { useState } from 'react';
import './Website.css'; // We'll create this CSS file next

// Assume images are in public/images/ directory relative to your server's root
const logoImage = '/images/this-side-up-logo.png';
const whiteShirtImage = '/images/white-shirt.jpg';
const blueShirtImage = '/images/blue-shirt.jpg';
const blueShirtGonImage = '/images/blue-shirt-gon.jpg';

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
    const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false); // New state for product dropdown

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

    const toggleProductDropdown = (e) => {
        e.preventDefault();
        setIsProductDropdownOpen(!isProductDropdownOpen);
    };

    // --- RENDER ---
    return (
        <> {/* React Fragment */}
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

export default ShoppingCartPage;