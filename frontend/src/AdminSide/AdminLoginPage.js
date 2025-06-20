// src/AdminSide/AdminLoginPage.js

import React, { useState } from 'react';
import '../Website.css';
import AdminHeader from '../AdminHeader';
import Footer from '../Footer';

// --- Icons for password toggle ---
const EyeIcon = ({ size = 20, color = "currentColor" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>;
const EyeOffIcon = ({ size = 20, color = "currentColor" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>;

// ✅ FIX: The ADMIN_ROLE_ID is defined here at the top level.
const ADMIN_ROLE_ID = '6849291d57e7f26973c9fb3e';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const userData = { email, password };

    try {
      // ✅ FIX: 'response' is correctly defined here with `const`.
      const response = await fetch('/api/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      const user = await response.json();
      if (!response.ok) {
        throw new Error(user.error || 'Failed to log in');
      }      if (user && user.role && (
        user.role._id === ADMIN_ROLE_ID || 
        user.role.role_name === 'Admin' || 
        user.role.role_name === 'Super Admin' || 
        user.role.role_name === 'Super-Admin'
      )) {
        // Use the isolated storage key for admins and super admins
        localStorage.setItem('admin_user', JSON.stringify(user));
        window.location.href = '/admin-dashboard';
      } else {
        throw new Error('Access Denied. You do not have permission to log in here.');
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AdminHeader showNav={false} />
      <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div style={{ flex: 1, maxWidth: '450px' }}>          <h2 style={{ fontWeight: 'bold', fontSize: '2em', marginBottom: '10px', textAlign: 'center' }}>
            Admin Portal Login
          </h2>
          <p style={{ marginBottom: '30px', fontSize: '1em', color: '#555', textAlign: 'center' }}>
            Admin and Super Admin access only.
          </p>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{ display: 'block', width: '100%', marginBottom: '15px', padding: '12px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
              required
            />
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
            <button
              type="submit"
              className="complete-purchase-btn"
              style={{ width: '100%', backgroundColor: '#333', color: '#fff' }}
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
            {error && <div className="error" style={{ color: 'red', marginTop: '15px', textAlign: 'center', fontWeight: 'bold' }}>{error}</div>}
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AdminLoginPage;