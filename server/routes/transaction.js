const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const checkRole = require('../middleware/roleCheck');
const {
  addTransaction,
  getTransactions,
  getDashboardSummary,
  updateTransaction,
  deleteTransaction
} = require('../controllers/transactionController');


router.get('/summary', auth, checkRole(['Admin', 'Analyst', 'Viewer']), getDashboardSummary);
router.get('/', auth, checkRole(['Admin', 'Analyst']), getTransactions);
router.post('/', auth, checkRole(['Admin', 'Analyst']), addTransaction);
router.put('/:id', auth, checkRole(['Admin', 'Analyst']), updateTransaction);
router.delete('/:id', auth, checkRole(['Admin']), deleteTransaction);


module.exports = router;
