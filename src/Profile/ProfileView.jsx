import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useDispatch } from "react-redux";
import { userEdit } from "../Login/LoginSlice";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { loginSuccess } from "../Login/LoginSlice";

export default function ProfilePage() {
  const user = useSelector(state => state.login.user)
  const [ userName, setUserName ] = useState()
  const [ email, setEmail ] = useState()
  const [ firstName, setFirstName ] = useState('')
  const [ lastName, setLastName ] = useState('')
  const dispatch = useDispatch()
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
          try
          {
            const response2 = await axios.get('http://localhost:5174/profile', {
              params: {
                user:response.data.userName
              },
            })
            setUserName(response2.data.user.userName)
            setEmail(response2.data.user.email)
            if(response2.data.user.firstName && response2.data.user.firstName !== response2.data.user.userName)
            {
              setFirstName(response2.data.user.firstName)
            }
            if(response2.data.user.lastName && response2.data.user.lastName !== response2.data.user.userName)
            {
              setLastName(response2.data.user.lastName)
            }
          }
          catch(error)
          {
            console.log(error)
          }
        }
      }
      else
      {
        navigate("/login")
      }
    }
    getAccess()
  }, [])



  const handleChanges = async(e) => {
    e.preventDefault()
    if(!userName || !email)
    {
      console.log("Bad input")
      return
    }
    const updatedUser = {
      oldUserName: user,
      userName: userName,
      email: email,
      firstName: firstName,
      lastName: lastName
    }
    try
    {
      const response = await axios.put('http://localhost:5174/profile', updatedUser)
      dispatch(userEdit(response.data.user.userName))
      alert("Changes successful")
    }
    catch(error)
    {
      console.log(error)
    }
  }


  return (
    <div className="bg-gray-200 min-h-screen flex flex-col items-center py-10">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-semibold">Profile</h1>
        {/* <div className="flex items-center justify-center">
          <img
            src="profile-icon.png" // Replace with your profile icon URL
            alt="Profile Icon"
            className="w-32 h-32 rounded-full bg-gray-300 object-cover mr-4"
          />
          <button className="text-indigo-600 hover:text-indigo-800">
            Change Photo
          </button>
        </div> */}
      </div>
      <form 
        className="w-5/6 flex flex-col items-start"
        onSubmit={e => handleChanges(e)}>
        <div className="mb-4 w-full">
          <label className="text-gray-600 font-semibold mb-2 block">
            First Name
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-indigo-500"
            placeholder= {firstName ? firstName : "First Name here"}
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
          />
        </div>
        <div className="mb-4 w-full">
          <label className="text-gray-600 font-semibold mb-2 block">
            Last Name
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-indigo-500"
            placeholder= {lastName ? lastName : "Last Name here"}
            value={lastName}
            onChange={e => setLastName(e.target.value)}
          />
        </div>
        <div className="mb-4 w-full">
          <label className="text-gray-600 font-semibold mb-2 block">
            User Name
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-indigo-500"
            placeholder={userName}
            value={userName}
            onChange={e => setUserName(e.target.value)}
          />
        </div>
        <div className="mb-4 w-full">
          <label className="text-gray-600 font-semibold mb-2 block">
            Email
          </label>
          <input
            type="email"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-indigo-500"
            placeholder={email}
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>  
        {/* Edit Profile button */}
        <div className="text-center">
          <button
            className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-6 rounded-lg font-semibold focus:outline-none"
            type="submit"
          >
            Edit Profile
          </button>
        </div>
      </form>
    </div>
  );
}
