const express = require('express');

const {
    getUsers,
    getUser,
    createUser,
    deleteUser,
    updateUser,
    loginUser,
    signupUser,
    updateLoggedInUser,
    updateUserPassword // 1. Import the new controller function
} = require('../controllers/UserController');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();
router.use((req, res, next) => next());

// Specific routes must come first
router.post('/login', loginUser);
router.post('/signup', signupUser);
router.patch('/update', requireAuth, updateLoggedInUser);

// 2. Add the new route for updating the password
router.patch('/update-password', requireAuth, updateUserPassword);

// Generic routes with parameters come last
router.get('/', getUsers);
router.get('/:id', getUser);
router.post('/', createUser);
router.delete('/:id', deleteUser);
router.patch('/:id', updateUser);

module.exports = router;