const express = require('express');
const router = express.Router();
const { getAdminSummary, getManagerSummary } = require('../controllers/analyticsController');
const auth = require('../middleware/auth');
const checkRole = require('../middleware/roleCheck');
router.get('/admin', auth, checkRole(['Admin', 'Analyst']), getAdminSummary);

router.get('/manager', auth, getManagerSummary);

module.exports = router;
