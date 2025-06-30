const express = require('express');
const { query, validationResult } = require('express-validator');
const Transaction = require('../models/Transaction');
const auth = require('../middleware/auth');

const router = express.Router();

// Get dashboard summary
router.get('/', auth, [
  query('month').optional().isInt({ min: 1, max: 12 }),
  query('year').optional().isInt({ min: 2000, max: 2100 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { month, year } = req.query;
    const currentDate = new Date();
    const targetMonth = month ? parseInt(month) - 1 : currentDate.getMonth();
    const targetYear = year ? parseInt(year) : currentDate.getFullYear();

    // Date range for the month
    const startDate = new Date(targetYear, targetMonth, 1);
    const endDate = new Date(targetYear, targetMonth + 1, 0, 23, 59, 59);

    // Get transactions for the month
    const monthlyTransactions = await Transaction.find({
      userId: req.user._id,
      date: { $gte: startDate, $lte: endDate }
    });

    // Calculate totals
    const totalIncome = monthlyTransactions
      .filter(t => t.type === 'Income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = monthlyTransactions
      .filter(t => t.type === 'Expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpense;

    // Get recent transactions (last 5)
    const recentTransactions = await Transaction.find({ userId: req.user._id })
      .sort({ date: -1 })
      .limit(5);

    res.json({
      balance,
      totalIncome,
      totalExpense,
      recentTransactions
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;