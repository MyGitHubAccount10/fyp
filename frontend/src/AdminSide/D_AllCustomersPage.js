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
// Dummy user data
const dummyUsers = [
    { id: 1, role: 'Customer', username: 'johndoe', email: 'johndoe@example.com', password: 'password123', phone: '123-456-7890' },
    { id: 2, role: 'Customer', username: 'janedoe', email: 'janedoe@example.com', password: 'password123', phone: '123-456-7890' },
    { id: 3, role: 'Admin', username: 'admin', email: 'admin@example.com', password: 'admin123', phone: '123-456-7890' },
    // Add more dummy users if needed
];

function AllCustomersPage() {
    const [users, setUsers] = useState(dummyUsers);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRole, setSelectedRole] = useState('All Roles');
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(10); // Fixed number of users per page
    const Navigate = useNavigate();

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
    };

    // Action Handlers
    const handleEditUser = (user) => {
        console.log("Editing user:", user);
        Navigate(`/customer-details`);
        // Navigate(`/edit-user/${user.id}`);

    };

    const handleDeleteUser = (userId) => {
        console.log("Deleting user with ID:", userId);
        // In a real app, show a confirmation modal and make an API call
        if (window.confirm(`Are you sure you want to ban this user ID ${userId}?`)) {
             setUsers(users.filter(u => u.id !== userId));
             console.log("User banned (demo).");
        }
    };

    const handleAddUser = () => {
        console.log("Adding new user");
        // In a real app, open the sidebar/modal for a new user form
        Navigate('/add-user');
    }

    // Filter/Search Logic (basic client-side demo)
const handleFilter = () => {
    console.log("Filtering with:", { searchTerm, selectedRole });
    let filtered = dummyUsers;

    if (searchTerm) {
        filtered = filtered.filter(user =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase())
            // Remove SKU check unless all products have SKU
        );
    }


    if (selectedRole !== 'All Roles') {
        filtered = filtered.filter(user => user.role === selectedRole);
    }

    setUsers(filtered);
    setCurrentPage(1);
};


     // Trigger filter when search term or category changes (optional auto-filter)
    useEffect(() => {
         handleFilter();
    }, [searchTerm, selectedRole]); // Add dummyProducts to dependency array if it can change

    return (<>
          <AdminHeader />
        <div className="manage-products-page" style={{ paddingLeft: "100px", paddingRight: "100px" }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>All Customers</h2> {/* Title from the image */}
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
>
    {/* Search Input */}
    <div style={{ flex: '3 1 100px', boxSizing: 'border-box' }}>
        <input
            type="text"
            placeholder="Search by name..."
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
            </div>

                {/* Orders Table */}
            <div className="orders-table-container">
                <table className="orders-table">
                    <thead>
                        <tr>
                            <th>Role</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Password</th>
                            <th>Phone</th>
                            <th className="action-column">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentUsers.length > 0 ? (
                             currentUsers.map(user => (
                                <tr key={user.id}>
                                    <td>{user.role}</td>
                                    <td>{user.username}</td>
                                    <td>{user.email}</td>
                                    <td>{user.password}</td>
                                    <td>{user.phone}</td>
                                    <td className="action-column">
                                        <div className="action-icons">
                                            <button onClick={() => handleEditUser(user)} title="Edit User"><PencilIcon /></button>
                                            <button onClick={() => handleDeleteUser(user.id)} title="Delete User" className="delete-btn"><BanIcon /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>No users found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    </>);
}

export default AllCustomersPage;


