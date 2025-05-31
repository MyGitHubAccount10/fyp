import React, { useState } from 'react';
import './Website.css';
import Header from './Header';
import Footer from './Footer';

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
      <Footer />
    </>
  );
};

export default ContactPage;