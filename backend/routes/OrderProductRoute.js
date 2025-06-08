const express = require('express');

const {
    getOrderProducts,
    getOrderProduct,
    createOrderProduct,
    deleteOrderProduct,
    updateOrderProduct
} = require('../controllers/OrderProductController');

const router = express.Router();

router.get('/', getOrderProducts);

router.get('/:id', getOrderProduct);

router.post('/', createOrderProduct);

router.delete('/:id', deleteOrderProduct);

router.patch('/:id', updateOrderProduct);

module.exports = router;