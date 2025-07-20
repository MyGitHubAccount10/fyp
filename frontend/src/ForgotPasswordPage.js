// src/ForgotPasswordPage.js

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import './Website.css';

const EyeIcon = ({ size = 20, color = "currentColor" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>;
const EyeOffIcon = ({ size = 20, color = "currentColor" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>;

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const [emailError, setEmailError] = useState('');
    const [newPasswordError, setNewPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [apiError, setApiError] = useState(null);

    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const validateEmail = (email) => {
        if (!email) return 'Email is required.';
        if (!/^\S+@\S+\.\S+$/.test(email)) return 'Please enter a valid email format.';
        return '';
    };

    const validateNewPassword = (pass) => {
        if (pass.length < 8) return 'Password must be at least 8 characters long.';
        if (!/[A-Z]/.test(pass)) return 'Password must contain at least one uppercase letter.';
        if (!/[a-z]/.test(pass)) return 'Password must contain at least one lowercase letter.';
        if (!/[0-9]/.test(pass)) return 'Password must contain at least one number.';
        if (!/[!@#$%^&*]/.test(pass)) return 'Password must contain a special character (e.g., !@#$%^&*).';
        return '';
    };

    const validateConfirmPassword = (pass, confirmPass) => {
        if (!confirmPass) return 'Please confirm your new password.';
        if (pass !== confirmPass) return 'Passwords do not match.';
        return '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError(null);
        setSuccess('');

        const emailErr = validateEmail(email);
        const newPassErr = validateNewPassword(newPassword);
        const confirmPassErr = validateConfirmPassword(newPassword, confirmPassword);

        setEmailError(emailErr);
        setNewPasswordError(newPassErr);
        setConfirmPasswordError(confirmPassErr);

        if (emailErr || newPassErr || confirmPassErr) {
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, newPassword }),
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to reset password.');
            }

            setSuccess('Password reset successfully! Redirecting to login...');
            setEmail('');
            setNewPassword('');
            setConfirmPassword('');
            
            setTimeout(() => {
                navigate('/login', { state: location.state });
            }, 2000);
            
        } catch (err) {
            setApiError(err.message);
        } finally {
            setIsLoading(false);
        }
    };
    
    const labelStyle = { fontWeight: '600', marginBottom: '6px', display: 'block', fontSize: '0.9em' };
    const inputStyle = { display: 'block', width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' };
    const errorInputStyle = { ...inputStyle, borderColor: '#e74c3c' };
    const errorMessageStyle = { color: '#e74c3c', fontSize: '0.875em', marginTop: '5px', marginBottom: '15px' };
    const successMessageStyle = { color: '#2ecc71', backgroundColor: '#e8f8f2', border: '1px solid #2ecc71', padding: '10px', borderRadius: '4px', fontSize: '0.875em', marginTop: '5px', marginBottom: '15px' };


    return (
        <>
            <Header />
            <div className="container" style={{ maxWidth: '500px', margin: '40px auto' }}>
                <h2 style={{ fontWeight: 'bold', fontSize: '2em', marginBottom: '10px', textAlign: 'center' }}>Reset Your Password</h2>
                <p style={{ marginBottom: '30px', fontSize: '1em', color: '#555', textAlign: 'center' }}>
                    Enter your account's email and a new password.
                </p>

                <form onSubmit={handleSubmit} noValidate>
                    <label style={labelStyle}>Email Address</label>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onBlur={() => setEmailError(validateEmail(email))}
                        style={{ ...emailError ? errorInputStyle : inputStyle, marginBottom: emailError ? '0' : '15px' }}
                        required
                    />
                    {emailError && <p style={errorMessageStyle}>{emailError}</p>}

                    <label style={labelStyle}>New Password</label>
                    <div className="password-input-wrapper" style={{ marginBottom: newPasswordError ? '0' : '15px' }}>
                        <input
                            type={isPasswordVisible ? 'text' : 'password'}
                            placeholder="Enter your new password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            onBlur={() => setNewPasswordError(validateNewPassword(newPassword))}
                            style={newPasswordError ? errorInputStyle : inputStyle}
                            required
                        />
                        <button
                            type="button"
                            className="password-toggle-btn"
                            onClick={() => setIsPasswordVisible(prev => !prev)}
                        >
                            {isPasswordVisible ? <EyeOffIcon /> : <EyeIcon />}
                        </button>
                    </div>
                    {newPasswordError && <p style={errorMessageStyle}>{newPasswordError}</p>}

                    <label style={labelStyle}>Confirm New Password</label>
                     <div className="password-input-wrapper" style={{ marginBottom: confirmPasswordError ? '0' : '20px' }}>
                        <input
                            type={isConfirmPasswordVisible ? 'text' : 'password'}
                            placeholder="Confirm your new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            onBlur={() => setConfirmPasswordError(validateConfirmPassword(newPassword, confirmPassword))}
                            style={confirmPasswordError ? errorInputStyle : inputStyle}
                            required
                        />
                        <button
                            type="button"
                            className="password-toggle-btn"
                            onClick={() => setIsConfirmPasswordVisible(prev => !prev)}
                        >
                            {isConfirmPasswordVisible ? <EyeOffIcon /> : <EyeIcon />}
                        </button>
                    </div>
                    {confirmPasswordError && <p style={errorMessageStyle}>{confirmPasswordError}</p>}

                    
                    {apiError && <p style={errorMessageStyle}>{apiError}</p>}
                    {success && <p style={successMessageStyle}>{success}</p>}

                    <button
                        type="submit"
                        className="complete-purchase-btn"
                        style={{ width: '100%', backgroundColor: '#333', color: '#fff' }}
                        disabled={isLoading || success}
                    >
                        {isLoading ? 'Resetting...' : 'Reset Password'}
                    </button>
                    
                    <div style={{ marginTop: '20px' }}>
                        <button
                            type="button"
                            className="update-cart-btn"
                            onClick={() => navigate('/login', { state: location.state })}
                            // ✅ MODIFIED: Updated style to match the theme's secondary buttons
                            style={{
                                width: '100%',
                                backgroundColor: '#f0f0f0',
                                color: '#333',
                                border: '1px solid #ccc',
                                textDecoration: 'none', // Remove underline
                                marginTop: 0 // Reset margin from class if needed inside this div
                            }}
                        >
                            Back to Login
                        </button>
                    </div>
                </form>
            </div>
            <Footer />
        </>
    );
};

export default ForgotPasswordPage;