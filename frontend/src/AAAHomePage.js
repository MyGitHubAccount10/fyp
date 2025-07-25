import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Website.css';
import Header from './Header';
import Footer from './Footer';
import { useProductsContext } from './hooks/useProductsContext';


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
  const [slideshowImages, setSlideshowImages] = useState([]);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const { products, dispatch } = useProductsContext();
  const navigate = useNavigate();

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

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

  const handleImageClick = () => {
    if (slideshowImages[currentSlideIndex]?.link) {
      navigate(slideshowImages[currentSlideIndex].link);
    }
  };

  // Touch event handlers for swipe functionality
  const onTouchStart = (e) => {
    setTouchEnd(null); // Reset touchEnd
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && slideshowImages.length > 1) {
      nextSlide();
    }
    if (isRightSwipe && slideshowImages.length > 1) {
      prevSlide();
    }
  };

    useEffect(() => {
        const fetchActivePromos = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/promo/active`);
                const data = await response.json();
                if (response.ok) {
                    // Transform promo data to match slideshow format
                    const transformedImages = data.map(promo => ({
                        src: `${process.env.REACT_APP_API_URL}/images/promo/${promo.promo_image}`,
                        link: promo.promo_link
                    }));
                    setSlideshowImages(transformedImages);
                }
            } catch (error) {
                console.error('Error fetching promo images:', error);
                // Fallback to default images if API fails
                setSlideshowImages([
                    { src: '/images/PromoPictures/bananaPromo.png', link: '/product/6879ed59e50a186e08b7c246' },
                    { src: '/images/PromoPictures/WhiteT.png', link: '/product/68771a551d5a7723398dda2f' },
                    { src: '/images/PromoPictures/WhiteT2.png', link: '/product/68771a551d5a7723398dda2f' },
                    { src: '/images/WannaAdmin.png', link: '/contact' }
                ]);
            }
        };

        fetchActivePromos();
    }, []);

    useEffect(() => {
    // If there's only one image, don't start the timer.
    if (slideshowImages.length <= 1) {
      return;
    }

    // Set up the timer to advance to the next slide.
    const intervalId = setInterval(() => {
      nextSlide();
    }, 5000); // Change slide every 5 seconds

    // The cleanup function. This will run before the effect re-runs or when the component unmounts.
    return () => clearInterval(intervalId);

    });

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/product`);
                const data = await response.json();
                if (response.ok) {
                    dispatch({ type: 'SET_PRODUCTS', payload: data });
                }
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        if (!products || products.length === 0) {
            fetchProducts();
        }
    }, [dispatch, products]);

    // ✅ MODIFIED: Effect to load social media embed scripts
    useEffect(() => {
        // This function will run every time the component mounts.
        // We remove the old script and add a new one to force TikTok to re-scan the page.
        const existingScript = document.getElementById('tiktok-embed-script');
        if (existingScript) {
            existingScript.remove();
        }

        const script = document.createElement('script');
        script.id = 'tiktok-embed-script';
        script.src = 'https://www.tiktok.com/embed.js';
        script.async = true;
        document.body.appendChild(script);

        // Optional: Cleanup function to remove the script when the component unmounts
        return () => {
            const scriptToRemove = document.getElementById('tiktok-embed-script');
            if (scriptToRemove) {
                scriptToRemove.remove();
            }
        };
    }, []); // The empty dependency array ensures this runs on every mount/unmount cycle


  return (
    <>
      <div style={{ position: 'sticky', top: 0, zIndex: 1000}}>
      <Header />
      </div>
      {/* --- MAIN HOMEPAGE CONTENT --- */}
      <main className="homepage-content">
        {/* Hero Section */}
        <section className="hero-section">
          <div 
            className="hero-image-container"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {slideshowImages.length > 0 && (
                <img 
                    src={slideshowImages[currentSlideIndex].src} 
                    alt={`Skimboarder slide ${currentSlideIndex + 1}`} 
                    className="hero-image" 
                    onClick={handleImageClick}
                    style={{ cursor: 'pointer' }}
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
            
            {/* Slideshow Indicators */}
            {slideshowImages.length > 1 && (
              <div className="slideshow-indicators">
                {slideshowImages.map((_, index) => (
                  <button
                    key={index}
                    className={`slideshow-dot ${index === currentSlideIndex ? 'active' : ''}`}
                    onClick={() => setCurrentSlideIndex(index)}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Choice Cards Section */}
        <section className="popular-products-section container">
          <h2 className="popular-products-title">What Are You Looking For?</h2>
          <div className="popular-products-grid">
            {/* Browse Categories Card */}
            <Link to={'/categories'} style={{ textDecoration: 'none' }} onClick={() => window.scrollTo(0, 0)}>
              <div className="popular-product-card">
                <img src={'/images/PromoPictures/Categories.jpg'} alt={'Products'} className="popular-product-card-image" />
                <div className="popular-product-card-caption">Products</div>
              </div>
            </Link>
            
            {/* Popular Products Card */}
            <Link to={'/popular-products'} style={{ textDecoration: 'none' }} onClick={() => window.scrollTo(0, 0)}>
              <div className="popular-product-card">
                <img src={'/images/PromoPictures/Popproducts.jpg'} alt={'Popular Products'} className="popular-product-card-image" />
                <div className="popular-product-card-caption">Popular Products</div>
              </div>
            </Link>
            
            {/* Custom Skimboard Card */}
            <Link to={'/customise-image'} style={{ textDecoration: 'none' }} onClick={() => window.scrollTo(0, 0)}>
              <div className="popular-product-card">
                <img src={'/images/PromoPictures/CustoSkimPromo.jpg'} alt={'Custom Skimboard'} className="popular-product-card-image" />
                <div className="popular-product-card-caption">Design Skimboard</div>
              </div>
            </Link>
          </div>
        </section>

        {/* Social Media Section */}
        <section className="social-media-section">
            <h2 className="social-media-title">Catch The Vibe</h2>
            <div className="social-embeds-container">
                <div className="social-embed-item">
                    <blockquote className="tiktok-embed" cite="https://www.tiktok.com/@this_side_up.sg/video/7447587830504623378" data-video-id="7447587830504623378" style={{ maxWidth: '605px', minWidth: '325px' }} > <section> <a target="_blank" rel="noopener noreferrer" title="@this_side_up.sg" href="https://www.tiktok.com/@this_side_up.sg?refer=embed">@this_side_up.sg</a> <p></p> <a target="_blank" rel="noopener noreferrer" title="♬ Paradise - Bazzi" href="https://www.tiktok.com/music/Paradise-6677379022231440129?refer=embed">♬ Paradise - Bazzi</a> </section> </blockquote>
                </div>
            </div>
        </section>

      </main>
      <Footer />
    </>
  );
};

export default HomePage;