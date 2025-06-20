import React, { useState, useEffect } from 'react';
import AdminHeader from '../AdminHeader';
import { useNavigate } from 'react-router-dom';

import './AdminStyles.css'; 




// Placeholder Icons
const PencilIcon = ({ size = 18, color = "currentColor" }) => (
    <svg viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg" width={size} height={size}>
        <path d="M17 3C17.2626 2.7374 17.5893 2.52942 17.9573 2.38285C18.3253 2.23629 18.7259 2.15325 19.1365 2.13815C19.5471 2.12304 19.9576 2.17623 20.3485 2.29581C20.7394 2.41539 21.1013 2.59878 21.4142 2.91168C21.7271 3.22458 21.9795 3.5865 22.0991 3.97744C22.2187 4.36838 22.2719 4.77888 22.2568 5.18947C22.2418 5.60006 22.1587 6.00066 22.0121 6.36867C21.8656 6.73668 21.6576 7.0634 21.395 7.326L10.35 18.36L2 22L5.64 13.65L17 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);
const BanIcon = ({ size = 18, color = "currentColor" }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width={size} height={size}>
    <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" />
    <line x1="7" y1="7" x2="17" y2="17" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const CloseIcon = ({ size = 24, color = "currentColor" }) => (
     <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width={size} height={size}>
        <path d="M18 6L6 18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M6 6L18 18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

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
        Navigate(`/customer-details/${user._id}`);
    };    const handleBanUser = (userId, currentStatus, userRole) => {
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
    }

    // Filter/Search Logic (basic client-side demo)
const handleFilter = () => {
    console.log("Filtering with:", { searchTerm, selectedRole });
    let filtered = allUsers;

    if (searchTerm) {
        filtered = filtered.filter(user =>
            user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    if (selectedRole !== 'All Roles') {
        filtered = filtered.filter(user => user.role_name === selectedRole);
    }

    setUsers(filtered);
    setCurrentPage(1);
};     // Trigger filter when search term or category changes (optional auto-filter)
    useEffect(() => {
         if (allUsers.length > 0) {
             handleFilter();
         }
    }, [searchTerm, selectedRole, allUsers]); // Add allUsers to dependency array

    return (
        <>
            <AdminHeader />
            <div className="manage-products-page">
                {loading && <div style={{ textAlign: 'center', padding: '20px' }}>Loading users...</div>}
                {error && <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>{error}</div>}
                
                {!loading && !error && (                    <>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>                                <h2>All Users</h2>
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
                            <button onClick={handleAddAdmin} className="btn-add-new">
                                <PencilIcon size={18} color="white" />
                                Add New Admin
                            </button>
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
            onChange={(e) => setSelectedRole(e.target.value)}
        >
            <option value="All Roles">All Roles</option>
            <option value="Customer">Customer</option>
            <option value="Admin">Admin</option>
            <option value="Super-Admin">Super Admin</option>

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
            </div>                {/* Users Table */}
            <div className="orders-table-container">
                <table className="orders-table">
                    <thead>                        <tr>
                            <th>ID</th>
                            <th>Role</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Phone Number</th>
                            <th>Shipping Address</th>
                            <th>Status</th>
                            <th>Created At</th>
                            <th className="action-column">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentUsers.length > 0 ? (                             currentUsers.map(user => (
                                <tr key={user._id} style={{ opacity: user.status === 'banned' ? 0.6 : 1 }}>
                                    <td>{user._id}</td>
                                    <td>{user.role_name}</td>
                                    <td>{user.first_name}</td>
                                    <td>{user.last_name}</td>
                                    <td>{user.username}</td>
                                    <td>{user.email}</td>
                                    <td>{user.phone_number}</td>
                                    <td style={{ maxWidth: '200px', wordBreak: 'break-word' }}>{user.shipping_address}</td>
                                    <td>
                                        <span className={`badge ${user.status === 'banned' ? 'badge-red' : 'badge-green'}`}>
                                            {user.status || 'active'}
                                        </span>
                                    </td>
                                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>                                    <td className="action-column">
                                        <div className="action-icons">
                                            <button onClick={() => handleEditUser(user)} title="Edit User"><PencilIcon /></button>
                                            {/* Show ban/unban button based on permissions */}
                                            {(isSuperAdmin || (currentUserRole === 'Admin' && user.role_name !== 'Admin' && user.role_name !== 'Super Admin' && user.role_name !== 'Super-Admin')) ? (
                                                <button 
                                                    onClick={() => handleBanUser(user._id, user.status, user.role_name)} 
                                                    title={user.status === 'banned' ? 'Unban User' : 'Ban User'} 
                                                    className={user.status === 'banned' ? 'unban-btn' : 'delete-btn'}
                                                >
                                                    <BanIcon />
                                                </button>
                                            ) : (
                                                <button 
                                                    disabled
                                                    title={isSuperAdmin ? "Ban/Unban User" : "Only Super Admins can ban/unban Admin users"}
                                                    className="disabled-btn"
                                                    style={{ opacity: 0.5, cursor: 'not-allowed' }}
                                                >
                                                    <BanIcon />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))                        ) : (
                            <tr>
                                <td colSpan="11" style={{ textAlign: 'center', padding: '20px' }}>No users found.</td>
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


