const express = require('express')
const router = express.Router()
const User = require('../models/user.js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
require('dotenv').config()
const cookieParser = require('cookie-parser');
app = express();
app.use(express.json());
app.use(cookieParser());


const secretKey = process.env.ACCESS_TOKEN_SECRET;

router.post('/', async(req,res) => {
  const { userName, password } = req.body;

  try
  {
    const existingUser = await User.findOne({userName})
    if(!existingUser)
    {
      return res.status(400).json({message: "User Does not exist"})
    }
    bcrypt.compare(password, existingUser.password, (bcryptError,isMatch) => {
      if(bcryptError) {
        console.log(bcryptError)
        return res.status(500).json({message:"internal server error"})
      }
      if(!isMatch)
      {
        return res.status(401).json({message: "Invalid username or password"})
      }
      else
      {
        const accessToken = jwt.sign({ userName }, secretKey, {
          expiresIn: 3600,
        });
        res.cookie('AccessToken', accessToken, {
          // httpOnly: true, // Prevent client-side JavaScript access
          maxAge: 3600000, // 1 hour in milliseconds
        });
        return res.status(201).json({message: "Login succesful"})
      }
    })
  }
  catch(error)
  {
    console.error(error)
    return res.status(500).json({message: "Internal server error"})
  }
})


router.post('/logout', async(req,res) => {
  const { user } = req.body;
  try
  {
    const existingUser = await User.findOne({user})
    if(!existingUser)
    {
      return res.status(400).json({message: "User Does not exist"})
    }
    res.clearCookie('AccessToken');
    return res.status(201).json({message: "Logout succesful"})
  }
  catch(error)
  {
    console.error(error)
    return res.status(500).json({message: "Internal server error"})
  }
})


router.get('/getAccessToken', (req, res) => {
  const authHeader = req.headers['authorization'];
  const accessToken = authHeader && authHeader.split(' ')[1];
  if (!accessToken) {
    return res.status(401).json({ message: 'Access token not found' });
  }

  // Verify the access token
  jwt.verify(accessToken, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid access token' });
    }
    const { userName } = decoded;
    console.log(userName);
    res.status(200).json({ userName });
  });
});

module.exports = router