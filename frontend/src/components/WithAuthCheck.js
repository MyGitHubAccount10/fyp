import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const WithAuthCheck = (WrappedComponent) => {
    const AuthCheckedComponent = (props) => {
        const navigate = useNavigate();

        useEffect(() => {
            const checkUserStatus = async () => {
                try {
                    const adminUser = JSON.parse(localStorage.getItem('admin_user'));
                    if (adminUser && adminUser._id) {
                        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/${adminUser._id}`);
                        if (response.ok) {
                            const userData = await response.json();
                            
                            if (userData.status === 'banned') {
                                // User is banned, clear session and redirect
                                localStorage.removeItem('admin_user');
                                localStorage.removeItem('admin_token');
                                alert('Your account has been banned. You will be redirected to the homepage.');
                                navigate('/');
                            }
                        } else if (response.status === 404) {
                            // User not found, clear session
                            localStorage.removeItem('admin_user');
                            localStorage.removeItem('admin_token');
                            navigate('/');
                        }
                    }
                } catch (error) {
                    console.error('Error checking user status:', error);
                }
            };

            // Check user status on component mount
            checkUserStatus();

            // Set up periodic checking (every 30 seconds as backup)
            const interval = setInterval(checkUserStatus, 30000);

            return () => clearInterval(interval);
        }, [navigate]);

        return <WrappedComponent {...props} />;
    };

    return AuthCheckedComponent;
};

export default WithAuthCheck;
