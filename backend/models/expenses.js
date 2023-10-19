const mongoose = require('mongoose');
// const expenseCategories = require('./expensesCategories.js');

const expenseSchema = new mongoose.Schema({
  amount: {
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
  date: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  // Add a reference to the User schema for the userName field
  userName: {
    type: String,
    ref: 'User',
  },
});

module.exports = mongoose.model('Expense', expenseSchema);
