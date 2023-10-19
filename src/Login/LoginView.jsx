import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { loginSuccess, loginFail } from "./LoginSlice";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function LoginView() {
  const [ userName, setUserName ] = useState('');
  const [ password, setPassword ] = useState('');
  const navigate = useNavigate()

  const dispatch = useDispatch()

  const handleLogin = async (e) =>
  {
    e.preventDefault();
    if(userName === '' || password === '')
    {
      console.log("Bad Entry")
    }

    const formData = {
      userName: userName,
      password: password
    }

    try
    {
      const response = await axios.post('http://localhost:5174/login', formData, {
        withCredentials: true,
      })
      dispatch(loginSuccess(userName))
      navigate("/expenses")
    }
    catch(error)
    {
      if(error.response)
      {
        alert(error.response.data.message)
        dispatch(loginFail())
      }
      else
      {
        console.log(error)
        dispatch(loginFail())
      }
    }
  }


  return (
    <div className="bg-indigo-900 flex justify-center items-center h-screen px-10">
      <form 
        onSubmit={handleLogin}
        className="bg-white shadow-md rounded px-10 pt-6 pb-8 mb-4 w-1/3 h-96">
        <h2 className="text-2xl text-gray-800 font-bold mb-4">Login</h2>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Username
          </label>
          <input
            className="bg-gray-200 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-indigo-500"
            type="text"
            placeholder="Username"
            value={userName}
            onChange={e => setUserName(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Password
          </label>
          <input
            className="bg-gray-200 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-indigo-500 focus:ring-0"
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>
        <p className="text-sm text-indigo-500 hover:text-indigo-800 mb-6">
          Forgot Password?
        </p>
        <p className="text-sm text-indigo-500 hover:text-indigo-800 mb-6">
          <NavLink to={'/register'}>Don't have an account? Sign up.</NavLink>
        </p>
        <button
          className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
