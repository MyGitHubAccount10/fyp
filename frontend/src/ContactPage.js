import React, { useState } from 'react';
import './Website.css';
import Header from './Header';
import Footer from './Footer';
import emailjs from 'emailjs-com';

const contactBannerImage = '/images/AboutBanner.png'; // Reusing AboutBanner.png, replace if you have a specific contact banner

// ✅ ADDED: Self-contained InfoIcon component for hints
const InfoIcon = ({ hint }) => {
  const [isHovered, setIsHovered] = useState(false);

  const containerStyle = {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    marginLeft: '8px',
  };

  const iconStyle = {
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    backgroundColor: '#adb5bd',
    color: 'white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '12px',
    fontWeight: 'bold',
    fontFamily: 'sans-serif',
    cursor: 'pointer',
    userSelect: 'none',
  };

  const tooltipStyle = {
    visibility: isHovered ? 'visible' : 'hidden',
    opacity: isHovered ? 1 : 0,
    width: '240px',
    minWidth: '200px',
    maxWidth: '300px',
    backgroundColor: '#343a40',
    color: '#fff',
    textAlign: 'left',
    borderRadius: '6px',
    padding: '10px',
    position: 'absolute',
    zIndex: 1000,
    bottom: '140%',
    left: '50%',
    transform: 'translateX(-50%)',
    transition: 'opacity 0.2s ease-in-out',
    boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
    fontSize: '0.85em',
    lineHeight: '1.4',
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
    boxSizing: 'border-box',
  };

  // Enhanced CSS to fix tooltip positioning on all devices
  const mobileTooltipFix = `
    @media (max-width: 768px) {
      .info-tooltip-mobile-fix {
        width: auto !important;
        min-width: 200px;
        max-width: calc(100vw - 40px) !important;
        left: 0 !important;
        transform: none !important;
      }
    }
    @media (max-width: 480px) {
      .info-tooltip-mobile-fix {
        min-width: 180px;
        max-width: calc(100vw - 20px) !important;
        font-size: 0.8em !important;
        padding: 8px !important;
        bottom: 120% !important;
      }
    }
    @media (max-width: 360px) {
      .info-tooltip-mobile-fix {
        min-width: 150px;
        max-width: calc(100vw - 10px) !important;
        font-size: 0.75em !important;
        padding: 6px !important;
      }
    }
  `;

  return (
    <div 
      style={containerStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <style>{mobileTooltipFix}</style>
      <span style={iconStyle}>i</span>
      <div style={tooltipStyle} className="info-tooltip-mobile-fix">{hint}</div>
    </div>
  );
};

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

  // ✅ MODIFIED: Updated label style to align icon
  const labelStyle = { fontWeight: '600', marginBottom: '6px', display: 'flex', alignItems: 'center', fontSize: '0.9em' };
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
              <label style={labelStyle}>
                Name
                <InfoIcon hint="Please use only letters and spaces." />
              </label>
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

              <label style={labelStyle}>
                Email Address
                <InfoIcon hint="We'll use this address to reply to your feedback, e.g., 'name@example.com'." />
              </label>
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

              <label style={{...labelStyle, display: 'block'}}>Feedback</label>
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