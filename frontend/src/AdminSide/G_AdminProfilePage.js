// src/AdminSide/G_AdminProfilePage.js (or wherever your admin profile page is)

import React, { useState, useEffect } from 'react';
import '../Website.css'; // Assuming common styles are in Website.css
import AdminHeader from '../AdminHeader';
import Footer from '../Footer';

function AdminProfilePage() { // Renamed from UserProfilePage for clarity
    // --- STATE: Transferred from UserProfilePage ---
    const [personalInfo, setPersonalInfo] = useState({
        username: '', // Username will be loaded, but not editable
        email: '',
        phoneNumber: '',
    });
    const [isEditingPersonalInfo, setIsEditingPersonalInfo] = useState(false);

    const [passwordChange, setPasswordChange] = useState({
        newPassword: '',
        confirmNewPassword: '',
    });

    // --- Effects: Transferred and adapted from UserProfilePage ---
    useEffect(() => {
        try {
            // Load the logged-in user's data from localStorage
            const user = JSON.parse(localStorage.getItem('user'));
            if (user) {
                setPersonalInfo({
                    username: user.username || '',
                    email: user.email || '',
                    phoneNumber: user.phone_number || '',
                });
            }
        } catch (error) {
            console.error('Error loading user data:', error);
            // Handle error, e.g., redirect to login if no user data
        }
    }, []);

    // --- Handlers: Transferred from UserProfilePage ---
    const handlePersonalInfoChange = (e) => {
        const { name, value } = e.target;
        setPersonalInfo(prev => ({ ...prev, [name]: value }));
    };

    const handleSavePersonalInfo = async (e) => {
        e.preventDefault();
        const userData = JSON.parse(localStorage.getItem('user'));
        if (!userData || !userData.token) {
            alert('Authentication error. Please log in again.');
            return;
        }

        try {
            const updatedData = { 
                email: personalInfo.email, 
                phone_number: personalInfo.phoneNumber 
            };

            const response = await fetch('/api/user/update', { // Endpoint to update user details
                method: 'PATCH',
                headers: { 
                    'Content-Type': 'application/json', 
                    Authorization: `Bearer ${userData.token}` 
                },
                body: JSON.stringify(updatedData),
            });

            if (!response.ok) {
                const errorResult = await response.json();
                throw new Error(errorResult.error || 'Failed to update user information');
            }

            const updatedFields = await response.json();
            // Update localStorage with the fresh data from the server
            const newUserData = { ...userData, ...updatedFields };
            localStorage.setItem('user', JSON.stringify(newUserData));

            // Update local state to reflect changes immediately
            setPersonalInfo((prevInfo) => ({ 
                ...prevInfo, 
                email: newUserData.email, 
                phoneNumber: newUserData.phone_number 
            }));

            setIsEditingPersonalInfo(false);
            alert('Personal information updated successfully!');
        } catch (error) {
            console.error('Error saving personal info:', error);
            alert(`Failed to save personal information: ${error.message}`);
        }
    };

    const handlePasswordFormChange = (e) => {
        const { name, value } = e.target;
        setPasswordChange(prev => ({ ...prev, [name]: value }));
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();

        if (passwordChange.newPassword !== passwordChange.confirmNewPassword) {
            alert("New passwords do not match.");
            return;
        }
        if (passwordChange.newPassword.length < 8) {
            alert("New password must be at least 8 characters long.");
            return;
        }

        const userData = JSON.parse(localStorage.getItem('user'));
        if (!userData || !userData.token) {
            alert('Authentication error. Please log in again.');
            return;
        }

        try {
            const response = await fetch('/api/user/update-password', { // Endpoint to update password
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userData.token}`,
                },
                body: JSON.stringify({ newPassword: passwordChange.newPassword }),
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.error || 'Failed to update password.');
            }

            alert('Password updated successfully!');
            setPasswordChange({ newPassword: '', confirmNewPassword: '' }); // Clear fields
        } catch (error) {
            console.error('Error changing password:', error);
            alert(`Error: ${error.message}`);
        }
    };

    return (
        <>
            <AdminHeader />
            <div className="container user-profile-container">
                <h2>Admin Profile</h2>

                {/* --- Personal Information Section (Adapted from UserProfilePage) --- */}
                <div className="profile-section">
                    <div className="profile-section-header">
                        <h3>Personal Information</h3>
                        {!isEditingPersonalInfo && <button onClick={() => setIsEditingPersonalInfo(true)} className="btn-edit-profile">Edit</button>}
                    </div>
                    {isEditingPersonalInfo ? (
                        <form onSubmit={handleSavePersonalInfo} className="profile-form">
                            <div className="form-group">
                                <label htmlFor="username">Username</label>
                                <input type="text" id="username" name="username" value={personalInfo.username} disabled title="Username cannot be changed" className="disabled-input" />
                                <small className="form-text text-muted">Contact support to change your username.</small>
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email Address</label>
                                <input type="email" id="email" name="email" value={personalInfo.email} onChange={handlePersonalInfoChange} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="phoneNumber">Phone Number</label>
                                <input type="tel" id="phoneNumber" name="phoneNumber" value={personalInfo.phoneNumber} onChange={handlePersonalInfoChange} pattern="[689]\d{7}" title="Enter a valid Singapore mobile or landline number" required />
                            </div>
                            <div className="form-actions">
                                <button type="submit" className="btn-save-profile">Save Changes</button>
                                <button type="button" onClick={() => { setIsEditingPersonalInfo(false); }} className="btn-cancel-profile">Cancel</button>
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

                {/* --- Change Password Section (Adapted from UserProfilePage) --- */}
                <div className="profile-section">
                    <div className="profile-section-header">
                        <h3>Change Password</h3>
                    </div>
                    <form onSubmit={handleChangePassword} className="profile-form">
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

export default AdminProfilePage;