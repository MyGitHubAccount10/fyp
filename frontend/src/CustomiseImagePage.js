import React, { useState, useRef, useCallback } from 'react';
import './CustomiseImagePage.css';

export default function CustomiseImagePage() {
  const [color, setColor] = useState('#FFD700');
  const [customText, setCustomText] = useState('My Skimboard');
  const [images, setImages] = useState([]);
  const [textPosition, setTextPosition] = useState({ x: 125, y: 350 });
  const [fontSize, setFontSize] = useState(20);
  const [fontFamily, setFontFamily] = useState('Arial');
  const [textColor, setTextColor] = useState('#FFFFFF');
  const [backgroundPattern, setBackgroundPattern] = useState('solid');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedElement, setSelectedElement] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const previewRef = useRef(null);
  const dragging = useRef({ id: null, type: null, offsetX: 0, offsetY: 0 });
  const fileInputRef = useRef(null);

  // Save state to history for undo/redo functionality
  const saveToHistory = useCallback(() => {
    const currentState = {
      color,
      customText,
      images: JSON.parse(JSON.stringify(images)),
      textPosition: { ...textPosition },
      fontSize,
      fontFamily,
      textColor,
      backgroundPattern
    };
    
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(currentState);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [color, customText, images, textPosition, fontSize, fontFamily, textColor, backgroundPattern, history, historyIndex]);

  // Undo functionality
  const handleUndo = () => {
    if (historyIndex > 0) {
      const previousState = history[historyIndex - 1];
      setColor(previousState.color);
      setCustomText(previousState.customText);
      setImages(previousState.images);
      setTextPosition(previousState.textPosition);
      setFontSize(previousState.fontSize);
      setFontFamily(previousState.fontFamily);
      setTextColor(previousState.textColor);
      setBackgroundPattern(previousState.backgroundPattern);
      setHistoryIndex(historyIndex - 1);
    }
  };

  // Redo functionality
  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      setColor(nextState.color);
      setCustomText(nextState.customText);
      setImages(nextState.images);
      setTextPosition(nextState.textPosition);
      setFontSize(nextState.fontSize);
      setFontFamily(nextState.fontFamily);
      setTextColor(nextState.textColor);
      setBackgroundPattern(nextState.backgroundPattern);
      setHistoryIndex(historyIndex + 1);
    }
  };
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    saveToHistory();
    
    files.forEach((file, index) => {
      if (file && file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        setImages((prev) => [
          ...prev,
          {
            id: Date.now() + index,
            src: url,
            x: 60 + (index * 20),
            y: 100 + (index * 20),
            width: 80,
            height: 80,
            rotation: 0,
            opacity: 1,
            zIndex: prev.length + index,
          },
        ]);
      }
    });
    
    // Clear the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDeleteImage = (id) => {
    saveToHistory();
    setImages((prev) => prev.filter((img) => img.id !== id));
    setSelectedElement(null);
  };

  const handleDuplicateImage = (id) => {
    saveToHistory();
    const imageToDuplicate = images.find(img => img.id === id);
    if (imageToDuplicate) {
      setImages((prev) => [
        ...prev,
        {
          ...imageToDuplicate,
          id: Date.now(),
          x: imageToDuplicate.x + 20,
          y: imageToDuplicate.y + 20,
          zIndex: prev.length,
        },
      ]);
    }
  };

  const bringToFront = (id) => {
    const maxZ = Math.max(...images.map(img => img.zIndex));
    setImages((prev) =>
      prev.map((img) =>
        img.id === id ? { ...img, zIndex: maxZ + 1 } : img
      )
    );
  };

  const sendToBack = (id) => {
    const minZ = Math.min(...images.map(img => img.zIndex));
    setImages((prev) =>
      prev.map((img) =>
        img.id === id ? { ...img, zIndex: minZ - 1 } : img
      )
    );
  };
  const handleReset = () => {
    saveToHistory();
    setColor('#FFD700');
    setCustomText('My Skimboard');
    setImages([]);
    setTextPosition({ x: 125, y: 350 });
    setFontSize(20);
    setFontFamily('Arial');
    setTextColor('#FFFFFF');
    setBackgroundPattern('solid');
    setSelectedElement(null);
  };
  const handleDownload = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    const preview = previewRef.current;
    const canvas = document.createElement('canvas');
    const scale = 3; // Higher resolution
    const width = preview.offsetWidth;
    const height = preview.offsetHeight;

    canvas.width = width * scale;
    canvas.height = height * scale;

    const ctx = canvas.getContext('2d');
    ctx.scale(scale, scale);

    // Draw background with pattern/gradient support
    if (backgroundPattern === 'gradient') {
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, color);
      gradient.addColorStop(1, adjustBrightness(color, -20));
      ctx.fillStyle = gradient;
    } else {
      ctx.fillStyle = color;
    }
    
    ctx.fillRect(0, 0, width, height);

    // Sort images by zIndex for proper layering
    const sortedImages = [...images].sort((a, b) => a.zIndex - b.zIndex);

    // Load and draw all images
    const loadAll = sortedImages.map((img) => {
      return new Promise((resolve) => {
        const image = new Image();
        image.crossOrigin = 'anonymous';
        image.src = img.src;
        image.onload = () => {
          ctx.save();
          ctx.globalAlpha = img.opacity || 1;
          ctx.translate(img.x + img.width / 2, img.y + img.height / 2);
          ctx.rotate((img.rotation * Math.PI) / 180);
          ctx.drawImage(
            image,
            -img.width / 2,
            -img.height / 2,
            img.width,
            img.height
          );
          ctx.restore();
          resolve();
        };
        image.onerror = () => resolve(); // Continue even if image fails to load
      });
    });

    try {
      await Promise.all(loadAll);
      
      // Draw text with better styling
      ctx.fillStyle = textColor;
      ctx.font = `bold ${fontSize}px ${fontFamily}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Add text stroke for better visibility
      ctx.strokeStyle = textColor === '#FFFFFF' ? '#000000' : '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.strokeText(customText, textPosition.x, textPosition.y);
      ctx.fillText(customText, textPosition.x, textPosition.y);

      const link = document.createElement('a');
      link.download = `skimboard-design-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to adjust color brightness
  const adjustBrightness = (hex, percent) => {
    const num = parseInt(hex.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
  };  const handleMouseDown = (e, type, id = null) => {
    e.stopPropagation();
    const bounds = previewRef.current.getBoundingClientRect();
    
    if (!dragging.current.type) {
      saveToHistory();
    }
    
    if (type === 'rotate' && id) {
      const img = images.find(img => img.id === id);
      if (img) {
        const centerX = img.x + img.width / 2;
        const centerY = img.y + img.height / 2;
        const mouseX = e.clientX - bounds.left;
        const mouseY = e.clientY - bounds.top;
        const initialAngle = Math.atan2(mouseY - centerY, mouseX - centerX);
        
        dragging.current = {
          type,
          id,
          initialAngle,
          initialRotation: img.rotation
        };
      }
    } else {
      dragging.current = {
        type,
        id,
        offsetX: e.clientX - bounds.left - (type === 'text' ? textPosition.x : 
          images.find(img => img.id === id)?.x || 0),
        offsetY: e.clientY - bounds.top - (type === 'text' ? textPosition.y : 
          images.find(img => img.id === id)?.y || 0)
      };
    }

    if (type === 'image') {
      setSelectedElement({ type: 'image', id });
      bringToFront(id);
    } else if (type === 'text') {
      setSelectedElement({ type: 'text' });
    }
  };


  const handleMouseMove = (e) => {
    if (!dragging.current.type) return;

    const bounds = previewRef.current.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const y = e.clientY - bounds.top;

    if (dragging.current.type === 'text') {
      setTextPosition({ 
        x: Math.max(0, Math.min(bounds.width, x - dragging.current.offsetX)), 
        y: Math.max(0, Math.min(bounds.height, y - dragging.current.offsetY)) 
      });
    } else if (dragging.current.type === 'image') {
      setImages((prev) =>
        prev.map((img) =>
          img.id === dragging.current.id ? { 
            ...img, 
            x: Math.max(0, Math.min(bounds.width - img.width, x - dragging.current.offsetX)), 
            y: Math.max(0, Math.min(bounds.height - img.height, y - dragging.current.offsetY)) 
          } : img
        )
      );
    } else if (dragging.current.type === 'resize') {
      setImages((prev) =>
        prev.map((img) =>
          img.id === dragging.current.id
            ? {
                ...img,
                width: Math.max(20, Math.min(200, x - img.x)),
                height: Math.max(20, Math.min(200, y - img.y)),
              }
            : img
        )
      );    } else if (dragging.current.type === 'rotate') {
      setImages((prev) =>
        prev.map((img) => {
          if (img.id !== dragging.current.id) return img;
          const centerX = img.x + img.width / 2;
          const centerY = img.y + img.height / 2;
          const currentAngle = Math.atan2(y - centerY, x - centerX);
          const angleDifference = currentAngle - dragging.current.initialAngle;
          const newRotation = dragging.current.initialRotation + (angleDifference * 180) / Math.PI;
          return { ...img, rotation: newRotation };
        })
      );
    }
  };
  const handleMouseUp = () => {
    dragging.current = { 
      id: null, 
      type: null, 
      offsetX: 0, 
      offsetY: 0, 
      initialAngle: 0, 
      initialRotation: 0 
    };
  };

  const handleKeyDown = (e) => {
    if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
      e.preventDefault();
      handleUndo();
    } else if ((e.ctrlKey && e.key === 'y') || (e.ctrlKey && e.shiftKey && e.key === 'Z')) {
      e.preventDefault();
      handleRedo();
    } else if (e.key === 'Delete' && selectedElement) {
      if (selectedElement.type === 'image') {
        handleDeleteImage(selectedElement.id);
      }
    }
  };

  // Add keyboard event listener
  React.useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedElement, handleUndo, handleRedo]);

  const handlePresetColors = (presetColor) => {
    saveToHistory();
    setColor(presetColor);
  };

  const presetColors = [
    '#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', 
    '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8',
    '#000000', '#FFFFFF', '#FF0000', '#0000FF'
  ];
  return (
    <div
      className="skimboard-container"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <h1>Customize Your Skimboard</h1>
      <div className="skimboard-customiser">
        <div className="customisation-panel">
          {/* Background Controls */}
          <div className="control-group">
            <h3>Background</h3>
            <label>
              Background Type:
              <select 
                value={backgroundPattern} 
                onChange={(e) => {
                  saveToHistory();
                  setBackgroundPattern(e.target.value);
                }}
              >
                <option value="solid">Solid Color</option>
                <option value="gradient">Gradient</option>
              </select>
            </label>
            
            <label>
              Background Color:
              <input 
                type="color" 
                value={color} 
                onChange={(e) => {
                  saveToHistory();
                  setColor(e.target.value);
                }} 
              />
            </label>

            <div className="preset-colors">
              <span>Quick Colors:</span>
              <div className="color-swatches">
                {presetColors.map((presetColor, index) => (
                  <button
                    key={index}
                    className="color-swatch"
                    style={{ backgroundColor: presetColor }}
                    onClick={() => handlePresetColors(presetColor)}
                    title={presetColor}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Text Controls */}
          <div className="control-group">
            <h3>Text</h3>
            <label>
              Text Content:
              <input 
                type="text" 
                value={customText} 
                onChange={(e) => {
                  setCustomText(e.target.value);
                }} 
                maxLength={30} 
                placeholder="Enter your text"
              />
            </label>

            <label>
              Text Color:
              <input 
                type="color" 
                value={textColor} 
                onChange={(e) => setTextColor(e.target.value)} 
              />
            </label>

            <label>
              Font Size: {fontSize}px
              <input
                type="range"
                min="10"
                max="60"
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value))}
              />
            </label>

            <label>
              Font Family:
              <select value={fontFamily} onChange={(e) => setFontFamily(e.target.value)}>
                <option value="Arial">Arial</option>
                <option value="Comic Sans MS">Comic Sans</option>
                <option value="Courier New">Courier New</option>
                <option value="Georgia">Georgia</option>
                <option value="Impact">Impact</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Verdana">Verdana</option>
                <option value="Helvetica">Helvetica</option>
                <option value="Roboto">Roboto</option>
              </select>
            </label>
          </div>

          {/* Image Controls */}
          <div className="control-group">
            <h3>Images</h3>
            <label>
              Upload Images:
              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*" 
                multiple
                onChange={handleImageUpload} 
              />
            </label>
            
            {selectedElement && selectedElement.type === 'image' && (
              <div className="image-controls">
                <h4>Selected Image Controls</h4>
                <label>
                  Opacity: {Math.round((images.find(img => img.id === selectedElement.id)?.opacity || 1) * 100)}%
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={images.find(img => img.id === selectedElement.id)?.opacity || 1}
                    onChange={(e) => {
                      setImages(prev =>
                        prev.map(img =>
                          img.id === selectedElement.id
                            ? { ...img, opacity: parseFloat(e.target.value) }
                            : img
                        )
                      );
                    }}
                  />
                </label>
                
                <div className="image-actions">
                  <button onClick={() => handleDuplicateImage(selectedElement.id)}>
                    Duplicate
                  </button>
                  <button onClick={() => bringToFront(selectedElement.id)}>
                    Bring Forward
                  </button>
                  <button onClick={() => sendToBack(selectedElement.id)}>
                    Send Back
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button 
              onClick={handleUndo} 
              disabled={historyIndex <= 0}
              title="Undo (Ctrl+Z)"
            >
              ↶ Undo
            </button>
            <button 
              onClick={handleRedo} 
              disabled={historyIndex >= history.length - 1}
              title="Redo (Ctrl+Y)"
            >
              ↷ Redo
            </button>
            <button onClick={handleReset}>🔄 Reset</button>
            <button 
              onClick={handleDownload}
              disabled={isLoading}
              className="download-btn"
            >
              {isLoading ? '⏳ Generating...' : '💾 Download PNG'}
            </button>
          </div>

          <div className="help-text">
            <small>
              💡 Tips: Drag elements to move • Use handles to resize/rotate • 
              Press Delete to remove selected image • Ctrl+Z/Y for undo/redo
            </small>
          </div>
        </div>        <div className="preview-panel">
          <div 
            ref={previewRef} 
            className="skimboard-preview" 
            style={{ 
              background: backgroundPattern === 'gradient' 
                ? `linear-gradient(135deg, ${color}, ${adjustBrightness(color, -20)})` 
                : color 
            }}
            onClick={() => setSelectedElement(null)}
          >
            {/* Text Element */}
            <div
              className={`draggable skimboard-text ${selectedElement?.type === 'text' ? 'selected' : ''}`}
              style={{ 
                top: textPosition.y, 
                left: textPosition.x, 
                fontSize: `${fontSize}px`,
                fontFamily: fontFamily,
                color: textColor,
                transform: 'translate(-50%, -50%)',
                textShadow: textColor === '#FFFFFF' ? '2px 2px 4px rgba(0,0,0,0.8)' : '2px 2px 4px rgba(255,255,255,0.8)'
              }}
              onMouseDown={(e) => handleMouseDown(e, 'text')}
            >
              {customText}
            </div>

            {/* Images */}
            {images
              .sort((a, b) => a.zIndex - b.zIndex)
              .map((img) => (
              <div
                key={img.id}
                className={`image-wrapper ${selectedElement?.id === img.id ? 'selected' : ''}`}
                style={{
                  top: img.y,
                  left: img.x,
                  width: img.width,
                  height: img.height,
                  transform: `rotate(${img.rotation}deg)`,
                  opacity: img.opacity || 1,
                  zIndex: img.zIndex,
                }}
                onMouseDown={(e) => handleMouseDown(e, 'image', img.id)}
                onDoubleClick={() => handleDuplicateImage(img.id)}
              >
                <img 
                  src={img.src} 
                  alt="Custom upload" 
                  className="skimboard-image" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  draggable={false}
                />
                
                {/* Control buttons - only show for selected image */}
                {selectedElement?.id === img.id && (
                  <>
                    <button 
                      className="delete-btn" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteImage(img.id);
                      }}
                      title="Delete image"
                    >
                      ×
                    </button>

                    <div
                      className="resize-handle"
                      onMouseDown={(e) => handleMouseDown(e, 'resize', img.id)}
                      title="Resize"
                    />
                    
                    <div
                      className="rotate-handle"
                      onMouseDown={(e) => handleMouseDown(e, 'rotate', img.id)}
                      title="Rotate"
                    />
                  </>
                )}
              </div>
            ))}

            {/* Selection indicator */}
            {selectedElement && (
              <div className="selection-info">
                {selectedElement.type === 'text' ? 'Text Selected' : 'Image Selected'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
