const express = require('express');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(__dirname, '../public/images')),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
})

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

router.post('/', upload.single('product_image'), createProduct);

router.delete('/:id', deleteProduct);

router.patch('/:id', upload.single('product_image'), updateProduct);

module.exports = router;