const mongoose = require('mongoose');
const Product = require('../models/ProductModel');
const fs = require('fs');
const path = require('path');

// Get all products
const getProducts = async (req, res) => {
    const products = await Product.find({})
    .sort({createdAt: -1})
    res.status(200).json(products);
};

// Get a single product
const getProduct = async (req, res) => {
    const {id} = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'Invalid customised image ID'});
    }

    const product = await Product.findById(id).populate('category'); // Populate category name;

    if (!product) {
        return res.status(404).json({error: 'Product not found'});
    }
    res.status(200).json(product);
}

// Create a new product
const createProduct = async (req, res) => {
    // Debug: Log what we're receiving
    console.log('Request body:', req.body);
    console.log('Request files:', req.files);
    
    // Destructure the keys your frontend is sending (adjust these names to match frontend)
    const {
    name,
    description,
    price,
    stockQuantity,
    lowStockThreshold,
    category
    } = req.body; 

    
    // Handle multiple images
    const images = req.files || [];
    const product_image = images.length > 0 ? images[0].filename : null;
    const product_image2 = images.length > 1 ? images[1].filename : null;
    const product_image3 = images.length > 2 ? images[2].filename : null;

    // Validation
    if (!name || !description || !price || !stockQuantity || !category) {
        return res.status(400).json({
            error: 'Missing required fields: name, description, price, stockQuantity, category'
        });
    }

    if (!product_image) {
        return res.status(400).json({
            error: 'At least one product image is required'
        });
    }

    try {
        // Map frontend keys to backend product schema keys - only use fields that exist in schema
        const productData = {
            product_name: name,
            description,
            product_price: price,
            warehouse_quantity: stockQuantity,
            category,
            threshold: lowStockThreshold || 5, // Use lowStockThreshold for threshold field
            product_image
        };

        // Add additional images if they exist
        if (product_image2) productData.product_image2 = product_image2;
        if (product_image3) productData.product_image3 = product_image3;

        const product = await Product.create(productData);
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

    try {
        // First, find the product to get its image filenames
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({error: 'Product not found'});
        }

        // Collect all image filenames that need to be deleted
        const imagesToDelete = [];
        if (product.product_image) imagesToDelete.push(product.product_image);
        if (product.product_image2) imagesToDelete.push(product.product_image2);
        if (product.product_image3) imagesToDelete.push(product.product_image3);

        // Delete the product from database
        await Product.findByIdAndDelete({_id: id});

        // Delete the associated image files from the filesystem
        imagesToDelete.forEach(filename => {
            if (filename) {
                const filePath = path.join(__dirname, '..', 'public', 'images', filename);
                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.error(`Failed to delete image file ${filename}:`, err);
                    } else {
                        console.log(`Successfully deleted image file: ${filename}`);
                    }
                });
            }
        });

        res.status(200).json({
            message: 'Product and associated images deleted successfully',
            deletedProduct: product,
            deletedImages: imagesToDelete
        });
    } catch (error) {
        console.error('Delete product error:', error);
        res.status(400).json({error: error.message});
    }
}

// Update a product
const updateProduct = async (req, res) => {
    const {id} = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'Invalid product ID'});
    }

    console.log('Update request body:', req.body);
    console.log('Update request files:', req.files);

    try {
        // First, get the current product to access old image filenames
        const currentProduct = await Product.findById(id);
        if (!currentProduct) {
            return res.status(404).json({error: 'Product not found'});
        }

        const updateData = {};
        
        // Map the incoming fields to the database schema
        if (req.body.product_name) updateData.product_name = req.body.product_name;
        if (req.body.description) updateData.description = req.body.description;
        if (req.body.product_price) updateData.product_price = req.body.product_price;
        if (req.body.warehouse_quantity) updateData.warehouse_quantity = req.body.warehouse_quantity;
        if (req.body.threshold !== undefined) updateData.threshold = req.body.threshold || 5;
        if (req.body.category) updateData.category = req.body.category;
        
        // Handle multiple images and delete old ones if new images are provided
        if (req.files && req.files.length > 0) {
            const images = req.files;
            
            // Store old image filenames for deletion
            const oldImages = [];
            if (currentProduct.product_image) oldImages.push(currentProduct.product_image);
            if (currentProduct.product_image2) oldImages.push(currentProduct.product_image2);
            if (currentProduct.product_image3) oldImages.push(currentProduct.product_image3);
            
            // Set new image filenames
            updateData.product_image = images[0].filename;
            updateData.product_image2 = images.length > 1 ? images[1].filename : null;
            updateData.product_image3 = images.length > 2 ? images[2].filename : null;
            
            // Delete old image files from the filesystem
            oldImages.forEach(filename => {
                if (filename) {
                    const filePath = path.join(__dirname, '..', 'public', 'images', filename);
                    fs.unlink(filePath, (err) => {
                        if (err) {
                            console.error(`Failed to delete old image ${filename}:`, err);
                        } else {
                            console.log(`Successfully deleted old image: ${filename}`);
                        }
                    });
                }
            });
        }

        console.log('Update data:', updateData);

        const product = await Product.findOneAndUpdate(
            {_id: id}, 
            updateData, 
            { new: true } // Return the updated document
        );

        if (!product) {
            return res.status(404).json({error: 'Product not found'});
        }

        res.status(200).json(product);
    }
    catch (error) {
        console.error('Update error:', error);
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