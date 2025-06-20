const express = require('express');
const requireAuth = require('../middleware/requireAuth');

const {
    getAllOrders,
    getOrders,
    getOrder,
    createOrder,
    deleteOrder,
    updateOrder
} = require('../controllers/OrderController');

const router = express.Router();

// Add authentication middleware
router.use(requireAuth);

// Admin route to get all orders
router.get('/admin/all', getAllOrders);

router.get('/', getOrders);

router.get('/:id', getOrder);

router.post('/', createOrder);

router.delete('/:id', deleteOrder);

router.patch('/:id', updateOrder);

module.exports = router;