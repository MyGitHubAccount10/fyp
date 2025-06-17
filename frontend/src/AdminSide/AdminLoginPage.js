// src/AdminSide/AdminLoginPage.js

import React, { useState } from 'react';
import '../Website.css'; // You can use the same base styles
import Header from '../Header'; // You might want a different, simpler header later
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
      // We use the same login endpoint as regular users
      const response = await fetch('/api/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      const user = await response.json();

      if (!response.ok) {
        // If the server returns an error (e.g., wrong password), display it
        throw new Error(user.error || 'Failed to log in');
      }

      // --- CRITICAL ADMIN CHECK ---
      // Check if the user object includes the role and if that role is 'Admin'
      // This assumes your API returns the role name. See the backend note below.
      if (user && user.role && user.role.role_name === 'Admin') {
        // SUCCESS: The user is an admin.
        localStorage.setItem('user', JSON.stringify(user));
        // Redirect to the admin dashboard
        window.location.href = '/admin-dashboard';
      } else {
        // FAILURE: The user is not an admin or role data is missing.
        throw new Error('Access Denied. You do not have permission to log in here.');
      }

    } catch (err) {
      console.error(err);
      setError(err.message); // Display the specific error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
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