import React, { useState, useRef } from 'react';
import './CustomiseImagePage.css';

export default function CustomiseImagePage() {
  const [color, setColor] = useState('#FFD700');
  const [customText, setCustomText] = useState('My Skimboard');
  const [images, setImages] = useState([]);
  const [textPosition, setTextPosition] = useState({ x: 50, y: 300 });
  const [fontSize, setFontSize] = useState(20);
  const [fontFamily, setFontFamily] = useState('Arial');


  const previewRef = useRef(null);
  const dragging = useRef({ id: null, type: null, offsetX: 0, offsetY: 0 });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
    setImages((prev) => [
    ...prev,
    {
        id: Date.now(),
        src: url,
        x: 60,
        y: 100,
        width: 100,
        height: 100,
        rotation: 0,
    },
    ]);
};
};


  const handleDeleteImage = (id) => {
  setImages((prev) => prev.filter((img) => img.id !== id));
};

  const handleReset = () => {
    setColor('#FFD700');
    setCustomText('My Skimboard');
    setImages([]);
    setTextPosition({ x: 50, y: 300 });
  };

  const handleDownload = () => {
    const preview = previewRef.current;
    const canvas = document.createElement('canvas');
    const scale = 2;
    const width = preview.offsetWidth;
    const height = preview.offsetHeight;

    canvas.width = width * scale;
    canvas.height = height * scale;

    const ctx = canvas.getContext('2d');
    ctx.scale(scale, scale);

    // Fill background
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height);

    // Load and draw all images
    const loadAll = images.map((img) => {
      return new Promise((resolve) => {
        const image = new Image();
        image.crossOrigin = 'anonymous';
        image.src = img.src;
        image.onload = () => {
            ctx.save();
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
      });
    });

    Promise.all(loadAll).then(() => {
      // Draw text
        ctx.fillStyle = 'white';
        ctx.font = `${fontSize}px ${fontFamily}`;
        ctx.textAlign = 'center';
        ctx.fillText(customText, textPosition.x, textPosition.y);


      const link = document.createElement('a');
      link.download = 'skimboard-design.png';
      link.href = canvas.toDataURL();
      link.click();
    });
  };

    const handleMouseDown = (e, type, id = null) => {
    e.stopPropagation();
    const bounds = previewRef.current.getBoundingClientRect();
    dragging.current = {
        type,
        id
    };
    };


const handleMouseMove = (e) => {
  if (!dragging.current.type) return;

  const bounds = previewRef.current.getBoundingClientRect();
  const x = e.clientX - bounds.left;
  const y = e.clientY - bounds.top;

  if (dragging.current.type === 'text') {
    setTextPosition({ x, y });
  } else if (dragging.current.type === 'image') {
    setImages((prev) =>
      prev.map((img) =>
        img.id === dragging.current.id ? { ...img, x, y } : img
      )
    );
  } else if (dragging.current.type === 'resize') {
    setImages((prev) =>
      prev.map((img) =>
        img.id === dragging.current.id
          ? {
              ...img,
              width: Math.max(30, x - img.x),
              height: Math.max(30, y - img.y),
            }
          : img
      )
    );
  } else if (dragging.current.type === 'rotate') {
    setImages((prev) =>
      prev.map((img) => {
        if (img.id !== dragging.current.id) return img;
        const centerX = img.x + img.width / 2;
        const centerY = img.y + img.height / 2;
        const angle = Math.atan2(y - centerY, x - centerX);
        const degrees = (angle * 180) / Math.PI;
        return { ...img, rotation: degrees };
      })
    );
  }
};


  const handleMouseUp = () => {
    dragging.current.type = null;
  };

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
          <label>
            Select Color:
            <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
          </label>

          <label>
            Add Text:
            <input type="text" value={customText} onChange={(e) => setCustomText(e.target.value)} maxLength={20} />
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
            </select>
            </label>


          <label>
            Upload Image:
            <input type="file" accept="image/*" onChange={handleImageUpload} />
          </label>

          <div className="action-buttons">
            <button onClick={handleReset}>Reset</button>
            <button onClick={handleDownload}>Download</button>
          </div>
        </div>

        <div className="preview-panel">
          <div ref={previewRef} className="skimboard-preview" style={{ backgroundColor: color }}>
            <div
              className="draggable skimboard-text"
              style={{ top: textPosition.y, 
                left: textPosition.x, 
                fontSize: `${fontSize}px`,
                fontFamily: fontFamily, }}
              onMouseDown={(e) => handleMouseDown(e, 'text')}
            >
              {customText}
            </div>
            {/* img */}
            {images.map((img) => (
            <div
                key={img.id}
                className="image-wrapper"
                style={{
                top: img.y,
                left: img.x,
                width: img.width,
                height: img.height,
                transform: `rotate(${img.rotation}deg)`,
                }}
                onMouseDown={(e) => handleMouseDown(e, 'image', img.id)}
            >
                <img src={img.src} alt="Uploaded" className="skimboard-image" style={{ width: '100%', height: '100%' }} />
                <button className="delete-btn" onClick={(e) => {
                e.stopPropagation();
                handleDeleteImage(img.id);
                }}>×</button>

                <div
                className="resize-handle"
                onMouseDown={(e) => handleMouseDown(e, 'resize', img.id)}
                />
                <div
                className="rotate-handle"
                onMouseDown={(e) => handleMouseDown(e, 'rotate', img.id)}
                />
            </div>
            ))}
            {/* img */}
          </div>
        </div>
      </div>
    </div>
  );
}
