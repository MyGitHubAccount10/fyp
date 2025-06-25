import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './CustomiseImagePage.css';

export default function CustomiseImagePage() {
  const navigate = useNavigate();
  
  // Current side being edited
  const [currentSide, setCurrentSide] = useState('top');
  
  // Design data for both sides
  const [sideData, setSideData] = useState({
    top: {
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
    },
    bottom: {
      color: '#4ECDC4',
      customText: 'Bottom Side',
      images: [],
      textPosition: { x: 125, y: 350 },
      fontSize: 20,
      fontFamily: 'Arial',
      textColor: '#FFFFFF',
      textStrokeColor: '#000000',
      enableTextStroke: false,
      backgroundPattern: 'solid'
    }
  });

  // Current side shortcuts for easier access
  const currentData = sideData[currentSide];
  const color = currentData.color;
  const customText = currentData.customText;
  const images = currentData.images;
  const textPosition = currentData.textPosition;
  const fontSize = currentData.fontSize;
  const fontFamily = currentData.fontFamily;
  const textColor = currentData.textColor;
  const textStrokeColor = currentData.textStrokeColor;
  const enableTextStroke = currentData.enableTextStroke;
  const backgroundPattern = currentData.backgroundPattern;

  const [isLoading, setIsLoading] = useState(false);  const [selectedElement, setSelectedElement] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Helper function to update current side data
  const updateCurrentSide = (updates) => {
    setSideData(prev => ({
      ...prev,
      [currentSide]: {
        ...prev[currentSide],
        ...updates
      }
    }));
  };

  // Helper functions for easier state updates
  const setColor = (value) => updateCurrentSide({ color: value });
  const setCustomText = (value) => updateCurrentSide({ customText: value });
  const setImages = (value) => updateCurrentSide({ images: value });
  const setTextPosition = (value) => updateCurrentSide({ textPosition: value });
  const setFontSize = (value) => updateCurrentSide({ fontSize: value });
  const setFontFamily = (value) => updateCurrentSide({ fontFamily: value });
  const setTextColor = (value) => updateCurrentSide({ textColor: value });
  const setTextStrokeColor = (value) => updateCurrentSide({ textStrokeColor: value });
  const setEnableTextStroke = (value) => updateCurrentSide({ enableTextStroke: value });
  const setBackgroundPattern = (value) => updateCurrentSide({ backgroundPattern: value });

  const previewRef = useRef(null);
  const dragging = useRef({ id: null, type: null, offsetX: 0, offsetY: 0 });
  const fileInputRef = useRef(null);
  // Save state to history for undo/redo functionality
  const saveToHistory = useCallback(() => {
    const currentState = {
      currentSide,
      sideData: JSON.parse(JSON.stringify(sideData))
    };
    
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(currentState);    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [currentSide, sideData, history, historyIndex]);  // Undo functionality
  const handleUndo = () => {
    if (historyIndex > 0) {
      const previousState = history[historyIndex - 1];
      setCurrentSide(previousState.currentSide);
      setSideData(previousState.sideData);
      setHistoryIndex(historyIndex - 1);
    }
  };
  // Redo functionality
  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      setCurrentSide(nextState.currentSide);
      setSideData(nextState.sideData);
      setHistoryIndex(historyIndex + 1);
    }
  };  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    saveToHistory();
    
    const newImages = [];
    files.forEach((file, index) => {
      if (file && file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        newImages.push({
          id: Date.now() + index,
          src: url,
          x: 60 + (index * 20),
          y: 100 + (index * 20),
          width: 80,
          height: 80,
          rotation: 0,
          opacity: 1,
          zIndex: images.length + index,
        });
      }
    });
    
    if (newImages.length > 0) {
      setImages([...images, ...newImages]);
    }
    
    // Clear the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  const handleDeleteImage = (id) => {
    saveToHistory();
    const updatedImages = images.filter((img) => img.id !== id);
    setImages(updatedImages);
    setSelectedElement(null);
  };
  const handleDuplicateImage = (id) => {
    saveToHistory();
    const imageToDuplicate = images.find(img => img.id === id);
    if (imageToDuplicate) {
      const newImage = {
        ...imageToDuplicate,
        id: Date.now(),
        x: imageToDuplicate.x + 20,
        y: imageToDuplicate.y + 20,
        zIndex: images.length,
      };
      setImages([...images, newImage]);
    }
  };
  const bringToFront = (id) => {
    const maxZ = Math.max(...images.map(img => img.zIndex));
    const updatedImages = images.map((img) =>
      img.id === id ? { ...img, zIndex: maxZ + 1 } : img
    );
    setImages(updatedImages);
  };
  const sendToBack = (id) => {
    const minZ = Math.min(...images.map(img => img.zIndex));
    const updatedImages = images.map((img) =>
      img.id === id ? { ...img, zIndex: minZ - 1 } : img
    );
    setImages(updatedImages);
  };const handleReset = () => {
    saveToHistory();
    setSideData({
      top: {
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
      },
      bottom: {
        color: '#4ECDC4',
        customText: 'Bottom Side',
        images: [],
        textPosition: { x: 125, y: 350 },
        fontSize: 20,
        fontFamily: 'Arial',
        textColor: '#FFFFFF',
        textStrokeColor: '#000000',
        enableTextStroke: false,
        backgroundPattern: 'solid'
      }
    });
    setCurrentSide('top');
    setSelectedElement(null);
  };const handleDownload = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    const preview = previewRef.current;
    const canvas = document.createElement('canvas');
    const scale = 3; // Higher resolution
    
    // Use the actual skimboard dimensions from CSS (280x450)
    const width = 280;
    const height = 450;

    canvas.width = width * scale;
    canvas.height = height * scale;

    const ctx = canvas.getContext('2d');
    ctx.scale(scale, scale);

    // Create clipping path for skimboard shape (oval)
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(width / 2, height / 2, width / 2, height / 2, 0, 0, 2 * Math.PI);
    ctx.clip();

    // Draw background with pattern/gradient support
    if (backgroundPattern === 'gradient') {
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, color);
      gradient.addColorStop(1, adjustBrightness(color, -20));
      ctx.fillStyle = gradient;
    } else {
      ctx.fillStyle = color;
    }
    
    // Fill the entire canvas area
    ctx.fillRect(0, 0, width, height);

    // Calculate scaling factors from preview to actual dimensions
    const previewRect = preview.getBoundingClientRect();
    const scaleX = width / previewRect.width;
    const scaleY = height / previewRect.height;

    // Sort images by zIndex for proper layering
    const sortedImages = [...images].sort((a, b) => a.zIndex - b.zIndex);    // Load and draw all images
    const loadAll = sortedImages.map((img) => {
      return new Promise((resolve) => {
        const image = new Image();
        image.crossOrigin = 'anonymous';
        image.src = img.src;
        image.onload = () => {
          ctx.save();
          ctx.globalAlpha = img.opacity || 1;
          
          // Scale positions and dimensions to match canvas
          const scaledX = img.x * scaleX;
          const scaledY = img.y * scaleY;
          const scaledWidth = img.width * scaleX;
          const scaledHeight = img.height * scaleY;
          
          ctx.translate(scaledX + scaledWidth / 2, scaledY + scaledHeight / 2);
          ctx.rotate((img.rotation * Math.PI) / 180);
            // Calculate aspect ratios for proper cover behavior
          const imageAspect = image.width / image.height;
          const targetAspect = scaledWidth / scaledHeight;
          
          let drawWidth, drawHeight;
          
          if (imageAspect > targetAspect) {
            // Image is wider - scale to height and crop width (center the crop)
            drawHeight = scaledHeight;
            drawWidth = drawHeight * imageAspect;
          } else {
            // Image is taller - scale to width and crop height (center the crop)
            drawWidth = scaledWidth;
            drawHeight = drawWidth / imageAspect;
          }
          
          // Create clipping region for the image area
          ctx.beginPath();
          ctx.rect(-scaledWidth / 2, -scaledHeight / 2, scaledWidth, scaledHeight);
          ctx.clip();
          
          // Draw the image centered (no offset needed - centering is automatic)
          ctx.drawImage(
            image,
            -drawWidth / 2,
            -drawHeight / 2,
            drawWidth,
            drawHeight
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
      ctx.font = `bold ${fontSize * scaleX}px ${fontFamily}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
        // Scale text position
      const scaledTextX = textPosition.x * scaleX;
      const scaledTextY = textPosition.y * scaleY;
      
      // Add text stroke if enabled
      if (enableTextStroke) {
        ctx.strokeStyle = textStrokeColor;
        ctx.lineWidth = Math.max(1, fontSize * scaleX * 0.05); // Proportional stroke width
        ctx.strokeText(customText, scaledTextX, scaledTextY);
      }
      
      ctx.fillText(customText, scaledTextX, scaledTextY);

      ctx.restore(); // Restore from clipping

      const link = document.createElement('a');
      link.download = `skimboard-${currentSide}-side-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadBothSides = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      // Download top side
      await downloadSide('top', sideData.top);
      // Wait a moment to avoid browser issues with multiple downloads
      await new Promise(resolve => setTimeout(resolve, 500));
      // Download bottom side
      await downloadSide('bottom', sideData.bottom);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadSide = async (side, data) => {
    const canvas = document.createElement('canvas');
    const scale = 3; // Higher resolution
    
    // Use the actual skimboard dimensions from CSS (280x450)
    const width = 280;
    const height = 450;

    canvas.width = width * scale;
    canvas.height = height * scale;

    const ctx = canvas.getContext('2d');
    ctx.scale(scale, scale);

    // Create clipping path for skimboard shape (oval)
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(width / 2, height / 2, width / 2, height / 2, 0, 0, 2 * Math.PI);
    ctx.clip();

    // Draw background with pattern/gradient support
    if (data.backgroundPattern === 'gradient') {
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, data.color);
      gradient.addColorStop(1, adjustBrightness(data.color, -20));
      ctx.fillStyle = gradient;
    } else {
      ctx.fillStyle = data.color;
    }
    
    // Fill the entire canvas area
    ctx.fillRect(0, 0, width, height);

    // Calculate scaling factors from preview to actual dimensions
    const previewRect = previewRef.current.getBoundingClientRect();
    const scaleX = width / previewRect.width;
    const scaleY = height / previewRect.height;

    // Sort images by zIndex for proper layering
    const sortedImages = [...data.images].sort((a, b) => a.zIndex - b.zIndex);

    // Load and draw all images
    const loadAll = sortedImages.map((img) => {
      return new Promise((resolve) => {
        const image = new Image();
        image.crossOrigin = 'anonymous';
        image.src = img.src;
        image.onload = () => {
          ctx.save();
          ctx.globalAlpha = img.opacity || 1;
          
          // Scale positions and dimensions to match canvas
          const scaledX = img.x * scaleX;
          const scaledY = img.y * scaleY;
          const scaledWidth = img.width * scaleX;
          const scaledHeight = img.height * scaleY;
          
          ctx.translate(scaledX + scaledWidth / 2, scaledY + scaledHeight / 2);
          ctx.rotate((img.rotation * Math.PI) / 180);
          
          // Calculate aspect ratios for proper cover behavior
          const imageAspect = image.width / image.height;
          const targetAspect = scaledWidth / scaledHeight;
          
          let drawWidth, drawHeight;
          
          if (imageAspect > targetAspect) {
            // Image is wider - scale to height and crop width (center the crop)
            drawHeight = scaledHeight;
            drawWidth = drawHeight * imageAspect;
          } else {
            // Image is taller - scale to width and crop height (center the crop)
            drawWidth = scaledWidth;
            drawHeight = drawWidth / imageAspect;
          }
          
          // Create clipping region for the image area
          ctx.beginPath();
          ctx.rect(-scaledWidth / 2, -scaledHeight / 2, scaledWidth, scaledHeight);
          ctx.clip();
          
          // Draw the image centered (no offset needed - centering is automatic)
          ctx.drawImage(
            image,
            -drawWidth / 2,
            -drawHeight / 2,
            drawWidth,
            drawHeight
          );
          
          ctx.restore();
          resolve();
        };
        image.onerror = () => resolve(); // Continue even if image fails to load
      });
    });

    await Promise.all(loadAll);
    
    // Draw text with better styling
    ctx.fillStyle = data.textColor;
    ctx.font = `bold ${data.fontSize * scaleX}px ${data.fontFamily}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Scale text position
    const scaledTextX = data.textPosition.x * scaleX;
    const scaledTextY = data.textPosition.y * scaleY;
    
    // Add text stroke if enabled
    if (data.enableTextStroke) {
      ctx.strokeStyle = data.textStrokeColor;
      ctx.lineWidth = Math.max(1, data.fontSize * scaleX * 0.05); // Proportional stroke width
      ctx.strokeText(data.customText, scaledTextX, scaledTextY);
    }
    
    ctx.fillText(data.customText, scaledTextX, scaledTextY);

    ctx.restore(); // Restore from clipping

    const link = document.createElement('a');
    link.download = `skimboard-${side}-side-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();
  };

  const handleAddToCustomise = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      // Generate both sides as data URLs
      const topSideImage = await generateSideImage('top', sideData.top);
      const bottomSideImage = await generateSideImage('bottom', sideData.bottom);
      
      // Navigate back to CustomisePage with the images
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

  const generateSideImage = async (side, data) => {
    const canvas = document.createElement('canvas');
    const scale = 2; // Good resolution for preview
    
    // Use the actual skimboard dimensions from CSS (280x450)
    const width = 280;
    const height = 450;

    canvas.width = width * scale;
    canvas.height = height * scale;

    const ctx = canvas.getContext('2d');
    ctx.scale(scale, scale);

    // Create clipping path for skimboard shape (oval)
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(width / 2, height / 2, width / 2, height / 2, 0, 0, 2 * Math.PI);
    ctx.clip();

    // Draw background with pattern/gradient support
    if (data.backgroundPattern === 'gradient') {
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, data.color);
      gradient.addColorStop(1, adjustBrightness(data.color, -20));
      ctx.fillStyle = gradient;
    } else {
      ctx.fillStyle = data.color;
    }
    
    // Fill the entire canvas area
    ctx.fillRect(0, 0, width, height);

    // Calculate scaling factors from preview to actual dimensions
    const previewRect = previewRef.current.getBoundingClientRect();
    const scaleX = width / previewRect.width;
    const scaleY = height / previewRect.height;

    // Sort images by zIndex for proper layering
    const sortedImages = [...data.images].sort((a, b) => a.zIndex - b.zIndex);

    // Load and draw all images
    const loadAll = sortedImages.map((img) => {
      return new Promise((resolve) => {
        const image = new Image();
        image.crossOrigin = 'anonymous';
        image.src = img.src;
        image.onload = () => {
          ctx.save();
          ctx.globalAlpha = img.opacity || 1;
          
          // Scale positions and dimensions to match canvas
          const scaledX = img.x * scaleX;
          const scaledY = img.y * scaleY;
          const scaledWidth = img.width * scaleX;
          const scaledHeight = img.height * scaleY;
          
          ctx.translate(scaledX + scaledWidth / 2, scaledY + scaledHeight / 2);
          ctx.rotate((img.rotation * Math.PI) / 180);
          
          // Calculate aspect ratios for proper cover behavior
          const imageAspect = image.width / image.height;
          const targetAspect = scaledWidth / scaledHeight;
          
          let drawWidth, drawHeight;
          
          if (imageAspect > targetAspect) {
            // Image is wider - scale to height and crop width (center the crop)
            drawHeight = scaledHeight;
            drawWidth = drawHeight * imageAspect;
          } else {
            // Image is taller - scale to width and crop height (center the crop)
            drawWidth = scaledWidth;
            drawHeight = drawWidth / imageAspect;
          }
          
          // Create clipping region for the image area
          ctx.beginPath();
          ctx.rect(-scaledWidth / 2, -scaledHeight / 2, scaledWidth, scaledHeight);
          ctx.clip();
          
          // Draw the image centered
          ctx.drawImage(
            image,
            -drawWidth / 2,
            -drawHeight / 2,
            drawWidth,
            drawHeight
          );
          
          ctx.restore();
          resolve();
        };
        image.onerror = () => resolve(); // Continue even if image fails to load
      });
    });

    await Promise.all(loadAll);
    
    // Draw text with better styling
    ctx.fillStyle = data.textColor;
    ctx.font = `bold ${data.fontSize * scaleX}px ${data.fontFamily}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Scale text position
    const scaledTextX = data.textPosition.x * scaleX;
    const scaledTextY = data.textPosition.y * scaleY;
    
    // Add text stroke if enabled
    if (data.enableTextStroke) {
      ctx.strokeStyle = data.textStrokeColor;
      ctx.lineWidth = Math.max(1, data.fontSize * scaleX * 0.05);
      ctx.strokeText(data.customText, scaledTextX, scaledTextY);
    }
    
    ctx.fillText(data.customText, scaledTextX, scaledTextY);

    ctx.restore(); // Restore from clipping

    return canvas.toDataURL('image/png', 0.9);
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
      });    } else if (dragging.current.type === 'image') {
      const bounds = previewRef.current.getBoundingClientRect();
      const updatedImages = images.map((img) =>
        img.id === dragging.current.id ? { 
          ...img, 
          x: Math.max(0, Math.min(bounds.width - img.width, x - dragging.current.offsetX)), 
          y: Math.max(0, Math.min(bounds.height - img.height, y - dragging.current.offsetY)) 
        } : img
      );
      setImages(updatedImages);
    } else if (dragging.current.type === 'resize') {
      const updatedImages = images.map((img) =>
        img.id === dragging.current.id
          ? {
              ...img,
              width: Math.max(20, Math.min(200, x - img.x)),
              height: Math.max(20, Math.min(200, y - img.y)),
            }
          : img
      );
      setImages(updatedImages);
    } else if (dragging.current.type === 'rotate') {
      const updatedImages = images.map((img) => {
        if (img.id !== dragging.current.id) return img;
        const centerX = img.x + img.width / 2;
        const centerY = img.y + img.height / 2;
        const currentAngle = Math.atan2(y - centerY, x - centerX);
        const angleDifference = currentAngle - dragging.current.initialAngle;
        const newRotation = dragging.current.initialRotation + (angleDifference * 180) / Math.PI;
        return { ...img, rotation: newRotation };
      });
      setImages(updatedImages);
    }
  };  const handleMouseUp = () => {
    // Keep the selected element when finishing drag operations
    // Only reset the dragging state, not the selection
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
    >      <h1>Customize Your Skimboard</h1>
      
      {/* Side Selection */}
      <div className="side-selector">
        <button 
          className={`side-button ${currentSide === 'top' ? 'active' : ''}`}
          onClick={() => {
            saveToHistory();
            setCurrentSide('top');
            setSelectedElement(null);
          }}
        >
          Top Side
        </button>
        <button 
          className={`side-button ${currentSide === 'bottom' ? 'active' : ''}`}
          onClick={() => {
            saveToHistory();
            setCurrentSide('bottom');
            setSelectedElement(null);
          }}
        >
          Bottom Side
        </button>
      </div>
      
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
            </label>            <label>
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

            <label>
              <input 
                type="checkbox" 
                checked={enableTextStroke} 
                onChange={(e) => setEnableTextStroke(e.target.checked)}
                style={{ marginRight: '0.5rem' }}
              />
              Enable Text Stroke/Outline
            </label>

            {enableTextStroke && (
              <label>
                Stroke Color:
                <input 
                  type="color" 
                  value={textStrokeColor} 
                  onChange={(e) => setTextStrokeColor(e.target.value)} 
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
                    value={images.find(img => img.id === selectedElement.id)?.opacity || 1}                    onChange={(e) => {
                      const updatedImages = images.map(img =>
                        img.id === selectedElement.id
                          ? { ...img, opacity: parseFloat(e.target.value) }
                          : img
                      );
                      setImages(updatedImages);
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
              {isLoading ? '⏳ Generating...' : `💾 Download ${currentSide.toUpperCase()} Side`}
            </button>            <button 
              onClick={handleDownloadBothSides}
              disabled={isLoading}
              className="download-btn"
              title="Download Both Sides"
            >
              {isLoading ? '⏳ Generating...' : '📥 Download Both Sides'}
            </button>            <button 
              onClick={handleAddToCustomise}
              disabled={isLoading}
              className="add-to-order-btn"
              title="Add These Custom Images to Your Skimboard Order"
            >
              {isLoading ? '⏳ Processing...' : '🎨 Add These Custom Images'}
            </button>
          </div>          <div className="help-text">
            <small>
              💡 Tips: Switch between Top/Bottom sides • Drag elements to move • Use handles to resize/rotate • 
              Press Delete to remove selected image • Ctrl+Z/Y for undo/redo • Download individual sides or both •
              Use "Add These Custom Images" to add your design to your skimboard order
            </small>
          </div>
        </div>        <div className="preview-panel">
          <div className="side-indicator">
            Currently editing: <span className="side-label">{currentSide.toUpperCase()} SIDE</span>
          </div>
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
            {/* Text Element */}            <div
              className={`draggable skimboard-text ${selectedElement?.type === 'text' ? 'selected' : ''}`}
              style={{ 
                top: textPosition.y, 
                left: textPosition.x, 
                fontSize: `${fontSize}px`,
                fontFamily: fontFamily,
                color: textColor,
                transform: 'translate(-50%, -50%)',
                textShadow: enableTextStroke 
                  ? `1px 1px 0 ${textStrokeColor}, -1px -1px 0 ${textStrokeColor}, 1px -1px 0 ${textStrokeColor}, -1px 1px 0 ${textStrokeColor}`
                  : (textColor === '#FFFFFF' ? '2px 2px 4px rgba(0,0,0,0.8)' : '2px 2px 4px rgba(255,255,255,0.8)')
              }}
              onMouseDown={(e) => handleMouseDown(e, 'text')}
              onClick={(e) => {
                e.stopPropagation(); // Prevent event from bubbling to preview panel
                setSelectedElement({ type: 'text' });
              }}
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
                }}                onMouseDown={(e) => handleMouseDown(e, 'image', img.id)}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent event from bubbling to preview panel
                  setSelectedElement({ type: 'image', id: img.id });
                }}
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
