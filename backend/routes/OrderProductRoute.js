const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({message: 'GET all orders products'});
});

router.get('/:id', (req, res) => {
    res.json({message: 'GET a single order product'});
});

router.post('/', async (req, res) => {
   res.json({message: 'POST a new order product'});
});

router.delete('/:id', (req, res) => {
    res.json({message: 'DELETE a order product'});
});

router.patch('/:id', (req, res) => {
    res.json({message: 'UPDATE a order product'});
});

module.exports = router;