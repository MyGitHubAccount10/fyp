const express = require('express');

const {
    getCategories,
    getCategory,
    createCategory,
    deleteCategory,
    updateCategory
} = require('../controllers/CategoryController');

const router = express.Router();

router.get('/', getCategories);

router.get('/:id', getCategory);

router.post('/', createCategory);

router.delete('/:id', deleteCategory);

router.patch('/:id', updateCategory);

module.exports = router;