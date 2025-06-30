const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-passwordHash');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user preferences
router.patch('/preferences', auth, [
  body('darkMode').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      req.body,
      { new: true }
    ).select('-passwordHash');

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;