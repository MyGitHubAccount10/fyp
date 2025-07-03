import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Website.css';
import Header from './Header';
import Footer from './Footer';
import { useProductsContext } from './hooks/useProductsContext';

// Slideshow images for hero section
const slideshowImages = [
    '/images/an1.jpeg',
    '/images/an2.jpeg',
    '/images/aizat1.jpeg',
    '/images/aizat2.jpeg',
    // Add more image paths here if needed for the slideshow
];

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
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const navigate = useNavigate();
  const { products, dispatch } = useProductsContext();

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

  const handleCustomise = () => {
    navigate('/customise-image'); // Navigate to the Customise page
  }

  useEffect(() => {
        console.log('HomePage useEffect triggered'); // Debug log
        const fetchProducts = async () => {
            try {
                const response = await fetch('/api/product');
                const data = await response.json();
                if (response.ok) {
                    dispatch({ type: 'SET_PRODUCTS', payload: data });
                }
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        // Prevent redundant API calls
        if (!products || products.length === 0) {
            fetchProducts();
        }
    }, [dispatch, products]);

  return (
    <>
      <Header />
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
            <button onClick={handleCustomise} className="hero-cta-button">Customise Skimboards</button>
          </div>
        </section>

        {/* Popular Designs Section */}
        <section className="popular-designs-section container">
          <h2 className="popular-designs-title">Popular Designs</h2>
          <div className="popular-designs-grid">
            {products && products.filter(product => product.warehouse_quantity > 0 &&
            product.threshold >= product.warehouse_quantity).map(product => (
              <Link to={`/product/${product._id}`} key={product._id} style={{ textDecoration: 'none' }}>
                <div className="popular-design-card" key={product._id}>
                  <img src={`/images/${product.product_image}`} alt={product.product_name} className="popular-design-card-image" />
                  <div className="popular-design-card-caption">{product.product_name}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default HomePage;