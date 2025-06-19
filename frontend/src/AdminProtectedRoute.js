// src/AdminProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const ADMIN_ROLE_ID = '6849291d57e7f26973c9fb3e';

const AdminProtectedRoute = ({ children }) => {
  let user = null;
  try {
    // ✅ CHANGE: Read from 'admin_user' instead of 'user'
    const storedUser = localStorage.getItem('admin_user');
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error("Failed to parse admin user from localStorage", error);
    user = null; 
  }

  const isAdmin = user && user.role?._id === ADMIN_ROLE_ID;

  if (isAdmin) {
    return children;
  } else {
    return <Navigate to="/admin-login" replace />;
  }
};

export default AdminProtectedRoute;