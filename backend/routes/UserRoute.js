const express = require('express');
const User = require('../models/UserModel');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({message: 'GET all users'});
});

router.get('/:id', (req, res) => {
    res.json({message: 'GET a single user'});
});

router.post('/', async (req, res) => {
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
});

router.delete('/:id', (req, res) => {
    res.json({message: 'DELETE a user'});
});

router.patch('/:id', (req, res) => {
    res.json({message: 'UPDATE a user'});
});

module.exports = router;