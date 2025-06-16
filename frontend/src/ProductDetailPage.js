import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useCartContext } from './hooks/useCartContext';
import './Website.css';
import Header from './Header';
import Footer from './Footer';

const ProductDetailPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { dispatch } = useCartContext();
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
          const productResponse = await fetch('/api/product');
          const json = await productResponse.json();
          
          if (productResponse.ok) {
            const similarProducts = json.filter(p =>
              p.category === product.category && p._id !== productId
            );
            setSimilarProducts(similarProducts);
          }
        }
      catch (error) {
        console.error('Error fetching similar products:', error);
      }
    };
    fetchSimilarProducts();
    setQuantity(1);
    window.scrollTo(0, 0);
  }, [product]);

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  const handleQuantityChange = (amount) => {
    setQuantity(prevQuantity => (prevQuantity + amount));
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

            <div className="product-options">
              {/* <div className="product-sizes">
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
              </div> */}
              <div className="product-quantity-selector">
                <span className="option-label">Quantity:</span>
                <div className="quantity-controls-detail">
                    <button 
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity === 1 || product.warehouse_quantity === 0}
                    style={{ opacity: quantity === 1 ? 0.5 : 1 }}>-
                    </button>
                    <span>{quantity}</span>
                    <button 
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity === product.warehouse_quantity || product.warehouse_quantity === 0}
                    style={{ opacity: quantity === product.warehouse_quantity || product.warehouse_quantity === 0 ? 0.5 : 1 }}>+
                    </button>
                </div>
              </div>
            </div>

            <div className="product-actions-detail">              <button 
              className="btn-buy-now"
              onClick={() => {
                dispatch({
                  type: 'ADD_TO_CART',
                  payload: {
                    id: product._id,
                    name: product.product_name,
                    price: product.product_price,
                    quantity: quantity,
                    image: product.product_image
                  }
                });
                navigate('/place-order');
              }}
              disabled={product.warehouse_quantity === 0}
              style={{ opacity: product.warehouse_quantity === 0 ? 0.5 : 1 }}>Buy Now</button>
              <button 
              className="btn-add-to-cart-detail"
              onClick={() => {
                dispatch({
                  type: 'ADD_TO_CART',
                  payload: {
                    id: product._id,
                    name: product.product_name,
                    price: product.product_price,
                    quantity: quantity,
                    image: product.product_image
                  }
                });
                navigate('/cart');
              }}
              disabled={product.warehouse_quantity === 0}
              style={{ opacity: product.warehouse_quantity === 0 ? 0.5 : 1 }}>Add to Cart</button>
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