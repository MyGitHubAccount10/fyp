// LoginPage.js

import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthContext } from './hooks/useAuthContext';
import './Website.css';
import Header from './Header';
import Footer from './Footer';

// ... (EyeIcon and EyeOffIcon components remain the same) ...
const EyeIcon = ({ size = 20, color = "currentColor" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>;
const EyeOffIcon = ({ size = 20, color = "currentColor" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>;


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

  // ... (validation and handleSubmit functions are unchanged) ...
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

      // ✅ FIX: The navigation logic is updated here.
      // It retrieves the intended destination (e.g., '/place-order') from the location state.
      const from = location.state?.from || '/';
      // It then navigates to that destination, passing the *entire* state object along.
      // This ensures that the 'buyNowItem' is preserved and passed to PlaceOrderPage.
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
  
  // --- ADDED: Handler to navigate to the forgot password page ---
  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  const inputStyle = { display: 'block', width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' };
  const errorInputStyle = { ...inputStyle, borderColor: '#e74c3c' };
  const errorMessageStyle = { color: '#e74c3c', fontSize: '0.875em', marginTop: '5px', marginBottom: '15px' };

  return (
    <>
      <Header />
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '40px', marginTop: '40px' }}>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontWeight: 'bold', fontSize: '2em', marginBottom: '10px' }}>Login Form</h2>
          <p style={{ marginBottom: '30px', fontSize: '1em', color: '#555' }}>Login to your account!</p>

          <form onSubmit={handleSubmit} noValidate>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onBlur={() => setEmailError(validateEmail(email))}
              style={{ ...emailError ? errorInputStyle : inputStyle, marginBottom: emailError ? '0' : '15px' }}
            />
            {emailError && <p style={errorMessageStyle}>{emailError}</p>}

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
              {/* --- MODIFIED: Added onClick handler to this button --- */}
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