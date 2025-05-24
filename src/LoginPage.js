import React, { useState } from 'react';
import './Website.css';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    alert(`Logging in as: ${username}`);
  };

  return (
    <>
      {/* --- HEADER --- */}
      <header>
        <div className="header-left-content">
          <button className="burger-btn" aria-label="Menu" title="Menu">
            <svg viewBox="0 0 24 24" fill="none"><path d="M3 12H21M3 6H21M3 18H21" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <a href="/" className="header-logo-link">
            <img src="/images/this-side-up-logo.png" alt="This Side Up Logo" className="header-logo-img" />
          </a>
          <nav className="header-nav-links">
            <a href="#">About</a>
            <a href="#">Contact</a>
            <a href="#">FAQ</a>
          </nav>
        </div>
        <div className="header-right-content">
          <form className="search-bar" onSubmit={e => e.preventDefault()}>
            <input type="search" placeholder="Search" />
            <button type="submit"><svg viewBox="0 0 24 24" fill="none"><path d="M11 19a8 8 0 100-16 8 8 0 000 16zM21 21l-4.35-4.35" stroke="#000" strokeWidth="2"/></svg></button>
          </form>
          {/* MODIFIED CART ICON HERE */}
          <a href="#" aria-label="Shopping Cart" className="header-icon-link" title="Shopping Cart">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 2L3 6V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 21.7893 20.2107 21.4142 20.5858 21.0391C20.9609 20.664 21.1716 20.1554 21.1716 19.625V6L18 2H6Z" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" transform="scale(0.9) translate(1.2, 1.2)"/>
                <path d="M3 6H21" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" transform="scale(0.9) translate(1.2, 1.2)"/>
                <path d="M16 10C16 11.0609 15.5786 12.0783 14.8284 12.8284C14.0783 13.5786 13.0609 14 12 14C10.9391 14 9.92172 13.5786 9.17157 12.8284C8.42143 12.0783 8 11.0609 8 10" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" transform="scale(0.9) translate(1.2, 1.2)"/>
            </svg>
          </a>
          <a href="#" className="header-icon-link" aria-label="User"><svg viewBox="0 0 24 24" fill="none"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" stroke="#000" strokeWidth="1.5"/></svg></a>
          <span className="header-separator" />
          <div className="header-social-icons">
            <a href="#"><img src="https://img.icons8.com/ios-glyphs/30/000000/instagram-new.png" alt="Instagram" /></a>
            <a href="#"><img src="https://img.icons8.com/ios-glyphs/30/000000/tiktok.png" alt="TikTok" /></a>
          </div>
        </div>
      </header>

      {/* --- MAIN LOGIN FORM --- */}
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', gap: '40px', marginTop: '40px' }}>
        {/* Left Column */}
        <div style={{ flex: 1 }}>
          <h2>Login Form</h2>
          <p>Login to your account!</p>
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px' }}
          />
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px' }}
          />
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <button className="update-cart-btn">Forgot Password?</button>
            <button className="complete-purchase-btn" onClick={handleLogin}>Login</button>
          </div>
          <hr />
          <p>Or log in with</p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <img src="https://img.icons8.com/color/32/google-logo.png" alt="Google" />
            <img src="https://img.icons8.com/color/32/windows-10.png" alt="Microsoft" />
          </div>
        </div>

        {/* Right Column - Role Card */}
        <div style={{ backgroundColor: '#f5eae4', borderRadius: '8px', padding: '20px', width: '280px', textAlign: 'center' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#ccc', margin: '0 auto 10px' }}></div>
          <p style={{ fontWeight: 'bold' }}>User / Admin</p>
          <p style={{ fontSize: '0.9em', color: '#555' }}>Select your user role</p>
          <button className="update-cart-btn" style={{ marginTop: '10px' }}>Choose Role</button>
        </div>
      </div>

      {/* --- FOOTER --- */}
      <footer className="footer">
        <div className="footer-column">
          <strong>#THISSIDEUP</strong>
          <div className="social-icons">
            <a href="#"><img src="https://img.icons8.com/ios-filled/50/ffffff/instagram-new.png" alt="Instagram" /></a>
            <a href="#"><img src="https://img.icons8.com/ios-filled/50/ffffff/tiktok--v1.png" alt="TikTok" /></a>
          </div>
        </div>
        <div className="footer-column">
          <strong>Customer Service</strong>
          <a href="#">Contact</a><br />
          <a href="#">FAQ</a><br />
          <a href="#">About</a>
        </div>
        <div className="footer-column">
          <strong>Handcrafted in Singapore</strong>
          From humble beginnings in a small beachside garage, we've grown into a community cornerstone, dedicated to providing the best accessories, and advice to all. Our mission is simple: to spread the joy of that perfect, glassy glide.
        </div>
      </footer>
    </>
  );
};

export default LoginPage;
