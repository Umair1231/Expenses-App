import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Table from "../components/Table";
import { Card, Typography } from "@material-tailwind/react";
import expensesCategories from "../../backend/models/expensesCategories";
import { useSelector } from "react-redux/es/hooks/useSelector";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addExpense, expensesGet, fetchExpense, updateExpense } from "./ExpensesSlice";
import BudgetView from "../Budget/BudgetView";
import PieChart from "../components/PieChart";
import LineChart from "../components/LineChart";
import { fetchBudget } from "../Budget/BudgetSlice";
import Cookies from "js-cookie";
import { loginSuccess } from "../Login/LoginSlice";

export default function ExpensesView() {
  const [ expensesAmount, setExpensesAmount ] = useState(0)
  const [ expensesCategory, setExpensesCategory ] = useState('')
  const [ expensesDate, setExpensesDate] = useState()
  const [ expensesDescription, setExpensesDescription] = useState()
  const [ editMode, setEditMode ] = useState(false)
  const [ editRow, setEditRow ] = useState()
  const user = useSelector(state => state.login.user)
  const dispatch = useDispatch()
  const tableInfo = useSelector(state => state.expenses.tableInfo)
  const navigate = useNavigate()

  useEffect(() => {
    const getAccess = async () => {
      const accessToken = Cookies.get("AccessToken")
      if(accessToken)
      {
        const response = await axios.get('http://localhost:5174/login/getAccessToken',{
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        if(response.status === 200)
        {
          dispatch(loginSuccess(response.data.userName))
        }
      }
      else
      {
        navigate("/login")
      }
    }
    getAccess()
  }, [])

  useEffect(() => {
    fetchExpenses()
  },[])



  const fetchExpenses = async () => {
    try
    {
      dispatch(fetchExpense(user))
    }
    catch(error)
    {
      console.log(error)
    }
  }


  const handleFormSubmit =  async e => {
    e.preventDefault()
    if(!expensesDescription)
    {
      setExpensesDescription(expensesCategory)
    }

    if(expensesAmount === 0)
    {
      alert("Expenses are none, expense not added")
      return
    }

    const date = new Date();
    
    if(expensesDate > date)
    {
      alert("Expense cannot be in the future")
      return
    }
    const rawDate = new Date(expensesDate)
    const formattedDate = rawDate.toLocaleDateString()
    if(!editMode)
    {
      const formData = {
        user: user,
        amount: expensesAmount,
        category: expensesCategory,
        date: formattedDate,
        description: expensesDescription
      }
  
      try
      {
        dispatch(addExpense(formData)).unwrap()
      }
      catch(error)
      {
        console.log(error)
      }
    }
    else
    {
      const formData = {
        user: user,
        amount: expensesAmount,
        category: expensesCategory,
        date: expensesDate,
        description: expensesDescription,
        _id: editRow._id
      }
      try
      {
        dispatch(updateExpense(formData)).unwrap()
        setEditRow(null)
        setEditMode(false)
      }
      catch(error)
      {
        console.log(error)
      }
    }
  } 



  const handleEditClick = row => {
    const editedItem = tableInfo.find((item) => item._id === row._id);
    setExpensesAmount(editedItem.amount)
    setExpensesCategory(editedItem.category),
    setExpensesDescription(editedItem.description)
    setEditRow(editedItem)
    setEditMode(true)
  }

  const handleDeleteClick = async _id => {
    try
    {
      const response = await axios.delete('http://localhost:5174/expenses', {
        params: {
          _id: _id
        },
      })
      alert(response.data.message)
      fetchExpenses()
      dispatch(fetchBudget(user))
    }
    catch(error)
    {
      console.log(error)
    }
  }
 


  
  return (
    <div className="bg-gray-200 min-h-screen flex flex-col">
      <div className="text-center mb-8">
        <h1 className="text-5xl mb-4 mt-4 font-semibold">Expenses Dashboard</h1>
        <div className="container text-left mx-auto mt-8">
          <div className="flex justify-between">
            <div className="w-1/2 p-4 bg-blue-200 rounded-md shadow-md mb-8">
              <div>
                <LineChart/>
              </div>
            </div>
            <div className="w-2/5 p-4 bg-blue-200 rounded-md shadow-md mb-8">
              <div className="h-full">
                <PieChart />
              </div>
            </div>
          </div>
          <div className="flex justify-between">
            <div className="w-1/2 p-4 bg-blue-200 rounded-md shadow-md">
              <h2 className="text-2xl font-semibold mb-4">Add Expense</h2>
              <form onSubmit={e => handleFormSubmit(e)}>
                  <div className="mb-4">
                    <label htmlFor="expensesAmount" className="block text-sm font-medium text-gray-600">
                      Expense Amount
                    </label>
                    <input
                      type="number"
                      id="expensesAmount"
                      value={expensesAmount}
                      onChange={e => setExpensesAmount(e.target.value)}
                      min={0}
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="expensesCategory" className="block text-sm font-medium text-gray-600">
                      Expense Category
                    </label>
                    <select
                      id="expensesCategory"
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
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
                  <div className="mb-4">
                    <label htmlFor="expensesDate" className="block text-sm font-medium text-gray-600">
                      Date
                    </label>
                    <input
                      type="date"
                      id="expensesDate"
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
                      value={expensesDate}
                      onChange={e => setExpensesDate(e.target.value)}  
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="expensesDescription" className="block text-sm font-medium text-gray-600">
                      Description
                    </label>
                    <input
                      type="text"
                      id="expensesDescription"
                      value={expensesDescription}
                      placeholder="Brief Description"
                      onChange={e => setExpensesDescription(e.target.value)}
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
                    />
                  </div>
                  <button 
                    type="submit"
                    className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                    {editMode ? "Edit" : "Add"}
                  </button>
                </form>
            </div>
            <BudgetView />

          </div>

          
          <div className="mt-8">
            <Card className="bg-blue-200 w-full rounded-md shadow-md">
              <h2 className="text-2xl font-semibold m-4">Expenses Table</h2>
              <div className="w-4/5 h-4/5 my-10 ml-20">
                <Table onEditClick={handleEditClick} onDeleteClick={handleDeleteClick} />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

