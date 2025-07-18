const express = require('express');
const multer = require('multer');
const path = require('path');
const {
    createPromo,
    getPromos,
    getActivePromos,
    getPromo,
    deletePromo,
    updatePromo
} = require('../controllers/PromoController');

const router = express.Router();

// Configure multer for image upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10000000 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    }
});

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
