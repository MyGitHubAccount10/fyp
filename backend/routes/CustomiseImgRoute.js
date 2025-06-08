const express = require('express');

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

router.post('/', createCustomiseImg);

router.delete('/:id', deleteCustomiseImg);

router.patch('/:id', updateCustomiseImg);

module.exports = router;