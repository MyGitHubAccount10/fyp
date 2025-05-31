import React, { useState } from 'react';
import './Website.css'; // Assuming Website.css contains all necessary styles

// Assume images are in public/images/ directory relative to your server's root
const logoImage = '/images/this-side-up-logo.png';

// Slideshow images for hero section
const slideshowImages = [
    '/images/aizat1.jpeg',
    '/images/aizat2.jpeg',
    // Add more image paths here if needed for the slideshow
];

const popularDesign1Image = '/images/popular-shipwreck.jpg'; // Placeholder
const popularDesign2Image = '/images/popular-wooden-shack.jpg'; // Placeholder
const popularDesign3Image = '/images/popular-jing-of-seas.jpg'; // Placeholder
const popularDesign4Image = '/images/popular-choose-name.jpg'; // Placeholder


// Simple SVG Icons for secondary navigation (black color is set via CSS or inline fill)
const TshirtIcon = () => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="black">
        <path d="M12,2C9.243,2,7,4.243,7,7v3H5c-1.103,0-2,0.897-2,2v8c0,1.103,0.897,2,2,2h14c1.103,0,2-0.897,2-2v-8c0-1.103-0.897-2-2-2h-2V7 C17,4.243,14.757,2,12,2z M10,7V6c0-1.103,0.897-2,2-2s2,0.897,2,2v1H10z"/>
    </svg>
);
const JacketIcon = () => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="black">
        <path d="M18 7h-2V5c0-1.103-.897-2-2-2h-4c-1.103 0-2 .897-2 2v2H6c-1.103 0-2 .897-2 2v10c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2V9c0-1.103-.897-2-2-2zm-8-2h4v2h-4V5zm6 14H8V9h8v10z"/>
        <path d="M10 12h4v2h-4zm0 15h4v2h-4z"/>
    </svg>
);
const BoardshortsIcon = () => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="black">
        <path d="M8 2v4H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4v-6h4v6h4c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-2V2h-8zm2 5h4v3h-4V7z"/>
    </svg>
);
const AccessoriesIcon = () => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="black">
        <path d="M21.41,11.59l-9-9C12.05,2.24,11.55,2,11,2H4C2.9,2,2,2.9,2,4v7c0,0.55,0.24,1.05,0.59,1.41l9,9 C11.95,21.76,12.45,22,13,22s1.05-0.24,1.41-0.59l7-7C22.17,13.66,22.17,12.34,21.41,11.59z M13,20L4,11V4h7l9,9L13,20z"/>
        <circle cx="6.5" cy="6.5" r="1.5"/>
    </svg>
);

// SVG for hero arrows
const LeftArrowIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="black" xmlns="http://www.w3.org/2000/svg">
        <path d="M15.7071 16.2929L11.4142 12L15.7071 7.70711C16.0976 7.31658 16.0976 6.68342 15.7071 6.29289C15.3166 5.90237 14.6834 5.90237 14.2929 6.29289L9.29289 11.2929C8.90237 11.6834 8.90237 12.3166 9.29289 12.7071L14.2929 17.7071C14.6834 18.0976 15.3166 18.0976 15.7071 17.7071C16.0976 17.3166 16.0976 16.6834 15.7071 16.2929Z"/>
    </svg>
);

const RightArrowIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="black" xmlns="http://www.w3.org/2000/svg">
        <path d="M8.29289 7.70711L12.5858 12L8.29289 16.2929C7.90237 16.6834 7.90237 17.3166 8.29289 17.7071C8.68342 18.0976 9.31658 18.0976 9.70711 17.7071L14.7071 12.7071C15.0976 12.3166 15.0976 11.6834 14.7071 11.2929L9.70711 6.29289C9.31658 5.90237 8.68342 5.90237 8.29289 6.29289C7.90237 6.68342 7.90237 7.31658 8.29289 7.70711Z"/>
    </svg>
);


const HomePage = () => {
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const toggleProductDropdown = (e) => {
    e.preventDefault();
    setIsProductDropdownOpen(!isProductDropdownOpen);
  };

  const nextSlide = () => {
    setCurrentSlideIndex((prevIndex) =>
      prevIndex === slideshowImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentSlideIndex((prevIndex) =>
      prevIndex === 0 ? slideshowImages.length - 1 : prevIndex - 1
    );
  };


  return (
    <>
      {/* --- HEADER --- */}
      <header>
          <div className="header-left-content">
              <button className="burger-btn" aria-label="Menu" title="Menu">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 12H21" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M3 6H21" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M3 18H21" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
              </button>
              <a href="/" className="header-logo-link">
                  <img src={logoImage} alt="This Side Up Logo" className="header-logo-img" />
              </a>
              <nav className="header-nav-links">
                  <a href="#">About</a>
                  <a href="#">Contact</a>
                  <a href="#">FAQ</a>
                  <a href="#" onClick={toggleProductDropdown} className="product-dropdown-toggle">
                      Product
                      <svg className={`product-arrow ${isProductDropdownOpen ? 'up' : ''}`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                  </a>
              </nav>
          </div>
          <div className="header-right-content">
              <form className="search-bar" role="search" onSubmit={(e) => e.preventDefault()}>
                  <input type="search" placeholder="Search" aria-label="Search site" />
                  <button type="submit" aria-label="Submit search" title="Search">
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M21 21L16.65 16.65" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                  </button>
              </form>
              <a href="#" aria-label="Shopping Cart" className="header-icon-link" title="Shopping Cart">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 2L3 6V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 21.7893 20.2107 21.4142 20.5858 21.0391C20.9609 20.664 21.1716 20.1554 21.1716 19.625V6L18 2H6Z" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" transform="scale(0.9) translate(1.2, 1.2)"/>
                      <path d="M3 6H21" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" transform="scale(0.9) translate(1.2, 1.2)"/>
                      <path d="M16 10C16 11.0609 15.5786 12.0783 14.8284 12.8284C14.0783 13.5786 13.0609 14 12 14C10.9391 14 9.92172 13.5786 9.17157 12.8284C8.42143 12.0783 8 11.0609 8 10" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" transform="scale(0.9) translate(1.2, 1.2)"/>
                  </svg>
              </a>
              <a href="#" aria-label="User Account" className="header-icon-link" title="User Account">
                   <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
              </a>
              <span className="header-separator"></span>
              <div className="header-social-icons">
                  <a href="#" aria-label="Instagram" title="Instagram"><img src="https://img.icons8.com/ios-glyphs/30/000000/instagram-new.png" alt="Instagram" /></a>
                  <a href="#" aria-label="TikTok" title="TikTok"><img src="https://img.icons8.com/ios-glyphs/30/000000/tiktok.png" alt="TikTok" /></a>
              </div>
          </div>
      </header>

      {isProductDropdownOpen && (
          <nav className="secondary-navbar">
              <a href="#" className="secondary-navbar-item">
                  <TshirtIcon /> T-shirt
              </a>
              <a href="#" className="secondary-navbar-item">
                  <JacketIcon /> Jackets
              </a>
              <a href="#" className="secondary-navbar-item">
                  <BoardshortsIcon /> Boardshorts
              </a>
              <a href="#" className="secondary-navbar-item">
                  <AccessoriesIcon /> Accessories
              </a>
          </nav>
      )}

      {/* --- MAIN HOMEPAGE CONTENT --- */}
      <main className="homepage-content">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-image-container">
            {slideshowImages.length > 0 && (
                <img 
                    src={slideshowImages[currentSlideIndex]} 
                    alt={`Skimboarder slide ${currentSlideIndex + 1}`} 
                    className="hero-image" 
                />
            )}
            {slideshowImages.length > 1 && ( // Only show arrows if more than one image
                <>
                    <button onClick={prevSlide} className="hero-arrow hero-arrow-left" aria-label="Previous slide">
                        <LeftArrowIcon />
                    </button>
                    <button onClick={nextSlide} className="hero-arrow hero-arrow-right" aria-label="Next slide">
                        <RightArrowIcon />
                    </button>
                </>
            )}
            <button className="hero-cta-button">Customise Skimboards</button>
          </div>
        </section>

        {/* Popular Designs Section */}
        <section className="popular-designs-section container">
          <h2 className="popular-designs-title">Popular Designs</h2>
          <div className="popular-designs-grid">
            <div className="popular-design-card">
              <img src={popularDesign1Image} alt="Shipwreck Breaker Skimboard" className="popular-design-card-image" />
              <div className="popular-design-card-caption">Shipwreck Breaker</div>
            </div>
            <div className="popular-design-card">
              <img src={popularDesign2Image} alt="The Wooden Shack Skateboard" className="popular-design-card-image" />
              <div className="popular-design-card-caption">The Wooden Shack Skimboard</div>
            </div>
            <div className="popular-design-card">
              <img src={popularDesign3Image} alt="Jing of Seas Skimboard" className="popular-design-card-image" />
              <div className="popular-design-card-caption">Jing of Seas</div>
            </div>
            <div className="popular-design-card">
              <img src={popularDesign4Image} alt="Choose Name Skimboard" className="popular-design-card-image" />
              <div className="popular-design-card-caption">Choose Name</div>
            </div>
          </div>
        </section>
      </main>

      {/* --- FOOTER --- */}
      <footer className="footer">
        <div className="footer-column">
          <strong>#THISSIDEUP</strong>
          <div className="social-icons">
            <a href="#" aria-label="Instagram" title="Instagram"><img src="https://img.icons8.com/ios-filled/50/ffffff/instagram-new.png" alt="Instagram" /></a>
            <a href="#" aria-label="TikTok" title="TikTok"><img src="https://img.icons8.com/ios-filled/50/ffffff/tiktok--v1.png" alt="TikTok" /></a>
          </div>
        </div>
        <div className="footer-column">
          <strong>Customer Service</strong>
          <a href="#">Contact</a><br />
          <a href="#">FAQ</a><br />
          <a href="#">About</a>
        </div>
        <div className="footer-column">
          <strong>Handcrafted in Singapore</strong>
          Here at This Side Up, we're a passionate, Singapore-based skimboard company committed to bringing the exhilarating rush of skimboarding to enthusiasts of every skill level. We specialize in crafting custom-designed skimboards, blending high-quality materials with your unique, personalized designs. The result? Boards that not only perform exceptionally but let your individual style shine on the shore. Rooted in Singapore's vibrant coastal culture, we aim to inspire a spirited community of adventure seekers and champion an active, sun-soaked lifestyle.
        </div>
      </footer>
    </>
  );
};

export default HomePage;