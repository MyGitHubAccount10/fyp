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
        cart_items  // Array of items from shopping cart
    } = req.body;
    
    // Start a transaction
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
        // 1. Create the order first
        const order = await Order.create([{
            user,
            status,
            payment_method,
            shipping_address
        }], { session });

        // 2. Create order-products for each cart item
        for (const item of cart_items) {
            await OrderProduct.create([{
                order: order[0]._id,
                product: item.productId,
                order_quantity: item.quantity,
                order_unit_price: item.finalTotal  // This is the total amount for this item
            }], { session });
        }

        // If everything is successful, commit the transaction
        await session.commitTransaction();
        res.status(200).json(order[0]);
    }
    catch (error) {
        // If there's an error, abort the transaction
        await session.abortTransaction();
        res.status(400).json({error: error.message});
    }
    finally {
        session.endSession();
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