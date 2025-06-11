import React, { useState, useEffect } from 'react';
import '../Website.css';
import AdminHeader from '../AdminHeader';
import Footer from '../Footer';

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
    useEffect(() => {
        console.log("UserProfilePage mounted. In a real app, fetch user data here.");
    }, []);

    const handlePersonalInfoChange = (e) => {
        const { name, value } = e.target;
        setPersonalInfo(prev => ({ ...prev, [name]: value }));
    };

    const handleSavePersonalInfo = (e) => {
        e.preventDefault();
        console.log('Saving Personal Info:', personalInfo);
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
            <AdminHeader />
            {/* --- Main Content --- */}
            <div className="container user-profile-container">
                <h2>Admin Profile</h2>

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
            </div>
            <Footer />
        </>
    );
}

export default UserProfilePage;