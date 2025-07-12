const mongoose = require('mongoose');
const Order = require('../models/OrderModel');
const User = require('../models/UserModel');
const OrderProduct = require('../models/OrderProductModel');
const Product = require('../models/ProductModel');

// Get all orders for admin (new function)
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({})
            .populate('user_id', 'full_name email username phone_number')
            .populate('status_id', 'status_name')
            .sort({createdAt: -1});
        res.status(200).json(orders);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

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
    }      try {
        const order = await Order.findById(id)
            .populate('user_id', 'full_name email username phone_number')
            .populate('status_id', 'status_name');
            
        if (!order) {
            return res.status(404).json({error: 'Order not found'});
        }

        // Get user role to check permissions
        const userWithRole = await mongoose.model('User').findById(req.user._id).populate('role_id', 'role_name');
        const userRole = userWithRole.role_id.role_name;

        // Allow admins and super admins to view any order, regular users can only view their own
        if (userRole !== 'Admin' && userRole !== 'Super Admin' && order.user_id._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'User not authorized to view this order' });
        }

        res.status(200).json(order);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
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
    
    try {
        // Get user role to check permissions
        const userWithRole = await mongoose.model('User').findById(req.user._id).populate('role_id', 'role_name');
        const userRole = userWithRole.role_id.role_name;

        // Find the order first to check ownership and get current status
        const existingOrder = await Order.findById(id).populate('status_id', 'status_name');
        if (!existingOrder) {
            return res.status(404).json({error: 'Order not found'});
        }

        // Allow admins and super admins to update any order, regular users can only update their own
        if (userRole !== 'Admin' && userRole !== 'Super Admin' && existingOrder.user_id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'User not authorized to update this order' });
        }

        // Handle stock adjustments if status is being changed
        if (req.body.status_id && req.body.status_id !== existingOrder.status_id._id.toString()) {
            // Get the new status name
            const StatusModel = mongoose.model('Status');
            const newStatus = await StatusModel.findById(req.body.status_id);
            if (!newStatus) {
                return res.status(400).json({error: 'Invalid status ID'});
            }

            const currentStatusName = existingOrder.status_id?.status_name;
            const newStatusName = newStatus.status_name;

            // Define statuses that should restore stock (cancelled/failed orders)
            const stockRestoringStatuses = ['Attempted Delivery', 'Returned to Sender', 'Declined'];
            
            const isCurrentlyRestoring = stockRestoringStatuses.includes(currentStatusName);
            const isNewlyRestoring = stockRestoringStatuses.includes(newStatusName);

            // Get order products for this order (excluding custom items)
            const orderProducts = await OrderProduct.find({ order_id: id }).populate('product_id');

            // Only process regular products (not custom items)
            const regularProducts = orderProducts.filter(op => op.product_id);

            if (isNewlyRestoring && !isCurrentlyRestoring) {
                // Changing TO a stock-restoring status - add stock back
                for (const orderProduct of regularProducts) {
                    const product = await Product.findById(orderProduct.product_id._id);
                    if (product) {
                        product.warehouse_quantity += orderProduct.order_qty;
                        await product.save();
                        console.log(`Restored ${orderProduct.order_qty} units to ${product.product_name} (new quantity: ${product.warehouse_quantity})`);
                    }
                }
            } else if (!isNewlyRestoring && isCurrentlyRestoring) {
                // Changing FROM a stock-restoring status - remove stock
                for (const orderProduct of regularProducts) {
                    const product = await Product.findById(orderProduct.product_id._id);
                    if (product) {
                        // Check if we have enough stock to deduct
                        if (product.warehouse_quantity >= orderProduct.order_qty) {
                            product.warehouse_quantity -= orderProduct.order_qty;
                            await product.save();
                            console.log(`Deducted ${orderProduct.order_qty} units from ${product.product_name} (new quantity: ${product.warehouse_quantity})`);
                        } else {
                            return res.status(400).json({
                                error: `Insufficient stock to process status change. Product: ${product.product_name}, Available: ${product.warehouse_quantity}, Required: ${orderProduct.order_qty}`
                            });
                        }
                    }
                }
            }
            // If both statuses are stock-restoring or both are non-stock-restoring, no stock change needed
        }

        // Update the order
        const order = await Order.findOneAndUpdate({_id: id}, { ...req.body }, { new: true })
            .populate('user_id', 'full_name email username phone_number')
            .populate('status_id', 'status_name');
            
        res.status(200).json(order);
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(400).json({error: error.message});
    }
}

module.exports = {
    getAllOrders,
    getOrders,
    getOrder,
    createOrder,
    deleteOrder,
    updateOrder
};