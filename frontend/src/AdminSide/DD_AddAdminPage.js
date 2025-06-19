// DD_AddAdminPage.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminStyles.css';
import AdminHeader from '../AdminHeader';

// --- ICONS ---
const BackIcon = ({ color = "currentColor" }) => <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19 12H5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 19L5 12L12 5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const PencilIcon = ({ size = 18, color = "currentColor" }) => (
    <svg viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg" width={size} height={size}>
        <path d="M17 3C17.2626 2.7374 17.5893 2.52942 17.9573 2.38285C18.3253 2.23629 18.7259 2.15325 19.1365 2.13815C19.5471 2.12304 19.9576 2.17623 20.3485 2.29581C20.7394 2.41539 21.1013 2.59878 21.4142 2.91168C21.7271 3.22458 21.9795 3.5865 22.0991 3.97744C22.2187 4.36838 22.2719 4.77888 22.2568 5.18947C22.2418 5.60006 22.1587 6.00066 22.0121 6.36867C21.8656 6.73668 21.6576 7.0634 21.395 7.326L10.35 18.36L2 22L5.64 13.65L17 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);
const EyeIcon = ({ size = 20, color = "#666" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>;
const EyeOffIcon = ({ size = 20, color = "#666" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>;

const ADMIN_ROLE_ID = '6849291d57e7f26973c9fb3e';

function AddAdminPage() {
    const navigate = useNavigate();
    const [roles, setRoles] = useState([]);

    // ✅ FIX: The formData state declaration is now included.
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        shippingAddress: '',
        password: '',
        confirmPassword: '',
        phoneNumber: '',
        role: ADMIN_ROLE_ID,
        status: 'Active',
    });

    // State for password visibility toggle
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await fetch('/api/role');
                if (response.ok) {
                    const rolesData = await response.json();
                    setRoles(rolesData);
                } else {
                    console.error('Failed to fetch roles:', response.status, response.statusText);
                }
            } catch (error) {
                console.error('Failed to fetch roles:', error);
            }
        };
        fetchRoles();
    }, []);

    const validatePassword = (pass) => {
        if (pass.length < 8) return 'Password must be at least 8 characters long.';
        if (!/[A-Z]/.test(pass)) return 'Password must contain at least one uppercase letter.';
        if (!/[a-z]/.test(pass)) return 'Password must contain at least one lowercase letter.';
        if (!/[0-9]/.test(pass)) return 'Password must contain at least one number.';
        if (!/[!@#$%^&*]/.test(pass)) return 'Password must contain a special character (e.g., !@#$%^&*).';
        return '';
    };

    // ✅ FIX: The handleChange function definition is now included.
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Name validation
        const nameRegex = /^[A-Z][a-zA-Z]*$/;
        if (!nameRegex.test(formData.firstName)) {
            alert('❌ First Name must start with a capital letter and contain no spaces, numbers, or special characters.');
            return;
        }
        if (!nameRegex.test(formData.lastName)) {
            alert('❌ Last Name must start with a capital letter and contain no spaces, numbers, or special characters.');
            return;
        }

        // General fields check
        if (!formData.username || !formData.email || !formData.password || !formData.role || !formData.shippingAddress) {
            alert('❌ Please fill in all required fields');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            alert('❌ Please enter a valid email address');
            return;
        }

        const passwordError = validatePassword(formData.password);
        if (passwordError) {
            alert(`❌ ${passwordError}`);
            return;
        }
        
        if (formData.password !== formData.confirmPassword) {
            alert('❌ Passwords do not match');
            return;
        }

        try {
            const response = await fetch('/api/user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    first_name: formData.firstName,
                    last_name: formData.lastName,
                    username: formData.username,
                    email: formData.email,
                    shipping_address: formData.shippingAddress,
                    password: formData.password,
                    phone_number: formData.phoneNumber,
                    role_id: formData.role, 
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`Server error (${response.status}): ${errorData.error || response.statusText || 'Unknown error'}`);
            }

            alert('✅ Admin user created successfully!');
            navigate('/all-customers');
        } catch (error) {
            console.error('Creation failed:', error);
            alert(`❌ Failed to create admin user: ${error.message}`);
        }
    };

    const handleBack = () => {
        navigate('/all-customers');
    };

    const handleCancel = () => {
        handleBack();
    };

  return (
    <div className="add-product-page">
      <AdminHeader />
      <div className="manage-products-page" style={{ paddingLeft: "100px", paddingRight: "100px" }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Add New Admin User</h2>
          <button onClick={handleBack} className="btn-add-new">
            <BackIcon size={18} color="white" />
            Back to All Users
          </button>
        </div>

            <form onSubmit={handleSubmit} >
                <div className="add-product-form-layout">
                <div className="add-product-main-column">
                    <div className="form-section-card">
                        <h3 className="section-card-title">Personal Information</h3>
                        <div className="form-group">
                            <label>First Name</label>
                            <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Enter first name" required />
                        </div>
                        <div className="form-group">
                            <label>Last Name</label>
                            <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Enter last name" required />
                        </div>
                        <div className="form-group">
                            <label>Phone Number</label>
                            <input type="tel" id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="Enter phone number" />
                        </div>
                    </div>
                    <div className="form-section-card">
                        <h3 className="section-card-title">Account Information</h3>
                        <div className="form-group">
                            <label>Username</label>
                            <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} placeholder="Enter username" required />
                        </div>
                        <div className="form-group">
                            <label>Email Address</label>
                            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter email address" required />
                        </div>
                        <div className="form-group">
                            <label>Shipping Address</label>
                            <input type="text" id="shippingAddress" name="shippingAddress" value={formData.shippingAddress} onChange={handleChange} placeholder="Enter shipping address" required />
                        </div>
                        
                        <div className="form-group">
                            <label>Password</label>
                            <div className="password-input-wrapper">
                                <input
                                    type={isPasswordVisible ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter password"
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
                        </div>

                        <div className="form-group">
                            <label>Confirm Password</label>
                            <div className="password-input-wrapper">
                                <input
                                    type={isConfirmPasswordVisible ? 'text' : 'password'}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Confirm password"
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
                        </div>
                    </div>
                </div>
                <div className="add-product-sidebar-panel">
                    <div className="form-section-card">
                        <h3 className="section-card-title">Admin Role</h3>
                         <div className="form-group">
                            <label htmlFor="adminRole">Assign Role</label>
                            <select id="adminRole" name="role" value={formData.role} onChange={handleChange} required style={{ flex: '1 1 150px', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} disabled >
                                <option value="" disabled>Select Role</option>
                                {roles.map((role) => (<option key={role._id} value={role._id}>{role.role_name}</option>))}
                            </select>
                        </div>
                    </div>
                    <div className="form-section-card">
                        <h3 className="section-card-title">Account Status</h3>
                        <div className="form-group">
                            <label htmlFor="adminStatus">Status</label>
                            <select id="adminStatus" name="status" value={formData.status} onChange={handleChange} style={{ flex: '1 1 150px', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} disabled>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-section-card">
                        <h3 className="section-card-title">Create Admin User</h3>
                        <div className="form-actions-vertical">
                            <button type="submit" className="btn-save-product">
                                 <PencilIcon size={18} color="white" />
                                 Create Admin User
                            </button>
                            <button type="button" onClick={handleCancel} className="btn-cancel-product">Cancel</button>
                        </div>
                    </div>
                </div>
                </div>
            </form>
        </div> 
        </div>
    );
}

export default AddAdminPage;