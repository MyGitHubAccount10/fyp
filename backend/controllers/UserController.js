const mongoose = require('mongoose');
const User = require('../models/UserModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const createToken = (_id) => {
    return jwt.sign({_id}, process.env.SECRET, { expiresIn: '3d' })
}

// Unchanged
const getUsers = async (req, res) => {
    const users = await User.find({}).sort({createdAt: -1});
    res.status(200).json(users);
}

// Unchanged
const getUser = async (req, res) => {
    const {id} = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({error: 'Invalid user ID'});
    const user = await User.findById(id);
    if (!user) return res.status(404).json({error: 'User not found'});
    res.status(200).json(user);
}

// Unchanged (already correct from previous fix)
const createUser = async (req, res) => {
    const { username, email, password, phone_number, role_id } = req.body;
    try {
       const user = await User.create({ username, email, password, phone_number, role_id });
       res.status(201).json(user);
    } catch (error) {
       res.status(400).json({error: error.message});
    }
}

// Unchanged
const deleteUser = async (req, res) => {
    const {id} = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({error: 'Invalid user ID'});
    const user = await User.findByIdAndDelete({_id: id});
    if (!user) return res.status(404).json({error: 'User not found'});
    res.status(200).json(user);
}

// Unchanged
const updateUser = async (req, res) => {
    const {id} = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({error: 'Invalid user ID'});
    const user = await User.findOneAndUpdate({_id: id}, {...req.body});
    if (!user) return res.status(404).json({error: 'User not found'});
    res.status(200).json(user);
}

// --- MODIFIED: This function now populates the role information upon login ---
const loginUser = async (req, res) => {
  const {email, password} = req.body;
  try {
    // 1. User.login validates the email and password
    const user = await User.login(email, password);

    // 2. After validation, find the user again to populate their role
    // This adds the role sub-document (e.g., { role_name: 'Admin' }) to the user object
    const userWithRole = await User.findById(user._id).populate({
      path: 'role_id', // The field in the User model to populate
      select: 'role_name' // We only need the role's name for our checks
    });

    // 3. Create a token
    const token = createToken(user._id);

    // 4. Send the full user object, including the populated role, to the frontend
    res.status(200).json({ 
        _id: userWithRole._id, 
        email: userWithRole.email, 
        username: userWithRole.username, 
        phone_number: userWithRole.phone_number,
        role: userWithRole.role_id, // This will be the populated role object
        token 
    });
  } catch (error) {
    res.status(400).json({error: error.message});
  }
}

// Unchanged (already correct from previous fix)
const signupUser = async (req, res) => {
  const {email, password, username, phone_number, role_id} = req.body;
  try {
    const user = await User.signup(email, password, username, phone_number, role_id);
    const token = createToken(user._id);
    res.status(200).json({ email: user.email, username: user.username, phone_number: user.phone_number, token });
  } catch (error) {
    res.status(400).json({error: error.message});
  }
}

// Unchanged
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

// Unchanged
const updateUserPassword = async (req, res) => {
    const userId = req.user._id;
    const { newPassword } = req.body;

    if (!newPassword) {
        return res.status(400).json({ error: 'New password is required.' });
    }
    if (newPassword.length < 8) {
        return res.status(400).json({ error: 'Password must be at least 8 characters long.' });
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(newPassword, salt);
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