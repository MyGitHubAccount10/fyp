import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Website.css';
import Header from './Header';
import Footer from './Footer';
import { useProductsContext } from './hooks/useProductsContext';

// This is the reusable ProductCard component
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

// This is our new, reusable CategoryPage component
const CategoryPage = ({ categoryName }) => {
  const { products, dispatch } = useProductsContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 1. Immediately start loading and clear old products from view
    setLoading(true);
    setError(null);
    dispatch({ type: 'SET_PRODUCTS', payload: [] }); // Clear previous products

    const fetchProducts = async () => {
      try {
        const categoryResponse = await fetch('/api/category');
        const categories = await categoryResponse.json();
        const currentCategory = categories.find(cat => cat.category_name === categoryName);

        if (currentCategory) {
          const productResponse = await fetch('/api/product');
          const allProducts = await productResponse.json();

          if (productResponse.ok) {
            const categoryProducts = allProducts.filter(product =>
              product.category === currentCategory._id
            );
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
        setLoading(false); // 2. Stop loading when fetch is complete (or fails)
      }
    };

    fetchProducts();

    // 3. Cleanup function: This runs when you navigate away from the page.
    // This is good practice to clear the context to prevent flashing old content.
    return () => {
      dispatch({ type: 'SET_PRODUCTS', payload: [] });
    };
  }, [dispatch, categoryName]); // Re-run effect if categoryName or dispatch function changes

  return (
    <>
      <Header />
      <div className="title-section">
        <h1 className="title">{categoryName}</h1>
      </div>
      
      <div className="product-grid-container" style={{padding: '2rem'}}>
        {loading && <p style={{textAlign: 'center'}}>Loading products...</p>}
        {error && <p style={{textAlign: 'center', color: 'red'}}>Error: {error}</p>}
        {!loading && !error && (
            <div className="product-grid">
                {products && products.length > 0 ? (
                    products.map(product => (
                        <ProductCard key={product._id} product={product} />
                    ))
                ) : (
                    <p style={{textAlign: 'center'}}>No products found in this category.</p>
                )}
            </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default CategoryPage;