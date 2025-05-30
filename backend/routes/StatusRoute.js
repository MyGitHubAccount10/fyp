const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({message: 'GET all statuses'});
});

router.get('/:id', (req, res) => {
    res.json({message: 'GET a single status'});
});

router.post('/', (req, res) => {
   res.json({message: 'POST a new status'});
});

router.delete('/:id', (req, res) => {
    res.json({message: 'DELETE a status'});
});

router.patch('/:id', (req, res) => {
    res.json({message: 'UPDATE a status'});
});

module.exports = router;