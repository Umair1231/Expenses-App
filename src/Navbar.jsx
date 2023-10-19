import React from "react";
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from "react-redux/es/hooks/useSelector";
import { loginFail } from "./Login/LoginSlice";
import { useDispatch } from "react-redux";
import axios from "axios";

export default function Navbar() {
  const isLoggedIn = useSelector(state => state.login.isLoggedIn)
  const user = useSelector(state => state.login.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const handleSignOut = async () => {
    const response = await axios.post('http://localhost:5174/login/logout', user, {
        withCredentials: true,
      })
    dispatch(loginFail())
    navigate("/")
  }


  return (
    <div className="bg-indigo-700 p-4 w-full flex justify-between items-center">
      <ul className="flex justify-center items-center">
        <li className="mr-4">
          <NavLink
            to={"/profile"}
            className={
              location.pathname === "/profile"
                ? "text-yellow-400"
                : "text-white hover:text-gray-300"
            }
          >
            Profile
          </NavLink>
        </li>
        <li className="mr-4">
          <NavLink
            to={"/expenses"}
            className={
              location.pathname === "/expenses"
                ? "text-yellow-400"
                : "text-white hover:text-gray-300"
            }
          >
            Expenses
          </NavLink>
        </li>
      </ul>
      <ul className="flex justify-end items-center">
        {isLoggedIn ? (
          <>
            <li className="mr-4 text-white">{user}</li>
            <li>
              <button
                className="text-white hover:text-gray-300 border border-white px-3 py-1 rounded"
                onClick={handleSignOut}>
                  Sign Out
                </button>
            </li>
          </>
        ) : (
          <>
            <li className="mr-4">
              <NavLink
                to={"login"}
                className={
                  location.pathname === "/login"
                    ? "text-yellow-400"
                    : "text-white hover:text-gray-300"
                }
              >
                Login
              </NavLink>
            </li>
            <li>
              <NavLink
                to={"register"}
                className={
                  location.pathname === "/register"
                    ? "text-yellow-400"
                    : "text-white hover:text-gray-300"
                }
              >
                Sign up
              </NavLink>
            </li>
          </>
        )}
      </ul>
    </div>
  );
}
