const express = require('express');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({storage});

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

router.post('/', upload.fields([{ name: 'top_image', maxCount: 1 }, { name: 'bottom_image', maxCount: 1 }]), createCustomise);

router.delete('/:id', deleteCustomise);

router.patch('/:id', upload.fields([{ name: 'top_image', maxCount: 1 }, { name: 'bottom_image', maxCount: 1 }]), updateCustomise);

module.exports = router;