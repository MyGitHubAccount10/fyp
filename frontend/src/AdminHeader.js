import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import './AdminHeader.css'; // Assuming this path is correct for your project structure

// Assume images are in public/images/ directory relative to your server's root
const logoImage = '/images/this-side-up-logo.png';

// Simple SVG Icons for secondary navigation (black color is set via CSS or inline fill)
const ProductsIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73L13 3.27a2 2 0 0 0-2 0L4 6.27A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4a2 2 0 0 0 1-1.73z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);
const OrdersIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2l1.5 4H16.5L18 2" />
    <path d="M3 6h18v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6z" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);
const CustomersIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M7 21v-2a4 4 0 0 1 3-3.87" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);
const SalesReportsIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="20" x2="12" y2="10" />
    <line x1="18" y1="20" x2="18" y2="4" />
    <line x1="6" y1="20" x2="6" y2="16" />
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
                <Link to="/admin-profile" aria-label="User Account" className="Admin-header-icon-link" title="User Account">
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
                        <ProductsIcon /> Products
                    </NavLink>
                    <NavLink to="/all-orders" className="Admin-secondary-navbar-item" onClick={() => setIsProductDropdownOpen(false)}> {/* Added Link and onClick to close */}
                        <OrdersIcon /> Orders
                    </NavLink>
                    <NavLink to="/all-customers" className="Admin-secondary-navbar-item" onClick={() => setIsProductDropdownOpen(false)}> {/* Added Link and onClick to close */}
                        <CustomersIcon /> Customers
                    </NavLink>
                    <NavLink to="" className="Admin-secondary-navbar-item" onClick={() => setIsProductDropdownOpen(false)}> {/* Added Link and onClick to close */}
                        <SalesReportsIcon /> Sales Reports
                    </NavLink>
                </nav>
            )} 
        </>
    )
};

export default Header;