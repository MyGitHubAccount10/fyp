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
    const [priceError, setPriceError] = useState('');    // State for second page (image editing)
    const [activeLayer, setActiveLayer] = useState('top'); // 'top' or 'bottom'
    const [topImages, setTopImages] = useState([]);
    const [bottomImages, setBottomImages] = useState([]);
    const [selectedImageId, setSelectedImageId] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [dragMode, setDragMode] = useState('move'); // 'move', 'scale', 'rotate'
    const [hoveredImageId, setHoveredImageId] = useState(null);
    const [hoveredZone, setHoveredZone] = useState(null); // 'center', 'corner', 'edge'

    const validateType = (type) => {
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
    }    // Image handling functions
    const generateImageId = () => {
        return Date.now() + Math.random().toString(36).substr(2, 9);
    };

    const handleImageUpload = (file, layer) => {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const newImage = {
                    id: generateImageId(),
                    src: e.target.result,
                    scale: 1,
                    x: 100,
                    y: 100,
                    rotation: 0,
                    width: 200,
                    height: 200
                };
                
                if (layer === 'top') {
                    setTopImages(prev => [...prev, newImage]);
                } else {
                    setBottomImages(prev => [...prev, newImage]);
                }
                setSelectedImageId(newImage.id);
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
            for (let i = 0; i < files.length; i++) {
                handleImageUpload(files[i], activeLayer);
            }
        }
    };

    const handleFileSelect = (e) => {
        const files = e.target.files;
        if (files) {
            for (let i = 0; i < files.length; i++) {
                handleImageUpload(files[i], activeLayer);
            }
        }
    };

    const getMouseZone = (e, imageElement) => {
        const rect = imageElement.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const width = rect.width;
        const height = rect.height;
        
        const cornerSize = 20;
        const edgeSize = 15;
        
        // Check corners for rotation
        if ((x < cornerSize && y < cornerSize) || 
            (x > width - cornerSize && y < cornerSize) ||
            (x < cornerSize && y > height - cornerSize) ||
            (x > width - cornerSize && y > height - cornerSize)) {
            return 'rotate';
        }
        
        // Check edges for scaling
        if (x < edgeSize || x > width - edgeSize || y < edgeSize || y > height - edgeSize) {
            return 'scale';
        }
        
        // Center for moving
        return 'move';
    };

    const getCursor = (zone) => {
        switch (zone) {
            case 'rotate': return 'grab';
            case 'scale': return 'nw-resize';
            case 'move': return 'move';
            default: return 'default';
        }
    };

    const handleImageMouseDown = (e, imageId) => {
        e.preventDefault();
        e.stopPropagation();
        
        const zone = getMouseZone(e, e.currentTarget);
        setIsDragging(true);
        setSelectedImageId(imageId);
        setDragMode(zone);
        setDragStart({
            x: e.clientX,
            y: e.clientY
        });
    };

    const handleImageMouseMove = (e, imageId) => {
        if (!isDragging || selectedImageId !== imageId) {
            // Just update hover state for cursor changes
            const zone = getMouseZone(e, e.currentTarget);
            setHoveredZone(zone);
            setHoveredImageId(imageId);
            return;
        }
        
        const deltaX = e.clientX - dragStart.x;
        const deltaY = e.clientY - dragStart.y;
        
        const images = activeLayer === 'top' ? topImages : bottomImages;
        const setImages = activeLayer === 'top' ? setTopImages : setBottomImages;
        
        const updatedImages = images.map(img => {
            if (img.id === imageId) {
                switch (dragMode) {
                    case 'move':
                        return {
                            ...img,
                            x: img.x + deltaX,
                            y: img.y + deltaY
                        };
                    case 'scale':
                        const scaleFactor = 1 + (deltaX + deltaY) / 200;
                        return {
                            ...img,
                            scale: Math.max(0.1, Math.min(3, img.scale * Math.max(0.5, scaleFactor)))
                        };
                    case 'rotate':
                        const rotationDelta = deltaX / 2;
                        return {
                            ...img,
                            rotation: (img.rotation + rotationDelta) % 360
                        };
                    default:
                        return img;
                }
            }
            return img;
        });
        
        setImages(updatedImages);
        setDragStart({
            x: e.clientX,
            y: e.clientY
        });
    };

    const handleImageMouseUp = () => {
        setIsDragging(false);
        setDragMode('move');
    };

    const handleImageMouseLeave = () => {
        setHoveredImageId(null);
        setHoveredZone(null);
    };

    const updateSelectedImage = (updates) => {
        if (!selectedImageId) return;
        
        const images = activeLayer === 'top' ? topImages : bottomImages;
        const setImages = activeLayer === 'top' ? setTopImages : setBottomImages;
        
        const updatedImages = images.map(img => 
            img.id === selectedImageId ? { ...img, ...updates } : img
        );
        setImages(updatedImages);
    };

    const handleScaleChange = (value) => {
        updateSelectedImage({ scale: value });
    };

    const handleRotationChange = (value) => {
        updateSelectedImage({ rotation: value });
    };

    const resetImagePosition = () => {
        updateSelectedImage({ scale: 1, x: 100, y: 100, rotation: 0 });
    };

    const removeImage = () => {
        if (!selectedImageId) return;
        
        const images = activeLayer === 'top' ? topImages : bottomImages;
        const setImages = activeLayer === 'top' ? setTopImages : setBottomImages;
        
        const filteredImages = images.filter(img => img.id !== selectedImageId);
        setImages(filteredImages);
        setSelectedImageId(null);
    };

    const removeAllImages = () => {
        if (activeLayer === 'top') {
            setTopImages([]);
        } else {
            setBottomImages([]);
        }
        setSelectedImageId(null);
    };

    const getSelectedImage = () => {
        if (!selectedImageId) return null;
        const images = activeLayer === 'top' ? topImages : bottomImages;
        return images.find(img => img.id === selectedImageId);
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
                            <div style={{ flex: 2 }}>                                <div 
                                    className="skimboard-canvas"
                                    style={{
                                        backgroundColor: activeLayer === 'top' ? topColor : bottomColor,
                                    }}
                                    onDragOver={handleDragOver}
                                    onDrop={handleDrop}
                                    onMouseMove={(e) => !isDragging && setHoveredZone(null)}
                                    onMouseUp={handleImageMouseUp}
                                    onMouseLeave={handleImageMouseUp}
                                >
                                    <div className="layer-indicator">
                                        {activeLayer === 'top' ? 'Top Layer' : 'Bottom Layer'}
                                    </div>
                                    
                                    {/* Bottom layer images */}
                                    {bottomImages.map((image) => (
                                        <img
                                            key={image.id}
                                            src={image.src}
                                            alt="Bottom design"
                                            className="customization-image"
                                            style={{
                                                transform: `translate(${image.x}px, ${image.y}px) scale(${image.scale}) rotate(${image.rotation}deg)`,
                                                transformOrigin: 'center',
                                                opacity: activeLayer === 'bottom' ? 1 : 0.3,
                                                zIndex: activeLayer === 'bottom' && selectedImageId === image.id ? 100 : 1,
                                                cursor: activeLayer === 'bottom' && hoveredImageId === image.id ? getCursor(hoveredZone) : 'default',
                                                border: activeLayer === 'bottom' && selectedImageId === image.id ? '2px solid #007bff' : 'none',
                                                width: `${image.width}px`,
                                                height: `${image.height}px`
                                            }}
                                            onMouseDown={activeLayer === 'bottom' ? (e) => handleImageMouseDown(e, image.id) : undefined}
                                            onMouseMove={activeLayer === 'bottom' ? (e) => handleImageMouseMove(e, image.id) : undefined}
                                            onMouseLeave={handleImageMouseLeave}
                                            draggable={false}
                                        />
                                    ))}
                                    
                                    {/* Top layer images */}
                                    {topImages.map((image) => (
                                        <img
                                            key={image.id}
                                            src={image.src}
                                            alt="Top design"
                                            className="customization-image"
                                            style={{
                                                transform: `translate(${image.x}px, ${image.y}px) scale(${image.scale}) rotate(${image.rotation}deg)`,
                                                transformOrigin: 'center',
                                                opacity: activeLayer === 'top' ? 1 : 0.3,
                                                zIndex: activeLayer === 'top' && selectedImageId === image.id ? 100 : 2,
                                                cursor: activeLayer === 'top' && hoveredImageId === image.id ? getCursor(hoveredZone) : 'default',
                                                border: activeLayer === 'top' && selectedImageId === image.id ? '2px solid #007bff' : 'none',
                                                width: `${image.width}px`,
                                                height: `${image.height}px`
                                            }}
                                            onMouseDown={activeLayer === 'top' ? (e) => handleImageMouseDown(e, image.id) : undefined}
                                            onMouseMove={activeLayer === 'top' ? (e) => handleImageMouseMove(e, image.id) : undefined}
                                            onMouseLeave={handleImageMouseLeave}
                                            draggable={false}
                                        />
                                    ))}
                                    
                                    {/* Drop zone message */}
                                    {((activeLayer === 'top' && topImages.length === 0) || (activeLayer === 'bottom' && bottomImages.length === 0)) && (
                                        <div className="drop-zone-message">
                                            <div className="drop-zone-icon">📁</div>
                                            <div>Drag & Drop Images Here</div>
                                            <div style={{ fontSize: '14px', marginTop: '5px' }}>or use the upload button</div>
                                            <div style={{ fontSize: '12px', marginTop: '5px', color: '#888' }}>Multiple images supported</div>
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
                                            Upload Images:
                                        </label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={handleFileSelect}
                                            style={{ width: '100%', padding: '8px' }}
                                        />
                                        <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                                            {activeLayer === 'top' ? topImages.length : bottomImages.length} image(s) on this layer
                                        </div>
                                    </div>

                                    {/* Image List */}
                                    {(activeLayer === 'top' ? topImages : bottomImages).length > 0 && (
                                        <div className="control-group">
                                            <label className="control-label">Images on {activeLayer} layer:</label>
                                            <div style={{ maxHeight: '150px', overflowY: 'auto', border: '1px solid #ddd', borderRadius: '4px' }}>
                                                {(activeLayer === 'top' ? topImages : bottomImages).map((image, index) => (
                                                    <div
                                                        key={image.id}
                                                        onClick={() => setSelectedImageId(image.id)}
                                                        style={{
                                                            padding: '8px',
                                                            borderBottom: '1px solid #eee',
                                                            cursor: 'pointer',
                                                            backgroundColor: selectedImageId === image.id ? '#e3f2fd' : 'transparent',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '8px'
                                                        }}
                                                    >
                                                        <img 
                                                            src={image.src} 
                                                            alt={`Image ${index + 1}`}
                                                            style={{ width: '30px', height: '30px', objectFit: 'cover', borderRadius: '4px' }}
                                                        />
                                                        <span style={{ fontSize: '14px' }}>Image {index + 1}</span>
                                                        {selectedImageId === image.id && <span style={{ color: '#007bff', fontSize: '12px' }}>✓ Selected</span>}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Image Controls */}
                                    {selectedImageId && getSelectedImage() && (
                                        <>
                                            <div className="control-group">
                                                <label className="control-label" style={{ color: '#007bff' }}>
                                                    Editing Selected Image
                                                </label>
                                                <div style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>
                                                    💡 Hover over image: center=move, edges=scale, corners=rotate
                                                </div>
                                            </div>

                                            {/* Scale Control */}
                                            <div className="control-group">
                                                <label className="control-label">
                                                    Scale: {getSelectedImage().scale.toFixed(2)}
                                                </label>
                                                <input
                                                    type="range"
                                                    min="0.1"
                                                    max="3"
                                                    step="0.1"
                                                    value={getSelectedImage().scale}
                                                    onChange={(e) => handleScaleChange(parseFloat(e.target.value))}
                                                    className="range-input"
                                                />
                                            </div>

                                            {/* Rotation Control */}
                                            <div className="control-group">
                                                <label className="control-label">
                                                    Rotation: {getSelectedImage().rotation}°
                                                </label>
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="360"
                                                    step="1"
                                                    value={getSelectedImage().rotation}
                                                    onChange={(e) => handleRotationChange(parseInt(e.target.value))}
                                                    className="range-input"
                                                />
                                            </div>

                                            {/* Position Info */}
                                            <div className="position-info">
                                                Position: X: {Math.round(getSelectedImage().x)}, Y: {Math.round(getSelectedImage().y)}
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="control-group">
                                                <button
                                                    onClick={resetImagePosition}
                                                    className="action-button primary"
                                                >
                                                    Reset Selected Image
                                                </button>
                                                <button
                                                    onClick={removeImage}
                                                    className="action-button danger"
                                                >
                                                    Remove Selected Image
                                                </button>
                                            </div>
                                        </>
                                    )}

                                    {/* Layer Actions */}
                                    {(activeLayer === 'top' ? topImages : bottomImages).length > 0 && (
                                        <div className="control-group">
                                            <button
                                                onClick={removeAllImages}
                                                className="action-button danger"
                                                style={{ backgroundColor: '#dc3545', opacity: 0.8 }}
                                            >
                                                Clear All Images from {activeLayer} Layer
                                            </button>
                                        </div>
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
                                </div>                                {/* Final Submit Button */}
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