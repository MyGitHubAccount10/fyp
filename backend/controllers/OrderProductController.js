const mongoose = require('mongoose');
const OrderProduct = require('../models/OrderProductModel');
const Product = require('../models/ProductModel'); // ✅ 1. Import the Product model

// --- START: Add the new controller function ---
// Get all order products for a specific order ID
const getOrderProductsByOrderId = async (req, res) => {
    const { orderId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
        return res.status(404).json({error: 'Invalid Order ID'});
    }

    try {
        const orderProducts = await OrderProduct.find({ order_id: orderId });

        if (!orderProducts) {
            // Send an empty array if no products found, which is not an error
            return res.status(200).json([]);
        }

        res.status(200).json(orderProducts);
    } catch (error) {
        res.status(500).json({ error: 'Server error fetching order products' });
    }
}
// --- END: Add the new controller function ---

// Get all order products (for admin purposes, likely)
const getOrderProducts = async (req, res) => {
    const orderProducts = await OrderProduct.find({}).sort({createdAt: -1});

    res.status(200).json(orderProducts);
}

// Get a single order product by its own ID
const getOrderProduct = async (req, res) => {
    const {id} = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'Invalid order-product ID'});
    }

    const orderProduct = await OrderProduct.findById(id);

    if (!orderProduct) {
        return res.status(404).json({error: 'Order product not found'});
    }
    res.status(200).json(orderProduct);
}

// ... (rest of the file is unchanged)
// MODIFIED: Create a new order product AND update inventory
const createOrderProduct = async (req, res) => {
    const {
        order_id,
        product_id,
        order_qty,
        order_unit_price,
        order_size
    } = req.body;
    
    try {
        // ✅ 2. Find the product in the database
        const product = await Product.findById(product_id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found. Cannot update inventory.' });
        }

        // ✅ 3. Check if there is enough stock
        if (product.warehouse_quantity < order_qty) {
            return res.status(400).json({ 
                error: `Insufficient stock for product: ${product.product_name}. Available: ${product.warehouse_quantity}, Requested: ${order_qty}` 
            });
        }
        
        // ✅ 4. Decrement the warehouse quantity and save the product
        product.warehouse_quantity -= order_qty;
        await product.save();

        // ✅ 5. If stock update is successful, create the order-product record
        const orderProduct = await OrderProduct.create({
            order_id,
            product_id,
            order_qty,
            order_unit_price,
            order_size
        });
        res.status(200).json(orderProduct);

    } catch (error) {
        // This will catch errors from both the product update and order-product creation
        console.error("Error creating order product and updating stock: ", error);
        res.status(500).json({error: `Server error while processing order item: ${error.message}`});
    }
}

const deleteOrderProduct = async (req, res) => {
    const {id} = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'Invalid order product ID'});
    }

    const orderProduct = await OrderProduct.findByIdAndDelete({_id: id});

    if (!orderProduct) {
        return res.status(404).json({error: 'Order product not found'});
    }
    res.status(200).json(orderProduct);
}

const updateOrderProduct = async (req, res) => {
    const {id} = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'Invalid order product ID'});
    }

    const orderProduct = await OrderProduct.findOneAndUpdate({_id: id}, {
        ...req.body
    });

    if (!orderProduct) {
        return res.status(404).json({error: 'Order product not found'});
    }

    res.status(200).json(orderProduct);
}


// --- START: Export the new function ---
module.exports = {
    getOrderProductsByOrderId,
    getOrderProducts,
    getOrderProduct,
    createOrderProduct,
    deleteOrderProduct,
    updateOrderProduct
};
// --- END: Export the new function ---