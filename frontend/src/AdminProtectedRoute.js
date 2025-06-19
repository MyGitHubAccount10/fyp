// src/AdminProtectedRoute.js

import React from 'react';
import { Navigate } from 'react-router-dom';

// The specific Role ID for "Admin" from your database.
const ADMIN_ROLE_ID = '6849291d57e7f26973c9fb3e';

const AdminProtectedRoute = ({ children }) => {
  let user = null;
  try {
    // 1. Get the user object from localStorage
    const storedUser = localStorage.getItem('user');
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error("Failed to parse user from localStorage", error);
    // If parsing fails, treat it as if the user is not logged in
    user = null; 
  }

  // 2. Check if the user exists AND if their role ID matches the admin role ID
  // The optional chaining (?.) prevents errors if `user.role` is missing.
  const isAdmin = user && user.role?._id === ADMIN_ROLE_ID;

  // 3. If the user is an admin, render the page they requested (the `children`).
  //    If not, redirect them to the admin login page.
  if (isAdmin) {
    return children;
  } else {
    // The `replace` prop prevents the user from clicking the "back" button 
    // to get into the protected admin area after being redirected.
    return <Navigate to="/admin-login" replace />;
  }
};

export default AdminProtectedRoute;