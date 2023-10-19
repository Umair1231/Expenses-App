const express = require('express')
const router = express.Router()
const User = require('../models/user.js')
const cookieJwtAuth = require('../middleware/JwtAuth.js')

router.get('/', async(req,res) => {
  const userName = req.query.user

  try
  {
    const existingUser = await User.findOne({userName})
    if(!existingUser)
    {
      return res.status(400).json({message: "User Does not exist"})
    }
    const userWithoutPassword = {
      _id: existingUser.userID,
      userName: existingUser.userName,
      email: existingUser.email,
      firstName: existingUser.firstName,
      lastName: existingUser.lastName
    }
    return res.status(200).json({ user: userWithoutPassword });
  }
  catch(error)
  {
    console.error(error)
    return res.status(500).json({message: "Internal server error"})
  }
})


router.put('/', async(req,res) => {
  const { oldUserName, userName, email, firstName, lastName } = req.body

  try
  {
    if(userName !== oldUserName)
    {
      const existingUser = await User.findOne({$or: [{userName}, {email}]})
      if(existingUser && existingUser.userName !== oldUserName)
      {
        return res.status(400).json({message: "Username or Email already exists"})
      }
    }
    
    const user = await User.findOne({userName: oldUserName})

    if(!user)
    {
      return res.status(404).json({message: "User not found"});
    }

    user.userName = userName
    user.email = email
    user.lastName = lastName
    user.firstName = firstName

    await user.save();
    return res.status(201).json({user: user})
  }
  catch(error)
  {
    console.error(error)
    return res.status(500).json({message: "Internal server error"})
  }
})


module.exports = router