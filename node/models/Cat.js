const mongoose = require('mongoose');

const CatSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  location: {
    type: String
  },
  status: {
    type: String,
    required: true
  },
  bio: {
    type: String
  },
  name: {
    type: String,
    required: true
  },
  birthday: {
    type: Date,
    required: true
  },
  breed: {
    type: String,
  },
  sex: {
    type: String,
  },
  avatar: {
    type: String,
  },
  uuid: {
    type: String,
    require: true
  },
  totalViews: {
    type: Number,
    require: true,
    default: 0
  },
  created: {
    type: Date,
    default: Date.now
  },
  updated: {
    type: Date,
    default: Date.now
  },
  visible: {
    type: Boolean,
    require: true,
    default: true
  },
  deleted: {
    type: Boolean,
    require: true,
    default: false
  },
});

module.exports = mongoose.model('cat', CatSchema);