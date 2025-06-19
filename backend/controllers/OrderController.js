const mongoose = require('mongoose');
const Order = require('../models/OrderModel');

// Get all orders for the logged-in user
const getOrders = async (req, res) => {
    const user_id = req.user._id;
    const orders = await Order.find({ user_id }).sort({createdAt: -1});
    res.status(200).json(orders);
}

// Get a single order
const getOrder = async (req, res) => {
    const {id} = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'Invalid order ID'});
    }
    const order = await Order.findById(id);
    if (!order) {
        return res.status(404).json({error: 'Order not found'});
    }
    if (order.user_id.toString() !== req.user._id.toString()) {
        return res.status(403).json({ error: 'User not authorized to view this order' });
    }
    res.status(200).json(order);
}

// MODIFIED: Create a new order (postal_code logic removed)
const createOrder = async (req, res) => {
    try {
        const {
            user_id,
            status_id,
            payment_method,
            shipping_address,
            // postal_code removed
            order_date,
            total_amount
        } = req.body;

        // Validate required fields
        if (!user_id || !status_id || !payment_method || !shipping_address) {
            const missingFields = [];
            if (!user_id) missingFields.push('user_id');
            if (!status_id) missingFields.push('status_id');
            if (!payment_method) missingFields.push('payment_method');
            if (!shipping_address) missingFields.push('shipping_address');
            
            return res.status(400).json({ 
                error: 'Missing required fields', 
                missingFields 
            });
        }

        if (!mongoose.Types.ObjectId.isValid(user_id)) {
            return res.status(400).json({ error: 'Invalid user_id format' });
        }
        if (!mongoose.Types.ObjectId.isValid(status_id)) {
            return res.status(400).json({ error: 'Invalid status_id format' });
        }

        // Create the order with validated data
        const order = await Order.create({
            user_id: new mongoose.Types.ObjectId(user_id),
            status_id: new mongoose.Types.ObjectId(status_id),
            payment_method,
            shipping_address,
            // postal_code removed
            order_date: new Date(order_date),
            total_amount: parseFloat(total_amount)
        });

        res.status(200).json(order);
    } catch (error) {
        res.status(400).json({ 
            error: error.message,
            details: error.errors
        });
    }
}

// Delete an order
const deleteOrder = async (req, res) => {
    const {id} = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'Invalid order ID'});
    }
    const order = await Order.findByIdAndDelete({_id: id});
    if (!order) {
        return res.status(404).json({error: 'Order not found'});
    }
    res.status(200).json(order);
}

// Update an order
const updateOrder = async (req, res) => {
    const {id} = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'Invalid order ID'});
    }
    const order = await Order.findOneAndUpdate({_id: id}, { ...req.body });
    if (!order) {
        return res.status(404).json({error: 'Order not found'});
    }
    res.status(200).json(order);
}

module.exports = {
    getOrders,
    getOrder,
    createOrder,
    deleteOrder,
    updateOrder
};