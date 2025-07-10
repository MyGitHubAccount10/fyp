// DD_AddAdminPage.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminStyles.css';
import AdminHeader from '../AdminHeader';

import { FaAngleLeft } from "react-icons/fa";
import { IoIosAddCircle } from "react-icons/io";

import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";

const ADMIN_ROLE_ID = '6849291d57e7f26973c9fb3e';

function AddAdminPage() {
    const navigate = useNavigate();
    const [roles, setRoles] = useState([]);
    const [currentUserRole, setCurrentUserRole] = useState(null);
    const [formData, setFormData] = useState({ fullName: '', username: '', email: '', shippingAddress: '', password: '', confirmPassword: '', phoneNumber: '', role: ADMIN_ROLE_ID });
    const [errors, setErrors] = useState({});
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

    useEffect(() => {
        try {
            const adminUser = JSON.parse(localStorage.getItem('admin_user'));
            if (adminUser && adminUser.role) setCurrentUserRole(adminUser.role.role_name);
        } catch (error) { console.error('Error loading admin user role:', error); }
    }, []);

    const isSuperAdmin = currentUserRole === 'Super Admin' || currentUserRole === 'Super-Admin';

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await fetch('/api/role');
                if (response.ok) {
                    const rolesData = await response.json();
                    let availableRoles = isSuperAdmin ? rolesData : rolesData.filter(role => role.role_name === 'Customer');
                    setRoles(availableRoles);
                    if (availableRoles.length > 0) {
                        const defaultRole = !isSuperAdmin ? availableRoles.find(role => role.role_name === 'Customer') : availableRoles.find(role => role._id === ADMIN_ROLE_ID);
                        if (defaultRole) setFormData(prev => ({ ...prev, role: defaultRole._id }));
                    }
                }
            } catch (error) { console.error('Failed to fetch roles:', error); }
        };
        if (currentUserRole !== null) fetchRoles();
    }, [currentUserRole, isSuperAdmin]);
    
    const validateField = (name, value) => {
      let error = '';
      switch (name) {
        case 'fullName': if (!value) error = 'Full Name is required.'; else if (!/^[a-zA-Z\s]*$/.test(value)) error = 'Full Name must only contain letters and spaces.'; break;
        case 'username': if (!value) error = 'Username is required.'; else if (!/^[a-zA-Z0-9]+$/.test(value)) error = 'Username must contain only letters and numbers.'; break;
        case 'email': if (!value) error = 'Email is required.'; else if (!/^\S+@\S+\.\S+$/.test(value)) error = 'Please enter a valid email format.'; break;
        case 'phoneNumber': if (!value) error = 'Phone number is required.'; else if (!/^\d{8}$/.test(value)) error = 'Phone number must be exactly 8 digits.'; break;
        case 'shippingAddress': if (!value) error = 'Shipping address is required.'; break;
        case 'password':
          if (value.length < 8) error = 'Password must be at least 8 characters long.';
          else if (!/[A-Z]/.test(value)) error = 'Must contain one uppercase letter.';
          else if (!/[a-z]/.test(value)) error = 'Must contain one lowercase letter.';
          else if (!/[0-9]/.test(value)) error = 'Must contain one number.';
          else if (!/[!@#$%^&*]/.test(value)) error = 'Must contain a special character.';
          break;
        case 'confirmPassword': if (!value) error = 'Please confirm the password.'; else if (formData.password !== value) error = 'Passwords do not match.'; break;
        default: break;
      }
      setErrors(prev => ({ ...prev, [name]: error }));
      return error;
    };
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) validateField(name, value);
    };

    const handleBlur = (e) => {
      const { name, value } = e.target;
      validateField(name, value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let validationErrors = {};
        Object.keys(formData).forEach(key => {
            const error = validateField(key, formData[key]);
            if(error) validationErrors[key] = error;
        });
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            alert('❌ Please fix the errors before submitting.');
            return;
        }
        try {
            const response = await fetch('/api/user', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ full_name: formData.fullName, username: formData.username, email: formData.email, shipping_address: formData.shippingAddress, password: formData.password, phone_number: formData.phoneNumber, role_id: formData.role }),
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`Server error (${response.status}): ${errorData.error || 'Unknown error'}`);
            }
            const createdUser = roles.find(r => r._id === formData.role)?.role_name || 'User';
            alert(`✅ ${createdUser} account created successfully!`);
            navigate('/all-customers');
        } catch (error) {
            alert(`❌ Failed to create user account: ${error.message}`);
        }
    };
    
    const handleBack = () => navigate('/all-customers');
    const handleCancel = () => handleBack();

    // ✅ REFACTORED: Removed inline styles for inputs, now using CSS classes.
    const errorMessageStyle = { color: '#e74c3c', fontSize: '0.875em', marginTop: '5px', marginBottom: '0' };
    const formGroupStyle = { marginBottom: '15px' };

  return (
    <div className="add-product-page">
            <div style={{ position: 'sticky', top: 0, zIndex: 1000}}>
                <AdminHeader />
            </div>
            <div className="manage-products-page">
        {currentUserRole === null ? ( <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div> ) :
         !isSuperAdmin && !roles.some(r => r.role_name === 'Customer') ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <h2>Access Restricted</h2> <p>You don't have permission to create new users.</p>
            <button onClick={handleBack} className="add-new-btn"><FaAngleLeft size={18} /> Back to All Users</button>
          </div>
        ) : (
          <>
            <div>
              <div className="title-row">
                <h2>{isSuperAdmin ? 'Add New User' : 'Add New Customer'}</h2>
              <button onClick={handleBack} className="add-new-btn"><FaAngleLeft size={18} /> Back to All Users</button>
              </div>
              <p style={{ color: '#666', fontSize: '14px', margin: '5px 0' }}>Logged in as: <strong>{currentUserRole}</strong></p>

            </div>
            <form onSubmit={handleSubmit} noValidate>
              <div className="add-product-form-layout">
                <div className="add-product-main-column">
                  <div className="form-section-card">
                    <h3 className="section-card-title">Personal Information</h3>
                    <div className="form-group" style={{...formGroupStyle, marginBottom: errors.fullName ? '5px' : '15px'}}>
                      <label>Full Name</label>
                      <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} onBlur={handleBlur} placeholder="Enter full name" className={errors.fullName ? 'input-error' : ''}/>
                      {errors.fullName && <p style={errorMessageStyle}>{errors.fullName}</p>}
                    </div>
                    <div className="form-group" style={{...formGroupStyle, marginBottom: errors.phoneNumber ? '5px' : '15px'}}>
                      <label>Phone Number</label>
                      <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} onBlur={handleBlur} placeholder="Enter 8-digit phone number" className={errors.phoneNumber ? 'input-error' : ''}/>
                      {errors.phoneNumber && <p style={errorMessageStyle}>{errors.phoneNumber}</p>}
                    </div>
                  </div>
                  <div className="form-section-card">
                    <h3 className="section-card-title">Account Information</h3>
                    <div className="form-group" style={{...formGroupStyle, marginBottom: errors.username ? '5px' : '15px'}}>
                      <label>Username</label>
                      <input type="text" name="username" value={formData.username} onChange={handleChange} onBlur={handleBlur} placeholder="Enter username" className={errors.username ? 'input-error' : ''} />
                      {errors.username && <p style={errorMessageStyle}>{errors.username}</p>}
                    </div>
                    <div className="form-group" style={{...formGroupStyle, marginBottom: errors.email ? '5px' : '15px'}}>
                      <label>Email Address</label>
                      <input type="email" name="email" value={formData.email} onChange={handleChange} onBlur={handleBlur} placeholder="Enter email address" className={errors.email ? 'input-error' : ''}/>
                      {errors.email && <p style={errorMessageStyle}>{errors.email}</p>}
                    </div>
                    <div className="form-group" style={{...formGroupStyle, marginBottom: errors.shippingAddress ? '5px' : '15px'}}>
                      <label>Shipping Address</label>
                      <input type="text" name="shippingAddress" value={formData.shippingAddress} onChange={handleChange} onBlur={handleBlur} placeholder="Enter shipping address" className={errors.shippingAddress ? 'input-error' : ''}/>
                      {errors.shippingAddress && <p style={errorMessageStyle}>{errors.shippingAddress}</p>}
                    </div>
                    <div className="form-group" style={{...formGroupStyle, marginBottom: errors.password ? '5px' : '15px'}}>
                      <label>Password</label>
                      <div className="password-input-wrapper">
                        <input type={isPasswordVisible ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} onBlur={handleBlur} placeholder="Enter password" className={errors.password ? 'input-error' : ''}/>
                        <button type="button" className="password-toggle-btn" onClick={() => setIsPasswordVisible(p => !p)}>
                            {isPasswordVisible ? <FaEyeSlash size={20}/> : <FaEye size={20}/>}
                        </button>
                      </div>
                      {errors.password && <p style={errorMessageStyle}>{errors.password}</p>}
                    </div>
                    <div className="form-group" style={{...formGroupStyle, marginBottom: errors.confirmPassword ? '5px' : '15px'}}>
                      <label>Confirm Password</label>
                      <div className="password-input-wrapper">
                        <input type={isConfirmPasswordVisible ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} onBlur={handleBlur} placeholder="Confirm password" className={errors.confirmPassword ? 'input-error' : ''}/>
                        <button type="button" className="password-toggle-btn" onClick={() => setIsConfirmPasswordVisible(p => !p)}>
                            {isConfirmPasswordVisible ? <FaEyeSlash size={20}/> : <FaEye size={20}/>}
                        </button>
                      </div>
                      {errors.confirmPassword && <p style={errorMessageStyle}>{errors.confirmPassword}</p>}
                    </div>
                  </div>
                </div>
                <div className="add-product-sidebar-panel">
                  <div className="form-section-card">
                    <h3 className="section-card-title">User Role</h3>
                    <div className="form-group">
                      <label htmlFor="role">Assign Role</label>
                      <select id="role" name="role" value={formData.role} onChange={handleChange} disabled={!isSuperAdmin}>
                        {roles.map((role) => (<option key={role._id} value={role._id}>{role.role_name}</option>))}
                      </select>
                      {!isSuperAdmin && (<p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>Only Super Admins can change roles.</p>)}
                    </div>
                  </div>
                  <div className="form-section-card">
                    <h3 className="section-card-title">Create Account</h3>
                    <div className="form-actions-vertical">
                      <button type="submit" className="btn-save-product"><IoIosAddCircle size={18} /> {isSuperAdmin ? 'Create User' : 'Create Customer'}</button>
                      <button type="button" onClick={handleCancel} className="btn-cancel-product">Cancel</button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default AddAdminPage;