// Initialization of the app :
// console.log("hello world")

require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const loggerMiddleware = require('./middlewares/logger')

// Initialization of Express
const app = express()

app.use(cors())

app.use(loggerMiddleware)

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

const router = express.Router()

// Port
const port = process.env.PORT

// Connexion to MongoDB database 
const mongoDbConnectionString = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority`

// Lauch of the connexion with params
mongoose.connect(mongoDbConnectionString, null, error => {
  if (error) throw new Error(error)
})

// Recovery of the connexion
const db = mongoose.connection

// Listener of the connexion
db.once('open', () => {
  console.info('Connexion à la base : OK')
})

app.get('/', (req, res) => {
  res.send('Coucou !')
})

//? Router
app.use(router)

// Roads
app.use('/auth', require('./routes/users/auth'))
app.use('/me', require('./routes/users'))


// Launch of the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})