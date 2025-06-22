import React, { useEffect, useState } from 'react';
import './Website.css';
import Header from './Header';
import Footer from './Footer';

const CustomisePage = () => {
    const [page, setPage] = useState(1);

    // State in first page
    const [type, setType] = useState('');
    const [shape, setShape] = useState('');
    const [size, setSize] = useState('');
    const [material, setMaterial] = useState('');
    const [topColor, setTopColor] = useState('');
    const [bottomColor, setBottomColor] = useState('');
    const [price, setPrice] = useState(0);

    const [typeError, setTypeError] = useState('');
    const [shapeError, setShapeError] = useState('');
    const [sizeError, setSizeError] = useState('');
    const [materialError, setMaterialError] = useState('');
    const [priceError, setPriceError] = useState('');

    // State for second page (image editing)
    const [activeLayer, setActiveLayer] = useState('top'); // 'top' or 'bottom'
    const [topImage, setTopImage] = useState(null);
    const [bottomImage, setBottomImage] = useState(null);
    const [topImageStyle, setTopImageStyle] = useState({
        scale: 1,
        x: 0,
        y: 0,
        rotation: 0
    });
    const [bottomImageStyle, setBottomImageStyle] = useState({
        scale: 1,
        x: 0,
        y: 0,
        rotation: 0
    });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });    const validateType = (type) => {
        if (!type) return 'Board type is required';
    };

    const validateShape = (shape) => {
        if (!shape) return 'Board shape is required';
    };

    const validateSize = (size) => {
        if (!size) return 'Board size is required';
    };

    const validateMaterial = (material) => {
        if (!material) return 'Material is required';
    };

    const validatePrice = (price) => {
        if (price <= 0) return 'Price must be greater than 0';
    };

    const handleFirstSubmit = (e) => {
        e.preventDefault();

        const typeError = validateType(type);
        const shapeError = validateShape(shape);
        const sizeError = validateSize(size);
        const materialError = validateMaterial(material);
        const priceError = validatePrice(price);
        
        setTypeError(typeError);
        setShapeError(shapeError);
        setSizeError(sizeError);
        setMaterialError(materialError);
        setPriceError(priceError);

        if (typeError || shapeError || sizeError || materialError || priceError) {
            return;
        }
        setPage(2);
    }

    // Image handling functions
    const handleImageUpload = (file, layer) => {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (layer === 'top') {
                    setTopImage(e.target.result);
                } else {
                    setBottomImage(e.target.result);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleImageUpload(files[0], activeLayer);
        }
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            handleImageUpload(file, activeLayer);
        }
    };

    const handleImageMouseDown = (e) => {
        setIsDragging(true);
        setDragStart({
            x: e.clientX,
            y: e.clientY
        });
    };

    const handleImageMouseMove = (e) => {
        if (!isDragging) return;
        
        const deltaX = e.clientX - dragStart.x;
        const deltaY = e.clientY - dragStart.y;
        
        const currentStyle = activeLayer === 'top' ? topImageStyle : bottomImageStyle;
        const newStyle = {
            ...currentStyle,
            x: currentStyle.x + deltaX,
            y: currentStyle.y + deltaY
        };
        
        if (activeLayer === 'top') {
            setTopImageStyle(newStyle);
        } else {
            setBottomImageStyle(newStyle);
        }
        
        setDragStart({
            x: e.clientX,
            y: e.clientY
        });
    };

    const handleImageMouseUp = () => {
        setIsDragging(false);
    };

    const handleScaleChange = (value) => {
        const currentStyle = activeLayer === 'top' ? topImageStyle : bottomImageStyle;
        const newStyle = { ...currentStyle, scale: value };
        
        if (activeLayer === 'top') {
            setTopImageStyle(newStyle);
        } else {
            setBottomImageStyle(newStyle);
        }
    };

    const handleRotationChange = (value) => {
        const currentStyle = activeLayer === 'top' ? topImageStyle : bottomImageStyle;
        const newStyle = { ...currentStyle, rotation: value };
        
        if (activeLayer === 'top') {
            setTopImageStyle(newStyle);
        } else {
            setBottomImageStyle(newStyle);
        }
    };

    const resetImagePosition = () => {
        const resetStyle = { scale: 1, x: 0, y: 0, rotation: 0 };
        if (activeLayer === 'top') {
            setTopImageStyle(resetStyle);
        } else {
            setBottomImageStyle(resetStyle);
        }
    };

    const removeImage = () => {
        if (activeLayer === 'top') {
            setTopImage(null);
            setTopImageStyle({ scale: 1, x: 0, y: 0, rotation: 0 });
        } else {
            setBottomImage(null);
            setBottomImageStyle({ scale: 1, x: 0, y: 0, rotation: 0 });
        }
    };
    const inputStyle = { display: 'block', width: '100%', margin: '12px', padding: '12px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' };
    const errorInputStyle = { ...inputStyle, borderColor: '#e74c3c' };
    const errorMessageStyle = { color: '#e74c3c', fontSize: '0.875em', marginTop: '5px', marginBottom: '15px' };
    
    return (
        <>
            <Header />
               <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', marginTop: '40px' }}>
                <div style={{ flex: 1, maxWidth: '500px' }}>
                <h2 style={{ fontWeight: 'bold', fontSize: '2em', marginBottom: '10px' }}>Customise Form</h2>
                <p style={{ marginBottom: '30px', fontSize: '1em', color: '#555' }}>Customise Your Skimboard!</p>
                        
                { page === 1 && (
                    <form onSubmit={handleFirstSubmit} noValidate>
                    <label>Board Type:</label>
                    <select
                        name="type"
                        value={type}
                        onChange={e => setType(e.target.value)}
                        onBlur={() => setTypeError(validateType(type))}
                        style={{...typeError ? errorInputStyle : inputStyle, marginBottom: typeError ? '0' : '15px'}}>
                        <option value="">Select</option>
                        <option value="Flatland">Flatland</option>
                        <option value="Wave">Wave</option>
                        <option value="Hybrid">Hybrid</option>
                    </select>

                    {typeError && <p style={errorMessageStyle}>{typeError}</p>}

                    <label>Board Shape:</label>
                    <select
                        name="shape"
                        value={shape}
                        onChange={e => setShape(e.target.value)}
                        onBlur={() => setShapeError(validateShape(shape))}
                        style={{...shapeError ? errorInputStyle : inputStyle, marginBottom: shapeError ? '0' : '15px'}}>
                        <option value="">Select</option>
                        <option value="Square Tail">Square Tail</option>
                        <option value="Round Tail">Round Tail</option>
                        <option value="Pin Tail">Pin Tail</option>
                        <option value="Swallow Tail">Swallow Tail</option>
                    </select>

                    {shapeError && <p style={errorMessageStyle}>{shapeError}</p>}

                    <label>Board Size:</label>
                    <select
                        name="size"
                        value={size}
                        onChange={e => setSize(e.target.value)}
                        onBlur={() => setSizeError(validateSize(size))}
                        style={{...sizeError ? errorInputStyle : inputStyle, marginBottom: sizeError ? '0' : '15px'}}>
                        <option value="">Select</option>
                        <option value="Small">Small</option>
                        <option value="Medium">Medium</option>
                        <option value="Large">Large</option>
                    </select>

                    {sizeError && <p style={errorMessageStyle}>{sizeError}</p>}

                    <label>Material:</label>
                    <select
                        name="material"
                        value={material}
                        onChange={e => setMaterial(e.target.value)}
                        onBlur={() => setMaterialError(validateMaterial(material))}
                        style={{...materialError ? errorInputStyle : inputStyle, marginBottom: materialError ? '0' : '15px'}}>
                        <option value="">Select</option>
                        <option value="Wood">Wood</option>
                        <option value="Foam Core">Foam Core</option>
                        <option value="Fiberglass">Fiberglass</option>
                        <option value="Carbon Fiber">Carbon Fiber</option>
                        <option value="Epoxy Coating">Epoxy Coating</option>
                        <option value="Plastic Bottom">Plastic Bottom</option>
                    </select>

                    {materialError && <p style={errorMessageStyle}>{materialError}</p>}

                    <label>Top Color:</label>
                    <input
                        type="color"
                        name="topColor"
                        value={topColor}
                        style={{...inputStyle, padding: '0px'}}
                        onChange={e => setTopColor(e.target.value)} required />
                    
                    <label>Bottom Color:</label>
                    <input
                        type="color"
                        name="bottomColor"
                        value={bottomColor}
                        style={{...inputStyle, padding: '0px'}}
                        onChange={e => setBottomColor(e.target.value)} required/>

                    <label>Price:</label>
                    <input
                        type="number"
                        name="price"
                        value={price}
                        placeholder="Enter price"
                        onChange={e => setPrice(e.target.value)}
                        onBlur={()=> setPriceError(validatePrice(price))}
                        style={{...priceError ? errorInputStyle : inputStyle, marginBottom: priceError ? '0' : '15px'}}/>
                    {priceError && <p style={errorMessageStyle}>{priceError}</p>}

                    <button 
                        type="submit"
                        className="complete-purchase-btn"
                        style={{ backgroundColor: '#333', color: '#fff', margin: '12px', padding: '12px' }}>
                        Proceed to Upload Image
                    </button>                    </form>   
                )}

                {page === 2 && (
                    <div>                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                            <button 
                                onClick={() => setPage(1)}
                                className="back-button">
                                Back
                            </button>
                            <h3>Design Your Skimboard</h3>
                            <div></div>
                        </div>{/* Layer Selection */}
                        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                            <button 
                                onClick={() => setActiveLayer('top')}
                                className={`layer-button ${activeLayer === 'top' ? 'active' : ''}`}>
                                Top Layer
                            </button>
                            <button 
                                onClick={() => setActiveLayer('bottom')}
                                className={`layer-button ${activeLayer === 'bottom' ? 'active' : ''}`}>
                                Bottom Layer
                            </button>
                        </div>

                        {/* Skimboard Canvas */}
                        <div style={{ display: 'flex', gap: '20px' }}>
                            <div style={{ flex: 2 }}>
                                <div 
                                    className="skimboard-canvas"
                                    style={{
                                        backgroundColor: activeLayer === 'top' ? topColor : bottomColor,
                                    }}
                                    onDragOver={handleDragOver}
                                    onDrop={handleDrop}
                                    onMouseMove={handleImageMouseMove}
                                    onMouseUp={handleImageMouseUp}
                                    onMouseLeave={handleImageMouseUp}
                                >
                                    <div className="layer-indicator">
                                        {activeLayer === 'top' ? 'Top Layer' : 'Bottom Layer'}
                                    </div>
                                      {/* Bottom layer image */}
                                    {bottomImage && (
                                        <img
                                            src={bottomImage}
                                            alt="Bottom design"
                                            className="customization-image"
                                            style={{
                                                transform: `translate(${bottomImageStyle.x}px, ${bottomImageStyle.y}px) scale(${bottomImageStyle.scale}) rotate(${bottomImageStyle.rotation}deg)`,
                                                transformOrigin: 'center',
                                                opacity: activeLayer === 'bottom' ? 1 : 0.5,
                                                zIndex: 1,
                                                cursor: activeLayer === 'bottom' ? 'move' : 'default'
                                            }}
                                            onMouseDown={activeLayer === 'bottom' ? handleImageMouseDown : undefined}
                                            draggable={false}
                                        />
                                    )}
                                    
                                    {/* Top layer image */}
                                    {topImage && (
                                        <img
                                            src={topImage}
                                            alt="Top design"
                                            className="customization-image"
                                            style={{
                                                transform: `translate(${topImageStyle.x}px, ${topImageStyle.y}px) scale(${topImageStyle.scale}) rotate(${topImageStyle.rotation}deg)`,
                                                transformOrigin: 'center',
                                                opacity: activeLayer === 'top' ? 1 : 0.5,
                                                zIndex: 2,
                                                cursor: activeLayer === 'top' ? 'move' : 'default'
                                            }}
                                            onMouseDown={activeLayer === 'top' ? handleImageMouseDown : undefined}
                                            draggable={false}
                                        />
                                    )}
                                    
                                    {/* Drop zone message */}
                                    {((activeLayer === 'top' && !topImage) || (activeLayer === 'bottom' && !bottomImage)) && (
                                        <div className="drop-zone-message">
                                            <div className="drop-zone-icon">📁</div>
                                            <div>Drag & Drop Image Here</div>
                                            <div style={{ fontSize: '14px', marginTop: '5px' }}>or use the upload button</div>
                                        </div>
                                    )}
                                </div>
                            </div>                            {/* Controls Panel */}
                            <div style={{ flex: 1, minWidth: '250px' }}>
                                <div className="controls-panel">
                                    <h4 style={{ marginTop: 0, marginBottom: '20px' }}>
                                        {activeLayer === 'top' ? 'Top Layer' : 'Bottom Layer'} Controls
                                    </h4>
                                    
                                    {/* File Upload */}
                                    <div className="control-group">
                                        <label className="control-label">
                                            Upload Image:
                                        </label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileSelect}
                                            style={{ width: '100%', padding: '8px' }}
                                        />
                                    </div>

                                    {/* Image Controls */}
                                    {((activeLayer === 'top' && topImage) || (activeLayer === 'bottom' && bottomImage)) && (
                                        <>
                                            {/* Scale Control */}
                                            <div className="control-group">
                                                <label className="control-label">
                                                    Scale: {(activeLayer === 'top' ? topImageStyle.scale : bottomImageStyle.scale).toFixed(2)}
                                                </label>
                                                <input
                                                    type="range"
                                                    min="0.1"
                                                    max="3"
                                                    step="0.1"
                                                    value={activeLayer === 'top' ? topImageStyle.scale : bottomImageStyle.scale}
                                                    onChange={(e) => handleScaleChange(parseFloat(e.target.value))}
                                                    className="range-input"
                                                />
                                            </div>

                                            {/* Rotation Control */}
                                            <div className="control-group">
                                                <label className="control-label">
                                                    Rotation: {activeLayer === 'top' ? topImageStyle.rotation : bottomImageStyle.rotation}°
                                                </label>
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="360"
                                                    step="1"
                                                    value={activeLayer === 'top' ? topImageStyle.rotation : bottomImageStyle.rotation}
                                                    onChange={(e) => handleRotationChange(parseInt(e.target.value))}
                                                    className="range-input"
                                                />
                                            </div>

                                            {/* Position Info */}
                                            <div className="position-info">
                                                Position: X: {Math.round(activeLayer === 'top' ? topImageStyle.x : bottomImageStyle.x)}, 
                                                Y: {Math.round(activeLayer === 'top' ? topImageStyle.y : bottomImageStyle.y)}
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="control-group">
                                                <button
                                                    onClick={resetImagePosition}
                                                    className="action-button primary"
                                                >
                                                    Reset Position
                                                </button>
                                                <button
                                                    onClick={removeImage}
                                                    className="action-button danger"
                                                >
                                                    Remove Image
                                                </button>
                                            </div>
                                        </>
                                    )}

                                    {/* Board Info */}
                                    <div className="board-specs">
                                        <h5>Board Specifications:</h5>
                                        <div><strong>Type:</strong> {type}</div>
                                        <div><strong>Shape:</strong> {shape}</div>
                                        <div><strong>Size:</strong> {size}</div>
                                        <div><strong>Material:</strong> {material}</div>
                                        <div><strong>Price:</strong> ${price}</div>
                                    </div>
                                </div>

                                {/* Final Submit Button */}
                                <button
                                    className="action-button success"
                                    onClick={() => {
                                        // Here you would typically save the customization data
                                        alert('Skimboard customization completed! Design saved.');
                                    }}
                                >
                                    Complete Customization
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                </div>
            </div>
            <Footer />
            </>
        )
}

export default CustomisePage;