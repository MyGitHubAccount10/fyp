const express = require('express');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({storage});

const {
    getProducts,
    getProduct,
    createProduct,
    deleteProduct,
    updateProduct
} = require('../controllers/ProductController');

const router = express.Router();

router.get('/', getProducts);

router.get('/:id', getProduct);

router.post('/', upload.array('product_images', 8), createProduct);

router.delete('/:id', deleteProduct);

router.patch('/:id', upload.array('product_images', 8), updateProduct);

module.exports = router;