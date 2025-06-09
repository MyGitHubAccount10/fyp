const mongoose = require('mongoose');
const CustomiseImg = require('../models/CustomiseImgModel');

// Get all customised images
const getCustomiseImgs = async (req, res) => {
    const customiseImg = await CustomiseImg.find({}).sort({createdAt: -1});

    res.status(200).json(customiseImg);
}

// Get a single customised image
const getCustomiseImg = async (req, res) => {
    const {id} = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'Invalid customised image ID'});
    }

    const customiseImg = await CustomiseImg.findById(id);

    if (!customiseImg) {
        return res.status(404).json({error: 'Customised image not found'});
    }
    res.status(200).json(customiseImg);
}

// Create a new customised image
const createCustomiseImg = async (req, res) => {
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
}

// Delete a customised image
const deleteCustomiseImg = async (req, res) => {
    const {id} = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'Invalid customised image ID'});
    }

    const customiseImg = await CustomiseImg.findByIdAndDelete({_id: id});

    if (!customiseImg) {
        return res.status(404).json({error: 'Customised image not found'});
    }
    res.status(200).json(customiseImg);
}

// Update a customised image
const updateCustomiseImg = async (req, res) => {
    const {id} = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'Invalid customised image ID'});
    }

    const customiseImg = await CustomiseImg.findOneAndUpdate({_id: id}, {
        ...req.body
    });

    if (!customiseImg) {
        return res.status(404).json({error: 'Customised image not found'});
    }

    res.status(200).json(customiseImg);
}

module.exports = {
    getCustomiseImgs,
    getCustomiseImg,
    createCustomiseImg,
    deleteCustomiseImg,
    updateCustomiseImg
};