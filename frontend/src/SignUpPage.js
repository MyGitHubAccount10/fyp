import React, { useState } from 'react';
import './Website.css';
import Header from './Header';
import Footer from './Footer';

const SignUpPage = () => {
  // State for separate email and phone number fields
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleAlreadyHaveAccount = () => {
    // In a real app, you would navigate to the login page
    alert('Navigating to login page...');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      email,
      phone_number: phone,
      username,
      password,
      role_id: 4001 // Automatically set role_id
    };

    try {
      const response = await fetch('/api/user/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        throw new Error('Failed to sign up');
      }

      const user = await response.json();

      // Save user to local storage
      localStorage.setItem('user', JSON.stringify(user));

      // Redirect to home page
      window.location.href = '/';
    } catch (error) {
      console.error(error);
      alert('Error signing up');
    }
  };

  return (
    <>
      <Header />
      {/* --- MAIN SIGN UP FORM --- */}
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '40px', marginTop: '40px' }}>
        {/* Left Column - Form */}
        <div style={{ flex: 1 }}>
          <h2 style={{ fontWeight: 'bold', fontSize: '2em', marginBottom: '10px' }}>Sign Up Form</h2>
          <p style={{ marginBottom: '30px', fontSize: '1em', color: '#555' }}>Create a new account!</p>
          {/* --- UPDATED INPUTS --- */}
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
              type="tel"
              placeholder="Enter your phone number"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              style={{ display: 'block', width: '100%', marginBottom: '15px', padding: '12px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
              required
            />
            {/* --- END OF UPDATED INPUTS --- */}
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={e => setUsername(e.target.value)}
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
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <button
                type="button" // Changed to type="button" to prevent form submission
                className="update-cart-btn"
                onClick={handleAlreadyHaveAccount}
                style={{ flexGrow: 1, backgroundColor: '#f0f0f0', color: '#333', border: '1px solid #ccc' }}
              >
                Already have an account?
              </button>
              <button
                type="submit"
                className="complete-purchase-btn"
                style={{ flexGrow: 1, backgroundColor: '#333', color: '#fff' }}
              >
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