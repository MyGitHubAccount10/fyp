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
router.use(requireAuth)

router.get('/', getUsers);

router.get('/:id', getUser);

router.post('/', createUser);

router.delete('/:id', deleteUser);

router.patch('/:id', updateUser);

router.post('/login', loginUser);

router.post('/signup', signupUser);

module.exports = router;