const mongoose = require('mongoose');
const Category = require('../models/CategoryModel');

// Get all categories
const getCategories = async (req, res) => {
    const categories = await Category.find({}).sort({createdAt: -1});

    res.status(200).json(categories);
}

// Get a single category
const getCategory = async (req, res) => {
    const {id} = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'Invalid category ID'});
    }

    const category = await Category.findById(id);

    if (!category) {
        return res.status(404).json({error: 'Category not found'});
    }
    res.status(200).json(category);
}

// Create a new category
const createCategory = async (req, res) => {
    const {category_name} = req.body;

    try {
        const category = await Category.create({category_name});
        res.status(200).json(category);
    }
    catch (error) {
        res.status(400).json({error: error.message});
    }
}

// Delete a category
const deleteCategory = async (req, res) => {
    const {id} = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'Invalid category ID'});
    }

    const category = await Category.findByIdAndDelete({_id: id});

    if (!category) {
        return res.status(404).json({error: 'Category not found'});
    }
    res.status(200).json(category);
}

// Update a category
const updateCategory = async (req, res) => {
    const {id} = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'Invalid category ID'});
    }

    const category = await Category.findOneAndUpdate({_id: id}, {
        ...req.body
    });

    if (!category) {
        return res.status(404).json({error: 'Category not found'});
    }

    res.status(200).json(category);
}

module.exports = {
    getCategories,
    getCategory,
    createCategory,
    deleteCategory,
    updateCategory
};