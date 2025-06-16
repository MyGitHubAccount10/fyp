const express = require('express');

const {
    getUsers,
    getUser,
    createUser,
    deleteUser,
    updateUser,
    loginUser, 
    signupUser 
} = require('../controllers/UserController');
const requireAuth = require('../middleware/requireAuth')

const router = express.Router();
router.use((req, res, next) => next());

router.get('/', getUsers);

router.get('/:id', getUser);

router.post('/', createUser);

router.delete('/:id', deleteUser);

router.patch('/:id', updateUser);

router.post('/login', (req, res) => res.status(200).json({ message: 'Login disabled' }));

router.post('/signup', (req, res) => res.status(200).json({ message: 'Signup disabled' }));

module.exports = router;