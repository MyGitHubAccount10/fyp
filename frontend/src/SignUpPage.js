import React, { useState } from 'react';
import './Website.css';
import Header from './Header';
import Footer from './Footer';

const SignUpPage = () => {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');


  const handleSignUp = () => {
    // In a real app, you would handle the sign-up logic here
    alert(`Signing up with:
    Email/Phone: ${emailOrPhone}
    Username: ${username}
    Password: ${password} (not shown for security)`);
  };

  const handleAlreadyHaveAccount = () => {
    // In a real app, you would navigate to the login page
    alert('Navigating to login page...');
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
          <input
            type="text"
            placeholder="Enter your email or phone number"
            value={emailOrPhone}
            onChange={e => setEmailOrPhone(e.target.value)}
            style={{ display: 'block', width: '100%', marginBottom: '15px', padding: '12px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
          />
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            style={{ display: 'block', width: '100%', marginBottom: '15px', padding: '12px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
          />
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ display: 'block', width: '100%', marginBottom: '20px', padding: '12px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
          />
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <button 
              className="update-cart-btn" 
              onClick={handleAlreadyHaveAccount}
              style={{ flexGrow: 1, backgroundColor: '#f0f0f0', color: '#333', border: '1px solid #ccc' }}
            >
              Already have an account?
            </button>
            <button 
              className="complete-purchase-btn" 
              onClick={handleSignUp}
              style={{ flexGrow: 1, backgroundColor: '#333', color: '#fff' }}
            >
              Sign Up
            </button>
          </div>
        </div>

        {/* Right Column - Role Card (Identical to LoginPage) */}
        <div style={{ backgroundColor: '#fdf0e9', borderRadius: '8px', padding: '30px 20px', width: '300px', textAlign: 'center', border: '1px solid #fce5d8' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#e0e0e0', margin: '0 auto 20px', backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
          <p style={{ fontWeight: 'bold', fontSize: '1.1em', marginBottom: '5px' }}>User / Admin</p>
          <div style={{ marginBottom: '15px' }}>
            <span style={{backgroundColor: '#e0e0e0', color: '#555', padding: '3px 8px', borderRadius: '4px', fontSize: '0.8em', marginRight: '5px' }}>User</span>
            <span style={{backgroundColor: '#e0e0e0', color: '#555', padding: '3px 8px', borderRadius: '4px', fontSize: '0.8em' }}>Admin</span>
          </div>
          <p style={{ fontSize: '0.9em', color: '#555', marginBottom: '20px' }}>Select your user role</p>
          <button 
            className="update-cart-btn" 
            style={{ marginTop: '10px', width: '100%', backgroundColor: '#333', color: '#fff', border: 'none' }}
          >
            Choose Role
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SignUpPage;