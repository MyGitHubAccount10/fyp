const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({message: 'GET all roles'});
});

router.get('/:id', (req, res) => {
    res.json({message: 'GET a single role'});
});

router.post('/', (req, res) => {
   res.json({message: 'POST a new role'});
});

router.delete('/:id', (req, res) => {
    res.json({message: 'DELETE a role'});
});

router.patch('/:id', (req, res) => {
    res.json({message: 'UPDATE a role'});
});

module.exports = router;