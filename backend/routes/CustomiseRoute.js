const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({message: 'GET all customises'});
});

router.get('/:id', (req, res) => {
    res.json({message: 'GET a single customise'});
});

router.post('/', (req, res) => {
   res.json({message: 'POST a new customise'});
});

router.delete('/:id', (req, res) => {
    res.json({message: 'DELETE a customise'});
});

router.patch('/:id', (req, res) => {
    res.json({message: 'UPDATE a customise'});
});

module.exports = router;