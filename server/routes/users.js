const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const checkRole = require('../middleware/roleCheck');
const {
  createUser,
  updateUserStatus,
  updateUser,
  getAdminDirectory,
} = require('../controllers/userController');

router.post('/', auth, checkRole(['Admin']), createUser);

router.patch('/:id/status', auth, checkRole(['Admin']), updateUserStatus);

router.patch('/:id', auth, checkRole(['Admin']), updateUser);

router.get('/', auth, checkRole(['Admin']), getAdminDirectory);

module.exports = router;
