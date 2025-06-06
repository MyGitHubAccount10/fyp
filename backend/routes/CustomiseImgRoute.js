const express = require('express');
const CustomiseImg = require('../models/CustomiseImgModel');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({message: 'GET all customise images'});
});

router.get('/:id', (req, res) => {
    res.json({message: 'GET a single customise image'});
});

router.post('/', async (req, res) => {
   const {
        customise,
        customise_img,
        x_position,
        y_position,
        width,
        height,
        rotation,
        layer_order
    } = req.body;
    
    try {
        const customiseImage = await CustomiseImg.create({
            customise,
            customise_img,
            x_position,
            y_position,
            width,
            height,
            rotation,
            layer_order
        });
        res.status(200).json(customiseImage);
    } 
    catch (error) {
        res.status(400).json({error: error.message});
    }
});

router.delete('/:id', (req, res) => {
    res.json({message: 'DELETE a customise image'});
});

router.patch('/:id', (req, res) => {
    res.json({message: 'UPDATE a customise image'});
});

module.exports = router;