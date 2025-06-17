const mongoose = require('mongoose');
const User = require('../models/UserModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); // 1. Import bcrypt

const createToken = (_id) => {
    return jwt.sign({_id}, process.env.SECRET, { expiresIn: '3d' })
}

// ... (getUsers, getUser, createUser, etc. functions are unchanged)

const getUsers = async (req, res) => {
    const users = await User.find({}).sort({createdAt: -1});
    res.status(200).json(users);
}

const getUser = async (req, res) => {
    const {id} = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({error: 'Invalid user ID'});
    const user = await User.findById(id);
    if (!user) return res.status(404).json({error: 'User not found'});
    res.status(200).json(user);
}

const createUser = async (req, res) => {
    const { username, email, password, phone_number } = req.body;
    try {
       const user = await User.create({ username, email, password, phone_number, role_id: 4001 });
       res.status(201).json(user);
    } catch (error) {
       res.status(400).json({error: error.message});
    }
}

const deleteUser = async (req, res) => {
    const {id} = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({error: 'Invalid user ID'});
    const user = await User.findByIdAndDelete({_id: id});
    if (!user) return res.status(404).json({error: 'User not found'});
    res.status(200).json(user);
}

const updateUser = async (req, res) => {
    const {id} = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({error: 'Invalid user ID'});
    const user = await User.findOneAndUpdate({_id: id}, {...req.body});
    if (!user) return res.status(404).json({error: 'User not found'});
    res.status(200).json(user);
}

const loginUser = async (req, res) => {
  const {email, password} = req.body
  try {
    const user = await User.login(email, password)
    const token = createToken(user._id)
    res.status(200).json({ _id: user._id, email: user.email, username: user.username, phone_number: user.phone_number, token })
  } catch (error) {
    res.status(400).json({error: error.message})
  }
}

const signupUser = async (req, res) => {
  const {email, password, username, phone_number} = req.body
  try {
    const user = await User.signup(email, password, username, phone_number)
    const token = createToken(user._id)
    res.status(200).json({ email: user.email, username: user.username, phone_number: user.phone_number, token })
  } catch (error) {
    res.status(400).json({error: error.message})
  }
}

const updateLoggedInUser = async (req, res) => {
    const userId = req.user._id;
    if (!mongoose.Types.ObjectId.isValid(userId)) return res.status(404).json({error: 'Invalid user ID'});
    try {
        const updatedUser = await User.findByIdAndUpdate(userId, { email: req.body.email, phone_number: req.body.phone_number }, { new: true, runValidators: true });
        if (!updatedUser) return res.status(404).json({error: 'User not found'});
        res.status(200).json({ email: updatedUser.email, username: updatedUser.username, phone_number: updatedUser.phone_number });
    } catch (error) {
        res.status(500).json({error: 'Failed to update user information'});
    }
};

// 2. Add the new controller function for password updates
const updateUserPassword = async (req, res) => {
    const userId = req.user._id;
    const { newPassword } = req.body;

    // Validation
    if (!newPassword) {
        return res.status(400).json({ error: 'New password is required.' });
    }
    if (newPassword.length < 8) {
        return res.status(400).json({ error: 'Password must be at least 8 characters long.' });
    }

    try {
        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(newPassword, salt);

        // Update the user in the database
        const updatedUser = await User.findByIdAndUpdate(userId, { password: hash });

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({ error: 'Server error while updating password.' });
    }
};

// 3. Export the new function
module.exports = {
    getUsers,
    getUser,
    createUser,
    deleteUser,
    updateUser,
    signupUser,
    loginUser,
    updateLoggedInUser,
    updateUserPassword,
};