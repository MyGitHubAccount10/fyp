const mongoose = require('mongoose');
const Customise = require('../models/CustomiseModel');

// Get all customises
const getCustomises = async (req, res) => {
    const customises = await Customise.find({}).sort({createdAt: -1});

    res.status(200).json(customises);
}

// Get a single customise
const getCustomise = async (req, res) => {
    const {id} = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'Invalid customise ID'});
    }

    const customise = await Customise.findById(id);

    if (!customise) {
        return res.status(404).json({error: 'Customise not found'});
    }
    res.status(200).json(customise);
}

// Create a new customise
const createCustomise = async (req, res) => {
    const {
        order,
        board_type,
        board_shape,
        board_size,
        material,
        top_color,
        bottom_color,
        customise_price,
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
            customise_date
        });
        res.status(200).json(customise);
    } 
    catch (error) {
        res.status(400).json({error: error.message});
    }
}

// Delete a customise
const deleteCustomise = async (req, res) => {
    const {id} = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'Invalid customise ID'});
    }

    const customise = await Customise.findByIdAndDelete({_id: id});

    if (!customise) {
        return res.status(404).json({error: 'Customise not found'});
    }
    res.status(200).json(customise);
}

// Update a customise
const updateCustomise = async (req, res) => {
    const {id} = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'Invalid customise ID'});
    }

    const customise = await Customise.findOneAndUpdate({_id: id}, {
        ...req.body
    });

    if (!customise) {
        return res.status(404).json({error: 'Customise not found'});
    }

    res.status(200).json(customise);
}

module.exports = {
    getCustomises,
    getCustomise,
    createCustomise,
    deleteCustomise,
    updateCustomise
};