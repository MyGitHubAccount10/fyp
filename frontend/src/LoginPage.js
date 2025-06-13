import React, { useState } from 'react';
import './Website.css';
import Header from './Header';
import Footer from './Footer';
import { useLogin } from '../src/hooks/useLogin'; // Make sure this path is correct

const LoginPage = () => {
  // Renamed 'username' to 'email' to match the hook's requirements
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, error, isLoading } = useLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
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

        {/* Right Column - Role Card (Unchanged) */}
        <div style={{ backgroundColor: '#fdf0e9', borderRadius: '8px', padding: '30px 20px', width: '300px', textAlign: 'center', border: '1px solid #fce5d8' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#e0e0e0', margin: '0 auto 20px' }}></div>
          <p style={{ fontWeight: 'bold', fontSize: '1.1em', marginBottom: '5px' }}>User / Admin</p>
          <div style={{ marginBottom: '15px' }}>
            <span style={{ backgroundColor: '#e0e0e0', color: '#555', padding: '3px 8px', borderRadius: '4px', fontSize: '0.8em', marginRight: '5px' }}>User</span>
            <span style={{ backgroundColor: '#e0e0e0', color: '#555', padding: '3px 8px', borderRadius: '4px', fontSize: '0.8em' }}>Admin</span>
          </div>
          <p style={{ fontSize: '0.9em', color: '#555', marginBottom: '20px' }}>Select your user role</p>
          <button
            type="button" // Set type to button
            className="update-cart-btn"
            style={{ marginTop: '10px', width: '100%', backgroundColor: '#333', color: '#fff', border: 'none', padding: '12px', borderRadius: '4px', fontSize: '1em' }}
          >
            Choose Role
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default LoginPage;