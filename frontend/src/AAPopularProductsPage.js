import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Website.css';
import Header from './Header';
import Footer from './Footer';
import { useProductsContext } from './hooks/useProductsContext';

const ProductCard = ({ product }) => {
  const isAvailable = product.warehouse_quantity > 0;

  const cardInnerContent = (
    <div className="product-card" style={{ position: 'relative', opacity: isAvailable ? 1 : 0.6 }}>
      <img 
        src={`${process.env.REACT_APP_API_URL}/images/product/${product.product_image}`} 
        alt={product.product_name} 
        className="product-image" 
      />
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
        }}>
          Out of Stock
        </div>
      )}
    </div>
  );
  
  return (
    <Link to={`/product/${product._id}`} style={{ textDecoration: 'none'}}>
      {cardInnerContent}
    </Link>
  );
};

const PopularProductsPage = () => {
  const { products, dispatch } = useProductsContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/product`);
        const data = await response.json();
        if (response.ok) {
          dispatch({ type: 'SET_PRODUCTS', payload: data });
        } else {
          throw new Error('Failed to fetch products');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (!products || products.length === 0) {
      fetchProducts();
    } else {
      setLoading(false);
    }
  }, [dispatch, products]);

  // Filter popular products (same logic as commented out in HomePage)
  const popularProducts = products 
    ? products
        .filter(product => 
          product.warehouse_quantity > 0 && 
          product.warehouse_quantity > product.threshold
        )
        .sort((a, b) => a.warehouse_quantity - b.warehouse_quantity)
    : [];

  const renderContent = () => {
    if (loading) {
      return <p>Loading popular products...</p>;
    }
    if (error) {
      return <p style={{ color: 'red' }}>Error: {error}</p>;
    }
    if (popularProducts && popularProducts.length > 0) {
      return (
        <div className="product-grid">
          {popularProducts.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      );
    }
    return <p className="no-products-message">No popular products found.</p>;
  };

  return (
    <>
      <div style={{ position: 'sticky', top: 0, zIndex: 1000}}>
      <Header />
      </div>
      <div className="title-section">
        <h1 className="title">Popular Products</h1>
        <p style={{ textAlign: 'center', color: '#666', marginTop: '10px' }}>
          Discover our most loved products with great availability
        </p>
      </div>

      <div className="product-grid-container">
        {renderContent()}
      </div>

      <Footer />
    </>
  );
};

export default PopularProductsPage;