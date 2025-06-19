// SignUpPage.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Website.css';
import Header from './Header';
import Footer from './Footer';

// --- Icons for password toggle ---
const EyeIcon = ({ size = 20, color = "currentColor" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>;
const EyeOffIcon = ({ size = 20, color = "currentColor" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>;

// The specific Role ID for "Customer" from your database collection.
const CUSTOMER_ROLE_ID = '6849293057e7f26973c9fb40';

const SignUpPage = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // --- State for all validation errors ---
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [isPasswordTouched, setIsPasswordTouched] = useState(false);

  // --- State for password visibility toggles ---
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

  // --- Validation Functions ---
  const validateName = (name, fieldName) => {
    if (!name) return `${fieldName} is required.`;
    if (!/^[A-Z][a-zA-Z]*$/.test(name)) {
      return `${fieldName} must start with a capital letter and contain no spaces, numbers, or special characters.`;
    }
    return '';
  };

  const validateEmail = (email) => {
    if (!email) return 'Email is required.';
    if (!/^\S+@\S+\.\S+$/.test(email)) return 'Please enter a valid email format (e.g., name@example.com).';
    return '';
  };

  const validatePhone = (phone) => {
    if (!phone) return 'Phone number is required.';
    if (!/^\d{8}$/.test(phone)) return 'Phone number must be exactly 8 digits.';
    return '';
  };

  const validatePassword = (pass) => {
    if (pass.length < 8) return 'Password must be at least 8 characters long.';
    if (!/[A-Z]/.test(pass)) return 'Password must contain at least one uppercase letter.';
    if (!/[a-z]/.test(pass)) return 'Password must contain at least one lowercase letter.';
    if (!/[0-9]/.test(pass)) return 'Password must contain at least one number.';
    if (!/[!@#$%^&*]/.test(pass)) return 'Password must contain a special character (e.g., !@#$%^&*).';
    return '';
  };

  const validateConfirmPassword = (pass, confirmPass) => {
    if (!confirmPass) return 'Please confirm your password.';
    if (pass !== confirmPass) return 'Passwords do not match.';
    return '';
  };

  // --- Event Handlers ---
  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    if (isPasswordTouched) {
      setPasswordError(validatePassword(newPassword));
    }
    if (confirmPassword) {
      setConfirmPasswordError(validateConfirmPassword(newPassword, confirmPassword));
    }
  };

  const handlePasswordBlur = () => {
    setIsPasswordTouched(true);
    setPasswordError(validatePassword(password));
  };
  
  const handleNameBlur = (e, validator, setError) => {
      setError(validator(e.target.value, e.target.placeholder.includes('first') ? 'First Name' : 'Last Name'));
  };

  const handleAlreadyHaveAccount = () => {
    navigate('/login');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const fNameError = validateName(firstName, 'First Name');
    const lNameError = validateName(lastName, 'Last Name');
    const emailErr = validateEmail(email);
    const phoneErr = validatePhone(phone);
    const passError = validatePassword(password);
    const cnfPassError = validateConfirmPassword(password, confirmPassword);
    
    setFirstNameError(fNameError);
    setLastNameError(lNameError);
    setEmailError(emailErr);
    setPhoneError(phoneErr);
    setPasswordError(passError);
    setConfirmPasswordError(cnfPassError);
    setIsPasswordTouched(true);

    if (fNameError || lNameError || emailErr || phoneErr || passError || cnfPassError) {
      return;
    }

    // ✅ FIX: 'userData' is now used in the fetch call below.
    const userData = {
      first_name: firstName,
      last_name: lastName,
      email,
      phone_number: phone,
      shipping_address: shippingAddress,
      username,
      password,
      // ✅ FIX: 'CUSTOMER_ROLE_ID' is now used here.
      role_id: CUSTOMER_ROLE_ID,
    };

    try {
      const response = await fetch('/api/user/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Failed to sign up');
      }

      alert('Account created successfully! You will be redirected to the homepage.');
      localStorage.setItem('user', JSON.stringify(result));
      window.location.href = '/';

    } catch (err) {
      alert(`Error signing up: ${err.message}`);
    }
  };

  const inputStyle = { display: 'block', width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' };
  const errorInputStyle = { ...inputStyle, borderColor: '#e74c3c' };
  const errorMessageStyle = { color: '#e74c3c', fontSize: '0.875em', marginTop: '-10px', marginBottom: '15px' };

  return (
    <>
      <Header />
      <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', marginTop: '40px' }}>
        <div style={{ flex: 1, maxWidth: '500px' }}>
          <h2 style={{ fontWeight: 'bold', fontSize: '2em', marginBottom: '10px' }}>Sign Up Form</h2>
          <p style={{ marginBottom: '30px', fontSize: '1em', color: '#555' }}>Create a new account!</p>
          <form onSubmit={handleSubmit} noValidate>
            
            {/* ✅ FIX: All inputs now have their onChange and onBlur handlers, using their respective state setters and error states. */}
            <input type="text" placeholder="Enter your first name" value={firstName} onChange={e => setFirstName(e.target.value)} onBlur={(e) => handleNameBlur(e, validateName, setFirstNameError)} style={{...firstNameError ? errorInputStyle : inputStyle, marginBottom: firstNameError ? '5px' : '15px'}} />
            {firstNameError && <p style={errorMessageStyle}>{firstNameError}</p>}
            
            <input type="text" placeholder="Enter your last name" value={lastName} onChange={e => setLastName(e.target.value)} onBlur={(e) => handleNameBlur(e, validateName, setLastNameError)} style={{...lastNameError ? errorInputStyle : inputStyle, marginBottom: lastNameError ? '5px' : '15px'}} />
            {lastNameError && <p style={errorMessageStyle}>{lastNameError}</p>}

            <input type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} onBlur={() => setEmailError(validateEmail(email))} style={{...emailError ? errorInputStyle : inputStyle, marginBottom: emailError ? '5px' : '15px'}} />
            {emailError && <p style={errorMessageStyle}>{emailError}</p>}
            
            <input type="tel" placeholder="Enter your phone number" value={phone} onChange={e => setPhone(e.target.value)} onBlur={() => setPhoneError(validatePhone(phone))} pattern="[689]\d{7}" title="Enter a valid 8-digit Singapore number starting with 6, 8, or 9." style={{...phoneError ? errorInputStyle : inputStyle, marginBottom: phoneError ? '5px' : '15px'}} />
            {phoneError && <p style={errorMessageStyle}>{phoneError}</p>}
            
            <input type="text" placeholder="Enter your shipping address" value={shippingAddress} onChange={e => setShippingAddress(e.target.value)} style={{...inputStyle, marginBottom: '15px'}} />
            
            <input type="text" placeholder="Enter your username" value={username} onChange={e => setUsername(e.target.value)} style={{...inputStyle, marginBottom: '15px'}} />
            
            <div className="password-input-wrapper" style={{ marginBottom: isPasswordTouched && passwordError ? '5px' : '15px' }}>
                <input
                    type={isPasswordVisible ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={handlePasswordChange}
                    onBlur={handlePasswordBlur}
                    style={isPasswordTouched && passwordError ? errorInputStyle : inputStyle}
                />
                <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setIsPasswordVisible(prev => !prev)}
                >
                    {isPasswordVisible ? <EyeOffIcon /> : <EyeIcon />}
                </button>
            </div>
            {isPasswordTouched && passwordError && <p style={errorMessageStyle}>{passwordError}</p>}

            <div className="password-input-wrapper" style={{ marginBottom: confirmPasswordError ? '5px' : '15px' }}>
                <input
                    type={isConfirmPasswordVisible ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    onBlur={() => setConfirmPasswordError(validateConfirmPassword(password, confirmPassword))}
                    style={confirmPasswordError ? errorInputStyle : inputStyle}
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
            
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button type="button" className="update-cart-btn" onClick={handleAlreadyHaveAccount} style={{ flexGrow: 1, backgroundColor: '#f0f0f0', color: '#333', border: '1px solid #ccc' }}>
                Already have an account?
              </button>
              <button type="submit" className="complete-purchase-btn" style={{ flexGrow: 1, backgroundColor: '#333', color: '#fff' }}>
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SignUpPage;