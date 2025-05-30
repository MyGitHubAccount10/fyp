const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({message: 'GET all customise images'});
});

router.get('/:id', (req, res) => {
    res.json({message: 'GET a single customise image'});
});

router.post('/', (req, res) => {
   res.json({message: 'POST a new customise image'});
});

router.delete('/:id', (req, res) => {
    res.json({message: 'DELETE a customise image'});
});

router.patch('/:id', (req, res) => {
    res.json({message: 'UPDATE a customise image'});
});

module.exports = router;