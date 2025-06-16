import React, { useState } from 'react';
import './Website.css';
import Header from './Header';
import Footer from './Footer';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      email,
      password
    };

    try {
      setIsLoading(true);
      const response = await fetch('/api/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        throw new Error('Failed to log in');
      }

      const user = await response.json();

      // Save user to local storage
      localStorage.setItem('user', JSON.stringify(user));

      // Redirect to home page
      window.location.href = '/';
    } catch (error) {
      console.error(error);
      setError('Error logging in');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      {/* --- MAIN LOGIN FORM --- */}
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '40px', marginTop: '40px' }}>
        {/* Left Column - Form */}
        <div style={{ flex: 1 }}>
          <h2 style={{ fontWeight: 'bold', fontSize: '2em', marginBottom: '10px' }}>Login Form</h2>
          <p style={{ marginBottom: '30px', fontSize: '1em', color: '#555' }}>Login to your account!</p>

          {/* --- CONVERTED TO A FORM WITH ONSUBMIT --- */}
          <form onSubmit={handleSubmit}>
            <input
              type="email" // Changed type to "email" for better validation
              placeholder="Enter your email" // Updated placeholder
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
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}> {/* Adjusted marginBottom */}
              <button
                type="button" // Use type="button" to prevent form submission
                className="update-cart-btn"
                style={{ flexGrow: 1, backgroundColor: '#f0f0f0', color: '#333', border: '1px solid #ccc' }}
              >
                Forgot Password?
              </button>
              <button
                type="submit" // Use type="submit" to trigger the form's onSubmit
                className="complete-purchase-btn"
                style={{ flexGrow: 1, backgroundColor: '#333', color: '#fff' }}
                disabled={isLoading} // Disable button while loading
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
            </div>
            {/* Display error message from the hook */}
            {error && <div className="error" style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default LoginPage;