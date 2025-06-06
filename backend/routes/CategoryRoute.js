const express = require('express');
const Category = require('../models/CategoryModel');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({message: 'GET all categories'});
});

router.get('/:id', (req, res) => {
    res.json({message: 'GET a single category'});
});

router.post('/', async (req, res) => {
   const {category_name} = req.body;

   try {
    const category = await Category.create({category_name});
    res.status(200).json(category);
   }
   catch (error) {
    res.status(400).json({error: error.message});
   }
});

router.delete('/:id', (req, res) => {
    res.json({message: 'DELETE a category'});
});

router.patch('/:id', (req, res) => {
    res.json({message: 'UPDATE a category'});
});

module.exports = router;