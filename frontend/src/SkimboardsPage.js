import React from 'react';
import './Website.css';
import Header from './Header';
import Footer from './Footer';

const category = 'Skimboards';

const products = [
  {
    id: 1,
    image: '/images/Candy-Camo.jpeg',
    name: 'Candy Camo'
  },
  {
    id: 2,
    image: '/images/Carbon-Fiber-Pro.jpeg',
    name: 'Carbon Fiber Pro'
  },
  {
    id: 3,
    image: '/images/Green-Island.jpeg',
    name: 'Green Island'
  },
  {
    id: 4,
    image: '/images/Lime-Swirl.jpeg',
    name: 'Lime Swirl'
  },
  {
    id: 5,
    image: '/images/MarbleFish.jpeg',
    name: 'Marble Fish'
  },
  {
    id: 6,
    image: '/images/Marble.jpeg',
    name: 'Marble'
  },
  {
    id: 7,
    image: '/images/PurpleCarbon.jpeg',
    name: 'Purple Carbon'
  },
  {
    id: 8,
    image: '/images/Rasta.jpeg',
    name: 'Rasta'
  },
  {
    id: 9,
    image: '/images/Samurai.jpeg',
    name: 'Samurai'
  },
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

const SkimboardsPage = () => {
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

export default SkimboardsPage;