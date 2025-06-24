import React, { useState } from 'react';
import './CustomiseImagePage.css';

export default function SkimboardCustomizer() {
  const [color, setColor] = useState('#FFD700'); // Default yellow
  const [customText, setCustomText] = useState('My Skimboard');
  const [uploadedImage, setUploadedImage] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedImage(URL.createObjectURL(file));
    }
  };

  return (
    <div className="skimboard-container">
      <h1>Customize Your Skimboard</h1>
      <div className="skimboard-customizer">
        {/* Left: Controls */}
        <div className="customization-panel">
          <label>
            Select Color:
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          </label>

          <label>
            Add Text:
            <input
              type="text"
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              maxLength={20}
            />
          </label>

          <label>
            Upload Image:
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
            />
          </label>
        </div>

        {/* Right: Preview */}
        <div className="preview-panel">
          <div className="skimboard-preview" style={{ backgroundColor: color }}>
            <div className="skimboard-text">{customText}</div>
            {uploadedImage && (
              <img src={uploadedImage} alt="Uploaded" className="skimboard-image" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
