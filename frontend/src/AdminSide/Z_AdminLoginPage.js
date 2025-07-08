// src/AdminSide/AdminLoginPage.js

import React, { useState } from 'react';
import '../Website.css';
import AdminHeader from '../AdminHeader';
import Footer from '../Footer';

// --- Icons for password toggle ---
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";


const ADMIN_ROLE_ID = '6849291d57e7f26973c9fb3e';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // State for validation and API errors
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [apiError, setApiError] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // Validation functions
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

    // Run validations on submit
    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);
    setEmailError(emailErr);
    setPasswordError(passErr);
    
    // If there are validation errors, stop the submission
    if (emailErr || passErr) {
        return;
    }

    setIsLoading(true);
    const userData = { email, password };

    try {
      const response = await fetch('/api/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      const user = await response.json();
      if (!response.ok) {
        throw new Error(user.error || 'Failed to log in');
      }

      if (user && user.role && (
        user.role._id === ADMIN_ROLE_ID || 
        user.role.role_name === 'Admin' || 
        user.role.role_name === 'Super Admin' || 
        user.role.role_name === 'Super-Admin'
      )) {
        if (user.status === 'banned') {
          throw new Error('Access Denied. Your account has been banned. Please contact an administrator.');
        }
        
        localStorage.setItem('admin_user', JSON.stringify(user));
        window.location.href = '/admin-dashboard';
      } else {
        throw new Error('Access Denied. You do not have permission to log in here.');
      }
    } catch (err) {
      console.error(err);
      setApiError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Styles for inputs and error messages
  const inputStyle = { display: 'block', width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' };
  const errorInputStyle = { ...inputStyle, borderColor: '#e74c3c' };
  const errorMessageStyle = { color: '#e74c3c', fontSize: '0.875em', marginTop: '5px', marginBottom: '15px' };

  return (
    <>
            <div style={{ position: 'sticky', top: 0, zIndex: 1000}}>
                <AdminHeader showNav={false} />
            </div>  
      <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div style={{ flex: 1, maxWidth: '450px' }}>
          <h2 style={{ fontWeight: 'bold', fontSize: '2em', marginBottom: '10px', textAlign: 'center' }}>
            Admin Portal Login
          </h2>
          <p style={{ marginBottom: '30px', fontSize: '1em', color: '#555', textAlign: 'center' }}>
            Admin and Super Admin access only.
          </p>
          <form onSubmit={handleSubmit} noValidate>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onBlur={() => setEmailError(validateEmail(email))}
              style={{...emailError ? errorInputStyle : inputStyle, marginBottom: emailError ? '0' : '15px'}}
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
                    {isPasswordVisible ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                </button>
            </div>
            {passwordError && <p style={errorMessageStyle}>{passwordError}</p>}

            <button
              type="submit"
              className="complete-purchase-btn"
              style={{ width: '100%', backgroundColor: '#333', color: '#fff' }}
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
            {apiError && <div className="error" style={{ color: 'red', marginTop: '15px', textAlign: 'center', fontWeight: 'bold' }}>{apiError}</div>}
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AdminLoginPage;