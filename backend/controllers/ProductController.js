const mongoose = require('mongoose');
const Product = require('../models/ProductModel');

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

    // Validation
    if (!name || !description || !price || !stockQuantity || !category) {
        return res.status(400).json({
            error: 'Missing required fields: name, description, price, stockQuantity, category'
        });
    }

    if (!images || images.length === 0) {
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
            product_image: `data:${images[0].mimetype};base64,${images[0].buffer.toString('base64')}` // Assuming the first image is the main product image
        };

        // Add additional images if they exist
        if (images[1]) productData.product_image2 = `data:${images[1].mimetype};base64,${images[1].buffer.toString('base64')}`;
        if (images[2]) productData.product_image3 = `data:${images[2].mimetype};base64,${images[2].buffer.toString('base64')}`;
        if (images[3]) productData.product_image4 = `data:${images[3].mimetype};base64,${images[3].buffer.toString('base64')}`;
        if (images[4]) productData.product_image5 = `data:${images[4].mimetype};base64,${images[4].buffer.toString('base64')}`;
        if (images[5]) productData.product_image6 = `data:${images[5].mimetype};base64,${images[5].buffer.toString('base64')}`;
        if (images[6]) productData.product_image7 = `data:${images[6].mimetype};base64,${images[6].buffer.toString('base64')}`;
        if (images[7]) productData.product_image8 = `data:${images[7].mimetype};base64,${images[7].buffer.toString('base64')}`;

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
        const product = await Product.findByIdAndDelete({_id: id});

        if (!product) {
            return res.status(404).json({error: 'Product not found'});
        }

        res.status(200).json({
            message: 'Product and associated images deleted successfully',
            deletedProduct: product,
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
        
        const images = req.files || [];
        // Handle image updates
        if (images[0]) updateData.product_image = `data:${images[0].mimetype};base64,${images[0].buffer.toString('base64')}`;
        if (images[1]) updateData.product_image2 = `data:${images[1].mimetype};base64,${images[1].buffer.toString('base64')}`;
        if (images[2]) updateData.product_image3 = `data:${images[2].mimetype};base64,${images[2].buffer.toString('base64')}`;
        if (images[3]) updateData.product_image4 = `data:${images[3].mimetype};base64,${images[3].buffer.toString('base64')}`;
        if (images[4]) updateData.product_image5 = `data:${images[4].mimetype};base64,${images[4].buffer.toString('base64')}`;
        if (images[5]) updateData.product_image6 = `data:${images[5].mimetype};base64,${images[5].buffer.toString('base64')}`;
        if (images[6]) updateData.product_image7 = `data:${images[6].mimetype};base64,${images[6].buffer.toString('base64')}`;
        if (images[7]) updateData.product_image8 = `data:${images[7].mimetype};base64,${images[7].buffer.toString('base64')}`;

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