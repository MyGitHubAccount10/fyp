import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import './Website.css';
import Header from './Header';
import Footer from './Footer';

const ProductDetailPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(productId);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/product/${productId}`);
        const product = await response.json();

        if (response.ok) {
          setProduct(product);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };
    fetchProduct();
    
  }, [productId]);

  useEffect(() => {
      const fetchSimilarProducts = async () => {
      try {
        const response = await fetch('/api/category');
        const categories = await response.json();
        const category = categories.find(cat => cat._id === product.category);

        if (category) {
          const productResponse = await fetch('/api/product');
          const json = await productResponse.json();
          
          if (productResponse.ok) {
            const similarProducts = json.filter(product =>
              product.category === category._id && product._id !== productId
            );
            setSimilarProducts(similarProducts);
          }
        }
      } catch (error) {
        console.error('Error fetching similar products:', error);
      }
    };
    fetchSimilarProducts();
    window.scrollTo(0, 0);
  }, [product]);

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  const handleQuantityChange = (amount) => {
    setQuantity(prevQuantity => Math.max(1, prevQuantity + amount));
  };
  
  return (
    <>
      <Header />
      {/* --- MAIN PRODUCT DETAIL PAGE CONTENT --- */}
      <main className="product-detail-page container">
        <section className="product-main-info-grid">
          <div className="product-image-gallery">
            <div className="product-main-image-container">
              <img src={`/images/${product.product_image}`} alt={product.product_name} className="product-main-image" />
            </div>
          </div>

          <div className="product-details-content">
            <h1 className="product-name-detail">{product.product_name}</h1>
            <p className="product-price-detail">${parseFloat(product.product_price).toFixed(2)}</p>

            {/* <div className="product-options">
              <div className="product-sizes">
                <span className="option-label">Size:</span>
                {product.sizes.map(size => (
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
            </div> */}

            <div className="product-actions-detail">
              <button className="btn-buy-now">Buy Now</button>
              <button className="btn-add-to-cart-detail">Add to Cart</button>
            </div>
          </div>
        </section>

        <section className="product-full-description-section">
          <h2 className="section-title-detail">Full Description</h2>
          <p>{product.description}</p>
        </section>

        <section className="similar-products-section">
          <h2 className="section-title-detail">Similar Products</h2>
          <div className="similar-products-grid">
            {similarProducts.map(product => (
              <Link to={`/product/${product._id}`} style={{ textDecoration: 'none' }}>
                <div className="similar-product-card" key={product._id}>
                  <img src={`/images/${product.product_image}`} alt={product.product_name} className="similar-product-image" />
                  <div className="similar-product-caption">{product.product_name}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default ProductDetailPage;