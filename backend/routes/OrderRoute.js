const express = require('express');
const requireAuth = require('../middleware/requireAuth');

const {
    getOrders,
    getOrder,
    createOrder,
    deleteOrder,
    updateOrder
} = require('../controllers/OrderController');

const router = express.Router();

// Add authentication middleware
router.use(requireAuth);

router.get('/', getOrders);

router.get('/:id', getOrder);

router.post('/', createOrder);

router.delete('/:id', deleteOrder);

router.patch('/:id', updateOrder);

module.exports = router;