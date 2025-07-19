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
  const { products, dispatch } = useProductsContext();
  const navigate = useNavigate();

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

    useEffect(() => {
        const fetchActivePromos = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/promo/active`);
                const data = await response.json();
                if (response.ok) {
                    // Transform promo data to match slideshow format
                    const transformedImages = data.map(promo => ({
                        src: `${process.env.REACT_APP_API_URL}/images/${promo.promo_image}`,
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

  }, [currentSlideIndex]); // <-- KEY CHANGE: Add currentSlideIndex as a dependency

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

    // Effect to load social media embed scripts
    useEffect(() => {
        const loadScript = (src, id) => {
            if (document.getElementById(id)) {
                // If script is already on the page, trigger the embed processing
                if (id === 'instagram-embed-script' && window.instgrm) {
                    window.instgrm.Embeds.process();
                }
                return;
            }
            const script = document.createElement('script');
            script.id = id;
            script.src = src;
            script.async = true;
            document.body.appendChild(script);

            if (id === 'instagram-embed-script') {
                script.onload = () => {
                    if (window.instgrm) {
                        window.instgrm.Embeds.process();
                    }
                };
            }
        };

        // loadScript('//www.instagram.com/embed.js', 'instagram-embed-script'); // REMOVED
        loadScript('https://www.tiktok.com/embed.js', 'tiktok-embed-script');
        
    }, []);


  return (
    <>
      <div style={{ position: 'sticky', top: 0, zIndex: 1000}}>
      <Header />
      </div>
      {/* --- MAIN HOMEPAGE CONTENT --- */}
      <main className="homepage-content">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-image-container">
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
          </div>
        </section>

        {/* Popular Products Section */}
        <section className="popular-products-section container">
          <h2 className="popular-products-title">Popular Products</h2>
          <div className="popular-products-grid">
            {products && products.filter(product => product.warehouse_quantity > 0 &&
            product.warehouse_quantity > product.threshold)
            .sort((a, b) => a.warehouse_quantity - b.warehouse_quantity)
            .slice(0, 3).map(product => (
              <Link to={`/product/${product._id}`} key={product._id} style={{ textDecoration: 'none' }}>
                <div className="popular-product-card" key={product._id}>
                  <img src={`${process.env.REACT_APP_API_URL}/images/${product.product_image}`} alt={product.product_name} className="popular-product-card-image" />
                  <div className="popular-product-card-caption">{product.product_name}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Social Media Section */}
        <section className="social-media-section">
            <h2 className="social-media-title">Catch The Vibe</h2>
            <div className="social-embeds-container">
                {/* The entire <div> for the Instagram post has been removed. */}
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