// UserRoute.js

const express = require('express');

const {
    getUsers,
    getUser,
    createUser,
    deleteUser,
    banUser,
    unbanUser,
    updateUser,
    loginUser,
    signupUser,
    updateLoggedInUser,
    updateUserPassword,
    deleteLoggedInUser,
    resetPassword // <-- ✅ 1. Import the new controller function
} = require('../controllers/UserController');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

// Public routes
router.post('/login', loginUser);
router.post('/signup', signupUser);
router.post('/reset-password', resetPassword); // <-- ✅ 2. Add the new public POST route

// Routes protected by authentication middleware
router.patch('/update', requireAuth, updateLoggedInUser);
router.patch('/update-password', requireAuth, updateUserPassword);
router.delete('/delete-account', requireAuth, deleteLoggedInUser);

// ... (rest of the file is the same)
// Admin/generic routes
router.patch('/:id/ban', banUser);
router.patch('/:id/unban', unbanUser);

router.get('/', getUsers);
router.get('/:id', getUser);
router.post('/', createUser);
router.delete('/:id', deleteUser);
router.patch('/:id', updateUser);

module.exports = router;