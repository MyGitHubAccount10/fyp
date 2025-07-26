const express = require('express');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(__dirname, '../public/images/customise-img')),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
})

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Not an image! Please upload only images.'), false);
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

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

// New route for multiple image uploads from CustomiseImagePage
router.post('/upload-multiple', upload.array('images', 10), (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'No files uploaded' });
        }
        
        const uploadedFiles = req.files.map(file => ({
            filename: file.filename,
            originalName: file.originalname,
            url: `/images/customise-img/${file.filename}`,
            size: file.size
        }));
        
        res.status(200).json({
            message: 'Files uploaded successfully',
            files: uploadedFiles
        });
    } catch (error) {
        res.status(500).json({ error: 'File upload failed', details: error.message });
    }
});

router.delete('/:id', deleteCustomiseImg);

router.patch('/:id', upload.single('customise_img'), updateCustomiseImg);

module.exports = router;