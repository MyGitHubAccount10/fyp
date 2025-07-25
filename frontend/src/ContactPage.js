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

  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    feedback: '',
  });

  const validateName = (name) => {
    if (!name) return 'Name is required.';
    if (!/^[a-zA-Z\s]*$/.test(name)) {
      return 'Name must only contain letters and spaces.';
    }
    return '';
  };

  const validateEmail = (email) => {
    if (!email) return 'Email is required.';
    if (!/^\S+@\S+\.\S+$/.test(email)) return 'Please enter a valid email format (e.g., name@example.com).';
    return '';
  };

  const validateFeedback = (feedback) => {
    if (!feedback) return 'Feedback is required.';
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate all fields
    const nameError = validateName(formData.name);
    const emailError = validateEmail(formData.email);
    const feedbackError = validateFeedback(formData.feedback);
    
    setFormErrors({
      name: nameError,
      email: emailError,
      feedback: feedbackError,
    });

    // If there are errors, don't submit
    if (nameError || emailError || feedbackError) {
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

    alert(`Thank you, ${formData.name}! Your feedback has been submitted.`);
    setFormData({ name: '', email: '', feedback: '' }); // Clear form
    setFormErrors({ name: '', email: '', feedback: '' }); // Clear errors
  };

  const labelStyle = { fontWeight: '600', marginBottom: '6px', display: 'block', fontSize: '0.9em' };
  const inputStyle = { display: 'block', width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' };
  const textareaStyle = { ...inputStyle, resize: 'vertical', minHeight: '120px' };
  const errorInputStyle = { ...inputStyle, borderColor: '#e74c3c' };
  const errorTextareaStyle = { ...textareaStyle, borderColor: '#e74c3c' };
  const errorMessageStyle = { color: '#e74c3c', fontSize: '0.875em', marginTop: '5px', marginBottom: '15px' };

  return (
    <>
      <div style={{ position: 'sticky', top: 0, zIndex: 1000}}>
      <Header />
      </div>
      {/* --- MAIN CONTACT PAGE CONTENT --- */}
      <main className="contact-page-content">
        <section className="contact-banner-section">
          <img src={contactBannerImage} alt="Colorful paint brushes" className="contact-banner-image" />
          <h1 className="contact-banner-title">Contact</h1>
        </section>

        <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', marginTop: '40px' }}>
          <div style={{ flex: 1, maxWidth: '500px' }}>
            <h2 style={{ fontWeight: 'bold', fontSize: '2em', marginBottom: '10px' }}>Contact Us</h2>
            <p style={{ marginBottom: '30px', fontSize: '1em', color: '#555' }}>We'd love to hear from you!</p>
            
            <form onSubmit={handleSubmit} noValidate>
              <label style={labelStyle}>Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                onBlur={() => setFormErrors(prev => ({ ...prev, name: validateName(formData.name) }))}
                style={{...formErrors.name ? errorInputStyle : inputStyle, marginBottom: formErrors.name ? '0' : '15px'}}
              />
              {formErrors.name && <p style={errorMessageStyle}>{formErrors.name}</p>}

              <label style={labelStyle}>Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                onBlur={() => setFormErrors(prev => ({ ...prev, email: validateEmail(formData.email) }))}
                style={{...formErrors.email ? errorInputStyle : inputStyle, marginBottom: formErrors.email ? '0' : '15px'}}
              />
              {formErrors.email && <p style={errorMessageStyle}>{formErrors.email}</p>}

              <label style={labelStyle}>Feedback</label>
              <textarea
                name="feedback"
                placeholder="Enter your feedback"
                rows="6"
                value={formData.feedback}
                onChange={handleChange}
                onBlur={() => setFormErrors(prev => ({ ...prev, feedback: validateFeedback(formData.feedback) }))}
                style={{...formErrors.feedback ? errorTextareaStyle : textareaStyle, marginBottom: formErrors.feedback ? '0' : '15px'}}
              />
              {formErrors.feedback && <p style={errorMessageStyle}>{formErrors.feedback}</p>}

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  type="submit"
                  className="complete-purchase-btn"
                  style={{ width: '100%', backgroundColor: '#333', color: '#fff', padding: '12px', border: 'none', borderRadius: '4px', fontSize: '1em', cursor: 'pointer' }}
                >
                  Submit Feedback
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ContactPage;