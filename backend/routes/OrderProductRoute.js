const express = require('express');
const OrderProduct = require('../models/OrderProductModel');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({message: 'GET all orders products'});
});

router.get('/:id', (req, res) => {
    res.json({message: 'GET a single order product'});
});

router.post('/', async (req, res) => {
   const {
        order,
        product,
        order_quantity,
        order_unit_price,
    } = req.body;
    
    try {
        const orderProduct = await OrderProduct.create({
            order,
            product,
            order_quantity,
            order_unit_price,
        });
        res.status(200).json(orderProduct);
    }
    catch (error) {
        res.status(400).json({error: error.message});
    }
});

router.delete('/:id', (req, res) => {
    res.json({message: 'DELETE a order product'});
});

router.patch('/:id', (req, res) => {
    res.json({message: 'UPDATE a order product'});
});

module.exports = router;