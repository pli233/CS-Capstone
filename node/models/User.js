const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    require: true
  },
  email: {
    type: String,
    require: true,
    unique: true
  },
  mobile: {
    type: String,
  },
  password: {
    type: String,
    require: true
  },
  avatar: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now
  },
  updated: {
    type: Date,
    default: Date.now
  },
  uuid: {
    type: String,
    require: true
  },
  visible: {
    type: Boolean,
    require: true,
    default: true
  },
  active: {
    type: Boolean,
    require: true,
    default: true
  },
});

module.exports = User = mongoose.model('user', UserSchema)