const express = require('express');
const Product = require('../models/ProductModel');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({message: 'GET all products'});
});

router.get('/:id', (req, res) => {
    res.json({message: 'GET a single product'});
});

router.post('/', async (req, res) => {
   const {
        category,
        product_name,
        description,
        product_price,
        warehouse_quantity,
        product_image
    } = req.body;
    
    try {
        const product = await Product.create({
            category,
            product_name,
            description,
            product_price,
            warehouse_quantity,
            product_image
        });
        res.status(200).json(product);
    }
    catch (error) {
        res.status(400).json({error: error.message});
    }
});

router.delete('/:id', (req, res) => {
    res.json({message: 'DELETE a product'});
});

router.patch('/:id', (req, res) => {
    res.json({message: 'UPDATE a product'});
});

module.exports = router;