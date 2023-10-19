import React, { useEffect } from "react";
import { useState } from "react";
import expensesCategories from "../../backend/models/expensesCategories";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { useDispatch } from "react-redux";
import { addBudget, fetchBudget, checkBudget, notifReset, setStateMonth } from "./BudgetSlice";

const allMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

const getMonthName = () => {
  const date = new Date();
  const month = date.getMonth() + 1;
  return(allMonths[month - 1])
}




export default function BudgetView()
{
  const dispatch = useDispatch()
  const user = useSelector(state => state.login.user)
  const [ expensesCategory, setExpensesCategory] = useState('')
  const [ budget, setBudget ] = useState(0)
  const [ month, setMonth ] = useState()
  const budgetInfo = useSelector(state => state.budget.budgetInfo)
  const lowBudget = useSelector(state => state.budget.lowBudgetCategory)
  const notif = useSelector(state => state.budget.notifFlag)
  const [ currentMonth, setCurrentMonth ] = useState(getMonthName())
  const [notificationVisible, setNotificationVisible] = useState(false);

  useEffect(() => {
    dispatch(setStateMonth(currentMonth))
    dispatch(fetchBudget(user))
  },[currentMonth])

  useEffect(() => {
    dispatch(checkBudget(user))
  },[budgetInfo])

  useEffect(() => {
    if (notif) {
      setNotificationVisible(true);
      setTimeout(() => {
        setNotificationVisible(false);
        dispatch(notifReset()); // Reset notifFlag and lowBudget
      }, 5000); // Adjust the duration as needed
    }
  }, [notif]);



  const handleFormSubmit = e => {
    e.preventDefault();
    if(expensesCategory === '' || budget === 0 || month === '')
    {
      console.log("Bad Input")
      return
    }
    const formData = {
      user: user,
      category: expensesCategory,
      budget: budget,
      month: month,
    }
    try
    {
      dispatch(addBudget(formData)).unwrap()
    }
    catch(error)
    {
      console.log(error)
    }
  }


  return (
    <div className="w-2/5 p-4 bg-blue-200 rounded-md shadow-md">
      <form onSubmit={e => handleFormSubmit(e)}>
        <div className="flex flex-wrap w-full">
          <div className="mb-4">
            <label htmlFor="expensesCategory" className="block text-sm font-medium text-gray-600">
              Expense Category
            </label>
            <select
              id="expensesCategory"
              className="mt-1 p-2 w-fullborder border-gray-300 rounded-md focus:ring focus:ring-blue-200"
              value={expensesCategory}
              onChange={e => setExpensesCategory(e.target.value)}
            >
              <option value="">Select Category</option>
              {expensesCategories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4 ml-10">
            <label htmlFor="Month" className="block text-sm font-medium text-gray-600">
              Month
            </label>
            <select
              id="Month"
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
              value={month}
              onChange={e => setMonth(e.target.value)}
            >
              <option value="">Select Month</option>
              {allMonths.map(month => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="budget" className="block text-sm font-medium text-gray-600">
              Allocated Budget
            </label>
            <input
              type="number"
              id="budget"
              value={budget}
              onChange={e => setBudget(e.target.value)}
              min={0}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
            />
          </div>
        </div>
        <button 
          type="submit"
          className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Set Budget
        </button>
      </form>
      <div className="mb-4  justify-center">
          <label htmlFor="selectedMonth" className="block text-sm font-medium text-gray-600">
            Selected Month
          </label>
          <select
            id="selectedMonth"
            className="mt-1 p-2 w-1/2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
            value={currentMonth}
            onChange={e => setCurrentMonth(e.target.value)}
          >
            <option value="">{currentMonth}</option>
            {allMonths.map(month => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>
      <div className="flex flex-wrap font-semibold text-2x1">
        {budgetInfo.map(({ category, budgetAmount }) => (
          <div key={category} className="w-1/2 mt-4">
            <p>Category: {category}</p>
            <p>Budget: {budgetAmount}</p>
          </div>  
        ))}
      </div>
      {notificationVisible && (
        <div className="fixed top-0 right-0 w-64 mt-4 mr-4 p-4 bg-indigo-500 text-white rounded shadow-lg transform transition-transform">
          <div className="mb-2 text-lg">Low Budget Categories:</div>
          <ul>
            {lowBudget.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>  
  )
}