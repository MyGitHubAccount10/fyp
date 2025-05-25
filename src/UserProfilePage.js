import React, { useState, useEffect } from 'react';
import './Website.css'; // Main CSS file

// Assume images are in public/images/ directory
const logoImage = '/images/this-side-up-logo.png';

function UserProfilePage() {
    // --- STATE ---
    const [personalInfo, setPersonalInfo] = useState({
        fullName: 'John Doe', // Dummy data
        email: 'john.doe@example.com', // Usually not editable or requires verification
        phoneNumber: '91234567',
    });
    const [isEditingPersonalInfo, setIsEditingPersonalInfo] = useState(false);

    const [shippingAddress, setShippingAddress] = useState({
        addressLine1: '123 Somerset Road', // Dummy data
        addressLine2: '#05-10 Condo Name',
        postalCode: '238165',
        isDefault: true, // Example property
    });
    const [isEditingAddress, setIsEditingAddress] = useState(false);

    const [passwordChange, setPasswordChange] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
    });

    // --- Effects ---
    // In a real app, fetch user data here
    useEffect(() => {
        // const fetchUserData = async () => {
        //   try {
        //     // const response = await api.getUserProfile();
        //     // setPersonalInfo(response.data.personalInfo);
        //     // setShippingAddress(response.data.shippingAddress);
        //   } catch (error) {
        //     console.error("Failed to fetch user profile", error);
        //   }
        // };
        // fetchUserData();
        console.log("UserProfilePage mounted. In a real app, fetch user data here.");
    }, []);


    // --- Event Handlers ---
    const handlePersonalInfoChange = (e) => {
        const { name, value } = e.target;
        setPersonalInfo(prev => ({ ...prev, [name]: value }));
    };

    const handleSavePersonalInfo = (e) => {
        e.preventDefault();
        console.log('Saving Personal Info:', personalInfo);
        // API call to update personal info would go here
        setIsEditingPersonalInfo(false);
        alert('Personal information updated (demo).');
    };

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setShippingAddress(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveAddress = (e) => {
        e.preventDefault();
        console.log('Saving Address:', shippingAddress);
        // API call to update address would go here
        setIsEditingAddress(false);
        alert('Shipping address updated (demo).');
    };

    const handlePasswordFormChange = (e) => {
        const { name, value } = e.target;
        setPasswordChange(prev => ({ ...prev, [name]: value }));
    };

    const handleChangePassword = (e) => {
        e.preventDefault();
        if (passwordChange.newPassword !== passwordChange.confirmNewPassword) {
            alert("New passwords do not match.");
            return;
        }
        if (passwordChange.newPassword.length < 8) {
            alert("New password must be at least 8 characters long.");
            return;
        }
        console.log('Changing Password with:', { currentPassword: passwordChange.currentPassword, newPassword: passwordChange.newPassword });
        // API call to change password
        alert('Password change request submitted (demo). In a real app, check current password.');
        setPasswordChange({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    };

    return (
        <>
            {/* --- Consistent Header --- */}
            <header>
                <div className="header-left-content">
                    <button className="burger-btn" aria-label="Menu" title="Menu">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 12H21" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M3 6H21" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M3 18H21" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                    <a href="/" className="header-logo-link">
                        <img src={logoImage} alt="This Side Up Logo" className="header-logo-img" />
                    </a>
                    <nav className="header-nav-links">
                        <a href="#">About</a>
                        <a href="#">Contact</a>
                        <a href="#">FAQ</a>
                    </nav>
                </div>
                <div className="header-right-content">
                    <form className="search-bar" role="search" onSubmit={(e) => e.preventDefault()}>
                        <input type="search" placeholder="Search" aria-label="Search site" />
                        <button type="submit" aria-label="Submit search" title="Search">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M21 21L16.65 16.65" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                    </form>
                    <a href="#" aria-label="Shopping Cart" className="header-icon-link" title="Shopping Cart">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 2L3 6V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 21.7893 20.2107 21.4142 20.5858 21.0391C20.9609 20.664 21.1716 20.1554 21.1716 19.625V6L18 2H6Z" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" transform="scale(0.9) translate(1.2, 1.2)"/>
                            <path d="M3 6H21" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" transform="scale(0.9) translate(1.2, 1.2)"/>
                            <path d="M16 10C16 11.0609 15.5786 12.0783 14.8284 12.8284C14.0783 13.5786 13.0609 14 12 14C10.9391 14 9.92172 13.5786 9.17157 12.8284C8.42143 12.0783 8 11.0609 8 10" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" transform="scale(0.9) translate(1.2, 1.2)"/>
                        </svg>
                    </a>
                    <a href="#" aria-label="User Account" className="header-icon-link" title="User Account">
                         <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </a>
                    <span className="header-separator"></span>
                    <div className="header-social-icons">
                        <a href="#" aria-label="Instagram" title="Instagram"><img src="https://img.icons8.com/ios-glyphs/30/000000/instagram-new.png" alt="Instagram" /></a>
                        <a href="#" aria-label="TikTok" title="TikTok"><img src="https://img.icons8.com/ios-glyphs/30/000000/tiktok.png" alt="TikTok" /></a>
                    </div>
                </div>
            </header>

            {/* --- Main Content --- */}
            <div className="container user-profile-container">
                <h2>My Profile</h2>

                <div className="profile-section">
                    <div className="profile-section-header">
                        <h3>Personal Information</h3>
                        {!isEditingPersonalInfo && (
                            <button onClick={() => setIsEditingPersonalInfo(true)} className="btn-edit-profile">Edit</button>
                        )}
                    </div>
                    {isEditingPersonalInfo ? (
                        <form onSubmit={handleSavePersonalInfo} className="profile-form">
                            <div className="form-group">
                                <label htmlFor="fullName">Full Name</label>
                                <input type="text" id="fullName" name="fullName" value={personalInfo.fullName} onChange={handlePersonalInfoChange} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email Address</label>
                                <input type="email" id="email" name="email" value={personalInfo.email} readOnly disabled title="Email cannot be changed here." />
                                <small className="form-text text-muted">Contact support to change your email address.</small>
                            </div>
                            <div className="form-group">
                                <label htmlFor="phoneNumber">Phone Number</label>
                                <input type="tel" id="phoneNumber" name="phoneNumber" value={personalInfo.phoneNumber} onChange={handlePersonalInfoChange} pattern="[689]\d{7}" title="Enter a valid Singapore mobile or landline number" />
                            </div>
                            <div className="form-actions">
                                <button type="submit" className="btn-save-profile">Save Changes</button>
                                <button type="button" onClick={() => { setIsEditingPersonalInfo(false); /* Reset changes or re-fetch original data */ }} className="btn-cancel-profile">Cancel</button>
                            </div>
                        </form>
                    ) : (
                        <div className="profile-display">
                            <p><strong>Full Name:</strong> {personalInfo.fullName}</p>
                            <p><strong>Email:</strong> {personalInfo.email}</p>
                            <p><strong>Phone:</strong> {personalInfo.phoneNumber || 'Not provided'}</p>
                        </div>
                    )}
                </div>

                <div className="profile-section">
                    <div className="profile-section-header">
                        <h3>Shipping Address</h3>
                        {!isEditingAddress && (
                            <button onClick={() => setIsEditingAddress(true)} className="btn-edit-profile">Edit</button>
                        )}
                         {/* <button className="btn-add-profile">Add New Address</button>  Placeholder for multi-address */}
                    </div>
                    {isEditingAddress ? (
                        <form onSubmit={handleSaveAddress} className="profile-form">
                            <div className="form-group">
                                <label htmlFor="addressLine1">Address Line 1</label>
                                <input type="text" id="addressLine1" name="addressLine1" value={shippingAddress.addressLine1} onChange={handleAddressChange} required placeholder="Block/House No., Street Name" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="addressLine2">Address Line 2 (Optional)</label>
                                <input type="text" id="addressLine2" name="addressLine2" value={shippingAddress.addressLine2} onChange={handleAddressChange} placeholder="Unit No., Building Name" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="postalCode">Postal Code</label>
                                <input type="text" id="postalCode" name="postalCode" value={shippingAddress.postalCode} onChange={handleAddressChange} required pattern="\d{6}" title="Enter a 6-digit Singapore postal code" />
                            </div>
                            {/* <div className="form-group">
                                <input type="checkbox" id="isDefault" name="isDefault" checked={shippingAddress.isDefault} onChange={(e) => setShippingAddress(prev => ({...prev, isDefault: e.target.checked}))} />
                                <label htmlFor="isDefault" className="checkbox-label">Set as default address</label>
                            </div> */}
                            <div className="form-actions">
                                <button type="submit" className="btn-save-profile">Save Address</button>
                                <button type="button" onClick={() => { setIsEditingAddress(false); /* Reset or re-fetch */}} className="btn-cancel-profile">Cancel</button>
                            </div>
                        </form>
                    ) : (
                        <div className="profile-display address-display">
                            <p>{shippingAddress.addressLine1}</p>
                            {shippingAddress.addressLine2 && <p>{shippingAddress.addressLine2}</p>}
                            <p>Singapore {shippingAddress.postalCode}</p>
                            {/* {shippingAddress.isDefault && <span className="default-badge">Default</span>} */}
                        </div>
                    )}
                </div>

                <div className="profile-section">
                    <div className="profile-section-header">
                        <h3>Change Password</h3>
                    </div>
                    <form onSubmit={handleChangePassword} className="profile-form">
                        <div className="form-group">
                            <label htmlFor="currentPassword">Current Password</label>
                            <input type="password" id="currentPassword" name="currentPassword" value={passwordChange.currentPassword} onChange={handlePasswordFormChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="newPassword">New Password</label>
                            <input type="password" id="newPassword" name="newPassword" value={passwordChange.newPassword} onChange={handlePasswordFormChange} required minLength="8" />
                            <small className="form-text text-muted">Must be at least 8 characters long.</small>
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirmNewPassword">Confirm New Password</label>
                            <input type="password" id="confirmNewPassword" name="confirmNewPassword" value={passwordChange.confirmNewPassword} onChange={handlePasswordFormChange} required />
                        </div>
                        <div className="form-actions">
                            <button type="submit" className="btn-save-profile">Update Password</button>
                        </div>
                    </form>
                </div>

                 <div className="profile-section">
                    <div className="profile-section-header">
                        <h3>My Orders</h3>
                    </div>
                    <div className="profile-display">
                       <p>View your past purchases and track current orders.</p>
                       <a href="/order-history" className="btn-link-profile">View Order History</a>
                    </div>
                </div>

            </div>

            {/* --- Consistent Footer --- */}
            <footer className="footer">
                <div className="footer-column">
                    <strong>#THISSIDEUP</strong>
                    <div className="social-icons">
                        <a href="#" aria-label="Instagram"><img src="https://img.icons8.com/ios-filled/50/ffffff/instagram-new.png" alt="Instagram" /></a>
                        <a href="#" aria-label="TikTok"><img src="https://img.icons8.com/ios-filled/50/ffffff/tiktok--v1.png" alt="TikTok" /></a>
                    </div>
                </div>
                <div className="footer-column">
                    <strong>Customer Service</strong>
                    <a href="#">Contact</a><br />
                    <a href="#">FAQ</a><br />
                    <a href="#">About</a>
                </div>
                <div className="footer-column">
                <strong>This Side Up</strong>
                <p>Welcome to This Side Up! From our home in Singapore, we're passionate about sharing the thrill of skimboarding with riders of all levels. We craft high-performance, custom-designed skimboards using top-quality materials and your unique vision, so your board performs exceptionally and truly reflects your style. Inspired by Singapore's vibrant coastal scene, we're building a community for adventure and championing an active life by the water.</p>
                </div>
            </footer>
        </>
    );
}

export default UserProfilePage;