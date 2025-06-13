import React, { useState } from 'react';

const ImageModal = ({ imageUrl }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOutsideClick = (e) => {
    if (e.target.className === 'modal-overlay') {
      setIsOpen(false);
    }
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open Image</button>

      {isOpen && (
        <div
          className="modal-overlay"
          onClick={handleOutsideClick}
          style={{
            position: 'fixed',
            top: 0, left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              padding: '10px',
              borderRadius: '8px',
              maxWidth: '25vw',
              maxHeight: '25vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img
              src={imageUrl}
              alt="Preview"
              style={{
                width: '100%',
                height: 'auto',
                objectFit: 'contain',
                borderRadius: '4px'
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ImageModal;
