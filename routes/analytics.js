const express = require('express');
const { query, validationResult } = require('express-validator');
const Transaction = require('../models/Transaction');
const auth = require('../middleware/auth');

const router = express.Router();

// Get category summary for charts
router.get('/category-summary', auth, [
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

    const categorySummary = await Transaction.aggregate([
      {
        $match: {
          userId: req.user._id,
          date: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' }
        }
      },
      {
        $project: {
          _id: 0,
          category: '$_id',
          total: 1
        }
      },
      {
        $sort: { total: -1 }
      }
    ]);

    res.json(categorySummary);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;