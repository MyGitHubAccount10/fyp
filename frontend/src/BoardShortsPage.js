import React, { useEffect, useState } from 'react';
import './Website.css';
import Header from './Header';
import Footer from './Footer';

const category = 'Board Shorts';

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <img src={`/images/${product.product_image}`} alt={product.product_name} className="product-image" />
      <div className="product-info">
        <h3 className="product-name">{product.product_name}</h3>
      </div>
    </div>
  );
};

const BoardShortsPage = () => {
  const [products, setProducts] = useState([]);
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // First get the category ID
        const categoryResponse = await fetch('/api/category');
        const categories = await categoryResponse.json();

        const boardShortsCategory = categories.find(cat => cat.category_name === category);

        if (boardShortsCategory) {
          // Then get products and filter by category ID
          const productResponse = await fetch('/api/product');
          const json = await productResponse.json();
          
          if (productResponse.ok) {
            const boardShortsProducts = json.filter(product =>
              product.category === boardShortsCategory._id
            );
            setProducts(boardShortsProducts);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <>
      <Header />
        {/* Product Section */}
          <div className="title-section">
            <h1 className="title">{category}</h1>
          </div>

          <div className="product-grid">
            {products && products.map(product => (
              <ProductCard
                key={product._id}
                product={product}
              />
            ))}
          </div>
      <Footer />
    </>
  );
};

export default BoardShortsPage;