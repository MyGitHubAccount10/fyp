// src/AdminHeader.js

import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAdminLogout } from '../src/hooks/useAdminLogout'; // Make sure this path is correct
import socketService from '../src/services/socketService';
import './AdminHeader.css';

// ✅ FIX: The full JSX for the icons is provided, not placeholder comments.
const logoImage = '/images/this-side-up-logo.png';
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
const PromosIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="14" rx="2" ry="2" />
    <line x1="7" y1="8" x2="17" y2="8" />
    <line x1="7" y1="12" x2="17" y2="12" />
    <line x1="7" y1="16" x2="13" y2="16" />
  </svg>
);


const AdminHeader = ({ showNav = true }) => {
    const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(true);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    
    const { logout } = useAdminLogout();
    const dropdownRef = useRef(null);

    // Initialize socket connection for admin users
    useEffect(() => {
        const adminUser = JSON.parse(localStorage.getItem('admin_user'));
        if (adminUser && adminUser._id) {
            socketService.connect(adminUser._id);
        }

        // Cleanup on unmount
        return () => {
            socketService.disconnect();
        };
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsProfileDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownRef]);

    const toggleProductDropdown = () => {
        setIsProductDropdownOpen(!isProductDropdownOpen);
    };

    const handleLogout = () => {
        setIsProfileDropdownOpen(false);
        logout();
    };
    
    return (
        <>
            <header className="Admin-header">
                <div className="Admin-header-left-content">
                    {showNav ? (
                        <Link to="/admin-dashboard" className="Admin-header-logo-link">
                            <img src={logoImage} alt="This Side Up Logo" className="Admin-header-logo-img" />
                        </Link>
                    ) : (
                        <div className="Admin-header-logo-link" style={{ cursor: 'default' }}>
                            <img src={logoImage} alt="This Side Up Logo" className="Admin-header-logo-img" />
                        </div>
                    )}
                </div>

                {showNav && (
                    <>
                        <nav className="Admin-header-nav-links">
                            <button onClick={toggleProductDropdown} className="Admin-product-dropdown-toggle">
                                ADMIN
                                <svg className={`Admin-product-arrow ${isProductDropdownOpen ? 'up' : ''}`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <polyline points="6 9 12 15 18 9" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></polyline>
                                </svg>
                            </button>
                        </nav>
                        <div className="Admin-header-right-content">
                            <div className="Admin-profile-dropdown-container" ref={dropdownRef}>
                                <button 
                                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                                    aria-label="User Account" 
                                    className="Admin-header-icon-link" 
                                    title="User Account"
                                >
                                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </button>
                                {isProfileDropdownOpen && (
                                    <div className="Admin-profile-dropdown-menu">
                                        <Link to="/admin-profile" className="Admin-profile-dropdown-item" onClick={() => setIsProfileDropdownOpen(false)}>
                                            Profile
                                        </Link>
                                        <button onClick={handleLogout} className="Admin-profile-dropdown-item logout">
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                            <span className="Admin-header-separator"></span>
                            <div className="Admin-header-social-icons">
                                <a href="https://www.instagram.com" aria-label="Instagram" title="Instagram"><img src="https://img.icons8.com/ios-glyphs/30/000000/instagram-new.png" alt="Instagram" /></a>
                                <a href="https://www.tiktok.com" aria-label="TikTok" title="TikTok"><img src="https://img.icons8.com/ios-glyphs/30/000000/tiktok.png" alt="TikTok" /></a>
                            </div>
                        </div>
                    </>
                )}
            </header>

            {showNav && isProductDropdownOpen && (
                <nav className="Admin-secondary-navbar">
                    <NavLink to="/all-products" className="Admin-secondary-navbar-item" onClick={() => setIsProductDropdownOpen(false)}>
                        <ProductsIcon /> Products
                    </NavLink>
                    <NavLink to="/all-orders" className="Admin-secondary-navbar-item" onClick={() => setIsProductDropdownOpen(false)}>
                        <OrdersIcon /> Orders
                    </NavLink>
                    <NavLink to="/all-customers" className="Admin-secondary-navbar-item" onClick={() => setIsProductDropdownOpen(false)}>
                        <CustomersIcon /> Customers
                    </NavLink>
                    <NavLink to="/manage-promos" className="Admin-secondary-navbar-item" onClick={() => setIsProductDropdownOpen(false)}>
                        <PromosIcon /> Homepage Promos
                    </NavLink>
                    <NavLink to="/sales-report" className="Admin-secondary-navbar-item" onClick={() => setIsProductDropdownOpen(false)}>
                        <SalesReportsIcon /> Sales Reports
                    </NavLink>
                </nav>
            )} 
        </>
    )
};

export default AdminHeader;