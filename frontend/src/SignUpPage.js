// SignUpPage.js

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthContext } from './hooks/useAuthContext';
import './Website.css';
import Header from './Header';
import Footer from './Footer';

const EyeIcon = ({ size = 20, color = "currentColor" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>;
const EyeOffIcon = ({ size = 20, color = "currentColor" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>;
const CUSTOMER_ROLE_ID = '6849293057e7f26973c9fb40'; 

// ✅ MODIFIED: InfoIcon component now includes a responsive style fix
// NEW, cleaner version for all your files
const InfoIcon = ({ hint }) => {
  const [isHovered, setIsHovered] = useState(false);

  const containerStyle = {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    marginLeft: '8px',
  };

  const iconStyle = {
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    backgroundColor: '#adb5bd',
    color: 'white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '12px',
    fontWeight: 'bold',
    fontFamily: 'sans-serif',
    cursor: 'pointer',
    userSelect: 'none',
  };

  const tooltipStyle = {
    visibility: isHovered ? 'visible' : 'hidden',
    opacity: isHovered ? 1 : 0,
    width: '240px',
    backgroundColor: '#343a40',
    color: '#fff',
    textAlign: 'left',
    borderRadius: '6px',
    padding: '10px',
    position: 'absolute',
    zIndex: 10,
    bottom: '140%',
    left: '50%',
    transform: 'translateX(-50%)',
    transition: 'opacity 0.2s ease-in-out',
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
    fontSize: '0.85em',
    lineHeight: '1.4',
    whiteSpace: 'pre-wrap',
  };

  return (
    <div 
      style={containerStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span style={iconStyle}>i</span>
      <div style={tooltipStyle} className="info-tooltip-mobile-fix">{hint}</div>
    </div>
  );
};

const SignUpPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { dispatch } = useAuthContext();
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [fullNameError, setFullNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [shippingAddressError, setShippingAddressError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [isPasswordTouched, setIsPasswordTouched] = useState(false);

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  const validateFullName = (name) => {
    if (!name) return `Full Name is required.`;
    if (!/^[a-zA-Z\s]*$/.test(name)) {
      return `Full Name must only contain letters and spaces.`;
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

  const validateShippingAddress = (address) => {
    if (!address) return 'Shipping address is required.';
    return '';
  };

  const validateUsername = (username) => {
    if (!username) return 'Username is required.';
    if (!/^[a-zA-Z0-9]+$/.test(username)) return 'Username must contain only letters and numbers.';
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

  const handleEmailBlur = async (e) => {
    const currentValue = e.target.value;
    const formatError = validateEmail(currentValue);
    if (formatError) {
      setEmailError(formatError);
      return;
    }
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/check-existence`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: currentValue.toLowerCase() })
      });
      const result = await response.json();
      if (result.exists) {
        setEmailError('This email is already taken.');
      } else {
        setEmailError('');
      }
    } catch (err) {
      console.error("API call to check email failed:", err);
    }
  };

  const handleUsernameBlur = async (e) => {
    const currentValue = e.target.value;
    const formatError = validateUsername(currentValue);
    if (formatError) {
      setUsernameError(formatError);
      return;
    }
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/check-existence`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: currentValue })
      });
      const result = await response.json();
      if (result.exists) {
        setUsernameError('This username is already taken.');
      } else {
        setUsernameError('');
      }
    } catch (err) {
      console.error("API call to check username failed:", err);
    }
  };

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
  
  const handleAlreadyHaveAccount = () => navigate('/login', { state: location.state });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);
    
    const fNameError = validateFullName(fullName);
    const emailErr = validateEmail(email);
    const phoneErr = validatePhone(phone);
    const shippingAddressErr = validateShippingAddress(shippingAddress);
    const usernameErr = validateUsername(username);
    const passError = validatePassword(password);
    const cnfPassError = validateConfirmPassword(password, confirmPassword);
    
    setFullNameError(fNameError);
    setEmailError(emailErr || emailError);
    setPhoneError(phoneErr);
    setShippingAddressError(shippingAddressErr);
    setUsernameError(usernameErr || usernameError);
    setPasswordError(passError);
    setConfirmPasswordError(cnfPassError);
    setIsPasswordTouched(true);

    if (fNameError || emailErr || phoneErr || shippingAddressErr || usernameErr || passError || cnfPassError || emailError || usernameError) {
      return;
    }

    setIsLoading(true);

    const userData = {
      full_name: fullName,
      email,
      phone_number: phone,
      shipping_address: shippingAddress,
      username,
      password,
      role_id: CUSTOMER_ROLE_ID,
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to sign up');

      localStorage.setItem('user', JSON.stringify(result));
      dispatch({ type: 'LOGIN', payload: result });
      
      const from = location.state?.from || '/';
      navigate(from, { replace: true, state: location.state });

    } catch (err) {
      setApiError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const labelStyle = { fontWeight: '600', marginBottom: '6px', display: 'flex', alignItems: 'center', fontSize: '0.9em' };
  const inputStyle = { display: 'block', width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' };
  const errorInputStyle = { ...inputStyle, borderColor: '#e74c3c' };
  const errorMessageStyle = { color: '#e74c3c', fontSize: '0.875em', marginTop: '5px', marginBottom: '15px' };

  const passwordHint = `Your password must include:\n• At least 8 characters\n• An uppercase letter (A-Z)\n• A lowercase letter (a-z)\n• A number (0-9)\n• A special character (!@#$%^&*)`;

  return (
    <>
      <div style={{ position: 'sticky', top: 0, zIndex: 1000}}>
      <Header />
      </div>
      <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', marginTop: '40px' }}>
        <div style={{ flex: 1, maxWidth: '500px' }}>
          <h2 style={{ fontWeight: 'bold', fontSize: '2em', marginBottom: '10px' }}>Sign Up Form</h2>
          <p style={{ marginBottom: '30px', fontSize: '1em', color: '#555' }}>Create a new account!</p>
          <form onSubmit={handleSubmit} noValidate>
            
            <label style={labelStyle}>
              Full Name
              <InfoIcon hint="Please use only letters and spaces." />
            </label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              onBlur={() => setFullNameError(validateFullName(fullName))}
              style={{...fullNameError ? errorInputStyle : inputStyle, marginBottom: fullNameError ? '0' : '15px'}} />
            {fullNameError && <p style={errorMessageStyle}>{fullNameError}</p>}
            
            <label style={labelStyle}>
              Email Address
              <InfoIcon hint="e.g., 'name@example.com'. This will be used to log in." />
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onBlur={handleEmailBlur}
              style={{...emailError ? errorInputStyle : inputStyle, marginBottom: emailError ? '0' : '15px'}} />
            {emailError && <p style={errorMessageStyle}>{emailError}</p>}
            
            <label style={labelStyle}>
              Phone Number
              <InfoIcon hint="Must be exactly 8 digits, no spaces or symbols." />
            </label>
            <input 
              type="tel"
              placeholder="Enter your phone number"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              onBlur={() => setPhoneError(validatePhone(phone))}
              style={{...phoneError ? errorInputStyle : inputStyle, marginBottom: phoneError ? '0' : '15px'}} />
            {phoneError && <p style={errorMessageStyle}>{phoneError}</p>}
            
            <label style={labelStyle}>Shipping Address</label>
            <input
              type="text"
              placeholder="Enter your shipping address"
              value={shippingAddress}
              onChange={e => setShippingAddress(e.target.value)}
              onBlur={() => setShippingAddressError(validateShippingAddress(shippingAddress))}
              style={{...shippingAddressError ? errorInputStyle : inputStyle, marginBottom: shippingAddressError ? '0' : '15px'}} />
            {shippingAddressError && <p style={errorMessageStyle}>{shippingAddressError}</p>}

            <label style={labelStyle}>
              Username
              <InfoIcon hint="Your unique username. Can only contain letters and numbers." />
            </label>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              onBlur={handleUsernameBlur}
              style={{...usernameError ? errorInputStyle : inputStyle, marginBottom: usernameError ? '0' : '15px'}} />
            {usernameError && <p style={errorMessageStyle}>{usernameError}</p>}

            <label style={labelStyle}>
              Password
              <InfoIcon hint={passwordHint} />
            </label>
            <div className="password-input-wrapper" style={{ marginBottom: isPasswordTouched && passwordError ? '0' : '15px' }}>
                <input
                  type={isPasswordVisible ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={handlePasswordChange}
                  onBlur={handlePasswordBlur}
                  style={isPasswordTouched && passwordError ? errorInputStyle : inputStyle} />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setIsPasswordVisible(p => !p)}>
                  {isPasswordVisible ? <EyeOffIcon /> : <EyeIcon />}
                </button>
            </div>
            {isPasswordTouched && passwordError && <p style={errorMessageStyle}>{passwordError}</p>}

            <label style={labelStyle}>Confirm Password</label>
            <div className="password-input-wrapper" style={{ marginBottom: confirmPasswordError ? '0' : '15px' }}>
                <input
                  type={isConfirmPasswordVisible ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  onBlur={() => setConfirmPasswordError(validateConfirmPassword(password, confirmPassword))}
                  style={confirmPasswordError ? errorInputStyle : inputStyle} />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setIsConfirmPasswordVisible(p => !p)}>
                  {isConfirmPasswordVisible ? <EyeOffIcon /> : <EyeIcon />}
                </button>
            </div>
            {confirmPasswordError && <p style={errorMessageStyle}>{confirmPasswordError}</p>}
            
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button
                type="button"
                className="update-cart-btn"
                onClick={handleAlreadyHaveAccount}
                style={{ flexGrow: 1, backgroundColor: '#f0f0f0', color: '#333', border: '1px solid #ccc' }}>
                Already have an account?
              </button>
              <button
                type="submit"
                className="complete-purchase-btn"
                style={{ flexGrow: 1, backgroundColor: '#333', color: '#fff' }}
                disabled={isLoading}
                >
                {isLoading ? 'Signing Up...' : 'Sign Up'}
              </button>
            </div>
            {apiError && <p style={{...errorMessageStyle, textAlign: 'center'}}>{apiError}</p>}
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SignUpPage;