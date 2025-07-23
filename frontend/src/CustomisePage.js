import React, { useEffect, useState } from 'react';
import './Website.css';
import Header from './Header';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';
import { useCustomiseContext } from './hooks/useCustomiseContext';
import { useCartContext } from './hooks/useCartContext';
import { useAuthContext } from './hooks/useAuthContext';

const CustomisePage = () => {
    const navigate = useNavigate();
    const { customItem } = useCustomiseContext();
    const { dispatch } = useCartContext();
    const { user } = useAuthContext();
    
    const [topImageName, setTopImageName] = useState('');
    const [bottomImageName, setBottomImageName] = useState('');
    const [topImageFile, setTopImageFile] = useState(null);
    const [bottomImageFile, setBottomImageFile] = useState(null);
    const [topImagePreview, setTopImagePreview] = useState(customItem ? customItem.top_image : null);
    const [bottomImagePreview, setBottomImagePreview] = useState(customItem ? customItem.bottom_image : null);

    // Helper function to convert Data URL to File object using fetch
    const dataURLtoFile = async (dataurl, filename) => {
        const response = await fetch(dataurl);
        const blob = await response.blob(); // Get the Blob from the response
        const mimeType = blob.type; // Extract MIME type from the Blob

        // Create a File object from the Blob
        return new File([blob], filename, { type: mimeType });
    };

    useEffect(() => {
      const restoreImagesFromLocalStorage = async () => {
          if (!customItem) {
              const topImageData = localStorage.getItem('topImagePreview');
              const bottomImageData = localStorage.getItem('bottomImagePreview');

              if (topImageData) {
                  const topFile = await dataURLtoFile(topImageData, `top_custom_${Date.now()}.png`);
                  setTopImageName(topFile.name);
                  setTopImageFile(topFile);
                  setTopImagePreview(topImageData);
              }

              if (bottomImageData) {
                  const bottomFile = await dataURLtoFile(bottomImageData, `bottom_custom_${Date.now()}.png`);
                  setBottomImageName(bottomFile.name);
                  setBottomImageFile(bottomFile);
                  setBottomImagePreview(bottomImageData);
              }
          }
      };

      restoreImagesFromLocalStorage();
    }, [customItem]);

    useEffect(() => {
    const updateImagesFromContext = async () => {
        if (customItem) {
            if (customItem.top_image) {
                const file = await dataURLtoFile(customItem.top_image, `top_custom_${Date.now()}.png`);
                setTopImageName(file.name);
                setTopImageFile(file);
                setTopImagePreview(customItem.top_image);
                localStorage.setItem('topImagePreview', customItem.top_image);
            } else {
                setTopImageName('');
                setTopImageFile(null);
                setTopImagePreview(null);
                localStorage.removeItem('topImagePreview');
            }
            if (customItem.bottom_image) {
                const file = await dataURLtoFile(customItem.bottom_image, `bottom_custom_${Date.now()}.png`);
                setBottomImageName(file.name);
                setBottomImageFile(file);
                setBottomImagePreview(customItem.bottom_image);
                localStorage.setItem('bottomImagePreview', customItem.bottom_image);
            } else {
                setBottomImageName('');
                setBottomImageFile(null);
                setBottomImagePreview(null);
                localStorage.removeItem('bottomImagePreview');
            }
        }
    };

    updateImagesFromContext();
  }, [customItem]);


    useEffect(() => {
        handleTypeSelect(selectedType);
        handleShapeSelect(selectedShape);
        handleSizeSelect(selectedSize);
        handleMaterialSelect(selectedMaterial);
        handleThicknessSelect(selectedThickness);
    });

    const [selectedType, setSelectedType] = useState('Flatland');
    const [selectedShape, setSelectedShape] = useState('Square Tail');
    const [selectedSize, setSelectedSize] = useState('M');
    const [selectedMaterial, setSelectedMaterial] = useState('Wood');
    const [selectedThickness, setSelectedThickness] = useState('7mm');
    const [quantity, setQuantity] = useState(1);

    const [typePrice, setTypePrice] = useState(0);
    const [shapePrice, setShapePrice] = useState(0);
    const [sizePrice, setSizePrice] = useState(0);
    const [materialPrice, setMaterialPrice] = useState(0);
    const [thicknessPrice, setThicknessPrice] = useState(0);

    const price = typePrice + shapePrice + sizePrice + materialPrice + thicknessPrice;
    
    const types = ['Flatland', 'Wave', 'Hybrid'];
    const shapes = ['Square Tail', 'Round Tail', 'Pin Tail', 'Swallow Tail'];
    const sizes = ['XS', 'S', 'M', 'L', 'XL'];
    const materials = ['Foam Core', 'Wood', 'Epoxy Coating', 'Fiberglass', 'Carbon Fiber'];
    const thicknesses = ['3mm', '5mm', '7mm', '9mm', '11mm'];
    const optionStyle = { display: 'block', width: '100%', margin: '12px', padding: '12px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' };

    const handleTypeSelect = (type) => {
      if (type === 'Flatland') {
        setTypePrice(150);
      }
      else if (type === 'Wave') {
        setTypePrice(200);
      } else if (type === 'Hybrid') {
        setTypePrice(250);
      } else {
        setTypePrice(0);
      }
      setSelectedType(type);
    };

    const handleShapeSelect = (shape) => {
      if (shape === 'Square Tail') {
          setShapePrice(10);
      } else if (shape === 'Round Tail') {
          setShapePrice(15);
      } else if (shape === 'Pin Tail') {
          setShapePrice(20);
      } else if (shape === 'Swallow Tail') {
          setShapePrice(25);
      } else {
          setShapePrice(0);
      }
      setSelectedShape(shape);
    };
    const handleSizeSelect = (size) => {
      if (size === 'XS') {
        setSizePrice(10);
      } else if (size === 'S') {
        setSizePrice(15);
      } else if (size === 'M') {
        setSizePrice(20);
      } else if (size === 'L') {
        setSizePrice(25);
      } else if (size === 'XL') {
          setSizePrice(30);
      }
      setSelectedSize(size);
    };

    const handleMaterialSelect = (material) => {
      if (material === 'Foam Core') {
        setMaterialPrice(10);
      } else if (material === 'Wood') {
        setMaterialPrice(20);
      } else if (material === 'Epoxy Coating') {
        setMaterialPrice(30);
      } else if (material === 'Fiberglass') {
        setMaterialPrice(40);
      } else if (material === 'Carbon Fiber') {
        setMaterialPrice(50);
      } else {
        setMaterialPrice(0);
      }
      setSelectedMaterial(material);
    };

    const handleThicknessSelect = (thickness) => {
      if (thickness === '3mm') {
        setThicknessPrice(10);
      } else if (thickness === '5mm') {
        setThicknessPrice(15);
      } else if (thickness === '7mm') {
        setThicknessPrice(20);
      } else if (thickness === '9mm') {
        setThicknessPrice(25);
      } else if (thickness === '11mm') {
        setThicknessPrice(30);
      } else {
        setThicknessPrice(0);
      }
      setSelectedThickness(thickness);
    };

    const handleQuantityChange = (amount) => {
      setQuantity(prevQuantity => Math.max(1, Math.min(prevQuantity + amount)));
    };

    const handleAddToCart = () => {
      dispatch({
        type: 'ADD_TO_CART',
        payload: { 
          type: selectedType,
          shape: selectedShape,
          size: selectedSize,
          material: selectedMaterial,
          thickness: selectedThickness,
          topImageFile: topImageFile,
          bottomImageFile: bottomImageFile,
          topImagePreview: topImagePreview,
          bottomImagePreview: bottomImagePreview,
          quantity: quantity,
          price: price
        }
      });
      navigate('/cart');
    };

    const handleBuyNow = () => {
      const buyNowItem = {
          type: selectedType,
          shape: selectedShape,
          size: selectedSize,
          material: selectedMaterial,
          thickness: selectedThickness,
          topImageFile: topImageFile,
          bottomImageFile: bottomImageFile,
          topImagePreview: topImagePreview,
          bottomImagePreview: bottomImagePreview,
          quantity: quantity,
          price: price
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

    return (
        <>
            <Header />
                <div className="title-section">
                  <h1 className="title">Design Your Own Skimboard</h1>
                </div>
                <main className="product-detail-page container">
                    <section className="product-main-info-grid">
                    <div className="customise-image-gallery">
                        <span>Top Image</span>
                        <div className="product-main-image-container">
                        <img src={topImagePreview} alt={topImageName} className="product-main-image" />
                        </div>
                        <span>Bottom Image</span>
                        <div className="product-main-image-container">
                        <img src={bottomImagePreview} alt={bottomImageName} className="product-main-image" />
                        </div>
                    </div>

                    <div className="product-details-content">
                    <p className="product-price-detail">${parseFloat(price).toFixed(2)}</p>
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
                                    onClick={() => handleQuantityChange(1)}>
                                    <span>+</span>
                                    </button>
                                </div>
                            </div>
                            </div>
                            <div className="product-actions-detail">              
                            <button className="btn-buy-now" onClick={handleBuyNow}>Buy Now</button>
                            <button className="btn-add-to-cart-detail" onClick={handleAddToCart}>Add to Cart</button>
                            </div>
                    </div>
                    </section>
                </main>
            <Footer />
            </>
        )
}

export default CustomisePage;