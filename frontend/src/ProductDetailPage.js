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
  const [selectedSize, setSelectedSize] = useState('M');
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

  const sizes = ['S', 'M', 'L'];

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  const handleQuantityChange = (amount) => {
    setQuantity(prevQuantity => (prevQuantity + amount));
  };

    const handlerStatus = () => {
        if (product.warehouse_quantity === 0) {
            return 'No Stock';
        }
        else if (product.warehouse_quantity <= product.threshold) {
            return 'Limited Stock';
        } else {
            return 'In Stock';
        }
    };

    // Function to get the class for product status
    const handleStatusClass = (status) => {
    switch (status) {
        case 'In Stock': return 'status-in-stock';
        case 'Limited Stock': return 'status-limited-stock';
        case 'No Stock': return 'status-no-stock';
        // Add other statuses as needed
        default: return '';
        }
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
            <p className={handleStatusClass(handlerStatus())}>
              <strong>{handlerStatus()}</strong>
            </p>

            {product.warehouse_quantity > 0 && (
              <>
              <div className="product-options">
                  <div>
                    <span className="option-label">Size:</span>
                    {sizes.map(size => (
                      <button
                        key={size}
                        className={`size-button ${selectedSize === size ? 'selected' : ''}`}
                        onClick={() => handleSizeSelect(size)}>
                      {size}
                    </button>
                    ))}
                  </div>
              </div>
              <div className="product-options">
                  <span className="option-label">Quantity:</span>
                  <div className="quantity-controls-detail">
                      <button
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity === 1}
                      style={{ opacity: quantity === 1 ? 0.5 : 1 }}>-
                      </button>
                      <span>{quantity}</span>
                      <button 
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity === product.warehouse_quantity}
                      style={{ opacity: quantity === product.warehouse_quantity ? 0.5 : 1 }}>+
                      </button>
                  </div>
              </div>
            <div className="product-actions-detail">              
              <button 
              className="btn-buy-now"
              onClick={() => {
                dispatch({
                  type: 'ADD_TO_CART',
                  payload: {
                    id: product._id,
                    name: product.product_name,
                    price: product.product_price,
                    size: selectedSize,
                    quantity: quantity,
                    warehouse_quantity: product.warehouse_quantity,
                    image: product.product_image
                  }
                });
                navigate('/place-order');
              }}>Buy Now</button>
              <button 
              className="btn-add-to-cart-detail"
              onClick={() => {
                dispatch({
                  type: 'ADD_TO_CART',
                  payload: {
                    id: product._id,
                    name: product.product_name,
                    price: product.product_price,
                    size: selectedSize,
                    quantity: quantity,
                    warehouse_quantity: product.warehouse_quantity,
                    image: product.product_image
                  }
                });
                navigate('/cart');
              }}>Add to Cart
              </button>
            </div> 
            </>           
            )}
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