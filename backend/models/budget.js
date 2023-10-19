

const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  userName: {
    type: String,
    ref: 'User',
  },
  budgetAmount: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Food',
      'Transportation',
      'Entertainment',
      'Utilities',
      'Rent',
      'Other',
    ],
  },
  month: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model('Budget', budgetSchema);


