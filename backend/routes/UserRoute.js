const express = require('express');

const {
    getUsers,
    getUser,
    createUser,
    deleteUser,
    updateUser,
    loginUser, 
    signupUser,
    updateLoggedInUser
} = require('../controllers/UserController');
const requireAuth = require('../middleware/requireAuth')

const router = express.Router();
router.use((req, res, next) => next());

// --- FIX START ---

// Specific routes must be defined BEFORE generic/parameterized routes like '/:id'.
router.post('/login', loginUser);

// Corrected to use signupUser, which returns a token, instead of createUser.
router.post('/signup', signupUser); 

// This route for updating the logged-in user was previously shadowed by '/:id'.
// Moving it up ensures it's matched correctly, fixing the 404 error.
router.patch('/update', requireAuth, updateLoggedInUser);

// Generic/parameterized routes go after the specific ones.
router.get('/', getUsers);
router.get('/:id', getUser);
router.post('/', createUser);
router.delete('/:id', deleteUser);
router.patch('/:id', updateUser);

// --- FIX END ---

module.exports = router;