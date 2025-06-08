const express = require('express');

const {
    getStatuses,
    getStatus,
    createStatus,
    deleteStatus,
    updateStatus
} = require('../controllers/StatusController');

const router = express.Router();

router.get('/', getStatuses);

router.get('/:id', getStatus);

router.post('/', createStatus);

router.delete('/:id', deleteStatus);

router.patch('/:id', updateStatus);

module.exports = router;