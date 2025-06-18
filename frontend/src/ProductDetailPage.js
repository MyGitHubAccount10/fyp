import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useCartContext } from './hooks/useCartContext';
import './Website.css';
import Header from './Header';
import Footer from './Footer';

const ProductDetailPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { cartItems, dispatch } = useCartContext();

  // --- FIX 1: Initialize product state as null, not with the ID string ---
  const [product, setProduct] = useState(null);
  
  const [similarProducts, setSimilarProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState('');
  const [productImages, setProductImages] = useState([]);
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [stock, setStock] = useState(0);

  // This effect fetches the main product data. It is already correct.
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

          // Calculate total quantity of this product in the cart, across all sizes
          const totalQuantity = cartItems.reduce((total, item) => {
            if (item.id === productData._id) {
              return total + item.quantity;
            }
            return total;
          }, 0);

          // Deduct the total quantity in cart from the warehouse quantity to get available stock
          setStock(productData.warehouse_quantity - totalQuantity);
          setQuantity(1); // Reset quantity to 1 for the newly selected product/size or initial load
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };
    fetchProduct();
  }, [productId, cartItems, selectedSize]);

  // This effect fetches similar products AFTER the main product has loaded.
  useEffect(() => {
    // --- FIX 3: Add a guard clause to prevent running if product is not yet loaded ---
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
    
    // Reset quantity and scroll to top when the product changes
    setQuantity(1);
    window.scrollTo(0, 0);

    // --- FIX 2: Add productId to the dependency array to remove the warning ---
  }, [product, productId]);

  const sizes = ['S', 'M', 'L'];

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    // Recalculate available stock when size changes
    if (product) {
      const totalQuantity = cartItems.reduce((total, item) => {
        if (item.id === product._id) {
          return total + item.quantity;
        }
        return total;
      }, 0);
      
      // Deduct the total quantity in cart from the warehouse quantity to get available stock
      setStock(product.warehouse_quantity - totalQuantity);
      setQuantity(1); // Reset quantity to 1 for the newly selected product/size or initial load
    }
  };

  const handleQuantityChange = (amount) => {
    setQuantity(prevQuantity => Math.max(1, Math.min(prevQuantity + amount, stock))); // Limit quantity by availableStock
  };

  // --- FIX 4: Add a loading state to prevent the page from crashing ---
  if (!product) {
    return (
      <>
        <Header />
        <div style={{ textAlign: 'center', padding: '5rem' }}>Loading product...</div>
        <Footer />
      </>
    );
  }

  // These functions are now safe to use because we know 'product' is loaded.
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
                        disabled={quantity === 1}>
                        <span style={{ opacity: quantity === 1 ? 0.5 : 1 }}>-</span>
                        </button>
                        <span>{quantity}</span>
                        <button 
                        onClick={() => handleQuantityChange(1)}
                        disabled={quantity >= stock}>
                        <span style={{ opacity: quantity === stock ? 0.5 : 1 }}>+</span>
                        </button>
                    </div>
                  </div>
                </div>
                <div className="product-actions-detail">              
                  <button 
                    className="btn-buy-now"
                    onClick={() => {
                      dispatch({
                        type: 'ADD_TO_CART',
                        payload: { id: product._id, name: product.product_name, price: product.product_price, size: selectedSize, quantity: quantity, warehouse_quantity: product.warehouse_quantity, image: product.product_image }
                      });
                      navigate('/place-order');
                    }}>Buy Now
                  </button>
                  <button 
                    className="btn-add-to-cart-detail"
                    onClick={() => {
                      dispatch({
                        type: 'ADD_TO_CART',
                        payload: { id: product._id, name: product.product_name, price: product.product_price, size: selectedSize, quantity: quantity, warehouse_quantity: product.warehouse_quantity, image: product.product_image }
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
            {similarProducts.map(p => (
              <Link to={`/product/${p._id}`} key={p._id} style={{ textDecoration: 'none' }}>
                <div className="similar-product-card">
                  <img src={`/images/${p.product_image}`} alt={p.product_name} className="similar-product-image" />
                  <div className="similar-product-caption">{p.product_name}</div>
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