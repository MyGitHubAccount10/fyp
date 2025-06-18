// src/AdminSide/AdminLoginPage.js

import React, { useState } from 'react';
import '../Website.css';
// --- FIX: Import the AdminHeader instead of the regular Header ---
import AdminHeader from '../AdminHeader';
import Footer from '../Footer';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const userData = {
      email,
      password
    };

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

      // This logic will need to be re-enabled when you turn auth back on
      // For now, we'll simulate a successful login
      if (user) { // A simple check to see if we got a user object back
        // In a real scenario, you'd check: user.role.role_name === 'Admin'
        
        // This part is disabled as auth is off, but kept for future reference
        // localStorage.setItem('user', JSON.stringify(user));
        
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
      {/* --- FIX: Use AdminHeader and pass a prop to hide the nav links --- */}
      <AdminHeader showNav={false} />

      <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div style={{ flex: 1, maxWidth: '450px' }}>
          <h2 style={{ fontWeight: 'bold', fontSize: '2em', marginBottom: '10px', textAlign: 'center' }}>
            Admin Dashboard Login
          </h2>
          <p style={{ marginBottom: '30px', fontSize: '1em', color: '#555', textAlign: 'center' }}>
            Please log in to continue.
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
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{ display: 'block', width: '100%', marginBottom: '20px', padding: '12px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
              required
            />
            
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