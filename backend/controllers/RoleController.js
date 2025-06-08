const mongoose = require('mongoose');
const Role = require('../models/RoleModel');

// Get all roles
const getRoles = async (req, res) => {
    const roles = await Role.find({}).sort({createdAt: -1});

    res.status(200).json(roles);
}

// Get a single role
const getRole = async (req, res) => {
    const {id} = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'Invalid role ID'});
    }

    const role = await Role.findById(id);

    if (!role) {
        return res.status(404).json({error: 'Role not found'});
    }
    res.status(200).json(product);
}

// Create a new role
const createRole = async (req, res) => {
    const {
        role_name
    } = req.body;
    
    try {
        const role = await Role.create({
            role_name
        });
        res.status(200).json(role);
    }
    catch (error) {
        res.status(400).json({error: error.message});
    }
}

// Delete a role
const deleteRole = async (req, res) => {
    const {id} = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'Invalid role ID'});
    }

    const role = await Role.findByIdAndDelete({_id: id});

    if (!role) {
        return res.status(404).json({error: 'Role not found'});
    }
    res.status(200).json(role);
}

// Update a role
const updateRole = async (req, res) => {
    const {id} = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'Invalid role ID'});
    }

    const role = await Role.findOneAndUpdate({_id: id}, {
        ...req.body
    });

    if (!role) {
        return res.status(404).json({error: 'Role not found'});
    }

    res.status(200).json(role);
}

module.exports = {
    getRoles,
    getRole,
    createRole,
    deleteRole,
    updateRole
};