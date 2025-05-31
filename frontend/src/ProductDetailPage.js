import React, { useState } from 'react';
import './Website.css';
import Header from './Header';
import Footer from './Footer';

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

const ProductDetailPage = () => {
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
      <Header />
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
      <Footer />
    </>
  );
};

export default ProductDetailPage;