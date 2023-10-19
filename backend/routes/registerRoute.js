const express = require('express')
const router = express.Router()
const User = require('../models/user.js')
const bcrypt = require('bcrypt')


router.post('/', async(req,res) => {
  const { userName, email, password } = req.body;

  try
  {
    const existingUser = await User.findOne({$or: [{userName}, {email}]})
    if(existingUser)
    {
      return res.status(400).json({message: "Username or Email already exists"})
    }
    hashedPassword = await bcrypt.hash(password,10)
    
    const newUser = new User({
      userName,
      email,
      password: hashedPassword,
      firstName: userName,
      lastName: userName
    })

    await newUser.save();
    return res.status(201).json({message: "Registration Successful"})
  }
  catch(error)
  {
    console.error(error)
    return res.status(500).json({message: "Internal server error"})
  }
})


module.exports = router