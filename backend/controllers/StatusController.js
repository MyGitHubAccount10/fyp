const mongoose = require('mongoose');
const Status = require('../models/StatusModel');

// Get all statuses
const getStatuses = async (req, res) => {
    const statuses = await Status.find({}).sort({createdAt: -1});

    res.status(200).json(statuses);
}

// Get a single status
const getStatus = async (req, res) => {
    const {id} = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'Invalid status ID'});
    }

    const status = await Status.findById(id);

    if (!status) {
        return res.status(404).json({error: 'Status not found'});
    }
    res.status(200).json(status);
}

// Create a new status
const createStatus = async (req, res) => {
    const {
        status_name
    } = req.body;
    
    try {
        const status = await Status.create({
            status_name
        });
        res.status(200).json(status);
    }
    catch (error) {
        res.status(400).json({error: error.message});
    }
}

// Delete a status
const deleteStatus = async (req, res) => {
    const {id} = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'Invalid status ID'});
    }

    const status = await Status.findByIdAndDelete({_id: id});

    if (!status) {
        return res.status(404).json({error: 'Status not found'});
    }
    res.status(200).json(status);
}

// Update a status
const updateStatus = async (req, res) => {
    const {id} = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'Invalid status ID'});
    }

    const status = await Status.findOneAndUpdate({_id: id}, {
        ...req.body
    });

    if (!status) {
        return res.status(404).json({error: 'Status not found'});
    }

    res.status(200).json(status);
}

module.exports = {
    getStatuses,
    getStatus,
    createStatus,
    deleteStatus,
    updateStatus
};