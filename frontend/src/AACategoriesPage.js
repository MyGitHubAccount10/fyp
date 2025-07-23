import React from 'react';
import { Link } from 'react-router-dom';
import './Website.css';
import Header from './Header';
import Footer from './Footer';

const CategoryCard = ({ categoryName, imageSrc, linkTo }) => {
  return (
    <Link to={linkTo} style={{ textDecoration: 'none' }}>
      <div className="product-card category-card">
        <img 
          src={imageSrc} 
          alt={categoryName} 
          className="product-image" 
        />
        <div className="product-info">
          <h3 className="product-name">{categoryName}</h3>
        </div>
      </div>
    </Link>
  );
};

const CategoriesPage = () => {
  const categories = [
    {
      name: 'Skimboards',
      image: '/images/PromoPictures/pictures of skimboard.jpg',
      link: '/products/skimboards'
    },
    {
      name: 'T-Shirts', 
      image: '/images/PromoPictures/pictures of T-shirts.jpg',
      link: '/products/t-shirts'
    },
    {
      name: 'Jackets',
      image: '/images/PromoPictures/pictures of Jackets.jpg',
      link: '/products/jackets'
    },
    {
      name: 'Board Shorts',
      image: '/images/PromoPictures/pictures of Board Shorts.jpg',
      link: '/products/boardshorts'
    },
    {
      name: 'Accessories',
      image: '/images/PromoPictures/pictures of Skimboard Accessories.jpg',
      link: '/products/accessories'
    }
  ];

  return (
    <>
      <Header />
      <div className="title-section">
        <h1 className="title">Products</h1>
      </div>

      <div className="product-grid-container">
        <div className="product-grid">
          {categories.map((category, index) => (
            <CategoryCard
              key={index}
              categoryName={category.name}
              imageSrc={category.image}
              linkTo={category.link}
            />
          ))}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default CategoriesPage;
