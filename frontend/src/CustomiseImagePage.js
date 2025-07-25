import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './CustomiseImagePage.css';
import Header from './Header';
import { useCustomiseContext } from './hooks/useCustomiseContext';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

// Default settings for a new skimboard design
const DEFAULT_DESIGN = {
  color: '#FFD700',
  customText: 'My Skimboard',
  images: [],
  textPosition: { x: 125, y: 350 },
  fontSize: 20,
  fontFamily: 'Arial',
  textColor: '#FFFFFF',
  textStrokeColor: '#000000',
  enableTextStroke: false,
  backgroundPattern: 'solid',
  gradientContrast: 20,
  textZIndex: 100,
  textVisible: true
};

// A function to adjust color brightness (It is used to create gradients)
const clamp = (value) => Math.max(0, Math.min(255, value));

const createGradient = (hex, percent) => {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);

  const r = clamp((num >> 16) + amt);
  const g = clamp((num >> 8 & 0xFF) + amt);
  const b = clamp((num & 0xFF) + amt);

  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
};

// Download an image file
const downloadImage = (dataUrl, filename) => {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  link.click();
};

// Generate skimboard image from design data
const generateSkimboardImage = async (designData, previewElement, scale = 2) => {
  const canvas = document.createElement('canvas');
  const width = 280;
  const height = 450;

  canvas.width = width * scale;
  canvas.height = height * scale;

  const canvaContext = canvas.getContext('2d');
  canvaContext.scale(scale, scale);

  // Create clipping path for skimboard shape (oval)
  canvaContext.save();
  canvaContext.beginPath();
  canvaContext.ellipse(width / 2, height / 2, width / 2, height / 2, 0, 0, 2 * Math.PI);
  canvaContext.clip();

  // Draw background
  if (designData.backgroundPattern === 'gradient') {
    const gradient = canvaContext.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, designData.color);
    gradient.addColorStop(1, createGradient(designData.color, -(designData.gradientContrast || 20)));
    canvaContext.fillStyle = gradient;
  } else {
    canvaContext.fillStyle = designData.color;
  }

  canvaContext.fillRect(0, 0, width, height);

  // Calculate scaling factors
  const previewRect = previewElement.getBoundingClientRect();
  const scaleX = width / previewRect.width;
  const scaleY = height / previewRect.height;

  // Create combined array of all elements with their zIndex for proper layering
  const allElements = [
    ...designData.images.map(img => ({ type: 'image', data: img, zIndex: img.zIndex }))
  ];
  
  if (designData.textVisible !== false) {
    allElements.push({ type: 'text', data: designData, zIndex: designData.textZIndex || 100 });
  }
  
  allElements.sort((a, b) => a.zIndex - b.zIndex);

  for (const element of allElements) {
    if (element.type === 'image') {
      await drawSingleImage(canvaContext, element.data, scaleX, scaleY);
    } else if (element.type === 'text') {
      drawText(canvaContext, element.data, scaleX, scaleY);
    }
  }

  canvaContext.restore();
  return canvas.toDataURL('image/png', 0.9);
};

// Helper function to draw a single image on canvas
const drawSingleImage = async (canvaContext, img, scaleX, scaleY) => {
  return new Promise((resolve) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.src = img.src;
    image.onload = () => {
      canvaContext.save();
      canvaContext.globalAlpha = img.opacity || 1;
      
      const scaledX = img.x * scaleX;
      const scaledY = img.y * scaleY;
      const scaledWidth = img.width * scaleX;
      const scaledHeight = img.height * scaleY;
      
      canvaContext.translate(scaledX + scaledWidth / 2, scaledY + scaledHeight / 2);
      canvaContext.rotate((img.rotation * Math.PI) / 180);
      
      const imageAspect = image.width / image.height;
      const targetAspect = scaledWidth / scaledHeight;
      
      let drawWidth, drawHeight;
      
      if (imageAspect > targetAspect) {
        drawWidth = scaledWidth;
        drawHeight = drawWidth / imageAspect;
      } else {
        drawHeight = scaledHeight;
        drawWidth = drawHeight * imageAspect;
      }
      
      canvaContext.beginPath();
      canvaContext.rect(-scaledWidth / 2, -scaledHeight / 2, scaledWidth, scaledHeight);
      canvaContext.clip();
      
      canvaContext.drawImage(
        image,
        -drawWidth / 2,
        -drawHeight / 2,
        drawWidth,
        drawHeight
      );
      
      canvaContext.restore();
      resolve();
    };
    image.onerror = () => {
      console.error('Failed to load image:', img.src);
      resolve();
    };
  });
};

// Helper function to draw text on canvas
const drawText = (canvaContext, designData, scaleX, scaleY) => {
  canvaContext.fillStyle = designData.textColor;
  canvaContext.font = `bold ${designData.fontSize * scaleX}px ${designData.fontFamily}`;
  canvaContext.textAlign = 'center';
  canvaContext.textBaseline = 'middle';
  
  const scaledTextX = designData.textPosition.x * scaleX;
  const scaledTextY = designData.textPosition.y * scaleY;
  
  const lines = designData.customText.split('\n');
  const lineHeight = designData.fontSize * scaleX * 1.2;
  const totalHeight = lines.length * lineHeight;
  const startY = scaledTextY - (totalHeight / 2) + (lineHeight / 2);
  
  lines.forEach((line, index) => {
    const currentY = startY + (index * lineHeight);
    
    if (designData.enableTextStroke) {
      canvaContext.strokeStyle = designData.textStrokeColor;
      canvaContext.lineWidth = Math.max(1, designData.fontSize * scaleX * 0.05);
      canvaContext.strokeText(line, scaledTextX, currentY);
    }
    
    canvaContext.fillText(line, scaledTextX, currentY);
  });
};

// Debounce utility for performance
const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export default function CustomiseImagePage() {
  const navigate = useNavigate();
  const { dispatch } = useCustomiseContext();
  
  const [currentSide, setCurrentSide] = useState('top');
  const [designs, setDesigns] = useState({
    top: { ...DEFAULT_DESIGN, customText: 'My Skimboard' },
    bottom: { ...DEFAULT_DESIGN, color: '#4ECDC4', customText: 'Bottom Side' }
  });
  const [selectedElement, setSelectedElement] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [preserveAspectRatio, setPreserveAspectRatio] = useState(true);
  const previewRef = useRef(null);
  const fileInputRef = useRef(null);
  const [history, setHistory] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const dragState = useRef({ type: null, id: null, offsetX: 0, offsetY: 0, initialWidth: 0, initialHeight: 0, initialRotation: 0, initialAngle: 0, bottomRightX: 0, bottomRightY: 0 });

  const saveToHistory = useCallback((state) => {
    const newHistory = history.slice(0, currentIndex + 1);
    newHistory.push(JSON.parse(JSON.stringify(state)));
    setHistory(newHistory);
    setCurrentIndex(newHistory.length - 1);
  }, [history, currentIndex]);

  const undo = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      return history[currentIndex - 1];
    }
    return null;
  }, [history, currentIndex]);

  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(currentIndex + 1);
      return history[currentIndex + 1];
    }
    return null;
  }, [history, currentIndex]);

  const updateCurrentDesign = (changes) => {
    setDesigns(prev => ({
      ...prev,
      [currentSide]: { ...prev[currentSide], ...changes }
    }));
  };

  const updateCurrentDesignWithHistory = (changes) => {
    saveToHistory({ currentSide, designs });
    updateCurrentDesign(changes);
  };

  const currentDesign = designs[currentSide];
  const currentImages = currentDesign.images;
  const updateImages = (newImages) => updateCurrentDesign({ images: newImages });

  const startDrag = (e, type, id = null) => {
    e.stopPropagation();
    e.preventDefault();
    
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    const bounds = previewRef.current.getBoundingClientRect();
    
    if (!dragState.current.type) {
      saveToHistory({ currentSide, designs });
    }
    
    if (type === 'rotate' && id) {
      const img = currentImages.find(img => img.id === id);
      if (img) {
        const centerX = img.x + img.width / 2;
        const centerY = img.y + img.height / 2;
        const mouseX = clientX - bounds.left;
        const mouseY = clientY - bounds.top;
        const initialAngle = Math.atan2(mouseY - centerY, mouseX - centerX);
        
        dragState.current = {
          type,
          id,
          initialAngle,
          initialRotation: img.rotation,
          offsetX: 0,
          offsetY: 0,
          bottomRightX: 0,
          bottomRightY: 0
        };
      }
    } else if (type === 'resize' && id) {
      const img = currentImages.find(img => img.id === id);
      if (img) {
        const mouseX = clientX - bounds.left;
        const mouseY = clientY - bounds.top;
        dragState.current = {
          type,
          id,
          offsetX: mouseX - (img.x + img.width),
          offsetY: mouseY - (img.y + img.height),
          initialWidth: img.width,
          initialHeight: img.height,
          bottomRightX: img.x + img.width,
          bottomRightY: img.y + img.height
        };
      }
    } else {
      dragState.current = {
        type,
        id,
        offsetX: clientX - bounds.left - (type === 'text' ? currentDesign.textPosition.x : 
          currentImages.find(img => img.id === id)?.x || 0),
        offsetY: clientY - bounds.top - (type === 'text' ? currentDesign.textPosition.y : 
          currentImages.find(img => img.id === id)?.y || 0),
        bottomRightX: 0,
        bottomRightY: 0
      };
    }

    if (type === 'image') {
      setSelectedElement({ type: 'image', id });
      moveImageToFront(id);
    } else if (type === 'text') {
      setSelectedElement({ type: 'text' });
    }
  };

  const updateDrag = useCallback(debounce((e) => {
    if (!dragState.current.type) return;
    
    e.preventDefault();
    
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const bounds = previewRef.current.getBoundingClientRect();
    const mouseX = clientX - bounds.left;
    const mouseY = clientY - bounds.top;

    if (dragState.current.type === 'text') {
      const newPosition = { 
        x: Math.max(0, Math.min(bounds.width, mouseX - dragState.current.offsetX)), 
        y: Math.max(0, Math.min(bounds.height, mouseY - dragState.current.offsetY)) 
      };
      setDesigns(prev => ({
        ...prev,
        [currentSide]: {
          ...prev[currentSide],
          textPosition: newPosition
        }
      }));
    } else if (dragState.current.type === 'image') {
      const updatedImages = currentImages.map((img) =>
        img.id === dragState.current.id ? { 
          ...img, 
          x: Math.max(0, Math.min(bounds.width - img.width, mouseX - dragState.current.offsetX)), 
          y: Math.max(0, Math.min(bounds.height - img.height, mouseY - dragState.current.offsetY)) 
        } : img
      );
      updateImages(updatedImages);
    } else if (dragState.current.type === 'resize') {
      const updatedImages = currentImages.map((img) => {
        if (img.id !== dragState.current.id) return img;
        
        // Calculate new bottom-right corner position
        const newBottomRightX = mouseX - dragState.current.offsetX;
        const newBottomRightY = mouseY - dragState.current.offsetY;
        
        // Calculate new dimensions keeping top-left corner fixed
        let newWidth = Math.max(20, newBottomRightX - img.x);
        let newHeight = Math.max(20, newBottomRightY - img.y);

        if (preserveAspectRatio) {
          const aspectRatio = dragState.current.initialWidth / dragState.current.initialHeight;
          newHeight = newWidth / aspectRatio;
          if (newHeight < 20) {
            newHeight = 20;
            newWidth = newHeight * aspectRatio;
          }
        }

        return {
          ...img,
          width: newWidth,
          height: newHeight,
        };
      });
      updateImages(updatedImages);
    } else if (dragState.current.type === 'rotate') {
      const updatedImages = currentImages.map((img) => {
        if (img.id !== dragState.current.id) return img;
        const centerX = img.x + img.width / 2;
        const centerY = img.y + img.height / 2;
        const currentAngle = Math.atan2(mouseY - centerY, mouseX - centerX);
        let newRotation = dragState.current.initialRotation + 
                         ((currentAngle - dragState.current.initialAngle) * 180 / Math.PI);

        const snapAngles = [0, 45, 90, 135, 180, 225, 270, 315];
        const snapThreshold = 5;
        for (const angle of snapAngles) {
          if (Math.abs(newRotation - angle) < snapThreshold) {
            newRotation = angle;
            break;
          }
        }

        return { ...img, rotation: newRotation };
      });
      updateImages(updatedImages);
    }
  }, 10), [currentImages, currentDesign, preserveAspectRatio]);

  const endDrag = () => {
    dragState.current = { type: null, id: null, offsetX: 0, offsetY: 0, initialWidth: 0, initialHeight: 0, initialRotation: 0, initialAngle: 0, bottomRightX: 0, bottomRightY: 0 };
  };

  const handleUndo = () => {
    const previousState = undo();
    if (previousState) {
      setCurrentSide(previousState.currentSide);
      setDesigns(previousState.designs);
    }
  };

  const handleRedo = () => {
    const nextState = redo();
    if (nextState) {
      setCurrentSide(nextState.currentSide);
      setDesigns(nextState.designs);
    }
  };

  const addImages = async (files) => {
    if (!files || files.length === 0) return;

    const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
    if (imageFiles.length === 0) {
      alert('Please select only image files.');
      return;
    }

    const oversizedFiles = imageFiles.filter(file => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      alert(`Some files are too large. Maximum size is 5MB per file.\nOversized files: ${oversizedFiles.map(f => f.name).join(', ')}`);
      return;
    }

    saveToHistory({ currentSide, designs });
    setIsLoading(true);
    
    try {
      const formData = new FormData();
      imageFiles.forEach(file => {
        formData.append('images', file);
      });

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/customise-img/upload-multiple`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Upload failed' }));
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.files || result.files.length === 0) {
        throw new Error('No files were processed by the server');
      }
      
      const newImages = result.files.map((file, index) => ({
        id: Date.now() + index,
        src: `${process.env.REACT_APP_API_URL}${file.url}`,
        x: 60 + (index * 20),
        y: 100 + (index * 20),
        width: 80,
        height: 80,
        rotation: 0,
        opacity: 1,
        zIndex: currentImages.length + index,
      }));
      
      if (newImages.length > 0) {
        updateImages([...currentImages, ...newImages]);
        console.log(`✅ Successfully uploaded ${newImages.length} image(s)`);
      }
      
    } catch (error) {
      console.error('Upload failed:', error);
      
      if (error.message.includes('Failed to fetch')) {
        alert('Cannot connect to server. Please make sure the backend is running on port 4000.');
      } else if (error.message.includes('Not an image')) {
        alert('Please upload only image files (PNG, JPG, GIF, etc.)');
      } else if (error.message.includes('File too large')) {
        alert('One or more files are too large. Maximum size is 5MB per file.');
      } else {
        alert(`Upload failed: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const deleteImage = (imageId) => {
    saveToHistory({ currentSide, designs });
    const imageToDelete = currentImages.find(img => img.id === imageId);
    
    if (imageToDelete && imageToDelete.src.startsWith('blob:')) {
      URL.revokeObjectURL(imageToDelete.src);
    }
    
    updateImages(currentImages.filter(img => img.id !== imageId));
    setSelectedElement(null);
  };

  const duplicateImage = (imageId) => {
    const originalImage = currentImages.find(img => img.id === imageId);
    if (!originalImage) return;

    saveToHistory({ currentSide, designs });
    const newImage = {
      ...originalImage,
      id: Date.now(),
      x: originalImage.x + 20,
      y: originalImage.y + 20,
      zIndex: currentImages.length,
    };
    updateImages([...currentImages, newImage]);
  };

  const moveImageToFront = (imageId) => {
    const allZIndices = currentImages.map(img => img.zIndex).concat(currentDesign.textZIndex || 100).filter(z => z >= 101);
    const sortedZ = [...new Set(allZIndices)].sort((a, b) => a - b);
    const img = currentImages.find(img => img.id === imageId);
    if (!img) return;
    const currentZ = img.zIndex;
    const idx = sortedZ.indexOf(currentZ);
    let newZ = currentZ;
    if (idx < sortedZ.length - 1) {
      newZ = sortedZ[idx + 1];
      let swappedText = false;
      let swappedImage = false;
      const updatedImages = currentImages.map(im => {
        if (!swappedImage && im.zIndex === newZ) {
          swappedImage = true;
          return { ...im, zIndex: currentZ };
        }
        return im;
      });
      if (currentDesign.textZIndex === newZ) {
        swappedText = true;
        updateCurrentDesign({ textZIndex: currentZ });
      }
      updateImages(updatedImages.map(im => im.id === imageId ? { ...im, zIndex: newZ } : im));
      if (!swappedText) updateCurrentDesign({ textZIndex: currentDesign.textZIndex });
    } else {
      updateImages(currentImages);
    }
  };

  const moveImageToBack = (imageId) => {
    const allZIndices = currentImages.map(img => img.zIndex).concat(currentDesign.textZIndex || 100).filter(z => z >= 101);
    const sortedZ = [...new Set(allZIndices)].sort((a, b) => a - b);
    const img = currentImages.find(img => img.id === imageId);
    if (!img) return;
    const currentZ = img.zIndex;
    const idx = sortedZ.indexOf(currentZ);
    let newZ = currentZ;
    if (idx > 0) {
      newZ = sortedZ[idx - 1];
      let swappedText = false;
      let swappedImage = false;
      const updatedImages = currentImages.map(im => {
        if (!swappedImage && im.zIndex === newZ) {
          swappedImage = true;
          return { ...im, zIndex: currentZ };
        }
        return im;
      });
      if (currentDesign.textZIndex === newZ) {
        swappedText = true;
        updateCurrentDesign({ textZIndex: currentZ });
      }
      updateImages(updatedImages.map(im => im.id === imageId ? { ...im, zIndex: newZ } : im));
      if (!swappedText) updateCurrentDesign({ textZIndex: currentDesign.textZIndex });
    } else {
      updateImages(currentImages);
    }
  };

  const toggleTextVisibility = () => {
    updateCurrentDesign({ textVisible: !currentDesign.textVisible });
  };

  const resetAll = () => {
    saveToHistory({ currentSide, designs });
    setDesigns({
      top: { ...DEFAULT_DESIGN, customText: 'My Skimboard' },
      bottom: { ...DEFAULT_DESIGN, color: '#4ECDC4', customText: 'Bottom Side' }
    });
    setCurrentSide('top');
    setSelectedElement(null);
  };

  const downloadCurrentSide = async () => {
    if (isLoading) return;
    setIsLoading(true);
    
    try {
      const imageData = await generateSkimboardImage(currentDesign, previewRef.current, 3);
      downloadImage(imageData, `skimboard-${currentSide}-side-${Date.now()}.png`);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadBothSides = async () => {
    if (isLoading) return;
    setIsLoading(true);
    
    try {
      const topImage = await generateSkimboardImage(designs.top, previewRef.current, 3);
      downloadImage(topImage, `skimboard-top-side-${Date.now()}.png`);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const bottomImage = await generateSkimboardImage(designs.bottom, previewRef.current, 3);
      downloadImage(bottomImage, `skimboard-bottom-side-${Date.now()}.png`);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const addDesignToOrder = async () => {
    if (isLoading) return;
    setIsLoading(true);
    
    try {
      const topSideImage = await generateSkimboardImage(designs.top, previewRef.current, 2);
      const bottomSideImage = await generateSkimboardImage(designs.bottom, previewRef.current, 2);

      dispatch({ type: 'SET_TOP_IMAGE', payload: topSideImage });
      dispatch({ type: 'SET_BOTTOM_IMAGE', payload: bottomSideImage });
      navigate('/customise');
    } catch (error) {
      console.error('Failed to generate images:', error);
      alert('Failed to generate images. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const applyPresetColor = (color) => {
    saveToHistory({ currentSide, designs });
    updateCurrentDesign({ color });
  };

  const switchSide = (side) => {
    saveToHistory({ currentSide, designs });
    setCurrentSide(side);
    setSelectedElement(null);
  };

  const handleKeyPress = (e) => {
    if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
      e.preventDefault();
      handleUndo();
    } else if ((e.ctrlKey && e.key === 'y') || (e.ctrlKey && e.shiftKey && e.key === 'Z')) {
      e.preventDefault();
      handleRedo();
    } else if (e.key === 'Delete' && selectedElement && selectedElement.type === 'image') {
      deleteImage(selectedElement.id);
    }
  };

  useEffect(() => {
    return () => {
      const allImages = [...designs.top.images, ...designs.bottom.images];
      allImages.forEach(img => {
        if (img.src.startsWith('blob:')) {
          URL.revokeObjectURL(img.src);
        }
      });
    };
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedElement]);

  const presetColors = [
    '#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', 
    '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8',
    '#000000', '#FFFFFF', '#FF0000', '#0000FF'
  ];

  return (
    <>
      <Header />
      <div className="title-section">
        <h1 className="title">Design Your Own Skimboard</h1>
      </div>
      <div
        className="skimboard-container"
        onMouseMove={updateDrag}
        onMouseUp={endDrag}
        onMouseLeave={endDrag}
        onTouchMove={updateDrag}
        onTouchEnd={endDrag}
      >
        <div className="side-selector">
          <button 
            className={`side-button ${currentSide === 'top' ? 'active' : ''}`}
            onClick={() => switchSide('top')}
          >
            Top Side
          </button>
          <button 
            className={`side-button ${currentSide === 'bottom' ? 'active' : ''}`}
            onClick={() => switchSide('bottom')}
          >
            Bottom Side
          </button>
        </div>
        
        <div className="skimboard-customiser">
          <div className="customisation-panel">
            <div className="control-group">
              <h3>Background</h3>
              <label>
                Background Type:
                <select 
                  value={currentDesign.backgroundPattern} 
                  onChange={(e) => updateCurrentDesignWithHistory({ backgroundPattern: e.target.value })}
                >
                  <option value="solid">Solid Color</option>
                  <option value="gradient">Gradient</option>
                </select>
              </label>
              
              <label>
                Background Color:
                <input 
                  type="color" 
                  value={currentDesign.color} 
                  onChange={(e) => updateCurrentDesignWithHistory({ color: e.target.value })} 
                />
              </label>

              {currentDesign.backgroundPattern === 'gradient' && (
                <label>
                  Gradient Contrast: {currentDesign.gradientContrast}%
                  <input
                    type="range"
                    min="5"
                    max="50"
                    value={currentDesign.gradientContrast}
                    onChange={(e) => updateCurrentDesignWithHistory({ gradientContrast: parseInt(e.target.value) })}
                  />
                </label>
              )}

              <div className="preset-colors">
                <span>Quick Colors:</span>
                <div className="color-swatches">
                  {presetColors.map((presetColor, index) => (
                    <button
                      key={index}
                      className="color-swatch"
                      style={{ backgroundColor: presetColor }}
                      onClick={() => applyPresetColor(presetColor)}
                      title={presetColor}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="control-group">
              <h3>Text</h3>
              <label>
                Text Content:
                <textarea 
                  value={currentDesign.customText} 
                  onChange={(e) => updateCurrentDesignWithHistory({ customText: e.target.value })} 
                  maxLength={100} 
                  placeholder="Enter your text"
                  rows={3}
                />
              </label>

              <label>
                Text Color:
                <input 
                  type="color" 
                  value={currentDesign.textColor} 
                  onChange={(e) => updateCurrentDesignWithHistory({ textColor: e.target.value })} 
                />
              </label>

              <label>
                Font Size: {currentDesign.fontSize}px
                <input
                  type="range"
                  min="10"
                  max="60"
                  value={currentDesign.fontSize}
                  onChange={(e) => updateCurrentDesignWithHistory({ fontSize: parseInt(e.target.value) })}
                />
              </label>

              <label>
                Font Family:
                <select value={currentDesign.fontFamily} onChange={(e) => updateCurrentDesignWithHistory({ fontFamily: e.target.value })}>
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

              <label>
                <input 
                  type="checkbox" 
                  checked={currentDesign.enableTextStroke} 
                  onChange={(e) => updateCurrentDesignWithHistory({ enableTextStroke: e.target.checked })}
                  style={{ marginRight: '0.5rem' }}
                />
                Enable Text Stroke/Outline
              </label>

              {currentDesign.enableTextStroke && (
                <label>
                  Stroke Color:
                  <input 
                    type="color" 
                    value={currentDesign.textStrokeColor} 
                    onChange={(e) => updateCurrentDesignWithHistory({ textStrokeColor: e.target.value })} 
                  />
                </label>
              )}
            </div>

            <div className="control-group">
              <h3>Images</h3>
              <label>
                Upload Images:
                <input 
                  ref={fileInputRef}
                  type="file" 
                  accept="image/*" 
                  multiple
                  onChange={(e) => addImages(e.target.files)} 
                  disabled={isLoading}
                />
              </label>
              {isLoading && (
                <div className="upload-status">
                  ⏳ Uploading images...
                </div>
              )}
              
              {selectedElement && selectedElement.type === 'image' && (
                <div className="image-controls">
                  <h4>Selected Image Controls</h4>
                  <label>
                    Opacity: {Math.round((currentImages.find(img => img.id === selectedElement.id)?.opacity || 1) * 100)}%
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={currentImages.find(img => img.id === selectedElement.id)?.opacity || 1}
                      onChange={(e) => {
                        const updatedImages = currentImages.map(img =>
                          img.id === selectedElement.id
                            ? { ...img, opacity: parseFloat(e.target.value) }
                            : img
                        );
                        updateImages(updatedImages);
                      }}
                    />
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={preserveAspectRatio}
                      onChange={(e) => setPreserveAspectRatio(e.target.checked)}
                      style={{ marginRight: '0.5rem' }}
                    />
                    Preserve Aspect Ratio
                  </label>
                  <div className="image-actions">
                    <button onClick={() => duplicateImage(selectedElement.id)}>
                      Duplicate
                    </button>
                  </div>
                </div>
              )}

              {selectedElement && selectedElement.type === 'text' && (
                <div className="text-control-buttons">
                  <button 
                    className="text-hide-btn" 
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      toggleTextVisibility();
                    }}
                    onTouchEnd={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      toggleTextVisibility();
                    }}
                    title={currentDesign.textVisible === false ? "Show Text" : "Hide Text"}
                  >
                    {currentDesign.textVisible === false ? <FaEye /> : <FaEyeSlash />}
                  </button>
                </div>
              )}
            </div>

            <div className="action-buttons">
              <button 
                onClick={handleUndo} 
                disabled={currentIndex <= 0}
                title="Undo (Ctrl+Z)"
              >
                ↶ Undo
              </button>
              <button 
                onClick={handleRedo} 
                disabled={currentIndex >= history.length - 1}
                title="Redo (Ctrl+Y)"
              >
                ↷ Redo
              </button>
              <button onClick={resetAll}>🔄 Reset</button>
              <button 
                onClick={downloadCurrentSide}
                disabled={isLoading}
                className="download-btn"
              >
                {isLoading ? '⏳ Generating...' : `💾 Download ${currentSide.toUpperCase()} Side`}
              </button>
              <button 
                onClick={downloadBothSides}
                disabled={isLoading}
                className="download-btn"
                title="Download Both Sides"
              >
                {isLoading ? '⏳ Generating...' : '📥 Download Both Sides'}
              </button>
              <button 
                onClick={addDesignToOrder}
                disabled={isLoading}
                className="add-to-order-btn"
                title="Send to Order"
              >
                {isLoading ? '⏳ Processing...' : '🎨 Send to order'}
              </button>
            </div>

            <div className="help-text">
              <small>
                💡 Tips: Switch between Top/Bottom sides • Drag elements to move • Use handles to resize/rotate •
                Double click an image to duplicate and move it to the front • Press Delete to remove selected image • Ctrl+Z/Y for undo/redo • Download individual sides or both •
                Use "Send to order" to add your design to your skimboard order
              </small>
            </div>
          </div>
          
          <div className="preview-panel">
            <div className="side-indicator">
              Currently editing: <span className="side-label">{currentSide.toUpperCase()} SIDE</span>
            </div>
            
            {selectedElement && (
              <div className="selection-info">
                {selectedElement.type === 'text' ? 'Text Selected' : 'Image Selected'}
              </div>
            )}
            
            <div
              ref={previewRef} 
              className="skimboard-preview" 
              style={{ 
                background: currentDesign.backgroundPattern === 'gradient' 
                  ? `linear-gradient(135deg, ${currentDesign.color}, ${createGradient(currentDesign.color, -(currentDesign.gradientContrast || 20))})` 
                  : currentDesign.color 
              }}
              onClick={() => setSelectedElement(null)}
              onTouchStart={(e) => {
                if (e.target === e.currentTarget) {
                  setSelectedElement(null);
                }
              }}
            >
              <div
                className={`draggable skimboard-text ${selectedElement?.type === 'text' ? 'selected' : ''}`}
                style={{ 
                  top: currentDesign.textPosition.y, 
                  left: currentDesign.textPosition.x, 
                  fontSize: `${currentDesign.fontSize}px`,
                  fontFamily: currentDesign.fontFamily,
                  color: currentDesign.textColor,
                  transform: 'translate(-50%, -50%)',
                  zIndex: currentDesign.textZIndex || 100,
                  display: currentDesign.textVisible === false ? 'none' : 'block',
                  whiteSpace: 'pre',
                  textAlign: 'center',
                  lineHeight: '1.2',
                  textShadow: currentDesign.enableTextStroke 
                    ? `1px 1px 0 ${currentDesign.textStrokeColor}, -1px -1px 0 ${currentDesign.textStrokeColor}, 1px -1px 0 ${currentDesign.textStrokeColor}, -1px 1px 0 ${currentDesign.textStrokeColor}`
                    : (currentDesign.textColor === '#FFFFFF' ? '2px 2px 4px rgba(0,0,0,0.8)' : '2px 2px 4px rgba(255,255,255,0.8)')
                }}
                onMouseDown={(e) => startDrag(e, 'text')}
                onTouchStart={(e) => startDrag(e, 'text')}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedElement({ type: 'text' });
                }}
              >
                {currentDesign.customText}
                
                {selectedElement?.type === 'text' && (
                  <div className="text-control-buttons">
                    <button 
                      className="text-hide-btn" 
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        toggleTextVisibility();
                      }}
                      onTouchEnd={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        toggleTextVisibility();
                      }}
                      title={currentDesign.textVisible === false ? "Show Text" : "Hide Text"}
                    >
                      {currentDesign.textVisible === false ? <FaEye /> : <FaEyeSlash />}
                    </button>
                  </div>
                )}
              </div>

              {currentImages
                .sort((a, b) => a.zIndex - b.zIndex)
                .map((img) => {
                  return (
                    <div
                      key={img.id}
                      className={`image-wrapper ${selectedElement?.id === img.id ? 'selected' : ''}`}
                      style={{
                        top: img.y,
                        left: img.x,
                        width: img.width,
                        height: img.height,
                        opacity: img.opacity || 1,
                        zIndex: img.zIndex,
                        position: 'absolute',
                        overflow: 'visible',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      onMouseDown={(e) => startDrag(e, 'image', img.id)}
                      onTouchStart={(e) => startDrag(e, 'image', img.id)}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedElement({ type: 'image', id: img.id });
                      }}
                      onDoubleClick={() => duplicateImage(img.id)}
                    >
                      <img
                        src={img.src}
                        alt="Custom upload"
                        className="skimboard-image"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                          transform: `rotate(${img.rotation}deg)`,
                          position: 'absolute',
                          left: '50%',
                          top: '50%',
                          transformOrigin: 'center center',
                          translate: '-50% -50%',
                          pointerEvents: 'none',
                        }}
                        draggable={false}
                      />
                      {selectedElement?.id === img.id && (
                        <>
                          <button
                            className="delete-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              deleteImage(img.id);
                            }}
                            onTouchEnd={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              deleteImage(img.id);
                            }}
                            title="Delete image"
                          >
                            ×
                          </button>
                          <div
                            className="resize-handle"
                            onMouseDown={(e) => startDrag(e, 'resize', img.id)}
                            onTouchStart={(e) => startDrag(e, 'resize', img.id)}
                            title="Resize"
                          />
                          <div
                            className="rotate-handle"
                            onMouseDown={(e) => startDrag(e, 'rotate', img.id)}
                            onTouchStart={(e) => startDrag(e, 'rotate', img.id)}
                            title="Rotate"
                          />
                        </>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}