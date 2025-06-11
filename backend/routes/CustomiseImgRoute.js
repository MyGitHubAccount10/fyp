const express = require('express');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, '../public/images'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
})

const upload = multer({storage});

const {
    getCustomiseImg,
    getCustomiseImgs,
    createCustomiseImg,
    deleteCustomiseImg,
    updateCustomiseImg
} = require('../controllers/CustomiseImgController');

const router = express.Router();

router.get('/', getCustomiseImgs);

router.get('/:id', getCustomiseImg);

router.post('/', upload.single('customise_img'), createCustomiseImg);

router.delete('/:id', deleteCustomiseImg);

router.patch('/:id', upload.single('customise_img'), updateCustomiseImg);

module.exports = router;