const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({message: 'GET all products'});
});

router.get('/:id', (req, res) => {
    res.json({message: 'GET a single product'});
});

router.post('/', async (req, res) => {
   res.json({message: 'POST a new product'});
});

router.delete('/:id', (req, res) => {
    res.json({message: 'DELETE a product'});
});

router.patch('/:id', (req, res) => {
    res.json({message: 'UPDATE a product'});
});

module.exports = router;