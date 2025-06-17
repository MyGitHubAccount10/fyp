// AddAdminPage.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminStyles.css';
import AdminHeader from '../AdminHeader';

const BackIcon = ({ color = "currentColor" }) => <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19 12H5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 19L5 12L12 5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const PencilIcon = ({ size = 18, color = "currentColor" }) => (
    <svg viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg" width={size} height={size}>
        <path d="M17 3C17.2626 2.7374 17.5893 2.52942 17.9573 2.38285C18.3253 2.23629 18.7259 2.15325 19.1365 2.13815C19.5471 2.12304 19.9576 2.17623 20.3485 2.29581C20.7394 2.41539 21.1013 2.59878 21.4142 2.91168C21.7271 3.22458 21.9795 3.5865 22.0991 3.97744C22.2187 4.36838 22.2719 4.77888 22.2568 5.18947C22.2418 5.60006 22.1587 6.00066 22.0121 6.36867C21.8656 6.73668 21.6576 7.0634 21.395 7.326L10.35 18.36L2 22L5.64 13.65L17 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

function AddAdminPage() {
    const navigate = useNavigate();

    const [roles, setRoles] = useState([]);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        phoneNumber: '',
        role: '', // For admin role selection
        status: 'Active', // Default status
    });    // Fetch roles on component mount
    useEffect(() => {
        const fetchRoles = async () => {
            try {
                console.log('Fetching roles...');
                const response = await fetch('/api/role');
                console.log('Roles response:', response.status, response.statusText);
                if (response.ok) {
                    const rolesData = await response.json();
                    console.log('Roles loaded:', rolesData);
                    setRoles(rolesData);
                } else {
                    console.error('Failed to fetch roles:', response.status, response.statusText);
                }
            } catch (error) {
                console.error('Failed to fetch roles:', error);
            }
        };
        fetchRoles();
    }, []);    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Frontend validation
        if (!formData.firstName || !formData.lastName || !formData.username || !formData.email || !formData.password || !formData.role) {
            alert('❌ Please fill in all required fields');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            alert('❌ Please enter a valid email address');
            return;
        }

        // Password validation
        if (formData.password.length < 6) {
            alert('❌ Password must be at least 6 characters long');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            alert('❌ Passwords do not match');
            return;
        }

        console.log('Form data before submission:', formData);

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
                    password: formData.password,
                    phone_number: formData.phoneNumber,
                    role: formData.role,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('Server response:', {
                    status: response.status,
                    statusText: response.statusText,
                    headers: Object.fromEntries(response.headers.entries()),
                    body: errorData
                });
                throw new Error(`Server error (${response.status}): ${errorData.error || response.statusText || 'Unknown error'}`);
            }

            const result = await response.json();
            console.log('Admin user created:', result);
            alert('✅ Admin user created successfully!');
            navigate('/admin-users'); // Navigate back to admin users list
        } catch (error) {
            console.error('Creation failed:', error);
            alert(`❌ Failed to create admin user: ${error.message}`);
        }    };

    // Function to handle back navigation

    const handleBack = () => {
        navigate('/all-customers');
    };

    const handleCancel = () => {
        console.log("Cancelling admin user creation.");
        handleBack(); // Go back to the list page
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


            <form onSubmit={handleSubmit} > {/* Use form element to wrap inputs */}

                <div className="add-product-form-layout">                 {/* Left Column: Main Admin Details */}
                <div className="add-product-main-column">

                     {/* Card 1: Personal Information */}
                    <div className="form-section-card">
                        <h3 className="section-card-title">Personal Information</h3>
                        
                        {/* First Name */}
                        <div className="form-group">
                            <label>First Name</label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder="Enter first name"
                                required
                            />
                        </div>

                        {/* Last Name */}
                        <div className="form-group">
                            <label>Last Name</label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder="Enter last name"
                                required
                            />
                        </div>

                        {/* Phone Number */}
                        <div className="form-group">
                            <label>Phone Number</label>
                            <input
                                type="tel"
                                id="phoneNumber"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                placeholder="Enter phone number"
                            />
                        </div>
                    </div>

                     {/* Card 2: Account Information */}
                    <div className="form-section-card">
                        <h3 className="section-card-title">Account Information</h3>

                        {/* Username */}
                        <div className="form-group">
                            <label>Username</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Enter username"
                                required
                            />
                        </div>

                        {/* Email */}
                        <div className="form-group">
                            <label>Email Address</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter email address"
                                required
                            />
                        </div>

                        {/* Password */}
                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter password (min 6 characters)"
                                required
                            />
                        </div>

                        {/* Confirm Password */}
                        <div className="form-group">
                            <label>Confirm Password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm password"
                                required
                            />
                        </div>
                    </div>

                </div> {/* End Left Column */}                 {/* Right Column: Settings Panel */}
                <div className="add-product-sidebar-panel">

                     {/* Card 4: Role Selection */}
                    <div className="form-section-card">
                        <h3 className="section-card-title">Admin Role</h3>
                         <div className="form-group">
                            <label htmlFor="adminRole">Assign Role</label>
                            <select
                                id="adminRole"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                required
                                style={{
                                    flex: '1 1 150px',
                                    padding: '10px',
                                    borderRadius: '6px',
                                    border: '1px solid #ccc'
                    }}
                            >
                                <option value="" disabled>Select Role</option>
                                {roles.map((role) => (
                                    <option key={role._id} value={role._id}>
                                        {role.role_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                     {/* Card 5: Account Status */}
                    <div className="form-section-card">
                        <h3 className="section-card-title">Account Status</h3>
                        <div className="form-group">
                            <label htmlFor="adminStatus">Status</label>
                            <select
                                id="adminStatus"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                style={{
                                    flex: '1 1 150px',
                                    padding: '10px',
                                    borderRadius: '6px',
                                    border: '1px solid #ccc'
                                }}
                            >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>
                    </div>

                     {/* Card 6: Create Admin */}
                    <div className="form-section-card">
                        <h3 className="section-card-title">Create Admin User</h3>
                         {/* Save and Cancel Buttons */}
                        <div className="form-actions-vertical">
                            <button type="submit" className="btn-save-product">
                                 <PencilIcon size={18} color="white" />
                                 Create Admin User
                            </button>
                            <button type="button" onClick={handleCancel} className="btn-cancel-product">Cancel</button>
                        </div>
                    </div>

                </div> {/* End Right Column */}

                </div>

            </form> {/* End Form */}

        </div> 

        <div>
            ///
        </div>

        </div>
    );
}

export default AddAdminPage;
