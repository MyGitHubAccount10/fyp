import React, { useState, useRef } from 'react';
import './CustomiseImagePage.css';

export default function CustomiseImagePage() {
  const [color, setColor] = useState('#FFD700');
  const [customText, setCustomText] = useState('My Skimboard');
  const [uploadedImage, setUploadedImage] = useState(null);
  const previewRef = useRef(null);

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
  };

  const handleDownload = () => {
    const canvas = document.createElement('canvas');
    const preview = previewRef.current;
    const scale = 2;
    canvas.width = preview.offsetWidth * scale;
    canvas.height = preview.offsetHeight * scale;
    const ctx = canvas.getContext('2d');

    // Fill with background color
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw image if exists
    if (uploadedImage) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = uploadedImage;
      img.onload = () => {
        ctx.drawImage(
          img,
          canvas.width / 2 - img.width / 4,
          canvas.height / 2 - img.height / 4,
          img.width / 2,
          img.height / 2
        );

        drawTextAndDownload(ctx, canvas);
      };
    } else {
      drawTextAndDownload(ctx, canvas);
    }
  };

  const drawTextAndDownload = (ctx, canvas) => {
    ctx.fillStyle = 'white';
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(customText, canvas.width / 2, canvas.height - 40);

    const link = document.createElement('a');
    link.download = 'my-skimboard-design.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="skimboard-container">
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
            <button onClick={handleDownload}>Download</button>
          </div>
        </div>

        <div className="preview-panel">
          <div ref={previewRef} className="skimboard-preview" style={{ backgroundColor: color }}>
            <div className="skimboard-text">{customText}</div>
            {uploadedImage && <img src={uploadedImage} alt="Uploaded" className="skimboard-image" />}
          </div>
        </div>
      </div>
    </div>
  );
}
