import React, { useState, useEffect } from 'react';
import { Link, useParams} from 'react-router-dom';
import './Website.css';
import Header from './Header';
import Footer from './Footer';
import { useProductsContext } from './hooks/useProductsContext';

// MODIFIED: ProductCard now indicates stock status
const ProductCard = ({ product }) => {
  const isAvailable = product.warehouse_quantity > 0;

  // The visual content of the card
  const cardInnerContent = (
    <div className="product-card" style={{ position: 'relative', opacity: isAvailable ? 1 : 0.8 }}>
      <img src={`${process.env.REACT_APP_API_URL}/images/${product.product_image}`} alt={product.product_name} className="product-image" />
      <div className="product-info">
        <h3 className="product-name">{product.product_name}</h3>
        <p>${parseFloat(product.product_price).toFixed(2)}</p>
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

// Custom Design Card Component
const CustomDesignCard = () => {
  return (
    <Link to="/customise-image" style={{ textDecoration: 'none'}}>
      <div className="product-card" style={{ 
        position: 'relative', 
        border: '2px dashed #FA704C',
        background: 'linear-gradient(135deg, #FFF0E1 0%, #FFE4CC 100%)'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '200px',
          textAlign: 'center',
          padding: '20px'
        }}>
          <div style={{
            fontSize: '48px',
            color: '#FA704C',
            marginBottom: '10px'
          }}>
            +
          </div>
          <h3 className="product-name" style={{ color: '#FA704C', fontWeight: 'bold' }}>
            Design Your Own Skimboard
          </h3>
          <p style={{ 
            color: '#666', 
            fontSize: '14px', 
            margin: '5px 0 0 0',
            fontStyle: 'italic'
          }}>
            Upload Your Own Images
          </p>
        </div>
      </div>
    </Link>
  );
};

const CategoryPage = ({ categoryName: propCategoryName }) => {
  const { categoryName: urlCategoryName } = useParams();
  const categoryName = propCategoryName || urlCategoryName;
  const { products, dispatch } = useProductsContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    dispatch({ type: 'SET_PRODUCTS', payload: [] });

    const fetchProducts = async () => {
      try {
        const categoryResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/category`);
        const categories = await categoryResponse.json();
        const currentCategory = categories.find(cat => cat.category_name === categoryName);

        if (currentCategory) {
          const productResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/product`);
          const allProducts = await productResponse.json();

          if (productResponse.ok) {
            const categoryProducts = allProducts.filter(product => product.category === currentCategory._id);
            dispatch({ type: 'SET_PRODUCTS', payload: categoryProducts });
          } else {
             throw new Error('Failed to fetch products');
          }
        } else {
            throw new Error(`Category "${categoryName}" not found.`);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    return () => {
      dispatch({ type: 'SET_PRODUCTS', payload: [] });
    };
  }, [dispatch, categoryName]);

  const renderContent = () => {
    if (loading) {
      return <p>Loading products...</p>;
    }
    if (error) {
      return <p style={{ color: 'red' }}>Error: {error}</p>;
    }
    if (products && products.length > 0) {
      return (
        <div className="product-grid">
          {/* Add Custom Design card for Skimboards category */}
          {categoryName === 'Skimboards' && <CustomDesignCard />}
          {products.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      );
    }
    // This is now returned directly if there are no products
    return <p className="no-products-message">No products found in this category.</p>;
  };

  return (
    <>
      <Header />
      <div className="title-section">
        <h1 className="title">{categoryName}</h1>
      </div>

      {/* This container will now correctly center its direct child */}
      <div className="product-grid-container">
        {renderContent()}
      </div>

      <Footer />
    </>
  );
};

export default CategoryPage;