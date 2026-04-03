const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const checkRole = require('../middleware/roleCheck');
const { getDashboardSummary } = require('../controllers/dashboardController');
router.get(
  '/summary',
  auth,
  checkRole(['Admin', 'Analyst', 'Viewer']),
  getDashboardSummary
);

module.exports = router;
