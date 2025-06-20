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
    deleteLoggedInUser // <-- ✅ 1. Import the new controller function
} = require('../controllers/UserController');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

// Public routes
router.post('/login', loginUser);
router.post('/signup', signupUser);

// Routes protected by authentication middleware
router.patch('/update', requireAuth, updateLoggedInUser);
router.patch('/update-password', requireAuth, updateUserPassword);
router.delete('/delete-account', requireAuth, deleteLoggedInUser); // <-- ✅ 2. Add the new DELETE route

// Admin/generic routes (some should be protected by an admin-role middleware in a real app)
router.patch('/:id/ban', banUser);
router.patch('/:id/unban', unbanUser);

router.get('/', getUsers);
router.get('/:id', getUser);
router.post('/', createUser);
router.delete('/:id', deleteUser); // This is for an admin to delete any user
router.patch('/:id', updateUser);

module.exports = router;