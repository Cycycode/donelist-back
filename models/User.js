// import libraries 
const mongoose = require('mongoose')
const { Schema } = mongoose

const bcrypt = require('bcryptjs')

// user schema declaration
const UserSchema = Schema({
  email: {
    type: String,
    required: true,
    match: /.+\@.+\..+/,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  phone: {
    type: String
  }
}, { timestamps: true })

// we want to crypt the password 

UserSchema.pre('save', function (next) {
  const user = this

  if (this.isModified('password') || this.isNew) {
    // "salt" generation
    bcrypt.genSalt(10, (error, salt) => {
      if (error) return next(error)
      // Crypting of the password
      bcrypt.hash(user.password, salt, (error, hash) => {
        if (error) return next(error)
        // remplacing the password by the hash
        user.password = hash
        // send the next
        return next()
      })
    })
  }
})

UserSchema.methods.comparePassword = function (password, callback) {
  bcrypt.compare(password, this.password, (error, isMatch) => {
    if (error) return callback(error)
    callback(null, isMatch)
  })
}

module.exports = mongoose.models.User || mongoose.model('User', UserSchema)