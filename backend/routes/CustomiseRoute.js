const express = require('express');
const Customise = require('../models/CustomiseModel');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({message: 'GET all customises'});
});

router.get('/:id', (req, res) => {
    res.json({message: 'GET a single customise'});
});

router.post('/', async (req, res) => {
   const {
        order,
        board_type,
        board_shape,
        board_size,
        material,
        top_color,
        bottom_color,
        customise_price,
        customise_status,
        customise_date
    } = req.body;
    
    try {
        const customise = await Customise.create({
            order,
            board_type,
            board_shape,
            board_size,
            material,
            top_color,
            bottom_color,
            customise_price,
            customise_status,
            customise_date
        });
        res.status(200).json(customise);
    } 
    catch (error) {
        res.status(400).json({error: error.message});
    }
});

router.delete('/:id', (req, res) => {
    res.json({message: 'DELETE a customise'});
});

router.patch('/:id', (req, res) => {
    res.json({message: 'UPDATE a customise'});
});

module.exports = router;