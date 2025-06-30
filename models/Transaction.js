const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['Income', 'Expense']
  }
}, {
  timestamps: true
});

transactionSchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model('Transaction', transactionSchema);