// LoginPage.js

import React, { useState } from 'react';
import './Website.css';
import Header from './Header';
import Footer from './Footer';

// --- Icons for password toggle ---
const EyeIcon = ({ size = 20, color = "currentColor" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>;
const EyeOffIcon = ({ size = 20, color = "currentColor" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>;

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // State for password visibility
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:4000/api/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }
      
      // Check if user is banned
      if (data.status === 'banned') {
        throw new Error('Access Denied. Your account has been banned. Please contact an administrator.');
      }
      
      localStorage.setItem('user', JSON.stringify(data));
      window.location.href = '/';
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Network error - please check your connection');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '40px', marginTop: '40px' }}>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontWeight: 'bold', fontSize: '2em', marginBottom: '10px' }}>Login Form</h2>
          <p style={{ marginBottom: '30px', fontSize: '1em', color: '#555' }}>Login to your account!</p>

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{ display: 'block', width: '100%', marginBottom: '15px', padding: '12px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
              required
            />

            {/* --- MODIFIED: Password Input with Toggle --- */}
            <div className="password-input-wrapper" style={{ marginBottom: '20px' }}>
                <input
                  type={isPasswordVisible ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
                  required
                />
                <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setIsPasswordVisible(prev => !prev)}
                >
                    {isPasswordVisible ? <EyeOffIcon /> : <EyeIcon />}
                </button>
            </div>
            
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <button
                type="button"
                className="update-cart-btn"
                style={{ flexGrow: 1, backgroundColor: '#f0f0f0', color: '#333', border: '1px solid #ccc' }}
              >
                Forgot Password?
              </button>
              <button
                type="submit"
                className="complete-purchase-btn"
                style={{ flexGrow: 1, backgroundColor: '#333', color: '#fff' }}
                disabled={isLoading}
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
            </div>
            {error && <div className="error" style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default LoginPage;