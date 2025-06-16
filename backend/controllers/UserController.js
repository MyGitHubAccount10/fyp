const mongoose = require('mongoose');
const User = require('../models/UserModel');
const jwt = require('jsonwebtoken')

const createToken = (_id) => {
  return jwt.sign({_id}, process.env.SECRET, { expiresIn: '3d' })
}

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
       email,
       password,
       phone_number
    } = req.body;

    try {
       const user = await User.create({
           username,
           email,
           password,
           phone_number,
           role_id: 4001 // Automatically set role_id
       });
       res.status(201).json(user);
    } catch (error) {
       console.error('Error creating user:', error.message); // Added detailed logging
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

// login a user
const loginUser = async (req, res) => {
  const {email, password} = req.body

  console.log('Login attempt:', { email, password }); // Debugging log

  try {
    const user = await User.login(email, password)

    // create a token
    const token = createToken(user._id)

    res.status(200).json({email, token})
  } catch (error) {
    res.status(400).json({error: error.message})
  }
}

// signup a user
const signupUser = async (req, res) => {
  const {email, password} = req.body

  try {
    const user = await User.signup(email, password)

    // create a token
    const token = createToken(user._id)

    res.status(200).json({email, token})
  } catch (error) {
    res.status(400).json({error: error.message})
  }
}

// Update logged-in user's information
const updateLoggedInUser = async (req, res) => {
    const userId = req.user._id; // Extract user ID from the authenticated user

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(404).json({error: 'Invalid user ID'});
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(userId, req.body, {new: true});

        if (!updatedUser) {
            return res.status(404).json({error: 'User not found'});
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({error: 'Failed to update user information'});
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
};