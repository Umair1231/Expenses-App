const express = require('express')
const router = express.Router()
const User = require('../models/user.js')
const Expense = require('../models/expenses.js')
const Budget = require('../models/budget.js')
const cookieJwtAuth = require('../middleware/JwtAuth.js')



router.post('/', async(req,res) => {
  const { user, amount, category, date, description } = req.body;
  const budgetDate = new Date(date)
  try
  {
    const newExpense = new Expense({
      userName: user,
      amount: amount,
      category: category,
      date: budgetDate,
      description: description
    })
    
    const startOfMonth = new Date(budgetDate.getFullYear(), budgetDate.getMonth(), 1);
    const endOfMonth = new Date(budgetDate.getFullYear(), budgetDate.getMonth() + 1, 0);
    const budget = await Budget.findOne({
      userName: user,
      category: category,
      month: {
        $gte: startOfMonth,
        $lte: endOfMonth,
      },
    });
    

    if (!budget) {
      await newExpense.save()
      return res.status(200).json({ message: 'Budget not found for the specified category and month.' });
    }

    budget.budgetAmount -= amount;

    await budget.save();


    await newExpense.save()
    return res.status(201).json({message: "Expense added"})
  }
  catch(error)
  {
    console.error(error)
    return res.status(500).json({message: "Internal server error"})
  }
})


router.get('/', async (req, res) => {
  const user = req.query.user;
  try {
    const expenses = await Expense.find({ userName: user });
    const formattedExpenses = expenses.map(expense => ({
      ...expense.toObject(),
      _id: expense._id.toString(),
      date: formatDate(expense.date), // Format the date
    }));
    res.json(formattedExpenses);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});


router.get('/pie', async (req, res) => {
  try {
    const userName = req.query.user;
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const expenses = await Expense.find({
      userName: userName,
      date: { $gte: startOfMonth, $lte: endOfMonth }
    });

    const categoryTotals = {};
    let overallTotal = 0;

    expenses.forEach((expense) => {
      const { category, amount } = expense;
      if (!categoryTotals[category]) {
        categoryTotals[category] = 0;
      }
      categoryTotals[category] += amount;
      overallTotal += amount;
    });

    const categoryData = [];
    for (const category in categoryTotals) {
      const total = categoryTotals[category];
      const percentage = (total / overallTotal) * 100; // Calculate the percentage
      categoryData.push({ category, total, percentage });
    }
    res.status(200).json({
      categoryData,
      overallTotal,
    });
  } catch (error) {
    console.error('Error retrieving budgets:', error);
    res.status(500).json({ message: 'Error retrieving budgets' });
  }
});



router.get('/line', async (req, res) => {
  try {
    const userName = req.query.user;

    const expenses = await Expense.find({ userName: userName });

    const categoryTotals = {};

    expenses.forEach((expense) => {
      const { category, amount, date } = expense;
      const month = date.getMonth();

      if (!categoryTotals[category]) {
        categoryTotals[category] = {};
      }

      if (!categoryTotals[category][month]) {
        categoryTotals[category][month] = 0;
      }

      categoryTotals[category][month] += amount;
    });

    res.status(200).json(categoryTotals);
  } catch (error) {
    console.error('Error retrieving expenses:', error);
    res.status(500).json({ message: 'Error retrieving expenses' });
  }
});


router.patch('/', async (req, res) => {
  const { _id, amount, category, date, description } = req.body;
  console.log("Hello", date)
  try {

    const existingExpense = await Expense.findById(_id);

    if (!existingExpense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    const oldAmount = existingExpense.amount;

    const updatedExpense = await Expense.findByIdAndUpdate(
      _id,
      {
        amount,
        category,
        date,
        description,
      },
      { new: true }
    );

    if (!updatedExpense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    const budgetDate = new Date(existingExpense.date)
    const startOfMonth = new Date(budgetDate.getFullYear(), budgetDate.getMonth(), 1);
    const endOfMonth = new Date(budgetDate.getFullYear(), budgetDate.getMonth() + 1, 0);
    const budget = await Budget.findOne({
      userName: existingExpense.userName,
      category: existingExpense.category,
      month: {
        $gte: startOfMonth,
        $lte: endOfMonth,
      },
    });
    

    if (!budget) {
      return res.status(400).json({ message: 'Budget not found for the specified category and month.' });
    }

    budget.budgetAmount += oldAmount;

    await budget.save();
    const newBudgetDate = new Date(date)
    const newStartOfMonth = new Date(newBudgetDate.getFullYear(), newBudgetDate.getMonth(), 1);
    const newEndOfMonth = new Date(newBudgetDate.getFullYear(), newBudgetDate.getMonth() + 1, 0);
    const newBudget = await Budget.findOne({
      userName: existingExpense.userName,
      category: category,
      month: {
        $gte: newStartOfMonth,
        $lte: newEndOfMonth,
      },
    });
    

    if (!newBudget) {
      return res.status(400).json({ message: 'Budget not found for the specified category and month.' });
    }

    newBudget.budgetAmount -= amount;

    await newBudget.save();


    return res.status(200).json({ message: 'Expense updated'});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});


router.delete('/', async (req, res) => {
  const expenseId = req.query._id;

  try {
    const deletedExpense = await Expense.findByIdAndRemove(expenseId);
    const budgetDate = new Date(deletedExpense.date)
    const startOfMonth = new Date(budgetDate.getFullYear(), budgetDate.getMonth(), 1);
    const endOfMonth = new Date(budgetDate.getFullYear(), budgetDate.getMonth() + 1, 0);
    const budget = await Budget.findOne({
      userName: deletedExpense.userName,
      category: deletedExpense.category,
      month: {
        $gte: startOfMonth,
        $lte: endOfMonth,
      },
    });
    

    if (!budget) {
      return res.status(400).json({ message: 'Budget not found for the specified category and month.' });
    }

    budget.budgetAmount += deletedExpense.amount;

    await budget.save();

    if (!deletedExpense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    return res.status(200).json({ message: 'Expense deleted'});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Function to format the date
function formatDate(date) {
  const options = { year: "numeric", month: "numeric", day: "numeric" };
  return new Date(date).toLocaleDateString(undefined, options);
}



module.exports = router