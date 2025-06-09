const express = require('express');

const {
    getRoles,
    getRole,
    createRole,
    deleteRole,
    updateRole
} = require('../controllers/RoleController');

const router = express.Router();

router.get('/', getRoles);

router.get('/:id', getRole);

router.post('/', createRole);

router.delete('/:id', deleteRole);

router.patch('/:id', updateRole);

module.exports = router;