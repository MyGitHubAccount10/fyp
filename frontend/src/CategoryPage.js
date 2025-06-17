import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Website.css';
import Header from './Header';
import Footer from './Footer';
import { useProductsContext } from './hooks/useProductsContext';

const ProductCard = ({ product }) => {
  return (
    <Link to={`/product/${product._id}`} style={{ textDecoration: 'none' }}>
      <div className="product-card">
        <img src={`/images/${product.product_image}`} alt={product.product_name} className="product-image" />
        <div className="product-info">
          <h3 className="product-name">{product.product_name}</h3>
        </div>
      </div>
    </Link>
  );
};

const CategoryPage = ({ categoryName }) => {
  const { products, dispatch } = useProductsContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    dispatch({ type: 'SET_PRODUCTS', payload: [] });

    const fetchProducts = async () => {
      try {
        const categoryResponse = await fetch('/api/category');
        const categories = await categoryResponse.json();
        const currentCategory = categories.find(cat => cat.category_name === categoryName);

        if (currentCategory) {
          const productResponse = await fetch('/api/product');
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