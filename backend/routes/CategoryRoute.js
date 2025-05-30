const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({message: 'GET all categories'});
});

router.get('/:id', (req, res) => {
    res.json({message: 'GET a single category'});
});

router.post('/', async (req, res) => {
   res.json({message: 'POST a new category'});
});

router.delete('/:id', (req, res) => {
    res.json({message: 'DELETE a category'});
});

router.patch('/:id', (req, res) => {
    res.json({message: 'UPDATE a category'});
});

module.exports = router;