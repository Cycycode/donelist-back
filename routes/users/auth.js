const router = require('express').Router()
// Libraries for the token
const { generateToken } = require('../../helpers/TokenHelper')

const User = require('../../models/User')

// Add a user in the db
router.route('/register')
  .post((req, res) => {
    // Get the params
    const { email, password, firstName, lastName, phone } = req.body
    // Gestion des erreurs
    if (!email || !password) return res.status(500).send('Email or password is missing')

    // Creation of the user
    const user = new User({
      email, password, firstName, lastName, phone
    })

    // Saving the user
    user.save((error, result) => {
      if (error) return res.status(500).send(error)
      const _user = result.toObject()
      // Deleting the password in the object
      delete _user.password
      // Token generation
      const payload = {
        id: _user._id
      }
      generateToken(payload, (error, token) => {
        if (error) return res.status(500).send('Error while generating token')
        // We send the user with the token
        return res.send({
          user: _user, token
        })
      })
    })
  })

// Creation of the login road
router.route('/login')
  .post((req, res) => {
    // Getting the sent params
    const { email, password } = req.body
    // Error managment
    if (!email || !password) return res.status(500).send('Email or password is missing')

    // Get the user by email
    User.findOne({ email: email }, (error, user) => {
      if (error || !user) return res.status(403).send('Invalid Credentials')
      // Comparation of the password
      user.comparePassword(password, (error, isMatch) => {
        if (error || !isMatch) return res.status(403).send('Invalid Credentials')
        
        user = user.toObject()
        
        delete user.password
        
        const payload = {
          id: user._id
        }
         // Token generation
        generateToken(payload, (error, token) => {
          if (error) return res.status(500).send('Error while generating token')
          return res.send({
            user, token
          })
        })
      })
    })
  })

module.exports = router