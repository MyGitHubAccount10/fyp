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
      image: '/images/JasonPictures/design.jpg',
      link: '/category/Skimboards'
    },
    {
      name: 'T-Shirts', 
      image: '/images/JasonPictures/design.jpg',
      link: '/category/T-Shirts'
    },
    {
      name: 'Jackets',
      image: '/images/JasonPictures/design.jpg',
      link: '/category/Jackets'
    },
    {
      name: 'Board Shorts',
      image: '/images/JasonPictures/design.jpg',
      link: '/category/Board Shorts'
    },
    {
      name: 'Accessories',
      image: '/images/JasonPictures/design.jpg',
      link: '/category/Accessories'
    }
  ];

  return (
    <>
      <Header />
      <div className="title-section">
        <h1 className="title">Browse Categories</h1>
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
