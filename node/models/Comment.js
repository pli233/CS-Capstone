const mongoose = require('mongoose');

const CommnetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'post'
  },
  type: {
    type: String,
    default: "text"
  },
  location: {
    type: String
  },
  text: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
  },
  name: {
    type: String,
  },
  likes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user'
    },
  }],
  // root: {
  //     type: Boolean,
  //     required: true
  // },
  picture: {
    type: String
  },
  video: {
    type: String
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
  subcomments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user'
    },
    name: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: "text"
    },
    location: {
      type: String
    },
    text: {
      type: String,
      required: true
    },
    avatar: {
      type: String,
    },
    likes: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
      },
    }],
    reply: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'comment'
    },
    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user'
    },
    replyToName: {
      type: String,
    },
    root: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'comment'
    },
    picture: {
      type: String
    },
    video: {
      type: String
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
  }],
});

module.exports = mongoose.model('comment', CommnetSchema);