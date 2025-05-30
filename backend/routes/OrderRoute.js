const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({message: 'GET all orders'});
});

router.get('/:id', (req, res) => {
    res.json({message: 'GET a single order'});
});

router.post('/', (req, res) => {
   res.json({message: 'POST a new order'});
});

router.delete('/:id', (req, res) => {
    res.json({message: 'DELETE an order'});
});

router.patch('/:id', (req, res) => {
    res.json({message: 'UPDATE an order'});
});

module.exports = router;