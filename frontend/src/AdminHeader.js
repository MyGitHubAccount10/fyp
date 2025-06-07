import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import './AdminHeader.css'; // Assuming this path is correct for your project structure

// Assume images are in public/images/ directory relative to your server's root
const logoImage = '/images/this-side-up-logo.png';

// Simple SVG Icons for secondary navigation (black color is set via CSS or inline fill)
const TshirtIcon = () => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="black">
        <path d="M12,2C9.243,2,7,4.243,7,7v3H5c-1.103,0-2,0.897-2,2v8c0,1.103,0.897,2,2,2h14c1.103,0,2-0.897,2-2v-8c0-1.103-0.897-2-2-2h-2V7 C17,4.243,14.757,2,12,2z M10,7V6c0-1.103,0.897-2,2-2s2,0.897,2,2v1H10z"/>
    </svg>
);
const JacketIcon = () => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="black">
        <path d="M18 7h-2V5c0-1.103-.897-2-2-2h-4c-1.103 0-2 .897-2 2v2H6c-1.103 0-2 .897-2 2v10c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2V9c0-1.103-.897-2-2-2zm-8-2h4v2h-4V5zm6 14H8V9h8v10z"/>
        <path d="M10 12h4v2h-4zm0 15h4v2h-4z"/>
    </svg>
);
const BoardshortsIcon = () => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="black">
        <path d="M8 2v4H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4v-6h4v6h4c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-2V2h-8zm2 5h4v3h-4V7z"/>
    </svg>
);
const AccessoriesIcon = () => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="black">
        <path d="M21.41,11.59l-9-9C12.05,2.24,11.55,2,11,2H4C2.9,2,2,2.9,2,4v7c0,0.55,0.24,1.05,0.59,1.41l9,9 C11.95,21.76,12.45,22,13,22s1.05-0.24,1.41-0.59l7-7C22.17,13.66,22.17,12.34,21.41,11.59z M13,20L4,11V4h7l9,9L13,20z"/>
        <circle cx="6.5" cy="6.5" r="1.5"/>
    </svg>
);

const SkimboardIcon = () => ( // Added Skimboard Icon
    <svg viewBox="0 0 24 24" width="18" height="18" fill="black" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 3 C 6 5, 4 10, 4 14 C 4 18, 7 21, 12 21 C 17 21, 20 18, 20 14 C 20 10, 18 5, 12 3 Z" />
    </svg>
);

const Header = () => {
    const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false); 

    const toggleProductDropdown = (e) => {
        e.preventDefault();
        setIsProductDropdownOpen(!isProductDropdownOpen);
    };
    
    return (
        <>
            <header>
            <div className="Admin-header-left-content">
                <Link to="/admin-dashboard" className="Admin-header-logo-link">
                    <img src={logoImage} alt="This Side Up Logo" className="Admin-header-logo-img" />
                </Link>
            </div>
            <div>
                <nav className="Admin-header-nav-links">
                    <a href="#" onClick={toggleProductDropdown} className="Admin-product-dropdown-toggle">
                        ADMIN
                        <svg className={`Admin-product-arrow ${isProductDropdownOpen ? 'up' : ''}`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <polyline points="6 9 12 15 18 9" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></polyline>
                        </svg>
                    </a>
                </nav>
            </div>
            <div className="Admin-header-right-content">
                <Link to="/profile" aria-label="User Account" className="Admin-header-icon-link" title="User Account">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </Link>
                <span className="Admin-header-separator"></span>
                <div className="Admin-header-social-icons">
                    <a href="#" aria-label="Instagram" title="Instagram"><img src="https://img.icons8.com/ios-glyphs/30/000000/instagram-new.png" alt="Instagram" /></a>
                    <a href="#" aria-label="TikTok" title="TikTok"><img src="https://img.icons8.com/ios-glyphs/30/000000/tiktok.png" alt="TikTok" /></a>
                </div>
            </div>
            </header>

            {isProductDropdownOpen && (
                <nav className="Admin-secondary-navbar">
                    <NavLink to="/manage-products" className="Admin-secondary-navbar-item" onClick={() => setIsProductDropdownOpen(false)}> {/* Added Link and onClick to close */}
                        <SkimboardIcon /> Products
                    </NavLink>
                    <NavLink to="/all-orders" className="Admin-secondary-navbar-item" onClick={() => setIsProductDropdownOpen(false)}> {/* Added Link and onClick to close */}
                        <TshirtIcon /> Orders
                    </NavLink>
                    <NavLink to="/all-customers" className="Admin-secondary-navbar-item" onClick={() => setIsProductDropdownOpen(false)}> {/* Added Link and onClick to close */}
                        <JacketIcon /> Customers
                    </NavLink>
                    <NavLink to="" className="Admin-secondary-navbar-item" onClick={() => setIsProductDropdownOpen(false)}> {/* Added Link and onClick to close */}
                        <BoardshortsIcon /> Sales Reports
                    </NavLink>
                </nav>
            )} 
        </>
    )
};

export default Header;