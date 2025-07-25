const express = require('express');
const multer = require('multer');
const path = require('path');
const storage = multer.memoryStorage();
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

// New route for multiple image uploads from CustomiseImagePage
router.post('/upload-multiple', upload.array('images', 10), (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'No files uploaded' });
        }
        
        const uploadedFiles = req.files.map(file => ({
            originalName: file.originalname,
            base64: `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
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