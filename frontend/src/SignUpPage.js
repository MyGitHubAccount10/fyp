// SignUpPage.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Website.css';
import Header from './Header';
import Footer from './Footer';

// The specific Role ID for "Customer" from your database collection.
const CUSTOMER_ROLE_ID = '6849293057e7f26973c9fb40';

const SignUpPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isPasswordTouched, setIsPasswordTouched] = useState(false);

  const validatePassword = (pass) => {
    if (pass.length < 8) return 'Password must be at least 8 characters long.';
    if (!/[A-Z]/.test(pass)) return 'Password must contain at least one uppercase letter.';
    if (!/[a-z]/.test(pass)) return 'Password must contain at least one lowercase letter.';
    if (!/[0-9]/.test(pass)) return 'Password must contain at least one number.';
    if (!/[!@#$%^&*]/.test(pass)) return 'Password must contain a special character (e.g., !@#$%^&*).';
    return '';
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    if (isPasswordTouched) {
      setPasswordError(validatePassword(newPassword));
    }
  };

  const handlePasswordBlur = () => {
    setIsPasswordTouched(true);
    setPasswordError(validatePassword(password));
  };

  const handleAlreadyHaveAccount = () => {
    navigate('/login');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validatePassword(password);
    if (validationError) {
      setPasswordError(validationError);
      setIsPasswordTouched(true);
      return;
    }

    const userData = {
      email,
      phone_number: phone,
      username,
      password,
      role_id: CUSTOMER_ROLE_ID, // Use the hardcoded constant here
    };

    try {
      const response = await fetch('/api/user/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Failed to sign up');
      }
      localStorage.setItem('user', JSON.stringify(result));
      window.location.href = '/';
    } catch (err) {
      console.error(err);
      alert(`Error signing up: ${err.message}`);
    }
  };

  const inputStyle = { display: 'block', width: '100%', marginBottom: '15px', padding: '12px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' };
  const errorInputStyle = { ...inputStyle, borderColor: '#e74c3c', marginBottom: '5px' };
  const errorMessageStyle = { color: '#e74c3c', fontSize: '0.875em', marginTop: '-10px', marginBottom: '15px' };

  return (
    <>
      <Header />
      <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', marginTop: '40px' }}>
        <div style={{ flex: 1, maxWidth: '500px' }}>
          <h2 style={{ fontWeight: 'bold', fontSize: '2em', marginBottom: '10px' }}>Sign Up Form</h2>
          <p style={{ marginBottom: '30px', fontSize: '1em', color: '#555' }}>Create a new account!</p>
          <form onSubmit={handleSubmit}>
            <input type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} required />
            <input type="tel" placeholder="Enter your phone number" value={phone} onChange={e => setPhone(e.target.value)} pattern="[689]\d{7}" title="Enter a valid 8-digit Singapore number starting with 6, 8, or 9." style={inputStyle} required />
            <input type="text" placeholder="Enter your username" value={username} onChange={e => setUsername(e.target.value)} style={inputStyle} required />
            <input type="password" placeholder="Enter your password" value={password} onChange={handlePasswordChange} onBlur={handlePasswordBlur} style={isPasswordTouched && passwordError ? errorInputStyle : inputStyle} required />
            {isPasswordTouched && passwordError && <p style={errorMessageStyle}>{passwordError}</p>}
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button type="button" className="update-cart-btn" onClick={handleAlreadyHaveAccount} style={{ flexGrow: 1, backgroundColor: '#f0f0f0', color: '#333', border: '1px solid #ccc' }}>
                Already have an account?
              </button>
              <button type="submit" className="complete-purchase-btn" style={{ flexGrow: 1, backgroundColor: '#333', color: '#fff' }}>
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SignUpPage;