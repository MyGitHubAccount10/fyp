const express = require('express');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(__dirname, '../public/images/customise')),
    filename: (req, file, cb) => cb(null, performance.now() + path.extname(file.originalname))
})

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