import React, { useState, useEffect } from 'react';
import './Website.css';
import Header from './Header';
import Footer from './Footer';

function UserProfilePage() {
    // --- STATE ---
    const [personalInfo, setPersonalInfo] = useState({
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
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            setPersonalInfo({
                username: user.username,
                email: user.email,
                phoneNumber: user.phone_number,
            });
        }
    }, []);

    const handlePersonalInfoChange = (e) => {
        const { name, value } = e.target;
        setPersonalInfo(prev => ({ ...prev, [name]: value }));
    };

    const handleSavePersonalInfo = async (e) => {
        e.preventDefault();
        try {
            const token = JSON.parse(localStorage.getItem('user')).token;
            const response = await fetch('/api/user/update', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(personalInfo),
            });

            if (!response.ok) {
                throw new Error('Failed to update personal information');
            }

            const updatedUser = await response.json();
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setIsEditingPersonalInfo(false);
        } catch (error) {
            console.error(error);
            alert('An error occurred while updating your information.');
        }
    };

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setShippingAddress(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveAddress = (e) => {
        e.preventDefault();
        console.log('Saving Address:', shippingAddress);
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
        alert('Password change request submitted (demo). In a real app, check current password.');
        setPasswordChange({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    };

    return (
        <>
            <Header />
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
                                <label htmlFor="username">Username</label>
                                <input type="text" id="username" name="username" value={personalInfo.username} onChange={handlePersonalInfoChange} required />
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
                            <p><strong>Username:</strong> {personalInfo.username}</p>
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
            <Footer />
        </>
    );
}

export default UserProfilePage;