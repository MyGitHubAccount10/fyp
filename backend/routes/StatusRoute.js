const express = require('express');
const Status = require('../models/StatusModel');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({message: 'GET all statuses'});
});

router.get('/:id', (req, res) => {
    res.json({message: 'GET a single status'});
});

router.post('/', async (req, res) => {
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
});

router.delete('/:id', (req, res) => {
    res.json({message: 'DELETE a status'});
});

router.patch('/:id', (req, res) => {
    res.json({message: 'UPDATE a status'});
});

module.exports = router;