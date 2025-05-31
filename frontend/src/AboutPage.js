import React, { useState } from 'react';
import './Website.css';
import Header from './Header';
import Footer from './Footer';

const aboutBannerImage = '/images/AboutBanner.png'; // Banner image for About page

const AboutPage = () => {
  return (
    <>
    <Header />
      {/* --- MAIN ABOUT PAGE CONTENT --- */}
      <main className="about-page-content">
        <section className="about-banner-section">
          <img src={aboutBannerImage} alt="Colorful paint brushes" className="about-banner-image" />
          <h1 className="about-banner-title">About</h1>
        </section>

        <section className="about-main-text container">
          <h2 className="about-section-title">About This Side Up</h2>
          <div className="about-orange-divider"></div>
          <h3 className="about-story-subtitle">Our Story: Riding the Tides of Passion</h3>
          <p className="about-story-paragraph">
            Here at This Side Up, we're a passionate, Singapore-based skimboard company committed to bringing the exhilarating rush
            of skimboarding to enthusiasts of every skill level. We specialize in crafting custom-designed skimboards, blending high-quality
            materials with your unique, personalized designs. The result? Boards that not only perform exceptionally but let
            your individual style shine on the shore. Rooted in Singapore's vibrant coastal culture, we aim to inspire a spirited
            community of adventure seekers and champion an active, sun-soaked lifestyle.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default AboutPage;