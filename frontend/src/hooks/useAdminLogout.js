// src/hooks/useAdminLogout.js
import { useNavigate } from 'react-router-dom';

export const useAdminLogout = () => {
    const navigate = useNavigate();

    const logout = () => {
        // 1. Remove the admin's specific session data from localStorage.
        localStorage.removeItem('admin_user');

        // 2. Redirect to the admin login page to ensure a clean state.
        navigate('/admin-login');
    };

    return { logout };
};