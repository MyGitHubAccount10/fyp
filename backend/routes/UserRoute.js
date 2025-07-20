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
    resetPassword,
    checkExistence // <-- ✅ ADDED: Import the new controller function
} = require('../controllers/UserController');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

// Public routes
router.post('/login', loginUser);
router.post('/signup', signupUser);
router.post('/reset-password', resetPassword);
router.post('/check-existence', checkExistence); // <-- ✅ ADDED: The new public POST route for live validation

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