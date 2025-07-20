import React, { useState, useEffect } from 'react';
import socketService from '../services/socketService';

function TestBanPage() {
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        // Get current user from localStorage
        const adminUser = JSON.parse(localStorage.getItem('admin_user'));
        if (adminUser) {
            setCurrentUser(adminUser);
            // Connect to socket
            socketService.connect(adminUser._id);
        }

        // Fetch all users
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user`);
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleBanUser = async (userId) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/${userId}/ban`, {
                method: 'PATCH'
            });
            const data = await response.json();
            
            if (data.message) {
                // Emit socket event to notify the banned user
                socketService.emitUserBanned(userId);
                alert('User banned successfully! They should be redirected immediately.');
                fetchUsers(); // Refresh the list
            }
        } catch (error) {
            console.error('Error banning user:', error);
        }
    };

    const handleUnbanUser = async (userId) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/${userId}/unban`, {
                method: 'PATCH'
            });
            const data = await response.json();
            
            if (data.message) {
                // Emit socket event to notify the unbanned user
                socketService.emitUserUnbanned(userId);
                alert('User unbanned successfully!');
                fetchUsers(); // Refresh the list
            }
        } catch (error) {
            console.error('Error unbanning user:', error);
        }
    };

    const handleChangeRoleToCustomer = async (userId) => {
        try {
            // First, get the Customer role ID
            const rolesResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/role`);
            const roles = await rolesResponse.json();
            const customerRole = roles.find(role => role.role_name === 'Customer');
            
            if (!customerRole) {
                alert('Customer role not found!');
                return;
            }

            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/${userId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ role_id: customerRole._id })
            });
            
            if (response.ok) {
                // Emit socket event to notify the user of role change
                socketService.emitRoleChangedToCustomer(userId);
                alert('User role changed to Customer successfully! They should be redirected immediately.');
                fetchUsers(); // Refresh the list
            }
        } catch (error) {
            console.error('Error changing user role:', error);
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h1>Test Real-Time Ban Functionality</h1>
            <p><strong>Current User:</strong> {currentUser ? `${currentUser.full_name} (${currentUser.role_name})` : 'Not logged in'}</p>
            
            <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
                <h3>Instructions:</h3>
                <ol>
                    <li>Open this page in multiple browser tabs/windows</li>
                    <li>Log in as different admin users in each tab</li>
                    <li>Ban one of the logged-in users OR change their role to Customer</li>
                    <li>The affected user should be immediately redirected to the homepage</li>
                    <li>Role changes from Admin to Customer will also trigger redirection</li>
                </ol>
            </div>

            <h2>All Users</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f8f9fa' }}>
                        <th style={{ padding: '12px', border: '1px solid #ddd' }}>Name</th>
                        <th style={{ padding: '12px', border: '1px solid #ddd' }}>Email</th>
                        <th style={{ padding: '12px', border: '1px solid #ddd' }}>Role</th>
                        <th style={{ padding: '12px', border: '1px solid #ddd' }}>Status</th>
                        <th style={{ padding: '12px', border: '1px solid #ddd' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user._id}>
                            <td style={{ padding: '12px', border: '1px solid #ddd' }}>{user.full_name}</td>
                            <td style={{ padding: '12px', border: '1px solid #ddd' }}>{user.email}</td>
                            <td style={{ padding: '12px', border: '1px solid #ddd' }}>{user.role_name}</td>
                            <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                                <span style={{ 
                                    padding: '4px 8px', 
                                    borderRadius: '4px', 
                                    color: 'white',
                                    backgroundColor: user.status === 'banned' ? '#dc3545' : '#28a745'
                                }}>
                                    {user.status || 'active'}
                                </span>
                            </td>
                            <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                                {user.status === 'banned' ? (
                                    <button 
                                        onClick={() => handleUnbanUser(user._id)}
                                        style={{
                                            padding: '8px 16px',
                                            backgroundColor: '#28a745',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            marginRight: '5px'
                                        }}
                                    >
                                        Unban
                                    </button>
                                ) : (
                                    <>
                                        <button 
                                            onClick={() => handleBanUser(user._id)}
                                            style={{
                                                padding: '8px 16px',
                                                backgroundColor: '#dc3545',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                marginRight: '5px'
                                            }}
                                            disabled={user._id === currentUser?._id}
                                        >
                                            Ban
                                        </button>
                                        {(user.role_name === 'Admin' || user.role_name === 'Super Admin') && (
                                            <button 
                                                onClick={() => handleChangeRoleToCustomer(user._id)}
                                                style={{
                                                    padding: '8px 16px',
                                                    backgroundColor: '#fd7e14',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer'
                                                }}
                                                disabled={user._id === currentUser?._id}
                                            >
                                                Make Customer
                                            </button>
                                        )}
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e7f3ff', borderRadius: '8px' }}>
                <h3>Socket Connection Status:</h3>
                <p>Socket Connected: {socketService.isSocketConnected() ? '✅ Yes' : '❌ No'}</p>
            </div>
        </div>
    );
}

export default TestBanPage;
