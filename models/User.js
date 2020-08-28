const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const UserSchema = new mongoose.Schema({
  socketId: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  fullName: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  },
  status: {
    type: String,
    default: ''
  },
  following: {
    type: Array,
    default: []
  },
  followers: {
    type: Array,
    default: []
  },
  online: {
    type: Boolean,
    default: false
  },
  date: {
    type: Date,
    default: Date.now
  }
})

UserSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('user', UserSchema)
