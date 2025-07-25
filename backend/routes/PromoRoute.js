const express = require('express');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({storage});

const {
    createPromo,
    getPromos,
    getActivePromos,
    getPromo,
    deletePromo,
    updatePromo
} = require('../controllers/PromoController');

const router = express.Router();

// GET all promos (admin)
router.get('/', getPromos);

// GET active promos (for homepage)
router.get('/active', getActivePromos);

// GET a single promo
router.get('/:id', getPromo);

// POST a new promo
router.post('/', upload.single('promo_image'), createPromo);

// PATCH a promo
router.patch('/:id', upload.single('promo_image'), updatePromo);

// DELETE a promo
router.delete('/:id', deletePromo);

module.exports = router;
