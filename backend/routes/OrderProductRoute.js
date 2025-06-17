const express = require('express');
const requireAuth = require('../middleware/requireAuth'); // Import auth middleware

const {
    getOrderProducts,
    getOrderProduct,
    createOrderProduct,
    deleteOrderProduct,
    updateOrderProduct,
    getOrderProductsByOrderId // 1. Import the new controller function
} = require('../controllers/OrderProductController');

const router = express.Router();

// 2. Protect all these routes
router.use(requireAuth);

// 3. Define the new, specific route BEFORE the generic '/:id' route
router.get('/by-order/:orderId', getOrderProductsByOrderId);

// Existing routes
router.get('/', getOrderProducts);
router.get('/:id', getOrderProduct); // This will now work correctly for its intended purpose
router.post('/', createOrderProduct);
router.delete('/:id', deleteOrderProduct);
router.patch('/:id', updateOrderProduct);

module.exports = router;