const express = require('express');
const Role = require('../models/RoleModel');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({message: 'GET all roles'});
});

router.get('/:id', (req, res) => {
    res.json({message: 'GET a single role'});
});

router.post('/', async (req, res) => {
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
});


router.delete('/:id', (req, res) => {
    res.json({message: 'DELETE a role'});
});

router.patch('/:id', (req, res) => {
    res.json({message: 'UPDATE a role'});
});

module.exports = router;