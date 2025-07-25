const mongoose = require('mongoose');
const Customise = require('../models/CustomiseModel');
const sharp = require('sharp');

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

const getCustomiseByOrder = async (req, res) => {
    const {orderId} = req.params;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
        return res.status(404).json({error: 'Invalid order ID'});
    }

    try {
        const customise = await Customise.find({ order: orderId });

        if (!customise) {
            return res.status(200).json(null);
        }

        res.status(200).json(customise);
    } catch (error) {
        console.error('Error fetching customises by order:', error);
        res.status(500).json({ error: `Server error while fetching customise data: ${error.message}` });
    }
}
// Create a new customise
const createCustomise = async (req, res) => {
    const {
        order,
        board_type,
        board_shape,
        board_size,
        material,
        thickness,
        customise_qty,
        customise_price,
    } = req.body;

    const top_file = req.files && req.files.top_image ? req.files.top_image[0] : null;
    const bottom_file = req.files && req.files.bottom_image ? req.files.bottom_image[0] : null;

    if (!top_file) {
        return res.status(400).json({error: 'Top image is required'});
    }

    if (!bottom_file) {
        return res.status(400).json({error: 'Bottom image is required'});
    }

    const top_compressed = await sharp(top_file.buffer)
        .jpeg({ quality: 75 })
        .toBuffer();
    const bottom_compressed = await sharp(bottom_file.buffer)
        .jpeg({ quality: 75 })
        .toBuffer();
    const top_image = `data:image/jpeg;base64,${top_compressed.toString('base64')}`;
    const bottom_image = `data:image/jpeg;base64,${bottom_compressed.toString('base64')}`;

    try {
        const customise = await Customise.create({
            order,
            board_type,
            board_shape,
            board_size,
            material,
            thickness,
            top_image,
            bottom_image,
            customise_qty,
            customise_price
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

    const updates = {...req.body};
    if (req.files && req.files.top_image) {
        const top_file = req.files.top_image[0];
        const top_compressed = await sharp(top_file.buffer)
            .jpeg({ quality: 75 })
            .toBuffer();
        updates.top_image = `data:image/jpeg;base64,${top_compressed.toString('base64')}`;
    }

    if (req.files && req.files.bottom_image) {
        const bottom_file = req.files.bottom_image[0];
        const bottom_compressed = await sharp(bottom_file.buffer)
            .jpeg({ quality: 75 })
            .toBuffer();
        updates.bottom_image = `data:image/jpeg;base64,${bottom_compressed.toString('base64')}`;
    }

    const customise = await Customise.findOneAndUpdate({_id: id}, updates, { new: true });

    if (!customise) {
        return res.status(404).json({error: 'Customise not found'});
    }

    res.status(200).json(customise);
}

module.exports = {
    getCustomises,
    getCustomise,
    getCustomiseByOrder,
    createCustomise,
    deleteCustomise,
    updateCustomise
};