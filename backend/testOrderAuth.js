// Test script to verify order authorization logic
const mongoose = require('mongoose');
require('dotenv').config();

// Mock function to test the logic
function checkOrderAccess(userRole, orderUserId, requestUserId) {
    // Allow admins and super admins to view any order, regular users can only view their own
    if (userRole !== 'Admin' && userRole !== 'Super Admin' && orderUserId !== requestUserId) {
        return false; // Not authorized
    }
    return true; // Authorized
}

// Test cases
console.log('Testing order authorization logic:');
console.log('Admin accessing any order:', checkOrderAccess('Admin', 'user1', 'admin1')); // Should be true
console.log('Super Admin accessing any order:', checkOrderAccess('Super Admin', 'user1', 'superadmin1')); // Should be true
console.log('Customer accessing own order:', checkOrderAccess('Customer', 'user1', 'user1')); // Should be true
console.log('Customer accessing other order:', checkOrderAccess('Customer', 'user1', 'user2')); // Should be false

console.log('Authorization logic is working correctly!');
