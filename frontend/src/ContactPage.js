import React, { useState } from 'react';
import './Website.css';
import Header from './Header';

const contactBannerImage = '/images/AboutBanner.png'; // Reusing AboutBanner.png, replace if you have a specific contact banner

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      alert('Please fill in all fields.');
      return;
    }
    // Email validation regex (simple one)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        alert('Please enter a valid email address.');
        return;
    }
    
    alert(`Thank you, ${formData.name}! Your message has been submitted:\nEmail: ${formData.email}\nMessage: ${formData.message}`);
    // In a real app, you would send this data to a backend server
    setFormData({ name: '', email: '', message: '' }); // Clear form
  };

  return (
    <>
      <Header />
      {/* --- MAIN CONTACT PAGE CONTENT --- */}
      <main className="contact-page-content">
        <section className="contact-banner-section">
          <img src={contactBannerImage} alt="Colorful paint brushes" className="contact-banner-image" />
          <h1 className="contact-banner-title">Contact</h1>
        </section>

        <section className="contact-form-section container">
          <h2 className="contact-form-main-title">Contact Us</h2>
          <form onSubmit={handleSubmit} className="contact-form-actual">
            <div className="contact-form-group">
              <label htmlFor="name" className="contact-form-label">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                className="contact-form-input"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="contact-form-group">
              <label htmlFor="email" className="contact-form-label">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                className="contact-form-input"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="contact-form-group">
              <label htmlFor="message" className="contact-form-label">Message</label>
              <textarea
                id="message"
                name="message"
                className="contact-form-textarea"
                rows="6"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <div className="contact-form-submit-group">
              <button type="submit" className="contact-submit-button">Submit</button>
            </div>
          </form>
        </section>
      </main>

      {/* --- FOOTER --- */}
      <footer className="footer">
        <div className="footer-column">
          <strong>#THISSIDEUP</strong>
          <div className="social-icons">
            <a href="#" aria-label="Instagram" title="Instagram"><img src="https://img.icons8.com/ios-filled/50/ffffff/instagram-new.png" alt="Instagram" /></a>
            <a href="#" aria-label="TikTok" title="TikTok"><img src="https://img.icons8.com/ios-filled/50/ffffff/tiktok--v1.png" alt="TikTok" /></a>
          </div>
        </div>
        <div className="footer-column">
          <strong>Customer Service</strong>
          <a href="#">Contact</a><br />
          <a href="#">FAQ</a><br />
          <a href="#">About</a>
        </div>
        <div className="footer-column">
          <strong>Handcrafted in Singapore</strong>
          Here at This Side Up, we're a passionate, Singapore-based skimboard company committed to bringing the exhilarating rush of skimboarding to enthusiasts of every skill level. We specialize in crafting custom-designed skimboards, blending high-quality materials with your unique, personalized designs. The result? Boards that not only perform exceptionally but let your individual style shine on the shore. Rooted in Singapore's vibrant coastal culture, we aim to inspire a spirited community of adventure seekers and champion an active, sun-soaked lifestyle.
        </div>
      </footer>
    </>
  );
};

export default ContactPage;