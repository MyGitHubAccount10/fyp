import React from 'react';
import './Website.css';
import Header from './Header';
import Footer from './Footer';

const category = 'Jackets';

const products = [
  {
    id: 1,
    image: '',
    name: 'Choose Name',
  },
  {
    id: 2,
    image: '',
    name: 'Choose Name',
  },
  {
    id: 3,
    image: '',
    name: 'Choose Name',
  }
];

const ProductCard = ({ image, name }) => {
  return (
    <div className="product-card">
      <img src={image} alt={name} className="product-image" />
      <div className="product-info">
        <h3 className="product-name">{name}</h3>
      </div>
    </div>
  );
};

const JacketPage = () => {
  return (
    <>
      <Header />
        {/* Product Section */}
          <div className="title-section">
            <h1 className="title">{category}</h1>
          </div>

          <div className="product-grid">
            {products.map(product => (
              <ProductCard
                key={product.id}
                image={product.image}
                name={product.name}
              />
            ))}
          </div>
      <Footer />
    </>
  );
};

export default JacketPage;