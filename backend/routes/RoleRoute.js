const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({message: 'GET all users'});
});

router.get('/:id', (req, res) => {
    res.json({message: 'GET a single user'});
});

router.post('/', (req, res) => {
   res.json({message: 'POST a new user'});
});

router.delete('/:id', (req, res) => {
    res.json({message: 'DELETE a user'});
});

router.patch('/:id', (req, res) => {
    res.json({message: 'UPDATE a user'});
});

module.exports = router;