// ProductDetailPage.js:

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
  const [selectedType, setSelectedType] = useState('Flatland');
  const [selectedShape, setSelectedShape] = useState('Square Tail');
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedMaterial, setSelectedMaterial] = useState('Wood');
  const [selectedThickness, setSelectedThickness] = useState('7mm');
  const [quantity, setQuantity] = useState(1);
  // MODIFIED: This 'stock' will now represent what's available for the user to add.
  const [stock, setStock] = useState(0);

  // Coin flip Easter egg
  const [keySequence, setKeySequence] = useState([]);
  const coinFlipCode = ['KeyC', 'KeyO', 'KeyI', 'KeyN', 'KeyF', 'KeyL', 'KeyI', 'KeyP'];

  // Coin flip effect
  useEffect(() => {
    const handleKeyPress = (event) => {
      setKeySequence(prev => {
        // Add new key to sequence
        const newSequence = [...prev, event.code];
        
        // Keep only last 8 keys to match coin flip code length
        if (newSequence.length > 8) {
          newSequence.shift();
        }
        
        // Check if coin flip code is entered
        if (JSON.stringify(newSequence) === JSON.stringify(coinFlipCode)) {
          alert('Easter Egg Triggered! Coin flip activated!');
          window.open('https://www.google.com/search?q=flip+a+coin', '_blank');
          setKeySequence([]); // Reset
        }
        
        return newSequence;
      });
    };

    window.addEventListener('keydown', handleKeyPress);
    
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [coinFlipCode]);

  // This effect fetches product data and calculates available stock
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/product/${productId}`);
        const productData = await response.json();

        if (response.ok) {
          setProduct(productData);
          const images = [
            productData.product_image,
            productData.product_image2,
            productData.product_image3,
            productData.product_image4,
            productData.product_image5,
            productData.product_image6,
            productData.product_image7,
            productData.product_image8
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
          const productResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/product`);
          const json = await productResponse.json();
          
          if (productResponse.ok) {
            const similar = json.filter(p =>
              p.category.toString() === product.category._id.toString() && p._id !== productId
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

  const types = ['Flatland', 'Wave', 'Hybrid'];
  const shapes = ['Square Tail', 'Round Tail', 'Pin Tail', 'Swallow Tail'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL'];
  const materials = ['Foam Core', 'Wood', 'Epoxy Coating', 'Fiberglass', 'Carbon Fiber'];
  const thicknesses = ['3mm', '5mm', '7mm', '9mm', '11mm'];
  const optionStyle = { 
    display: 'block', 
    width: '100%', 
    margin: '0', 
    marginTop: '12px',
    padding: '12px', 
    border: '1px solid #ccc', 
    borderRadius: '12px', 
    boxSizing: 'border-box',
    fontSize: '0.9rem'
  };

  const handleTypeSelect = (type) => {
    setSelectedType(type);
  };

  const handleShapeSelect = (shape) => {
    setSelectedShape(shape);
  };
  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  const handleMaterialSelect = (material) => {
    setSelectedMaterial(material);
  };

  const handleThicknessSelect = (thickness) => {
    setSelectedThickness(thickness);
  };

  const handleQuantityChange = (amount) => {
    // The quantity is now limited by the calculated 'stock' available for the user to add
    setQuantity(prevQuantity => Math.max(1, Math.min(prevQuantity + amount, stock)));
  };

  const handleAddToCart = () => {
    const isAccessory = product.category.category_name === 'Accessories';
    const type = isAccessory ? 'N/A' : selectedType;
    const shape = isAccessory ? 'N/A' : selectedShape;
    const size = isAccessory ? 'N/A' : selectedSize;
    const material = isAccessory ? 'N/A' : selectedMaterial;
    const thickness = isAccessory ? 'N/A' : selectedThickness;
    dispatch({
      type: 'ADD_TO_CART',
      payload: { 
        id: product._id, 
        name: product.product_name, 
        price: product.product_price,
        type: type,
        shape: shape,
        size: size,
        material: material,
        thickness: thickness,
        quantity: quantity,
        warehouse_quantity: product.warehouse_quantity,
        image: product.product_image
      }
    });
    navigate('/cart');
  };

  // --- MODIFIED: Buy Now action bypasses the cart context ---
  const handleBuyNow = () => {
    const isAccessory = product.category.category_name === 'Accessories';
    const type = isAccessory ? 'N/A' : selectedType;
    const shape = isAccessory ? 'N/A' : selectedShape;
    const size = isAccessory ? 'N/A' : selectedSize;
    const material = isAccessory ? 'N/A' : selectedMaterial;
    const thickness = isAccessory ? 'N/A' : selectedThickness;
  
    // Create the item payload that PlaceOrderPage will receive directly
    const buyNowItem = { 
        id: product._id, 
        name: product.product_name, 
        price: product.product_price,
        type: type,
        shape: shape,
        size: size,
        material: material,
        thickness: thickness,
        quantity: quantity,
        warehouse_quantity: product.warehouse_quantity,
        image: product.product_image
    };

    if (user) {
        // Navigate to the place-order page, passing the single item in the navigation state.
        // We wrap it in an array to maintain a consistent structure with cartItems.
        navigate('/place-order', { state: { buyNowItem: [buyNowItem] } });
    } else {
        // If not logged in, redirect to login but preserve the item and the final destination.
        navigate('/login', { state: { from: '/place-order', buyNowItem: [buyNowItem] } });
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
  const handleStatus = () => {
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
      <div className="title-section">
        <h1 className="title">{product.category.category_name}</h1>
      </div>
      <main className="product-detail-page container">
        <section className="product-main-info-grid">
          <div className="product-image-gallery">   
            <div className="product-main-image-container">
              <img src={`${process.env.REACT_APP_API_URL}/images/${selectedImage}`} alt={product.product_name} className="product-main-image" />
            </div>
            {productImages.length > 1 && (
              <div className="product-thumbnails">
                {productImages.map((img, index) => (
                  <img
                    key={index}
                    src={`${process.env.REACT_APP_API_URL}/images/${img}`}
                    alt={`${product.product_name} thumbnail ${index + 1}`}
                    className={`thumbnail-image ${selectedImage === img ? 'selected-thumbnail' : ''}`}
                    onClick={() => setSelectedImage(img)}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="product-details-content">
            <h1 className="product-name-detail">{product.product_name}</h1>
            <p className="product-price-detail">${parseFloat(product.product_price).toFixed(2)}</p>
            <p className={handleStatusClass(handleStatus())}>
              <strong>{handleStatus()}</strong>
            </p>

            {stock === 0 && (
              <p className="status-no-stock">
                Expected Restock Date: {new Date(new Date(product.updatedAt)
                  .getTime() + 21 * 24 * 60 * 60 * 1000)
                  .toLocaleDateString()}
              </p>
            )}

            {/* --- MODIFIED: Conditional Rendering for Scenarios 1 & 2 --- */}
            {stock > 0 && (
              <>
                {product.category.category_name === 'Skimboards' && (
                  <>
                  <div className="product-options">
                    <div>
                      <span className="option-label">Type:</span>
                      <select
                        value={selectedType}
                        onChange={(e) => handleTypeSelect(e.target.value)}
                        style={optionStyle}>
                        {types.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="product-options"> 
                    <div>
                      <span className="option-label">Shape:</span>
                      <select
                        value={selectedShape}
                        onChange={(e) => handleShapeSelect(e.target.value)}
                        style={optionStyle}>
                        {shapes.map(shape => (
                          <option key={shape} value={shape}>{shape}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  </>
                )}
                {product.category.category_name !== 'Accessories' && (
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
                )}
                {product.category.category_name === 'Skimboards' && (
                  <>
                  <div className="product-options">
                    <div>
                      <span className="option-label">Material:</span>
                      <select
                        value={selectedMaterial}
                        onChange={(e) => handleMaterialSelect(e.target.value)}
                        style={optionStyle}>
                        {materials.map(material => (
                          <option key={material} value={material}>{material}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="product-options">
                    <div>
                      <span className="option-label">Thickness:</span>
                      <select
                        value={selectedThickness}
                        onChange={(e) => handleThicknessSelect(e.target.value)}
                        style={optionStyle}>
                        {thicknesses.map(thickness => (
                          <option key={thickness} value={thickness}>{thickness}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  </>
                )}
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
                <div className="similar-product-card" style={{ position: 'relative', opacity: isAvailable ? 1 : 0.8 }}>
                  <img src={`${process.env.REACT_APP_API_URL}/images/${p.product_image}`} alt={p.product_name} className="similar-product-image" />
                  <div className="similar-product-caption">
                    <h3 className="product-name">{p.product_name}</h3>
                    <p style={{ margin: 0, fontWeight: 'normal' }}>${parseFloat(p.product_price).toFixed(2)}</p>
                  </div>
                  {!isAvailable && (
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'rgba(0, 0, 0, 0.6)', color: 'white', padding: '8px 16px', borderRadius: '5px', fontWeight: 'bold', textAlign: 'center', pointerEvents: 'none' }}>
                      Out of Stock
                    </div>
                  )}
                </div>
              );

              return (
                <Link to={`/product/${p._id}`} key={p._id} style={{ textDecoration: 'none'}}>
                  {cardContent}
                </Link>
              );
            })}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default ProductDetailPage;