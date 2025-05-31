import React, { useState } from 'react';
import './Website.css'; // Assuming Website.css contains all necessary styles

// Assume images are in public/images/ directory relative to your server's root
const logoImage = '/images/this-side-up-logo.png';

// Product Images
const mainProductImage = '/images/Marble.jpeg';
const thumbnailImages = [ // Placeholders, replace with actual thumbnail paths
    '/images/Marble.jpeg', // Often the main image is also the first thumbnail
    '/images/thumb2.jpg',
    '/images/thumb3.jpg',
    '/images/thumb4.jpg',
    '/images/thumb5.jpg',
    '/images/thumb6.jpg',
    '/images/thumb7.jpg',
];

// Similar Product Images
const similarProduct1 = '/images/Purple Carbon.jpeg';
const similarProduct2 = '/images/Rasta.jpeg';
const similarProduct3 = '/images/Samurai.jpeg';
const similarProduct4 = '/images/Marble Fish.jpeg';


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


const ProductDetailPage = () => {
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [currentMainImage, setCurrentMainImage] = useState(mainProductImage);

  const productData = {
    name: 'Marble Skimboard',
    price: 246,
    description: "Experience the fluid beauty of the ocean with our Marble Skimboard. Its unique aqueous marble design isn't just for show – it's built for smooth glides and responsive turns.",
    sizes: ["S", "M", "L"],
    fullDescription: "Dive into performance with the Marble Skimboard. Each board boasts a one-of-a-kind marble-effect resin art, making your board as unique as your riding style. Crafted with a high-density foam core and reinforced with durable fiberglass and epoxy resin, this board offers an optimal blend of lightweight maneuverability and robust construction. The Aqueous Flow is designed for intermediate to advanced riders looking to master tricks and ride waves with precision. Its rocker profile is engineered for speed and effortless transitions, while the slightly wider tail provides stability for landings. The deck features a subtle texture for enhanced grip, though we recommend pairing it with your favorite traction pads for maximum control. Whether you're hitting the shore break or practicing flatland tricks, the Marble Skimboard delivers consistent performance and head-turning aesthetics. Each board is hand-finished in our Singapore workshop, ensuring quality and attention to detail.",
};

  const similarProductsData = [
    { id: 1, name: "Purple Carbon", image: similarProduct1 },
    { id: 2, name: "Rasta", image: similarProduct2 },
    { id: 3, name: "Samurai", image: similarProduct3 },
    { id: 4, name: "Marble Fish", image: similarProduct4 },
  ];

  const toggleProductDropdown = (e) => {
    e.preventDefault();
    setIsProductDropdownOpen(!isProductDropdownOpen);
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  const handleQuantityChange = (amount) => {
    setQuantity(prevQuantity => Math.max(1, prevQuantity + amount));
  };
  
  const handleThumbnailClick = (imageSrc) => {
    setCurrentMainImage(imageSrc);
  };


  return (
    <>
      {/* --- HEADER --- */}
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

      {/* --- MAIN PRODUCT DETAIL PAGE CONTENT --- */}
      <main className="product-detail-page container">
        <section className="product-main-info-grid">
          <div className="product-image-gallery">
            <div className="product-thumbnails">
              {thumbnailImages.map((thumb, index) => (
                <img 
                    key={index} 
                    src={thumb} 
                    alt={`Thumbnail ${index + 1}`} 
                    className={`product-thumbnail-img ${currentMainImage === thumb ? 'active' : ''}`}
                    onClick={() => handleThumbnailClick(thumb)}
                />
              ))}
            </div>
            <div className="product-main-image-container">
              <img src={currentMainImage} alt={productData.name} className="product-main-image" />
            </div>
          </div>

          <div className="product-details-content">
            <h1 className="product-name-detail">{productData.name}</h1>
            <p className="product-price-detail">${productData.price.toFixed(2)}</p>
            <p className="product-short-description">{productData.description}</p>
            
            <div className="product-options">
              <div className="product-sizes">
                <span className="option-label">Size:</span>
                {productData.sizes.map(size => (
                  <button 
                    key={size} 
                    className={`size-button ${selectedSize === size ? 'selected' : ''}`}
                    onClick={() => handleSizeSelect(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
              <div className="product-quantity-selector">
                <span className="option-label">Quantity:</span>
                <div className="quantity-controls-detail">
                    <button onClick={() => handleQuantityChange(-1)}>-</button>
                    <span>{quantity}</span>
                    <button onClick={() => handleQuantityChange(1)}>+</button>
                </div>
              </div>
            </div>

            <div className="product-actions-detail">
              <button className="btn-buy-now">Buy Now</button>
              <button className="btn-add-to-cart-detail">Add to Cart</button>
            </div>
          </div>
        </section>

        <section className="product-full-description-section">
          <h2 className="section-title-detail">Full Description</h2>
          <p>{productData.fullDescription}</p>
        </section>

        <section className="similar-products-section">
          <h2 className="section-title-detail">Similar Products</h2>
          <div className="similar-products-grid">
            {similarProductsData.map(product => (
              <div className="similar-product-card" key={product.id}>
                <img src={product.image} alt={product.name} className="similar-product-image" />
                <div className="similar-product-caption">{product.name}</div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* --- FOOTER --- */}
      <footer className="footer">
        <div className="footer-column">
          <strong>#THISSIDEUP</strong>
          <div className="social-icons">
            <a href="#" aria-label="Instagram" title="Instagram"><img src="https://img.icons8.com/ios-filled/50/ffffff/instagram-new.png" alt="Instagram" /></a>
            <a href="#" aria-label="TikTok" title="TikTok"><img src="https://img.icons8.com/ios-filled/50/ffffff/tiktok--v1.png" alt="TikTok" /></a>
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
};

export default ProductDetailPage;