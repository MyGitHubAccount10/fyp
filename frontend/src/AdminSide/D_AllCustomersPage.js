import React, { useState, useEffect } from 'react';
import AdminHeader from '../AdminHeader';
import { useNavigate } from 'react-router-dom';

import './AdminStyles.css'; 




// Placeholder Icons
import { FaUserEdit } from "react-icons/fa";
import { FaEye } from "react-icons/fa6";


import { GrFormView } from "react-icons/gr";

import { FaBan } from "react-icons/fa";



  // <tr key={user.id}>
  //     <td>{user.role}</td>
  //     <td>{user.username}</td>
  //     <td>{user.email}</td>
  //     <td>{user.password}</td>
  //     <td>{user.phone}</td>
  // </tr>

function AllCustomersPage() {
    const [users, setUsers] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRole, setSelectedRole] = useState('All Roles');
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(10); // Fixed number of users per page
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentUserRole, setCurrentUserRole] = useState(null);
    const Navigate = useNavigate();

    // Get current user role from localStorage
    useEffect(() => {
        try {
            const adminUser = JSON.parse(localStorage.getItem('admin_user'));
            if (adminUser && adminUser.role) {
                setCurrentUserRole(adminUser.role.role_name);
            }
        } catch (error) {
            console.error('Error loading admin user role:', error);
        }
    }, []);

    // Check if current user is Super Admin
    const isSuperAdmin = currentUserRole === 'Super Admin' || currentUserRole === 'Super-Admin';

    // Fetch users from API
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const response = await fetch('http://localhost:4000/api/user');
                if (!response.ok) {
                    throw new Error('Failed to fetch users');
                }
                const userData = await response.json();
                
                // Populate role information for each user
                const usersWithRoles = await Promise.all(
                    userData.map(async (user) => {
                        try {
                            const roleResponse = await fetch(`http://localhost:4000/api/role/${user.role_id}`);
                            if (roleResponse.ok) {
                                const roleData = await roleResponse.json();
                                return {
                                    ...user,
                                    role_name: roleData.role_name
                                };
                            }
                            return {
                                ...user,
                                role_name: 'Unknown'
                            };
                        } catch (error) {
                            console.error('Error fetching role:', error);
                            return {
                                ...user,
                                role_name: 'Unknown'
                            };
                        }
                    })
                );
                
                setAllUsers(usersWithRoles);
                setUsers(usersWithRoles);
                setError('');
            } catch (error) {
                console.error('Error fetching users:', error);
                setError('Failed to load users');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    // Pagination Logic
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(users.length / usersPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };    // Action Handlers
    const handleEditUser = (user) => {
        console.log("Editing user:", user);
        // Check if current user has permission to edit this specific user
        const canEdit = isSuperAdmin || (currentUserRole === 'Admin' && user.role_name === 'Customer');
        
        // Navigate to customer details page with edit permission info
        Navigate(`/customer-details/${user._id}`, { 
            state: { 
                canEdit: canEdit,
                currentUserRole: currentUserRole,
                targetUserRole: user.role_name
            } 
        });
    };const handleBanUser = (userId, currentStatus, userRole) => {
        // Check if current user has permission to ban this specific user
        if (!isSuperAdmin && (userRole === 'Admin' || userRole === 'Super Admin' || userRole === 'Super-Admin')) {
            alert('Only Super Admins can ban/unban other Admin users. Regular Admins can only ban/unban customers.');
            return;
        }

        const action = currentStatus === 'banned' ? 'unban' : 'ban';
        const actionText = currentStatus === 'banned' ? 'unban' : 'ban';
        
        console.log(`${actionText} user with ID:`, userId);
        
        if (window.confirm(`Are you sure you want to ${actionText} this user?`)) {
            // Make API call to ban/unban user
            fetch(`http://localhost:4000/api/user/${userId}/${action}`, {
                method: 'PATCH'
            })
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    // Update the user status in the state
                    const newStatus = currentStatus === 'banned' ? 'active' : 'banned';
                    
                    setUsers(users.map(u => 
                        u._id === userId ? { ...u, status: newStatus } : u
                    ));
                    setAllUsers(allUsers.map(u => 
                        u._id === userId ? { ...u, status: newStatus } : u
                    ));
                    
                    console.log(`User ${actionText}ned successfully.`);
                } else {
                    console.error(`Failed to ${actionText} user`);
                }
            })
            .catch(error => {
                console.error(`Error ${actionText}ning user:`, error);
            });
        }
    };

    const handleAddAdmin = () => {
        console.log("Adding new admin");
        // In a real app, open the sidebar/modal for a new admin form
        Navigate('/add-admin');
    }    // Filter/Search Logic (basic client-side demo)
const handleFilter = () => {
    console.log("Filtering with:", { searchTerm, selectedRole });
    let filtered = allUsers;

    if (searchTerm) {
        filtered = filtered.filter(user =>
            user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    if (selectedRole !== 'All Roles') {
        filtered = filtered.filter(user => user.role_name === selectedRole);
    }

    setUsers(filtered);
    setCurrentPage(1);
};// Trigger filter when search term or category changes (optional auto-filter)
    useEffect(() => {
         if (allUsers.length > 0) {
             handleFilter();
         }
    }, [searchTerm, selectedRole, allUsers]); // Add allUsers to dependency array

    return (
        <>
            <div style={{ position: 'sticky', top: 0, zIndex: 1000}}>
                <AdminHeader />
            </div>  
            <div className="manage-products-page">
                {loading && <div style={{ textAlign: 'center', padding: '20px' }}>Loading users...</div>}
                {error && <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>{error}</div>}
                
                {!loading && !error && (                    
                    <>
                        <div className="title-row">
                            <div>
                                <h2>Users</h2>

                            </div>
                            <button onClick={handleAddAdmin} className="add-new-btn">
                                <FaUserEdit size={18} />
                                Add New User
                            </button>
                            </div>
                            <div>
                                {currentUserRole && (
                                    <p style={{ color: '#666', fontSize: '14px', margin: '5px 0' }}>
                                        Logged in as: <strong>{currentUserRole}</strong>
                                        {currentUserRole === 'Admin' && (
                                            <span style={{ color: '#f1673a', fontStyle: 'italic' }}>
                                                {' '}(Can ban/unban customers only. Admin banning restricted to Super Admins)
                                            </span>
                                        )}
                                        {isSuperAdmin && (
                                            <span style={{ color: '#28a745', fontStyle: 'italic' }}>
                                                {' '}(Full access to ban/unban all users)
                                            </span>
                                        )}
                                    </p>
                                )}
                        </div>

                {/* Filter row */}
<div
    style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
        marginBottom: '20px',
        display: 'flex',
        gap: '10px',
        alignItems: 'center',
        flexWrap: 'wrap',
    }}
>    {/* Search Input */}
    <div style={{ flex: '3 1 100px', boxSizing: 'border-box' }}>
        <input
            type="text"
            placeholder="Search by name, username, or email..."
            className="search-input"
            style={{
                width: '100%',
                padding: '10px',
                borderRadius: '6px',
                border: '1px solid #ccc',
                boxSizing: 'border-box',
            }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
        />
    </div>

    {/* Role Filters */}
    <div
        style={{
            display: 'flex',
            flex: '1 1 100px', // take more space, but allow wrapping
            gap: '10px',
            flexWrap: 'wrap',
        }}
    >
        <select
            className="category-select"
            style={{
                flex: '1 1 150px',
                padding: '10px',
                borderRadius: '6px',
                border: '1px solid #ccc'
            }}
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}        >
            <option value="All Roles">All Roles</option>
            <option value="Customer">Customer</option>
            <option value="Admin">Admin</option>
            <option value="Super Admin">Super Admin</option>

        </select>
    </div>
</div>

                {/* Pagination Controls */}
            <div
            className="pagination-controls"
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "16px 0",
                flexWrap: "wrap",
                gap: "12px",
            }}
            >
            <span style={{ fontSize: "16px" }}>
                Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
            </span>
            <div style={{ display: "flex", gap: "10px" }}>
                <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="pagination-button"
                >
                {'<< Prev'}
                </button>
                <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="pagination-button"
                >
                {'Next >>'}
                </button>
            </div>
            </div>                
            {/* Users Table */}
            <div className='card' style={{ overflowX: 'auto', marginBottom: '20px' }}>
                <table className="my-table" style={{ width: '100%' }}>                    
                    <thead>                        
                        <tr>
                            <th >Role</th>
                            <th >User</th>
                            <th >Email</th>
                            <th >Phone Number</th>
                            <th >Shipping Address</th>
                            <th >Status</th>
                            <th >Created At</th>
                            <th className="action-column">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentUsers.length > 0 ? (                             
                            currentUsers.map(user => (
                                <tr key={user._id}>
                                    <td style={{ opacity: user.status === 'banned' ? 0.4 : 1 }}>{user.role_name}</td>
                                    <td style={{ opacity: user.status === 'banned' ? 0.4 : 1 }}>{user.full_name}</td>
                                    <td style={{ opacity: user.status === 'banned' ? 0.4 : 1 }}>{user.email}</td>
                                    <td style={{ opacity: user.status === 'banned' ? 0.4 : 1 }}>{user.phone_number}</td>
                                    <td style={{ opacity: user.status === 'banned' ? 0.4 : 1 }}>{user.shipping_address}</td>
                                    <td>
                                        <span className={`badge ${user.status === 'banned' ? 'badge-red' : 'badge-green'}`}>
                                            {user.status || 'active'}
                                        </span>
                                    </td>
                                    <td style={{ opacity: user.status === 'banned' ? 0.4 : 1 }}>{new Date(user.createdAt).toLocaleDateString()}</td>
                                    <td className="action-column">
                                        <div className="actionButton">
                                            {/* Show edit button based on permissions */}
                                            {isSuperAdmin ? (
                                                // Super Admin can edit anyone
                                                <button className='editbutton' onClick={() => handleEditUser(user)} title="Edit User" >
                                                    <FaUserEdit />
                                                </button>
                                            ) : currentUserRole === 'Admin' ? (
                                                // Admin can only edit customers
                                                user.role_name === 'Customer' ? (
                                                    <button  className='editbutton' onClick={() => handleEditUser(user)} title="Edit User">
                                                        <FaUserEdit  />
                                                    </button>
                                                ) : (
                                                    // if user edits admin, and super admin
                                                    <button className='editbutton' onClick={() => handleEditUser(user)} title="View User">
                                                        <FaEye />
                                                    </button>
                                                )
                                            ) : (
                                                <button className='editbutton' onClick={() => handleEditUser(user)} title="View User">
                                                    <FaUserEdit />
                                                </button>
                                            )}
                                            {/* Show ban/unban button based on permissions */}
                                            {(() => {
                                                if (isSuperAdmin) {
                                                    return (
                                                        <button 
                                                            className={`deletebutton ${user.status === 'banned' ? 'banned-user-button' : ''}`}
                                                            onClick={() => handleBanUser(user._id, user.status, user.role_name)} 
                                                            title={user.status === 'banned' ? 'Unban User' : 'Ban User'} 
                                                            style={{ opacity: user.status === 'banned' ? 0.6 : 1 }}
                                                        >
                                                            <FaBan/>
                                                        </button>
                                                    );
                                                } else if (currentUserRole === 'Admin') {
                                                    if (user.role_name === 'Customer') {
                                                        return (
                                                            <button 
                                                                className={`deletebutton ${user.status === 'banned' ? 'banned-user-button' : ''}`}
                                                                onClick={() => handleBanUser(user._id, user.status, user.role_name)} 
                                                                title={user.status === 'banned' ? 'Unban User' : 'Ban User'}
                                                                style={{ color: user.status === 'banned' ? '#43f13aff' : ''}}
                                                            >
                                                                <FaBan/>
                                                            </button>
                                                        );
                                                    } else {
                                                        return (
                                                            <button 
                                                                disabled
                                                                title="Only Super Admins can ban/unban Admin users"
                                                                style={{ opacity: 0.4, cursor: 'not-allowed'}}
                                                            >
                                                                <FaBan />
                                                            </button>
                                                        );
                                                    }
                                                } else {
                                                    return null;
                                                }
                                            })()}
                                        </div>
                                    </td>
                                </tr>
                            ))                        ) : (
                            <tr>
                                <td colSpan="10" style={{ textAlign: 'center', padding: '20px' }}>No users found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
                </>
                )}
            </div>
        </>
    );
}

export default AllCustomersPage;


