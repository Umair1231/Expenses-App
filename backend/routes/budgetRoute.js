const express = require('express')
const router = express.Router()
const User = require('../models/user.js')
const Expense = require('../models/expenses.js')
const Budget = require('../models/budget.js')
const cookieJwtAuth = require('../middleware/JwtAuth.js')


function getFirstDayOfMonth(monthName, year) {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  if (!monthNames.includes(monthName)) {
    throw new Error('Invalid month name');
  }

  const monthIndex = monthNames.indexOf(monthName);
  return new Date(year, monthIndex, 1);
}

router.post('/', async (req, res) => {
  try {
    const { user, category, budget, month } = req.body;

    const year = new Date().getFullYear();
    const monthDate = getFirstDayOfMonth(month, year);
    await Budget.findOneAndDelete({ userName: user, month: monthDate, category:category});

    const newBudget = new Budget({
      userName: user,
      category,
      month: monthDate,
      budgetAmount: budget,
    });

    await newBudget.save();
    res.status(201).json({ message: 'Budget added successfully' });
  } catch (error) {
    console.error('Error adding budget:', error);
    res.status(500).json({ message: 'Error adding budget' });
  }
});


router.get('/', async (req, res) => {
  try {
    const userName = req.query.user;
    const month = req.query.month;
    const year = new Date().getFullYear();
    const monthDate = getFirstDayOfMonth(month, year);
    const startOfMonth = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
    const endOfMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);
    const budgets = await Budget.find({
      userName,
      month: {
        $gte: startOfMonth,
        $lte: endOfMonth,
      },
    });
    res.status(200).json( budgets );
  } catch (error) {
    console.error('Error retrieving budgets:', error);
    res.status(500).json({ message: 'Error retrieving budgets' });
  }
});


router.get('/check', async (req, res) => {
  try {
    const userName = req.query.user;
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    const budgets = await Budget.find({
      userName,
      month: {
        $gte: startOfMonth,
        $lte: endOfMonth,
      },
      budgetAmount: { $lt: 100}
    });
    if(budgets)
    {
      res.status(200).json( budgets );
    }
    else
    {
      res.status(404).json({ message: "All good!" })
    }
  } catch (error) {
    console.error('Error retrieving budgets:', error);
    res.status(500).json({ message: 'Error retrieving budgets' });
  }
});





module.exports = router