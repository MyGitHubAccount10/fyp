// LoginPage.js

import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthContext } from './hooks/useAuthContext';
import './Website.css';
import Header from './Header';
import Footer from './Footer';
import socketService from './services/socketService';

// ... (EyeIcon and EyeOffIcon components remain the same) ...
const EyeIcon = ({ size = 20, color = "currentColor" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>;
const EyeOffIcon = ({ size = 20, color = "currentColor" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>;

// ✅ MODIFIED: InfoIcon component now includes a responsive style fix
// NEW, cleaner version for all your files
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
    backgroundColor: '#343a40',
    color: '#fff',
    textAlign: 'left',
    borderRadius: '6px',
    padding: '10px',
    position: 'absolute',
    zIndex: 10,
    bottom: '140%',
    left: '50%',
    transform: 'translateX(-50%)',
    transition: 'opacity 0.2s ease-in-out',
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
    fontSize: '0.85em',
    lineHeight: '1.4',
    whiteSpace: 'pre-wrap',
  };

  return (
    <div 
      style={containerStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span style={iconStyle}>i</span>
      <div style={tooltipStyle} className="info-tooltip-mobile-fix">{hint}</div>
    </div>
  );
};

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [apiError, setApiError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { dispatch } = useAuthContext();

  const validateEmail = (email) => {
    if (!email) return 'Email is required.';
    if (!/^\S+@\S+\.\S+$/.test(email)) return 'Please enter a valid email format.';
    return '';
  };

  const validatePassword = (pass) => {
    if (!pass) return 'Password is required.';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);

    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);
    setEmailError(emailErr);
    setPasswordError(passErr);
    if (emailErr || passErr) {
        return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }
      
      if (data.status === 'banned') {
        throw new Error('Access Denied. Your account has been banned. Please contact an administrator.');
      }
      
      localStorage.setItem('user', JSON.stringify(data));
      dispatch({ type: 'LOGIN', payload: data });

      if (data._id) {
        socketService.connect(data._id);
      }

      const from = location.state?.from || '/';
      navigate(from, { replace: true, state: location.state });

    } catch (error) {
      console.error('Login error:', error);
      setApiError(error.message || 'Network error - please check your connection');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoToSignUp = () => {
    navigate('/signup', { state: location.state });
  };
  
  const handleForgotPassword = () => {
    navigate('/forgot-password', { state: location.state });
  };

  const labelStyle = { fontWeight: '600', marginBottom: '6px', display: 'flex', alignItems: 'center', fontSize: '0.9em' };
  const inputStyle = { display: 'block', width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' };
  const errorInputStyle = { ...inputStyle, borderColor: '#e74c3c' };
  const errorMessageStyle = { color: '#e74c3c', fontSize: '0.875em', marginTop: '5px', marginBottom: '15px' };

  return (
    <>
      <div style={{ position: 'sticky', top: 0, zIndex: 1000}}>
      <Header />
      </div>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '40px', marginTop: '40px' }}>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontWeight: 'bold', fontSize: '2em', marginBottom: '10px' }}>Login Form</h2>
          <p style={{ marginBottom: '30px', fontSize: '1em', color: '#555' }}>Login to your account!</p>

          <form onSubmit={handleSubmit} noValidate>
            <label style={labelStyle}>
              Email Address
              <InfoIcon hint="Please enter the email address associated with your account, e.g., 'name@example.com'." />
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onBlur={() => setEmailError(validateEmail(email))}
              style={{ ...emailError ? errorInputStyle : inputStyle, marginBottom: emailError ? '0' : '15px' }}
            />
            {emailError && <p style={errorMessageStyle}>{emailError}</p>}
            
            <label style={labelStyle}>Password</label>
            <div className="password-input-wrapper" style={{ marginBottom: passwordError ? '0' : '20px' }}>
                <input
                  type={isPasswordVisible ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onBlur={() => setPasswordError(validatePassword(password))}
                  style={passwordError ? errorInputStyle : inputStyle}
                />
                <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setIsPasswordVisible(prev => !prev)}
                >
                    {isPasswordVisible ? <EyeOffIcon /> : <EyeIcon />}
                </button>
            </div>
            {passwordError && <p style={errorMessageStyle}>{passwordError}</p>}
            
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <button
                type="button"
                className="update-cart-btn"
                onClick={handleForgotPassword}
                style={{ flexGrow: 1, backgroundColor: '#f0f0f0', color: '#333', border: '1px solid #ccc' }}>
                Forgot Password?
              </button>
              <button
                type="submit"
                className="complete-purchase-btn"
                style={{ flexGrow: 1, backgroundColor: '#333', color: '#fff' }}
                disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
            </div>
            {apiError && <div className="error" style={{ color: 'red', marginTop: '10px' }}>{apiError}</div>}
            
            <div style={{ marginTop: '20px' }}>
              <button
                type="button"
                className="update-cart-btn"
                onClick={handleGoToSignUp}
                style={{
                  width: '100%',
                  backgroundColor: '#f0f0f0',
                  color: '#333',
                  border: '1px solid #ccc'
                }}
              >
                Don't have an account? Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default LoginPage;