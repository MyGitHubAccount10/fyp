const express = require('express');

const {
    getCustomise,
    getCustomises,
    getCustomiseByOrder,
    createCustomise,
    deleteCustomise,
    updateCustomise
} = require('../controllers/CustomiseController');

const router = express.Router();

router.get('/by-order/:orderId', getCustomiseByOrder);

router.get('/', getCustomises);

router.get('/:id', getCustomise);

router.post('/', createCustomise);

router.delete('/:id', deleteCustomise);

router.patch('/:id', updateCustomise);

module.exports = router;