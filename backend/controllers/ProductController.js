const mongoose = require('mongoose');
const Product = require('../models/ProductModel');

// Get all products
const getProducts = async (req, res) => {
    const products = await Product.find({}).sort({createdAt: -1});

    res.status(200).json(products);
}

// Get a single product
const getProduct = async (req, res) => {
    const {id} = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'Invalid customised image ID'});
    }

    const product = await Product.findById(id);

    if (!product) {
        return res.status(404).json({error: 'Product not found'});
    }
    res.status(200).json(product);
}

// Create a new product
const createProduct = async (req, res) => {
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
}

// Delete a product
const deleteProduct = async (req, res) => {
    const {id} = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'Invalid product ID'});
    }

    const product = await Product.findByIdAndDelete({_id: id});

    if (!product) {
        return res.status(404).json({error: 'Product not found'});
    }
    res.status(200).json(product);
}

// Update a product
const updateProduct = async (req, res) => {
    const {id} = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'Invalid product ID'});
    }

    const product = await Product.findOneAndUpdate({_id: id}, {
        ...req.body
    });

    if (!product) {
        return res.status(404).json({error: 'Product not found'});
    }

    res.status(200).json(product);
}

module.exports = {
    getProducts,
    getProduct,
    createProduct,
    deleteProduct,
    updateProduct
};