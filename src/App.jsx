import { useState } from 'react'
import './App.css'
import LoginView from './Login/LoginView'
import RegistrationView from './Registration/RegistrationView'
import Navbar from './Navbar'
import { Routes, Route } from 'react-router-dom'
import HomePage from './HomePage'
import ProfileView from './Profile/ProfileView'
import ExpensesView from './Expenses/ExpensesView'



function App() {
  return(
    <div>
      <Navbar />
      <Routes>
        <Route path='/' element={<LoginView />} />
        <Route path='login' element={<LoginView />} />
        <Route path='register' element={<RegistrationView />} />
        <Route path='profile' element={<ProfileView />} />
        <Route path='expenses' element={<ExpensesView />} />
      </Routes>
    </div>

  )
}

export default App
