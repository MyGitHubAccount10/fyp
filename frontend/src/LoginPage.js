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
            <input type="search" placeholder="Search" aria-label="Search site" />
            <button type="submit" aria-label="Submit search" title="Search"><svg viewBox="0 0 24 24" fill="none"><path d="M11 19a8 8 0 100-16 8 8 0 000 16zM21 21l-4.35-4.35" stroke="#000" strokeWidth="2"/></svg></button>
          </form>
          <a href="#" aria-label="Shopping Cart" className="header-icon-link" title="Shopping Cart">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 2L3 6V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 21.7893 20.2107 21.4142 20.5858 21.0391C20.9609 20.664 21.1716 20.1554 21.1716 19.625V6L18 2H6Z" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" transform="scale(0.9) translate(1.2, 1.2)"/>
                <path d="M3 6H21" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" transform="scale(0.9) translate(1.2, 1.2)"/>
                <path d="M16 10C16 11.0609 15.5786 12.0783 14.8284 12.8284C14.0783 13.5786 13.0609 14 12 14C10.9391 14 9.92172 13.5786 9.17157 12.8284C8.42143 12.0783 8 11.0609 8 10" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" transform="scale(0.9) translate(1.2, 1.2)"/>
            </svg>
          </a>
          <a href="#" className="header-icon-link" aria-label="User Account" title="User Account"><svg viewBox="0 0 24 24" fill="none"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" stroke="#000" strokeWidth="1.5"/></svg></a>
          <span className="header-separator" />
          <div className="header-social-icons">
            <a href="#" aria-label="Instagram" title="Instagram"><img src="https://img.icons8.com/ios-glyphs/30/000000/instagram-new.png" alt="Instagram" /></a>
            <a href="#" aria-label="TikTok" title="TikTok"><img src="https://img.icons8.com/ios-glyphs/30/000000/tiktok.png" alt="TikTok" /></a>
          </div>
        </div>
      </header>

      {/* --- MAIN LOGIN FORM --- */}
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '40px', marginTop: '40px' }}>
        {/* Left Column */}
        <div style={{ flex: 1 }}>
          <h2 style={{ fontWeight: 'bold', fontSize: '2em', marginBottom: '10px' }}>Login Form</h2>
          <p style={{ marginBottom: '30px', fontSize: '1em', color: '#555' }}>Login to your account!</p>
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
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}> {/* Increased marginBottom */}
            <button className="update-cart-btn" style={{flexGrow: 1, backgroundColor: '#f0f0f0', color: '#333', border: '1px solid #ccc'}}>Forgot Password?</button>
            <button className="complete-purchase-btn" onClick={handleLogin} style={{flexGrow: 1, backgroundColor: '#333', color: '#fff'}}>Login</button>
          </div>
        </div>

        {/* Right Column - Role Card (UPDATED TO MATCH SIGNUP PAGE) */}
        <div style={{ backgroundColor: '#fdf0e9', borderRadius: '8px', padding: '30px 20px', width: '300px', textAlign: 'center', border: '1px solid #fce5d8' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#e0e0e0', margin: '0 auto 20px' /* You can add a placeholder image/icon here if needed */ }}></div>
          <p style={{ fontWeight: 'bold', fontSize: '1.1em', marginBottom: '5px' }}>User / Admin</p>
          <div style={{ marginBottom: '15px' }}>
            <span style={{backgroundColor: '#e0e0e0', color: '#555', padding: '3px 8px', borderRadius: '4px', fontSize: '0.8em', marginRight: '5px' }}>User</span>
            <span style={{backgroundColor: '#e0e0e0', color: '#555', padding: '3px 8px', borderRadius: '4px', fontSize: '0.8em' }}>Admin</span>
          </div>
          <p style={{ fontSize: '0.9em', color: '#555', marginBottom: '20px' }}>Select your user role</p>
          <button 
            className="update-cart-btn" // Base class, specific styles override
            style={{ marginTop: '10px', width: '100%', backgroundColor: '#333', color: '#fff', border: 'none', padding: '12px', borderRadius: '4px', fontSize: '1em' }} // Added padding, border-radius, font-size to match image
          >
            Choose Role
          </button>
        </div>
      </div>

      {/* --- FOOTER --- */}
      <footer className="footer">
        <div className="footer-column">
          <strong>#THISSIDEUP</strong>
          <div className="social-icons">
            <a href="#" aria-label="Instagram" title="Instagram"><img src="https://img.icons8.com/ios-filled/50/ffffff/instagram-new.png" alt="Instagram" /></a>
            <a href="#" aria-label="TikTok" title="TikTok"><img src="https://img.icons8.com/ios-filled/50/ffffff/tiktok--v1.png" alt="TikTok" /></a>
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
          Here at This Side Up, we're a passionate, Singapore-based skimboard company committed to bringing the exhilarating rush of skimboarding to enthusiasts of every skill level. We specialize in crafting custom-designed skimboards, blending high-quality materials with your unique, personalized designs. The result? Boards that not only perform exceptionally but let your individual style shine on the shore. Rooted in Singapore's vibrant coastal culture, we aim to inspire a spirited community of adventure seekers and champion an active, sun-soaked lifestyle.
        </div>
      </footer>
    </>
  );
};

export default LoginPage;
