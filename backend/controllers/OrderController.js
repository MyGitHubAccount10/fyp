const mongoose = require('mongoose');
const Order = require('../models/OrderModel');

// Get all orders
const getOrders = async (req, res) => {
    const orders = await Order.find({}).sort({createdAt: -1});

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
    res.status(200).json(order);
}

// Create a new order
const createOrder = async (req, res) => {
    const {
        user,
        status,
        payment_method,
        shipping_address,
    } = req.body;
    
    try {
        const order = await Order.create({
            user,
            status,
            payment_method,
            shipping_address
        });
        res.status(200).json(order);
    }
    catch (error) {
        res.status(400).json({error: error.message});
    }
}

// Delete a order
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

// Update a order
const updateOrder = async (req, res) => {
    const {id} = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'Invalid order ID'});
    }

    const order = await Order.findOneAndUpdate({_id: id}, {
        ...req.body
    });

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