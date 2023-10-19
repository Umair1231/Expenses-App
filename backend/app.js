require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors');

const app = express()
const port = 5174

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true, })

const db = mongoose.connection

db.on('error', (error) => console.log(error))
db.once('open', () => console.log('Connected to Database'))

app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

const registerRoute = require('./routes/registerRoute.js')
const loginRoute = require('./routes/loginRoute.js')
const profileRoute = require('./routes/profileRoute.js')
const expensesRoute = require('./routes/expensesRoute.js')
const budgetRoute = require('./routes/budgetRoute.js')

app.use('/profile', profileRoute)
app.use('/register', registerRoute)
app.use('/login', loginRoute)
app.use('/expenses', expensesRoute)
app.use('/budget', budgetRoute)


app.listen(port, () => {
  console.log(`Expenses app listening on port ${port}`)
})