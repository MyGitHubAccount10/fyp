const express = require('express');

const {
    getOrders,
    getOrder,
    createOrder,
    deleteOrder,
    updateOrder
} = require('../controllers/OrderController');

const router = express.Router();

router.get('/', getOrders);

router.get('/:id', getOrder);

router.post('/', createOrder);

router.delete('/:id', deleteOrder);

router.patch('/:id', updateOrder);

module.exports = router;