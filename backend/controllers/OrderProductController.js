const mongoose = require('mongoose');
const OrderProduct = require('../models/OrderProductModel');

// Get all order products
const getOrderProducts = async (req, res) => {
    const orderProducts = await OrderProduct.find({}).sort({createdAt: -1});

    res.status(200).json(orderProducts);
}

// Get a single order product
const getOrderProduct = async (req, res) => {
    const {id} = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'Invalid customised image ID'});
    }

    const orderProduct = await OrderProduct.findById(id);

    if (!orderProduct) {
        return res.status(404).json({error: 'Order product not found'});
    }
    res.status(200).json(orderProduct);
}

// Create a new order product
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

// Delete a order product
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

// Update a order product
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

module.exports = {
    getOrderProducts,
    getOrderProduct,
    createOrderProduct,
    deleteOrderProduct,
    updateOrderProduct
};