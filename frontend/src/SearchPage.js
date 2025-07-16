import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Website.css';
import Header from './Header';
import Footer from './Footer';

// This is the same product card used on the Category Page,
// including the "Out of Stock" logic.
const ProductCard = ({ product }) => {
  const isAvailable = product.warehouse_quantity > 0;

  const cardInnerContent = (
    <div className="product-card" style={{ position: 'relative', opacity: isAvailable ? 1 : 0.6 }}>
      <img src={`${process.env.REACT_APP_API_URL}/images/${product.product_image}`} alt={product.product_name} className="product-image" />
      <div className="product-info">
        <h3 className="product-name">{product.product_name}</h3>
      </div>
      {!isAvailable && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '5px',
          fontWeight: 'bold',
          textAlign: 'center',
          pointerEvents: 'none'
        }}>
          Out of Stock
        </div>
      )}
    </div>
  );

  if (isAvailable) {
    return (
      <Link to={`/product/${product._id}`} style={{ textDecoration: 'none' }}>
        {cardInnerContent}
      </Link>
    );
  } else {
    return (
      <div>
        {cardInnerContent}
      </div>
    );
  }
};


const SearchPage = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const location = useLocation();

  useEffect(() => {
    // Read the search query from the URL parameter `q`
    const params = new URLSearchParams(location.search);
    const queryParam = params.get('q');
    
    if (!queryParam) {
      setResults([]);
      setLoading(false);
      setQuery('');
      return;
    }
    
    setQuery(queryParam);
    setLoading(true);
    setError(null);

    const fetchAndFilterProducts = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/product`);
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const allProducts = await response.json();
        
        // Filter products based on the query (case-insensitive search on name)
        const filteredResults = allProducts.filter(product =>
          product.product_name.toLowerCase().includes(queryParam.toLowerCase())
        );
        
        setResults(filteredResults);

      } catch (err) {
        console.error('Error during search:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAndFilterProducts();

  }, [location.search]); // Re-run effect when the URL search part changes

  const renderContent = () => {
    if (loading) {
      return <p>Searching for products...</p>;
    }
    if (error) {
      return <p style={{ color: 'red' }}>Error: {error}</p>;
    }
    if (results.length > 0) {
      return (
        <div className="product-grid">
          {results.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      );
    }
    return <p className="no-products-message">No products found for "{query}".</p>;
  };

  return (
    <>
      <Header />
      <div className="title-section">
        <h1 className="title">Search Results for "{query}"</h1>
      </div>
      
      <div className="product-grid-container">
        {renderContent()}
      </div>

      <Footer />
    </>
  );
};

export default SearchPage;