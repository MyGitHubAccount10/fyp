const mongoose = require('mongoose');
const User = require('../models/UserModel');

// Get all users
const getUsers = async (req, res) => {
    const users = await User.find({}).sort({createdAt: -1});

    res.status(200).json(users);
}

// Get a single user
const getUser = async (req, res) => {
    const {id} = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'Invalid user ID'});
    }

    const user = await User.findById(id);

    if (!user) {
        return res.status(404).json({error: 'User not found'});
    }
    res.status(200).json(user);
}

// Create a new user
const createUser = async (req, res) => {
    const {
       username,
       role,
       email,
       password,
       phone_number
    } = req.body;

    try {
       const user = await User.create({
           username,
           email,
           password,
           role,
           phone_number
       });
       res.status(200).json(user);
    }
    catch (error) {
       res.status(400).json({error: error.message});
    }
}

// Delete a user
const deleteUser = async (req, res) => {
    const {id} = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'Invalid user ID'});
    }

    const user = await User.findByIdAndDelete({_id: id});

    if (!user) {
        return res.status(404).json({error: 'User not found'});
    }
    res.status(200).json(user);
}

// Update a user
const updateUser = async (req, res) => {
    const {id} = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'Invalid user ID'});
    }

    const user = await User.findOneAndUpdate({_id: id}, {
        ...req.body
    });

    if (!user) {
        return res.status(404).json({error: 'User not found'});
    }

    res.status(200).json(user);
}

module.exports = {
    getUsers,
    getUser,
    createUser,
    deleteUser,
    updateUser
};