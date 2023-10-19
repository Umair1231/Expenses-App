import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import LoginSlice from './Login/LoginSlice.js'
import loginReducer from './Login/LoginSlice.js'
import expensesReducer from './Expenses/ExpensesSlice.js'
import budgetReducer from './Budget/BudgetSlice.js'

const store = configureStore({
  reducer: {
    login: loginReducer,
    expenses: expensesReducer,
    budget: budgetReducer
  },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>,
)
