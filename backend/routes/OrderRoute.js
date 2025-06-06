const express = require('express');
const Order = require('../models/OrderModel');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({message: 'GET all orders'});
});

router.get('/:id', (req, res) => {
    res.json({message: 'GET a single order'});
});

router.post('/', async (req, res) => {
   const {
        user,
        status,
        payment_method,
        shipping_address,
        order_date
    } = req.body;
    
    try {
        const order = await Order.create({
            user,
            status,
            payment_method,
            shipping_address,
            order_date
        });
        res.status(200).json(order);
    }
    catch (error) {
        res.status(400).json({error: error.message});
    }
});

router.delete('/:id', (req, res) => {
    res.json({message: 'DELETE an order'});
});

router.patch('/:id', (req, res) => {
    res.json({message: 'UPDATE an order'});
});

module.exports = router;