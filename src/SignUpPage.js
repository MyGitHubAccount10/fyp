import React, { useState } from 'react';
import './Website.css'; // Assuming Website.css contains all necessary styles

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
      {/* --- HEADER (Identical to LoginPage) --- */}
      <header>
        <div className="header-left-content">
          <button className="burger-btn" aria-label="Menu" title="Menu">
            <svg viewBox="0 0 24 24" fill="none"><path d="M3 12H21M3 6H21M3 18H21" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <a href="/" className="header-logo-link">
            {/* Assuming logoImage is correctly sourced or public path is working */}
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
          <a href="#" aria-label="User Account" className="header-icon-link" title="User Account"><svg viewBox="0 0 24 24" fill="none"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" stroke="#000" strokeWidth="1.5"/></svg></a>
          <span className="header-separator" />
          <div className="header-social-icons">
            <a href="#" aria-label="Instagram" title="Instagram"><img src="https://img.icons8.com/ios-glyphs/30/000000/instagram-new.png" alt="Instagram" /></a>
            <a href="#" aria-label="TikTok" title="TikTok"><img src="https://img.icons8.com/ios-glyphs/30/000000/tiktok.png" alt="TikTok" /></a>
          </div>
        </div>
      </header>

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
            {/* "Already have an account?" button styled like "Forgot Password?" from LoginPage */}
            {/* Using .update-cart-btn for the light background, dark text style as seen in Figma sketch for "Already have an account?" */}
            <button 
              className="update-cart-btn" 
              onClick={handleAlreadyHaveAccount}
              style={{ flexGrow: 1, backgroundColor: '#f0f0f0', color: '#333', border: '1px solid #ccc' }} // Adjusted styling to match Figma
            >
              Already have an account?
            </button>
            {/* "Sign Up" button styled like "Login" button from LoginPage */}
            {/* Using .complete-purchase-btn for the dark background, light text style */}
            <button 
              className="complete-purchase-btn" 
              onClick={handleSignUp}
              style={{ flexGrow: 1, backgroundColor: '#333', color: '#fff' }} // Adjusted styling to match Figma
            >
              Sign Up
            </button>
          </div>
          {/* Removed "Or log in with" section as it's not in the Figma for Sign Up */}
        </div>

        {/* Right Column - Role Card (Identical to LoginPage) */}
        <div style={{ backgroundColor: '#fdf0e9', borderRadius: '8px', padding: '30px 20px', width: '300px', textAlign: 'center', border: '1px solid #fce5d8' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#e0e0e0', margin: '0 auto 20px', backgroundSize: 'cover', backgroundPosition: 'center' /* You can add a placeholder image here if needed */ }}></div>
          <p style={{ fontWeight: 'bold', fontSize: '1.1em', marginBottom: '5px' }}>User / Admin</p>
          <div style={{ marginBottom: '15px' }}>
            <span style={{backgroundColor: '#e0e0e0', color: '#555', padding: '3px 8px', borderRadius: '4px', fontSize: '0.8em', marginRight: '5px' }}>User</span>
            <span style={{backgroundColor: '#e0e0e0', color: '#555', padding: '3px 8px', borderRadius: '4px', fontSize: '0.8em' }}>Admin</span>
          </div>
          <p style={{ fontSize: '0.9em', color: '#555', marginBottom: '20px' }}>Select your user role</p>
          {/* Using .update-cart-btn for the light background, dark text style as seen in Figma sketch for "Choose Role" */}
          <button 
            className="update-cart-btn" 
            style={{ marginTop: '10px', width: '100%', backgroundColor: '#333', color: '#fff', border: 'none' }}
          >
            Choose Role
          </button>
        </div>
      </div>

      {/* --- FOOTER (Identical to LoginPage) --- */}
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
          From humble beginnings in a small bookshop to growing into a community-driven crew, dedicated to producing the rare, wearable works of absolute drip. Our selection includes t-shirts, accessories, and art objects of all kinds. Our mission is simple: to spread the love of screenprinting and the stories that live between. The joy of that perfect, drippy glide.
        </div>
      </footer>
    </>
  );
};

export default SignUpPage;