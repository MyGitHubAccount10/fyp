import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ 1. Import useNavigate for redirection
import { useAuthContext } from './hooks/useAuthContext'; // ✅ 2. Import auth context for logout
import './Website.css';
import Header from './Header';
import Footer from './Footer';

// --- Icons for password toggle ---
const EyeIcon = ({ size = 20, color = "currentColor" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>;
const EyeOffIcon = ({ size = 20, color = "currentColor" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>;

function UserProfilePage() {
    // --- STATE ---
    const [personalInfo, setPersonalInfo] = useState({ firstName: '', lastName: '', username: '', email: '', phoneNumber: '' });
    const [isEditingPersonalInfo, setIsEditingPersonalInfo] = useState(false);
    const [shippingAddress, setShippingAddress] = useState('');
    const [isEditingAddress, setIsEditingAddress] = useState(false);
    const [passwordChange, setPasswordChange] = useState({ newPassword: '', confirmNewPassword: '' });
    const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

    // --- HOOKS ---
    const navigate = useNavigate(); // ✅ 3. Initialize navigate hook
    const { dispatch } = useAuthContext(); // ✅ 4. Get dispatch function from context

    // --- Effects ---
    useEffect(() => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if (user) {
                setPersonalInfo({
                    firstName: user.first_name || '', lastName: user.last_name || '',
                    username: user.username || '', email: user.email || '', phoneNumber: user.phone_number || '',
                });
                setShippingAddress(user.shipping_address || 'No address provided.');
            } else {
                navigate('/login'); // Redirect if no user data
            }
        } catch (error) {
            console.error('Error loading user data:', error);
            navigate('/login');
        }
    }, [navigate]);

    // --- Handlers ---
    const handlePersonalInfoChange = (e) => setPersonalInfo(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handleSavePersonalInfo = async (e) => {
        e.preventDefault();
        const userData = JSON.parse(localStorage.getItem('user'));
        if (!userData?.token) return alert('Authentication error. Please log in again.');
        try {
            const updatedData = {
                first_name: personalInfo.firstName, last_name: personalInfo.lastName,
                email: personalInfo.email, phone_number: personalInfo.phoneNumber
            };
            const response = await fetch('/api/user/update', {
                method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userData.token}` },
                body: JSON.stringify(updatedData),
            });
            if (!response.ok) throw new Error((await response.json()).error || 'Failed to update user information');
            const updatedFields = await response.json();
            const newUserData = { ...userData, ...updatedFields };
            localStorage.setItem('user', JSON.stringify(newUserData));
            setPersonalInfo(prev => ({ ...prev, ...{
                firstName: newUserData.first_name, lastName: newUserData.last_name,
                email: newUserData.email, phoneNumber: newUserData.phone_number,
            }}));
            setIsEditingPersonalInfo(false);
            alert('Personal information updated successfully!');
        } catch (error) {
            alert(`Failed to save personal information: ${error.message}`);
        }
    };

    const handleSaveAddress = async (e) => {
        e.preventDefault();
        const userData = JSON.parse(localStorage.getItem('user'));
        if (!userData?.token) return alert('Authentication error. Please log in again.');
        try {
            const response = await fetch('/api/user/update', {
                method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userData.token}` },
                body: JSON.stringify({ shipping_address: shippingAddress }),
            });
            if (!response.ok) throw new Error((await response.json()).error || 'Failed to update address');
            const updatedFields = await response.json();
            const newUserData = { ...userData, ...updatedFields };
            localStorage.setItem('user', JSON.stringify(newUserData));
            setShippingAddress(newUserData.shipping_address);
            setIsEditingAddress(false);
            alert('Shipping address updated successfully!');
        } catch (error) {
            alert(`Failed to save shipping address: ${error.message}`);
        }
    };

    const handlePasswordFormChange = (e) => setPasswordChange(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (passwordChange.newPassword !== passwordChange.confirmNewPassword) return alert("New passwords do not match.");
        if (passwordChange.newPassword.length < 8) return alert("New password must be at least 8 characters long.");
        const userData = JSON.parse(localStorage.getItem('user'));
        if (!userData?.token) return alert('Authentication error. Please log in again.');
        try {
            const response = await fetch('/api/user/update-password', {
                method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userData.token}` },
                body: JSON.stringify({ newPassword: passwordChange.newPassword }),
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || 'Failed to update password.');
            alert('Password updated successfully!');
            setPasswordChange({ newPassword: '', confirmNewPassword: '' });
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    };

    // --- ✅ 5. NEW HANDLER FOR ACCOUNT DELETION ---
    const handleDeleteAccount = async () => {
        // a) Warn the user with a confirmation dialog
        const isConfirmed = window.confirm("Are you sure you want to delete your account? This action is permanent and cannot be undone.");

        if (!isConfirmed) {
            return; // Stop if the user clicks "Cancel"
        }

        const userData = JSON.parse(localStorage.getItem('user'));
        if (!userData?.token) {
            alert('Authentication error. Please log in again.');
            return;
        }

        try {
            const response = await fetch('/api/user/delete-account', {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${userData.token}` },
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.error || 'Failed to delete account.');
            }

            // b) Alert that the account has been deleted
            alert('Your account has been successfully deleted.');

            // Log the user out and redirect to the homepage
            dispatch({ type: 'LOGOUT' });
            navigate('/');

        } catch (error) {
            alert(`Error deleting account: ${error.message}`);
        }
    };


    return (
        <>
            <Header />
            <div className="container user-profile-container">
                <h2>My Profile</h2>

                {/* --- Personal Information Section (no changes) --- */}
                <div className="profile-section">
                    <div className="profile-section-header">
                        <h3>Personal Information</h3>
                        {!isEditingPersonalInfo && <button onClick={() => setIsEditingPersonalInfo(true)} className="btn-edit-profile">Edit</button>}
                    </div>
                    {isEditingPersonalInfo ? (
                        <form onSubmit={handleSavePersonalInfo} className="profile-form">
                            <div className="form-group"><label htmlFor="firstName">First Name</label><input type="text" id="firstName" name="firstName" value={personalInfo.firstName} onChange={handlePersonalInfoChange} required /></div>
                            <div className="form-group"><label htmlFor="lastName">Last Name</label><input type="text" id="lastName" name="lastName" value={personalInfo.lastName} onChange={handlePersonalInfoChange} required /></div>
                            <div className="form-group"><label htmlFor="username">Username</label><input type="text" id="username" name="username" value={personalInfo.username} disabled title="Username cannot be changed" className="disabled-input" /><small className="form-text text-muted">Contact support to change your username.</small></div>
                            <div className="form-group"><label htmlFor="email">Email Address</label><input type="email" id="email" name="email" value={personalInfo.email} onChange={handlePersonalInfoChange} required /></div>
                            <div className="form-group"><label htmlFor="phoneNumber">Phone Number</label><input type="tel" id="phoneNumber" name="phoneNumber" value={personalInfo.phoneNumber} onChange={handlePersonalInfoChange} pattern="[689]\d{7}" title="Enter a valid Singapore mobile or landline number" required /></div>
                            <div className="form-actions"><button type="submit" className="btn-save-profile">Save Changes</button><button type="button" onClick={() => setIsEditingPersonalInfo(false)} className="btn-cancel-profile">Cancel</button></div>
                        </form>
                    ) : (
                        <div className="profile-display"><p><strong>Name:</strong> {personalInfo.firstName} {personalInfo.lastName}</p><p><strong>Username:</strong> {personalInfo.username}</p><p><strong>Email:</strong> {personalInfo.email}</p><p><strong>Phone:</strong> {personalInfo.phoneNumber || 'Not provided'}</p></div>
                    )}
                </div>

                {/* --- Shipping Address Section (no changes) --- */}
                <div className="profile-section">
                    <div className="profile-section-header"><h3>Shipping Address</h3>{!isEditingAddress && <button onClick={() => setIsEditingAddress(true)} className="btn-edit-profile">Edit</button>}</div>
                    {isEditingAddress ? (
                        <form onSubmit={handleSaveAddress} className="profile-form">
                            <div className="form-group"><label htmlFor="shippingAddress">Full Shipping Address</label><input type="text" id="shippingAddress" name="shippingAddress" value={shippingAddress} onChange={(e) => setShippingAddress(e.target.value)} required placeholder="Block/House No., Street, Unit, Postal Code" /></div>
                            <div className="form-actions"><button type="submit" className="btn-save-profile">Save Address</button><button type="button" onClick={() => setIsEditingAddress(false)} className="btn-cancel-profile">Cancel</button></div>
                        </form>
                    ) : (<div className="profile-display address-display"><p>{shippingAddress}</p></div>)}
                </div>

                {/* --- Change Password Section (no changes) --- */}
                <div className="profile-section">
                    <div className="profile-section-header"><h3>Change Password</h3></div>
                    <form onSubmit={handleChangePassword} className="profile-form">
                        <div className="form-group"><label htmlFor="newPassword">New Password</label><div className="password-input-wrapper"><input type={isNewPasswordVisible ? 'text' : 'password'} id="newPassword" name="newPassword" value={passwordChange.newPassword} onChange={handlePasswordFormChange} required minLength="8" /><button type="button" className="password-toggle-btn" onClick={() => setIsNewPasswordVisible(p => !p)}>{isNewPasswordVisible ? <EyeOffIcon /> : <EyeIcon />}</button></div><small className="form-text text-muted">Must be at least 8 characters long.</small></div>
                        <div className="form-group"><label htmlFor="confirmNewPassword">Confirm New Password</label><div className="password-input-wrapper"><input type={isConfirmPasswordVisible ? 'text' : 'password'} id="confirmNewPassword" name="confirmNewPassword" value={passwordChange.confirmNewPassword} onChange={handlePasswordFormChange} required /><button type="button" className="password-toggle-btn" onClick={() => setIsConfirmPasswordVisible(p => !p)}>{isConfirmPasswordVisible ? <EyeOffIcon /> : <EyeIcon />}</button></div></div>
                        <div className="form-actions"><button type="submit" className="btn-save-profile">Update Password</button></div>
                    </form>
                </div>

                {/* --- My Orders Section (no changes) --- */}
                <div className="profile-section">
                    <div className="profile-section-header"><h3>My Orders</h3></div>
                    <div className="profile-display"><p>View your past purchases and track current orders.</p><a href="/order-history" className="btn-link-profile">View Order History</a></div>
                </div>

                {/* --- ✅ 6. NEW "DANGER ZONE" SECTION --- */}
                <div className="profile-section danger-zone">
                    <div className="profile-section-header">
                        <h3>Danger Zone</h3>
                    </div>
                    <div className="profile-display">
                        <p>Deleting your account will permanently remove all your personal information, order history, and saved details. This action cannot be undone.</p>
                        <button onClick={handleDeleteAccount} className="btn-delete-account">
                            Delete My Account
                        </button>
                    </div>
                </div>

            </div>
            <Footer />
        </>
    );
}

export default UserProfilePage;