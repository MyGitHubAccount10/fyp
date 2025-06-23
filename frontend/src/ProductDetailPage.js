import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useCartContext } from './hooks/useCartContext';
import { useAuthContext } from './hooks/useAuthContext';
import './Website.css';
import Header from './Header';
import Footer from './Footer';

const ProductDetailPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  // MODIFIED: Bring back cartItems to perform live calculations
  const { cartItems, dispatch } = useCartContext(); 
  const { user } = useAuthContext();

  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState('');
  const [productImages, setProductImages] = useState([]);
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  // MODIFIED: This 'stock' will now represent what's available for the user to add.
  const [stock, setStock] = useState(0);

  // This effect fetches product data and calculates available stock
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/product/${productId}`);
        const productData = await response.json();

        if (response.ok) {
          setProduct(productData);
          const images = [
            productData.product_image,
            productData.product_image2,
            productData.product_image3
          ].filter(Boolean);

          setSelectedImage(productData.product_image);
          setProductImages(images);

          // --- MODIFIED: Real-time stock calculation ---
          // 1. Find how many of this specific product are already in the cart (across all sizes)
          const quantityInCart = cartItems
            .filter(item => item.id === productData._id)
            .reduce((sum, item) => sum + item.quantity, 0);

          // 2. Calculate the stock the user can actually add
          const availableStock = productData.warehouse_quantity - quantityInCart;
          setStock(availableStock);
          setQuantity(1);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };
    fetchProduct();
    // MODIFIED: Add cartItems as a dependency so stock recalculates if the cart changes.
  }, [productId, cartItems]);

  // This effect fetches similar products
  useEffect(() => {
    if (product) {
      const fetchSimilarProducts = async () => {
        try {
          const productResponse = await fetch('/api/product');
          const json = await productResponse.json();
          
          if (productResponse.ok) {
            const similar = json.filter(p =>
              p.category === product.category && p._id !== productId
            );
            setSimilarProducts(similar);
          }
        } catch (error) {
          console.error('Error fetching similar products:', error);
        }
      };
      fetchSimilarProducts();
    }
    
    setQuantity(1);
    window.scrollTo(0, 0);
  }, [product, productId]);

  const sizes = ['XS', 'S', 'M', 'L', 'XL'];

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    setQuantity(1);
  };

  const handleQuantityChange = (amount) => {
    // The quantity is now limited by the calculated 'stock' available for the user to add
    setQuantity(prevQuantity => Math.max(1, Math.min(prevQuantity + amount, stock)));
  };

  const handleAddToCart = () => {
    dispatch({
      type: 'ADD_TO_CART',
      payload: { id: product._id, name: product.product_name, price: product.product_price, size: selectedSize, quantity: quantity, warehouse_quantity: product.warehouse_quantity, image: product.product_image }
    });
    navigate('/cart');
  };

  const handleBuyNow = () => {
    dispatch({
      type: 'ADD_TO_CART',
      payload: { id: product._id, name: product.product_name, price: product.product_price, size: selectedSize, quantity: quantity, warehouse_quantity: product.warehouse_quantity, image: product.product_image }
    });

    if (user) {
      navigate('/place-order');
    } else {
      navigate('/login', { state: { from: '/place-order' } });
    }
  };

  if (!product) {
    return (
      <>
        <Header />
        <div style={{ textAlign: 'center', padding: '5rem' }}>Loading product...</div>
        <Footer />
      </>
    );
  }

  // Use the total warehouse quantity for the initial status display
  const handlerStatus = () => {
    if (stock === 0) {
        return 'No Stock';
    } else if (stock <= product.threshold) {
        return 'Limited Stock';
    } else {
        return 'In Stock';
    }
  };

  const handleStatusClass = (status) => {
    switch (status) {
        case 'In Stock': return 'status-in-stock';
        case 'Limited Stock': return 'status-limited-stock';
        case 'No Stock': return 'status-no-stock';
        default: return '';
    }
  };

  return (
    <>
      <Header />
      <main className="product-detail-page container">
        <section className="product-main-info-grid">
          <div className="product-image-gallery">
            <div className="product-thumbnails">
              {productImages.map((img, index) => (
                <img
                  key={index}
                  src={`/images/${img}`}
                  alt={`${product.product_name} thumbnail ${index + 1}`}
                  className={`thumbnail-image ${selectedImage === img ? 'selected-thumbnail' : ''}`}
                  onClick={() => setSelectedImage(img)}
                />
              ))}
            </div>            
            <div className="product-main-image-container">
              <img src={`/images/${selectedImage}`} alt={product.product_name} className="product-main-image" />
            </div>
          </div>

          <div className="product-details-content">
            <h1 className="product-name-detail">{product.product_name}</h1>
            <p className="product-price-detail">${parseFloat(product.product_price).toFixed(2)}</p>
            <p className={handleStatusClass(handlerStatus())}>
              <strong>{handlerStatus()}</strong>
            </p>

            {/* --- MODIFIED: Conditional Rendering for Scenarios 1 & 2 --- */}
            {stock > 0 && (
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
                  <div>
                    <span className="option-label">Quantity:</span>
                    <div className="quantity-controls-detail">
                        <button
                          onClick={() => handleQuantityChange(-1)}
                          disabled={quantity === 1}
                          style={{ pointerEvents: quantity === 1 ? 'none' : 'auto', opacity: quantity === 1 ? 0.5 : 1 }}>
                          <span>-</span>
                        </button>
                        <span>{quantity}</span>
                        <button 
                          onClick={() => handleQuantityChange(1)}
                          disabled={quantity >= stock}
                          style={{ pointerEvents: quantity >= stock ? 'none' : 'auto', opacity: quantity >= stock ? 0.5 : 1 }}>
                          <span>+</span>
                        </button>
                    </div>
                  </div>
                </div>
                <div className="product-actions-detail">              
                  <button className="btn-buy-now" onClick={handleBuyNow}>Buy Now</button>
                  <button className="btn-add-to-cart-detail" onClick={handleAddToCart}>Add to Cart</button>
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
            {similarProducts.map(p => {
              const isAvailable = p.warehouse_quantity > 0;
              const cardContent = (
                <div className="similar-product-card" style={{ position: 'relative', opacity: isAvailable ? 1 : 0.6 }}>
                  <img src={`/images/${p.product_image}`} alt={p.product_name} className="similar-product-image" />
                  <div className="similar-product-caption">{p.product_name}</div>
                  {!isAvailable && (
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'rgba(0, 0, 0, 0.6)', color: 'white', padding: '8px 16px', borderRadius: '5px', fontWeight: 'bold', textAlign: 'center', pointerEvents: 'none' }}>
                      Out of Stock
                    </div>
                  )}
                </div>
              );

              if (isAvailable) {
                return (
                  <Link to={`/product/${p._id}`} key={p._id} style={{ textDecoration: 'none' }}>
                    {cardContent}
                  </Link>
                );
              } else {
                return (
                  <div key={p._id}>
                    {cardContent}
                  </div>
                );
              }
            })}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default ProductDetailPage;