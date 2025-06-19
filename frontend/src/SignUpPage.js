// SignUpPage.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Website.css';
import Header from './Header';
import Footer from './Footer';

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

  // --- State for all validation errors ---
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [emailError, setEmailError] = useState('');       // b) Added email error state
  const [phoneError, setPhoneError] = useState('');       // b) Added phone error state
  const [passwordError, setPasswordError] = useState('');
  const [isPasswordTouched, setIsPasswordTouched] = useState(false);

  // --- Validation Functions ---
  const validateName = (name, fieldName) => {
    if (!name) return `${fieldName} is required.`;
    if (!/^[A-Z][a-zA-Z]*$/.test(name)) {
      return `${fieldName} must start with a capital letter and contain no spaces, numbers, or special characters.`;
    }
    return '';
  };

  // b) Added email validation function
  const validateEmail = (email) => {
    if (!email) return 'Email is required.';
    // A simple regex for email format validation
    if (!/^\S+@\S+\.\S+$/.test(email)) return 'Please enter a valid email format (e.g., name@example.com).';
    return '';
  };

  // b) Added phone validation function
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

  // --- Event Handlers ---
  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    if (isPasswordTouched) {
      setPasswordError(validatePassword(newPassword));
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
    
    // --- Run all validations on submit ---
    const fNameError = validateName(firstName, 'First Name');
    const lNameError = validateName(lastName, 'Last Name');
    const emailErr = validateEmail(email); // b) Validate email on submit
    const phoneErr = validatePhone(phone); // b) Validate phone on submit
    const passError = validatePassword(password);
    
    setFirstNameError(fNameError);
    setLastNameError(lNameError);
    setEmailError(emailErr); // b) Set email error state
    setPhoneError(phoneErr); // b) Set phone error state
    setPasswordError(passError);
    setIsPasswordTouched(true);

    // b) Check all errors before proceeding
    if (fNameError || lNameError || emailErr || phoneErr || passError) {
      return; // Stop submission if there are any errors
    }

    const userData = {
      first_name: firstName,
      last_name: lastName,
      email,
      phone_number: phone,
      shipping_address: shippingAddress,
      username,
      password,
      role_id: CUSTOMER_ROLE_ID,
    };

    try {
      // a) The 'loading' state is the time between clicking submit and getting a response.
      const response = await fetch('/api/user/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Failed to sign up');
      }

      // a) Success pop-up
      alert('Account created successfully! You will be redirected to the homepage.');
      localStorage.setItem('user', JSON.stringify(result));
      window.location.href = '/';

    } catch (err) {
      // a) Error pop-up
      alert(`Error signing up: ${err.message}`);
    }
  };

  const inputStyle = { display: 'block', width: '100%', marginBottom: '15px', padding: '12px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' };
  const errorInputStyle = { ...inputStyle, borderColor: '#e74c3c', marginBottom: '5px' };
  const errorMessageStyle = { color: '#e74c3c', fontSize: '0.875em', marginTop: '-10px', marginBottom: '15px' };

  return (
    <>
      <Header />
      <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', marginTop: '40px' }}>
        <div style={{ flex: 1, maxWidth: '500px' }}>
          <h2 style={{ fontWeight: 'bold', fontSize: '2em', marginBottom: '10px' }}>Sign Up Form</h2>
          <p style={{ marginBottom: '30px', fontSize: '1em', color: '#555' }}>Create a new account!</p>
          <form onSubmit={handleSubmit} noValidate> {/* noValidate prevents default browser validation popups */}
            <input type="text" placeholder="Enter your first name" value={firstName} onChange={e => setFirstName(e.target.value)} onBlur={(e) => handleNameBlur(e, validateName, setFirstNameError)} style={firstNameError ? errorInputStyle : inputStyle} />
            {firstNameError && <p style={errorMessageStyle}>{firstNameError}</p>}
            
            <input type="text" placeholder="Enter your last name" value={lastName} onChange={e => setLastName(e.target.value)} onBlur={(e) => handleNameBlur(e, validateName, setLastNameError)} style={lastNameError ? errorInputStyle : inputStyle} />
            {lastNameError && <p style={errorMessageStyle}>{lastNameError}</p>}

            {/* b) Updated Email field with onBlur and dynamic styles */}
            <input type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} onBlur={() => setEmailError(validateEmail(email))} style={emailError ? errorInputStyle : inputStyle} />
            {emailError && <p style={errorMessageStyle}>{emailError}</p>}
            
            {/* b) Updated Phone field with onBlur and dynamic styles */}
            <input type="tel" placeholder="Enter your phone number" value={phone} onChange={e => setPhone(e.target.value)} onBlur={() => setPhoneError(validatePhone(phone))} pattern="[689]\d{7}" title="Enter a valid 8-digit Singapore number starting with 6, 8, or 9." style={phoneError ? errorInputStyle : inputStyle} />
            {phoneError && <p style={errorMessageStyle}>{phoneError}</p>}
            
            <input type="text" placeholder="Enter your shipping address" value={shippingAddress} onChange={e => setShippingAddress(e.target.value)} style={inputStyle} />
            
            <input type="text" placeholder="Enter your username" value={username} onChange={e => setUsername(e.target.value)} style={inputStyle} />
            
            <input type="password" placeholder="Enter your password" value={password} onChange={handlePasswordChange} onBlur={handlePasswordBlur} style={isPasswordTouched && passwordError ? errorInputStyle : inputStyle} />
            {isPasswordTouched && passwordError && <p style={errorMessageStyle}>{passwordError}</p>}
            
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