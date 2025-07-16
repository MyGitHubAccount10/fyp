import React, { useState } from 'react';
import './Website.css';
import Header from './Header';
import Footer from './Footer';
import emailjs from 'emailjs-com';

const contactBannerImage = '/images/AboutBanner.png'; // Reusing AboutBanner.png, replace if you have a specific contact banner

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    feedback: '',
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
    if (!formData.name || !formData.email || !formData.feedback) {
      alert('Please fill in all fields.');
      return;
    }
    // Email validation regex (simple one)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        alert('Please enter a valid email address.');
        return;
    }
    
    // Send email using EmailJS to the company
    emailjs
    .send("service_1igyvic","template_1igpjgb", 
    { name: formData.name , email: formData.email, feedback: formData.feedback },
    "-v7XRaWPXUv9k2m0a")
    .then((res) => {
      console.log('Email sent successfully:', res.status, res.text);
    })
    .catch((err) => {
      console.error('Failed to send email:', JSON.stringify(err));
    });

    // Send email using EmailJS to the user
    emailjs
    .send("service_1igyvic","template_k1lm8qi", 
    { name: formData.name , email: formData.email, feedback: formData.feedback },
    "-v7XRaWPXUv9k2m0a")
    .then((res) => {
      console.log('Email sent successfully:', res.status, res.text);
    })
    .catch((err) => {
      console.error('Failed to send email:', JSON.stringify(err));
    });

    alert(`Thank you, ${formData.name}! Your feedback has been submitted:\nEmail: ${formData.email}\nFeedback: ${formData.feedback}`);
    // In a real app, you would send this data to a backend server
    setFormData({ name: '', email: '', feedback: '' }); // Clear form
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
              <label htmlFor="feedback" className="contact-form-label">Feedback</label>
              <textarea
                id="feedback"
                name="feedback"
                className="contact-form-textarea"
                rows="6"
                value={formData.feedback}
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