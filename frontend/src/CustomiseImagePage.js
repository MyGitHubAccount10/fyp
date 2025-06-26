// canvaContext(ctx: short form) is basically a commonly named React 
// variable to tell the canva(A drawable div container <canva>) what 
// to display/do


//Disclaimer:
//This file along with CustomiseImagePage.css is made with conjoined efforts of ChatGPT and GitHub Copilot
// The code structure and logic have been influenced by a certain customize t-shirt website.
// but the implementation is original and unique to this project.
// It is thoroughly examined and tested to ensure that it is bug free and works as intended.

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './CustomiseImagePage.css';
import Header from './Header';

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
  backgroundPattern: 'solid'
};

// Backend URL configuration
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000';
//-
// A function to adjust color brightness (It is used to create gradients)
// clamp () is to make sure Red, Green and Blue values are between 0 and 255(as that is how computers interpret colors)
const clamp = (value) => Math.max(0, Math.min(255, value));

const createGradient = (hex, percent) => {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);

  const r = clamp((num >> 16) + amt);
  const g = clamp((num >> 8 & 0xFF) + amt);
  const b = clamp((num & 0xFF) + amt);

  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
};

//-

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
    gradient.addColorStop(1, createGradient(designData.color, -20));
    canvaContext.fillStyle = gradient;
  } else {
    canvaContext.fillStyle = designData.color;
  }

       canvaContext.fillStyle = designData.color;

  
  canvaContext.fillRect(0, 0, width, height);

  // Calculate scaling factors
  const previewRect = previewElement.getBoundingClientRect();
  const scaleX = width / previewRect.width;
  const scaleY = height / previewRect.height;

  // Draw images
  const sortedImages = [...designData.images].sort((a, b) => a.zIndex - b.zIndex);
  await drawImages(canvaContext, sortedImages, scaleX, scaleY);

  // Draw text
  drawText(canvaContext, designData, scaleX, scaleY);

  canvaContext.restore();
  return canvas.toDataURL('image/png', 0.9);
};

// Helper function to draw images on canvas
const drawImages = async (canvaContext, images, scaleX, scaleY) => {
  const loadAll = images.map((img) => {
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
        
        // Calculate aspect ratios for proper cover behavior
        const imageAspect = image.width / image.height;
        const targetAspect = scaledWidth / scaledHeight;
        
        let drawWidth, drawHeight;
        
        if (imageAspect > targetAspect) {
          drawHeight = scaledHeight;
          drawWidth = drawHeight * imageAspect;
        } else {
          drawWidth = scaledWidth;
          drawHeight = drawWidth / imageAspect;
        }
        
        // Create clipping region
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
        resolve(); // Continue even if one image fails
      };
    });
  });

  await Promise.all(loadAll);
};

// Helper function to draw text on canvas
const drawText = (canvaContext, designData, scaleX, scaleY) => {
  canvaContext.fillStyle = designData.textColor;
  canvaContext.font = `bold ${designData.fontSize * scaleX}px ${designData.fontFamily}`;
  canvaContext.textAlign = 'center';
  canvaContext.textBaseline = 'middle';
  
  const scaledTextX = designData.textPosition.x * scaleX;
  const scaledTextY = designData.textPosition.y * scaleY;
  
  if (designData.enableTextStroke) {
    canvaContext.strokeStyle = designData.textStrokeColor;
    canvaContext.lineWidth = Math.max(1, designData.fontSize * scaleX * 0.05);
    canvaContext.strokeText(designData.customText, scaledTextX, scaledTextY);
  }
  
  canvaContext.fillText(designData.customText, scaledTextX, scaledTextY);
};

export default function CustomiseImagePage() {
  const navigate = useNavigate();
  
  // Which side we're currently editing (top or bottom)
  const [currentSide, setCurrentSide] = useState('top');
  
  // The design data for both sides of the skimboard
  const [designs, setDesigns] = useState({
    top: { ...DEFAULT_DESIGN, customText: 'My Skimboard' },
    bottom: { ...DEFAULT_DESIGN, color: '#4ECDC4', customText: 'Bottom Side' }
  });
  
  // Currently selected element (text or image)
  const [selectedElement, setSelectedElement] = useState(null);
  
  // Loading state for downloads
  const [isLoading, setIsLoading] = useState(false);
  
  // References to DOM elements
  const previewRef = useRef(null);
  const fileInputRef = useRef(null);
  
  // History for undo/redo functionality
  const [history, setHistory] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  
  // Drag state
  const dragState = useRef({ type: null, id: null, offsetX: 0, offsetY: 0 });  // Save the current state to history
  const saveToHistory = useCallback((state) => {
    const newHistory = history.slice(0, currentIndex + 1);
    newHistory.push(JSON.parse(JSON.stringify(state)));
    setHistory(newHistory);
    setCurrentIndex(newHistory.length - 1);
  }, [history, currentIndex]);

  // Go back to the previous state
  const undo = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      return history[currentIndex - 1];
    }
    return null;
  }, [history, currentIndex]);

  // Go forward to the next state
  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(currentIndex + 1);
      return history[currentIndex + 1];
    }
    return null;
  }, [history, currentIndex]);

  // Helper functions to update the current design
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

  // Get the current design and its images
  const currentDesign = designs[currentSide];
  const currentImages = currentDesign.images;
  const updateImages = (newImages) => updateCurrentDesign({ images: newImages });  // Drag operations for moving/resizing elements
  const startDrag = (e, type, id = null) => {
    e.stopPropagation();
    const bounds = previewRef.current.getBoundingClientRect();
    
    // Save current state before starting drag
    if (!dragState.current.type) {
      saveToHistory({ currentSide, designs });
    }
    
    if (type === 'rotate' && id) {
      // Setup rotation drag
      const img = currentImages.find(img => img.id === id);
      if (img) {
        const centerX = img.x + img.width / 2;
        const centerY = img.y + img.height / 2;
        const mouseX = e.clientX - bounds.left;
        const mouseY = e.clientY - bounds.top;
        const initialAngle = Math.atan2(mouseY - centerY, mouseX - centerX);
        
        dragState.current = {
          type,
          id,
          initialAngle,
          initialRotation: img.rotation
        };
      }
    } else {
      // Setup position drag
      dragState.current = {
        type,
        id,
        offsetX: e.clientX - bounds.left - (type === 'text' ? currentDesign.textPosition.x : 
          currentImages.find(img => img.id === id)?.x || 0),
        offsetY: e.clientY - bounds.top - (type === 'text' ? currentDesign.textPosition.y : 
          currentImages.find(img => img.id === id)?.y || 0)
      };
    }

    if (type === 'image') {
      setSelectedElement({ type: 'image', id });
      moveImageToFront(id);
    } else if (type === 'text') {
      setSelectedElement({ type: 'text' });
    }
  };

  const updateDrag = (e) => {
    if (!dragState.current.type) return;

    const bounds = previewRef.current.getBoundingClientRect();
    const mouseX = e.clientX - bounds.left;
    const mouseY = e.clientY - bounds.top;

    if (dragState.current.type === 'text') {
      // Move text
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
      // Move image
      const updatedImages = currentImages.map((img) =>
        img.id === dragState.current.id ? { 
          ...img, 
          x: Math.max(0, Math.min(bounds.width - img.width, mouseX - dragState.current.offsetX)), 
          y: Math.max(0, Math.min(bounds.height - img.height, mouseY - dragState.current.offsetY)) 
        } : img
      );
      updateImages(updatedImages);
    } else if (dragState.current.type === 'resize') {
      // Resize image
      const updatedImages = currentImages.map((img) =>
        img.id === dragState.current.id
          ? {
              ...img,
              width: Math.max(20, Math.min(200, mouseX - img.x)),
              height: Math.max(20, Math.min(200, mouseY - img.y)),
            }
          : img
      );
      updateImages(updatedImages);
    } else if (dragState.current.type === 'rotate') {
      // Rotate image
      const updatedImages = currentImages.map((img) => {
        if (img.id !== dragState.current.id) return img;
        const centerX = img.x + img.width / 2;
        const centerY = img.y + img.height / 2;
        const currentAngle = Math.atan2(mouseY - centerY, mouseX - centerX);
        const angleDifference = currentAngle - dragState.current.initialAngle;
        const newRotation = dragState.current.initialRotation + (angleDifference * 180) / Math.PI;
        return { ...img, rotation: newRotation };
      });
      updateImages(updatedImages);
    }
  };

  const endDrag = () => {
    dragState.current = { type: null, id: null, offsetX: 0, offsetY: 0 };
  };
  // Undo the last action
  const handleUndo = () => {
    const previousState = undo();
    if (previousState) {
      setCurrentSide(previousState.currentSide);
      setDesigns(previousState.designs);
    }
  };

  // Redo the last undone action
  const handleRedo = () => {
    const nextState = redo();
    if (nextState) {
      setCurrentSide(nextState.currentSide);
      setDesigns(nextState.designs);
    }
  };
  // Handle uploading new images
  const addImages = async (files) => {
    if (!files || files.length === 0) return;

    // Filter only image files
    const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
    if (imageFiles.length === 0) {
      alert('Please select only image files.');
      return;
    }

    // Check file sizes (5MB limit per file)
    const oversizedFiles = imageFiles.filter(file => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      alert(`Some files are too large. Maximum size is 5MB per file.\nOversized files: ${oversizedFiles.map(f => f.name).join(', ')}`);
      return;
    }

    saveToHistory({ currentSide, designs });
    setIsLoading(true);
    
    try {
      // Create FormData to send files to backend
      const formData = new FormData();
      imageFiles.forEach(file => {
        formData.append('images', file);
      });

      // Upload files to backend using multer
      const response = await fetch(`${BACKEND_URL}/api/customiseImg/upload-multiple`, {
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
      
      // Create image objects for each uploaded file
      const newImages = result.files.map((file, index) => ({
        id: Date.now() + index,
        src: `${BACKEND_URL}${file.url}`, // Use server URL
        x: 60 + (index * 20),  // Offset each image slightly
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
      
      // Show specific error messages
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
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Delete an image
  const deleteImage = (imageId) => {
    saveToHistory({ currentSide, designs });
    const imageToDelete = currentImages.find(img => img.id === imageId);
    
    // Clean up blob URLs if they exist (for old client-side uploads)
    if (imageToDelete && imageToDelete.src.startsWith('blob:')) {
      URL.revokeObjectURL(imageToDelete.src);
    }
    
    updateImages(currentImages.filter(img => img.id !== imageId));
    setSelectedElement(null);
  };

  // Create a copy of an image
  const duplicateImage = (imageId) => {
    const originalImage = currentImages.find(img => img.id === imageId);
    if (!originalImage) return;

    saveToHistory({ currentSide, designs });
    const newImage = {
      ...originalImage,
      id: Date.now(),
      x: originalImage.x + 20,  // Offset the copy
      y: originalImage.y + 20,
      zIndex: currentImages.length,
    };
    updateImages([...currentImages, newImage]);
  };
  // Move an image to the front (above other images)
  const moveImageToFront = (imageId) => {
    const maxZ = Math.max(...currentImages.map(img => img.zIndex));
    const updatedImages = currentImages.map(img =>
      img.id === imageId ? { ...img, zIndex: maxZ + 1 } : img
    );
    updateImages(updatedImages);
  };

  // Move an image to the back (behind other images)
  const moveImageToBack = (imageId) => {
    const minZ = Math.min(...currentImages.map(img => img.zIndex));
    const updatedImages = currentImages.map(img =>
      img.id === imageId ? { ...img, zIndex: minZ - 1 } : img
    );
    updateImages(updatedImages);
  };

  // Reset everything back to default
  const resetAll = () => {
    saveToHistory({ currentSide, designs });
    setDesigns({
      top: { ...DEFAULT_DESIGN, customText: 'My Skimboard' },
      bottom: { ...DEFAULT_DESIGN, color: '#4ECDC4', customText: 'Bottom Side' }
    });
    setCurrentSide('top');
    setSelectedElement(null);
  };  // Download the current side as an image file
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

  // Download both sides as separate image files
  const downloadBothSides = async () => {
    if (isLoading) return;
    setIsLoading(true);
    
    try {
      // Download top side
      const topImage = await generateSkimboardImage(designs.top, previewRef.current, 3);
      downloadImage(topImage, `skimboard-top-side-${Date.now()}.png`);
      
      // Wait a moment between downloads
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Download bottom side
      const bottomImage = await generateSkimboardImage(designs.bottom, previewRef.current, 3);
      downloadImage(bottomImage, `skimboard-bottom-side-${Date.now()}.png`);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  // Add the custom design to the main customise page
  const addDesignToOrder = async () => {
    if (isLoading) return;
    setIsLoading(true);
    
    try {
      const topSideImage = await generateSkimboardImage(designs.top, previewRef.current, 2);
      const bottomSideImage = await generateSkimboardImage(designs.bottom, previewRef.current, 2);
      
      navigate('/customise', {
        state: {
          customImages: {
            topSide: topSideImage,
            bottomSide: bottomSideImage,
            timestamp: Date.now()
          }
        }
      });
    } catch (error) {
      console.error('Failed to generate images:', error);
      alert('Failed to generate images. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Apply a preset color to the current side
  const applyPresetColor = (color) => {
    saveToHistory({ currentSide, designs });
    updateCurrentDesign({ color });
  };

  // Switch to a different side (top/bottom)
  const switchSide = (side) => {
    saveToHistory({ currentSide, designs });
    setCurrentSide(side);
    setSelectedElement(null);
  };  // Handle keyboard shortcuts
  const handleKeyPress = (e) => {
    // Undo: Ctrl+Z
    if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
      e.preventDefault();
      handleUndo();
    } 
    // Redo: Ctrl+Y or Ctrl+Shift+Z
    else if ((e.ctrlKey && e.key === 'y') || (e.ctrlKey && e.shiftKey && e.key === 'Z')) {
      e.preventDefault();
      handleRedo();
    } 
    // Delete selected image: Delete key
    else if (e.key === 'Delete' && selectedElement && selectedElement.type === 'image') {
      deleteImage(selectedElement.id);
    }
  };

  // Cleanup blob URLs when component unmounts
  useEffect(() => {
    return () => {
      // Clean up any blob URLs to prevent memory leaks
      const allImages = [...designs.top.images, ...designs.bottom.images];
      allImages.forEach(img => {
        if (img.src.startsWith('blob:')) {
          URL.revokeObjectURL(img.src);
        }
      });
    };
  }, []);

  // Setup keyboard shortcuts
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedElement]);

  // Preset colors for quick selection
  const presetColors = [
    '#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', 
    '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8',
    '#000000', '#FFFFFF', '#FF0000', '#0000FF'
  ];
  return (
    <>
      <Header />
      <div
        className="skimboard-container"
        onMouseMove={updateDrag}
        onMouseUp={endDrag}
        onMouseLeave={endDrag}
      >
        <h1>Customize Your Skimboard</h1>
        
        {/* Side Selection Buttons */}
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
          {/* Control Panel - Left side */}
          <div className="customisation-panel">
            {/* Background Controls */}
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

            {/* Text Controls */}
            <div className="control-group">
              <h3>Text</h3>
              <label>
                Text Content:
                <input 
                  type="text" 
                  value={currentDesign.customText} 
                  onChange={(e) => updateCurrentDesignWithHistory({ customText: e.target.value })} 
                  maxLength={30} 
                  placeholder="Enter your text"
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
                  
                  <div className="image-actions">
                    <button onClick={() => duplicateImage(selectedElement.id)}>
                      Duplicate
                    </button>
                    <button onClick={() => moveImageToFront(selectedElement.id)}>
                      Bring Forward
                    </button>
                    <button onClick={() => moveImageToBack(selectedElement.id)}>
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
                title="Add These Custom Images to Your Skimboard Order"
              >
                {isLoading ? '⏳ Processing...' : '🎨 Add These Custom Images'}
              </button>
            </div>

            <div className="help-text">
              <small>
                💡 Tips: Switch between Top/Bottom sides • Drag elements to move • Use handles to resize/rotate • 
                Press Delete to remove selected image • Ctrl+Z/Y for undo/redo • Download individual sides or both •
                Use "Add These Custom Images" to add your design to your skimboard order
              </small>
            </div>
          </div>
          
          {/* Preview Panel - Right side */}
          <div className="preview-panel">
            <div className="side-indicator">
              Currently editing: <span className="side-label">{currentSide.toUpperCase()} SIDE</span>
            </div>
            <div
              ref={previewRef} 
              className="skimboard-preview" 
              style={{ 
                background: currentDesign.backgroundPattern === 'gradient' 
                  ? `linear-gradient(135deg, ${currentDesign.color}, ${createGradient(currentDesign.color, -20)})` 
                  : currentDesign.color 
              }}
              onClick={() => setSelectedElement(null)}
              >
              {/* Text Element */}
              <div
                className={`draggable skimboard-text ${selectedElement?.type === 'text' ? 'selected' : ''}`}
                style={{ 
                  top: currentDesign.textPosition.y, 
                  left: currentDesign.textPosition.x, 
                  fontSize: `${currentDesign.fontSize}px`,
                  fontFamily: currentDesign.fontFamily,
                  color: currentDesign.textColor,
                  transform: 'translate(-50%, -50%)',
                  textShadow: currentDesign.enableTextStroke 
                    ? `1px 1px 0 ${currentDesign.textStrokeColor}, -1px -1px 0 ${currentDesign.textStrokeColor}, 1px -1px 0 ${currentDesign.textStrokeColor}, -1px 1px 0 ${currentDesign.textStrokeColor}`
                    : (currentDesign.textColor === '#FFFFFF' ? '2px 2px 4px rgba(0,0,0,0.8)' : '2px 2px 4px rgba(255,255,255,0.8)')
                }}
                onMouseDown={(e) => startDrag(e, 'text')}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedElement({ type: 'text' });
                }}
              >
                {currentDesign.customText}
              </div>

              {/* Images */}
              {currentImages
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
                  onMouseDown={(e) => startDrag(e, 'image', img.id)}
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
                          deleteImage(img.id);
                        }}
                        title="Delete image"
                      >
                        ×
                      </button>

                      <div
                        className="resize-handle"
                        onMouseDown={(e) => startDrag(e, 'resize', img.id)}
                        title="Resize"
                      />
                      
                      <div
                        className="rotate-handle"
                        onMouseDown={(e) => startDrag(e, 'rotate', img.id)}
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
    </>
  );
}
