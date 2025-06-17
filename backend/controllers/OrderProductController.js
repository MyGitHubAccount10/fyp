const mongoose = require('mongoose');
const OrderProduct = require('../models/OrderProductModel');

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
const createOrderProduct = async (req, res) => {    const {
        order_id,
        product_id,
        order_qty,
        order_unit_price,
        order_size
    } = req.body;
    
    try {
        const orderProduct = await OrderProduct.create({
            order_id,
            product_id,
            order_qty,
            order_unit_price,
            order_size
        });
        res.status(200).json(orderProduct);
    }
    catch (error) {
        res.status(400).json({error: error.message});
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