const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Transaction = require('../models/Transaction');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all transactions with filtering and pagination
router.get('/', auth, [
  query('startDate').optional().isISO8601(),
  query('endDate').optional().isISO8601(),
  query('category').optional().trim().escape(),
  query('description').optional().trim().escape(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { startDate, endDate, category, description, page = 1, limit = 10 } = req.query;
    const filter = { userId: req.user._id };

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    if (category) filter.category = new RegExp(category, 'i');
    if (description) filter.description = new RegExp(description, 'i');

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Transaction.countDocuments(filter);
    const transactions = await Transaction.find(filter)
      .sort({ date: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      transactions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Add new transaction
router.post('/', auth, [
  body('date').isISO8601(),
  body('description').isLength({ min: 1, max: 200 }).trim().escape(),
  body('amount').isFloat({ min: 0.01 }),
  body('category').isLength({ min: 1 }).trim().escape(),
  body('type').isIn(['Income', 'Expense'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const transaction = new Transaction({
      ...req.body,
      userId: req.user._id
    });

    await transaction.save();
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update transaction
router.put('/:id', auth, [
  body('date').optional().isISO8601(),
  body('description').optional().isLength({ min: 1, max: 200 }).trim().escape(),
  body('amount').optional().isFloat({ min: 0.01 }),
  body('category').optional().isLength({ min: 1 }).trim().escape(),
  body('type').optional().isIn(['Income', 'Expense'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete transaction
router.delete('/:id', auth, async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Export transactions as CSV
router.get('/export/csv', auth, [
  query('startDate').optional().isISO8601(),
  query('endDate').optional().isISO8601(),
  query('category').optional().trim().escape()
], async (req, res) => {
  try {
    const { Parser } = require('json2csv');
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { startDate, endDate, category } = req.query;
    const filter = { userId: req.user._id };

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    if (category) filter.category = new RegExp(category, 'i');

    const transactions = await Transaction.find(filter).sort({ date: -1 });
    const fields = ['date', 'description', 'amount', 'category', 'type'];
    const parser = new Parser({ fields });
    const csv = parser.parse(transactions);

    res.header('Content-Type', 'text/csv');
    res.attachment('transactions.csv');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;