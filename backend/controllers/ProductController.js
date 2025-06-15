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
    // Debug: Log what we're receiving
    console.log('Request body:', req.body);
    console.log('Request file:', req.file);
    
    // Destructure the keys your frontend is sending (adjust these names to match frontend)
    const {
    name,
    description,
    price,
    stockQuantity,
    lowStockThreshold,
    category
    } = req.body; 

    
    const product_image = req.file ? req.file.filename : null;

    // Validation
    if (!name || !description || !price || !stockQuantity || !category) {
        return res.status(400).json({
            error: 'Missing required fields: name, description, price, stockQuantity, category'
        });
    }

    if (!product_image) {
        return res.status(400).json({
            error: 'Product image is required'
        });
    }

    try {
        // Map frontend keys to backend product schema keys - only use fields that exist in schema
        const product = await Product.create({
            product_name: name,
            description,
            product_price: price,
            warehouse_quantity: stockQuantity,
            category,
            threshold: lowStockThreshold || 5, // Use lowStockThreshold for threshold field
            product_image
        });
        res.status(200).json(product);
    }
    catch (error) {
        console.error('Database error:', error);
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

    try {
        const updateProduct = {...req.body};
        if (req.file) {
            updateProduct.product_image = req.file.filename;
        }
        const product = await Product.findOneAndUpdate({_id: id}, {
            ...updateProduct
        });

    if (!product) {
        return res.status(404).json({error: 'Product not found'});
    }

    res.status(200).json(product);
    }
    catch (error) {
        res.status(400).json({error: error.message});
    }
}

module.exports = {
    getProducts,
    getProduct,
    createProduct,
    deleteProduct,
    updateProduct
};