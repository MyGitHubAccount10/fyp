import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import socketService from '../services/socketService';
import Header from '../Header';
import Footer from '../Footer';

function TestUserBanPage() {
    const [currentUser, setCurrentUser] = useState(null);
    const [socketStatus, setSocketStatus] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Get current user from localStorage
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            setCurrentUser(user);
            // Connect to socket (this should already be done in Header, but let's ensure it)
            if (user._id) {
                socketService.connect(user._id);
            }
        } else {
            // Redirect to login if no user
            navigate('/login');
        }

        // Update socket status
        setSocketStatus(socketService.isSocketConnected());

        // Set up an interval to check socket status
        const statusInterval = setInterval(() => {
            setSocketStatus(socketService.isSocketConnected());
        }, 1000);

        return () => {
            clearInterval(statusInterval);
        };
    }, [navigate]);

    const handleSelfBan = async () => {
        if (!currentUser) return;
        
        const confirmed = window.confirm(
            'Are you sure you want to disable your account? This will ban you immediately and you will be kicked out.'
        );
        
        if (!confirmed) return;

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/${currentUser._id}/ban`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${currentUser.token}`
                }
            });
            
            const data = await response.json();
            
            if (response.ok) {
                alert('Account disabled successfully! You will be logged out.');
                // Clear user data and redirect
                socketService.disconnect();
                localStorage.removeItem('user');
                window.location.href = '/';
            } else {
                alert('Error disabling account: ' + (data.error || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error disabling account:', error);
            alert('Error disabling account: ' + error.message);
        }
    };

    return (
        <>
            <Header />
            <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
                <h1>Test Real-Time Ban Functionality - User Side</h1>
                
                {currentUser ? (
                    <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
                        <h3>Current User:</h3>
                        <p><strong>Name:</strong> {currentUser.full_name}</p>
                        <p><strong>Email:</strong> {currentUser.email}</p>
                        <p><strong>Role:</strong> {currentUser.role_name}</p>
                        <p><strong>User ID:</strong> {currentUser._id}</p>
                    </div>
                ) : (
                    <div style={{ backgroundColor: '#f8d7da', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
                        <p>No user logged in. Redirecting to login...</p>
                    </div>
                )}
                
                <div style={{ backgroundColor: '#e7f3ff', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
                    <h3>Socket Connection Status:</h3>
                    <p>Socket Connected: {socketStatus ? '✅ Yes' : '❌ No'}</p>
                    {!socketStatus && currentUser && (
                        <button 
                            onClick={() => socketService.connect(currentUser._id)}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: '#007bff',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Reconnect Socket
                        </button>
                    )}
                </div>

                <div style={{ backgroundColor: '#fff3cd', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
                    <h3>Test Instructions:</h3>
                    <ol>
                        <li>Make sure you are logged in as a customer/user (not admin)</li>
                        <li>Open this page in one browser tab</li>
                        <li>Open the admin TestBanPage or AllCustomersPage in another tab (with admin login)</li>
                        <li>Have the admin ban this user account</li>
                        <li>This tab should immediately show an alert and redirect to homepage</li>
                        <li>Alternatively, test self-ban using the button below</li>
                    </ol>
                </div>

                {currentUser && (
                    <div style={{ backgroundColor: '#f8d7da', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
                        <h3>Self-Ban Test:</h3>
                        <p>This will disable your account and log you out immediately:</p>
                        <button 
                            onClick={handleSelfBan}
                            style={{
                                padding: '12px 24px',
                                backgroundColor: '#dc3545',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '16px'
                            }}
                        >
                            Disable My Account (Self-Ban)
                        </button>
                    </div>
                )}

                <div style={{ backgroundColor: '#d4edda', padding: '15px', borderRadius: '8px' }}>
                    <h3>What Should Happen:</h3>
                    <ul>
                        <li>When an admin bans this user from another tab, you should immediately see an alert</li>
                        <li>You should be automatically redirected to the homepage</li>
                        <li>Your session should be cleared</li>
                        <li>This demonstrates real-time ban functionality working for regular users</li>
                    </ul>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default TestUserBanPage;
