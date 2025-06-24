import React, { useState, useRef } from 'react';
import './CustomiseImagePage.css';

export default function CustomiseImagePage() {
  const [color, setColor] = useState('#FFD700');
  const [customText, setCustomText] = useState('My Skimboard');
  const [uploadedImage, setUploadedImage] = useState(null);

  const [textPosition, setTextPosition] = useState({ x: 50, y: 300 });
  const [imagePosition, setImagePosition] = useState({ x: 60, y: 100 });

  const previewRef = useRef(null);
  const dragging = useRef({ type: null, offsetX: 0, offsetY: 0 });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedImage(URL.createObjectURL(file));
    }
  };

  const handleReset = () => {
    setColor('#FFD700');
    setCustomText('My Skimboard');
    setUploadedImage(null);
    setTextPosition({ x: 50, y: 300 });
    setImagePosition({ x: 60, y: 100 });
  };

  const handleMouseDown = (e, type) => {
    dragging.current.type = type;
    const bounds = previewRef.current.getBoundingClientRect();
    dragging.current.offsetX = e.clientX - bounds.left;
    dragging.current.offsetY = e.clientY - bounds.top;
  };

  const handleMouseMove = (e) => {
    if (!dragging.current.type) return;
    const bounds = previewRef.current.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const y = e.clientY - bounds.top;

    if (dragging.current.type === 'text') {
      setTextPosition({ x, y });
    } else if (dragging.current.type === 'image') {
      setImagePosition({ x, y });
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
            Upload Image:
            <input type="file" accept="image/*" onChange={handleImageUpload} />
          </label>

          <div className="action-buttons">
            <button onClick={handleReset}>Reset</button>
            <button onClick={() => alert('Download available in next step!')}>Download</button>
          </div>
        </div>

        <div className="preview-panel">
          <div ref={previewRef} className="skimboard-preview" style={{ backgroundColor: color }}>
            <div
              className="draggable skimboard-text"
              style={{ top: textPosition.y, left: textPosition.x }}
              onMouseDown={(e) => handleMouseDown(e, 'text')}
            >
              {customText}
            </div>
            {uploadedImage && (
              <img
                src={uploadedImage}
                alt="Uploaded"
                className="draggable skimboard-image"
                style={{ top: imagePosition.y, left: imagePosition.x }}
                onMouseDown={(e) => handleMouseDown(e, 'image')}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
