const mongoose = require('mongoose');
const Promo = require('../models/PromoModel');

// Get all promos
const getPromos = async (req, res) => {
    try {
        const promos = await Promo.find({}).sort({display_order: 1, createdAt: -1});
        res.status(200).json(promos);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

// Get active promos for homepage
const getActivePromos = async (req, res) => {
    try {
        const promos = await Promo.find({is_active: true}).sort({display_order: 1, createdAt: -1});
        res.status(200).json(promos);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

// Get a single promo
const getPromo = async (req, res) => {
    const {id} = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'Invalid promo ID'});
    }

    try {
        const promo = await Promo.findById(id);
        if (!promo) {
            return res.status(404).json({error: 'Promo not found'});
        }
        res.status(200).json(promo);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

// Create a new promo
const createPromo = async (req, res) => {
    const {promo_title, promo_link, display_order, is_active} = req.body;

    if (!promo_title) {
        return res.status(400).json({error: 'Promo title is required'});
    }
    
    // Check if image was uploaded
    if (!req.file) {
        return res.status(400).json({error: 'Promo image is required'});
    }

    try {
        const promo_image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
        
        const promo = await Promo.create({
            promo_title,
            promo_image,
            promo_link: promo_link || '/',
            display_order: display_order || 0,
            is_active: is_active !== undefined ? is_active : true
        });
        res.status(200).json(promo);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

// Update a promo
const updatePromo = async (req, res) => {
    const {id} = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'Invalid promo ID'});
    }

    try {
        const existingPromo = await Promo.findById(id);
        if (!existingPromo) {
            return res.status(404).json({error: 'Promo not found'});
        }

        const updateData = {
            promo_title: req.body.promo_title,
            promo_link: req.body.promo_link || '/',
            display_order: req.body.display_order || 0,
            is_active: req.body.is_active !== undefined ? req.body.is_active : true
        };

        if (req.file) {
            updateData.promo_image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
        }

        const promo = await Promo.findByIdAndUpdate(id, updateData, {new: true});
        res.status(200).json(promo);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

// Delete a promo
const deletePromo = async (req, res) => {
    const {id} = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'Invalid promo ID'});
    }

    try {
        const promo = await Promo.findByIdAndDelete({_id: id});

        if (!promo) {
            return res.status(404).json({error: 'Promo not found'});
        }

        res.status(200).json(promo);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

module.exports = {
    createPromo,
    getPromos,
    getActivePromos,
    getPromo,
    deletePromo,
    updatePromo
}
