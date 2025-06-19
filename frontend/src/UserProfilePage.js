import React, { useState, useEffect } from 'react';
import './Website.css';
import Header from './Header';
import Footer from './Footer';

function UserProfilePage() {
    // --- STATE ---
    const [personalInfo, setPersonalInfo] = useState({
        // MODIFIED: Added firstName and lastName
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        phoneNumber: '',
    });
    const [isEditingPersonalInfo, setIsEditingPersonalInfo] = useState(false);

    // MODIFIED: State is now a single string for the full shipping address
    const [shippingAddress, setShippingAddress] = useState('');
    const [isEditingAddress, setIsEditingAddress] = useState(false);

    const [passwordChange, setPasswordChange] = useState({
        newPassword: '',
        confirmNewPassword: '',
    });

    // --- Effects ---
    useEffect(() => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if (user) {
                // MODIFIED: Populate all personal info fields from localStorage
                setPersonalInfo({
                    firstName: user.first_name || '',
                    lastName: user.last_name || '',
                    username: user.username || '',
                    email: user.email || '',
                    phoneNumber: user.phone_number || '',
                });
                // MODIFIED: Populate shipping address from localStorage
                setShippingAddress(user.shipping_address || 'No address provided.');
            }
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    }, []);

    // --- Handlers ---
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
            // MODIFIED: Include first_name and last_name in the update
            const updatedData = {
                first_name: personalInfo.firstName,
                last_name: personalInfo.lastName,
                email: personalInfo.email,
                phone_number: personalInfo.phoneNumber
            };
            const response = await fetch('/api/user/update', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userData.token}` },
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
            
            // Sync component state
            setPersonalInfo({
                firstName: newUserData.first_name,
                lastName: newUserData.last_name,
                username: newUserData.username,
                email: newUserData.email,
                phoneNumber: newUserData.phone_number,
            });

            setIsEditingPersonalInfo(false);
            alert('Personal information updated successfully!');
        } catch (error) {
            console.error('Error saving personal info:', error);
            alert(`Failed to save personal information: ${error.message}`);
        }
    };

    // MODIFIED: handleSaveAddress is now a fully functional async function
    const handleSaveAddress = async (e) => {
        e.preventDefault();
        const userData = JSON.parse(localStorage.getItem('user'));
        if (!userData || !userData.token) {
            alert('Authentication error. Please log in again.');
            return;
        }

        try {
            const response = await fetch('/api/user/update', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userData.token}` },
                body: JSON.stringify({ shipping_address: shippingAddress }),
            });

            if (!response.ok) {
                const errorResult = await response.json();
                throw new Error(errorResult.error || 'Failed to update address');
            }
            const updatedFields = await response.json();
            // Update localStorage
            const newUserData = { ...userData, ...updatedFields };
            localStorage.setItem('user', JSON.stringify(newUserData));
            
            // Sync component state from the updated local storage
            setShippingAddress(newUserData.shipping_address);
            
            setIsEditingAddress(false);
            alert('Shipping address updated successfully!');
        } catch (error) {
            console.error('Error saving address:', error);
            alert(`Failed to save shipping address: ${error.message}`);
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
            const response = await fetch('/api/user/update-password', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userData.token}` },
                body: JSON.stringify({ newPassword: passwordChange.newPassword }),
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.error || 'Failed to update password.');
            }
            alert('Password updated successfully!');
            setPasswordChange({ newPassword: '', confirmNewPassword: '' });
        } catch (error) {
            console.error('Error changing password:', error);
            alert(`Error: ${error.message}`);
        }
    };

    return (
        <>
            <Header />
            <div className="container user-profile-container">
                <h2>My Profile</h2>

                <div className="profile-section">
                    <div className="profile-section-header">
                        <h3>Personal Information</h3>
                        {!isEditingPersonalInfo && <button onClick={() => setIsEditingPersonalInfo(true)} className="btn-edit-profile">Edit</button>}
                    </div>
                    {isEditingPersonalInfo ? (
                        <form onSubmit={handleSavePersonalInfo} className="profile-form">
                            {/* MODIFIED: Added First Name and Last Name inputs */}
                            <div className="form-group">
                                <label htmlFor="firstName">First Name</label>
                                <input type="text" id="firstName" name="firstName" value={personalInfo.firstName} onChange={handlePersonalInfoChange} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="lastName">Last Name</label>
                                <input type="text" id="lastName" name="lastName" value={personalInfo.lastName} onChange={handlePersonalInfoChange} required />
                            </div>
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
                            {/* MODIFIED: Display First Name and Last Name */}
                            <p><strong>Name:</strong> {personalInfo.firstName} {personalInfo.lastName}</p>
                            <p><strong>Username:</strong> {personalInfo.username}</p>
                            <p><strong>Email:</strong> {personalInfo.email}</p>
                            <p><strong>Phone:</strong> {personalInfo.phoneNumber || 'Not provided'}</p>
                        </div>
                    )}
                </div>

                <div className="profile-section">
                    <div className="profile-section-header">
                        <h3>Shipping Address</h3>
                        {!isEditingAddress && <button onClick={() => setIsEditingAddress(true)} className="btn-edit-profile">Edit</button>}
                    </div>
                    {isEditingAddress ? (
                        // MODIFIED: Form now has a single input for the full address
                        <form onSubmit={handleSaveAddress} className="profile-form">
                            <div className="form-group">
                                <label htmlFor="shippingAddress">Full Shipping Address</label>
                                <input type="text" id="shippingAddress" name="shippingAddress" value={shippingAddress} onChange={(e) => setShippingAddress(e.target.value)} required placeholder="Block/House No., Street, Unit, Postal Code" />
                            </div>
                            <div className="form-actions">
                                <button type="submit" className="btn-save-profile">Save Address</button>
                                <button type="button" onClick={() => { setIsEditingAddress(false); }} className="btn-cancel-profile">Cancel</button>
                            </div>
                        </form>
                    ) : (
                        // MODIFIED: Displays the single shipping address string
                        <div className="profile-display address-display">
                            <p>{shippingAddress}</p>
                        </div>
                    )}
                </div>

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