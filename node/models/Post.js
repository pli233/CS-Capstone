const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  cat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'cat'
  },
  profile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'profile'
  },
  location: {
    type: String
  },
  type: {
    type: String,
    default: "post"
  },
  name: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
  },
  cover: {
    type: String
  },
  likes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user'
    },
  }],
  // views: [{
  //     user: {
  //         type: mongoose.Schema.Types.ObjectId,
  //         ref: 'user'
  //     },
  // }],
  views: {
    type: Number,
    default: 0
  },
  pictures: [{
    picture: {
      type: String
    },
  }],
  video: {
    type: String
  },
  uuid: {
    type: String,
    required: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  draft: {
    type: Boolean,
    default: false
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

module.exports = mongoose.model('post', PostSchema);