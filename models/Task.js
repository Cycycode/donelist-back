const mongoose = require('mongoose')
const { Schema } = mongoose

const TaskSchema = Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  date_of_realisation: {
    type: Date,
    required:true
  }
}, { timestamps: true })

module.exports = mongoose.model('Task', TaskSchema)