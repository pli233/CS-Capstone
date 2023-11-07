const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  name: {
    type: String,
  },
  location: {
    type: String,
  },
  status: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
  },
  cats: [
    {
      name: {
        type: String,
        required: true,
      },
      birthday: {
        type: Date,
        required: true,
      },
      breed: {
        type: String,
      },
      sex: {
        type: Boolean,
      },
      avatar: {
        type: String,
      },
      uuid: {
        type: String,
        require: true,
      },
      created: {
        type: Date,
        default: Date.now,
      },
      updated: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  social: {
    youtube: {
      type: String,
    },
    twitter: {
      type: String,
    },
    facebook: {
      type: String,
    },
    linkedin: {
      type: String,
    },
    instagram: {
      type: String,
    },
  },
  date: {
    type: Date,
    default: Date.now,
  },
  updated: {
    type: Date,
    default: Date.now,
  },
  visible: {
    type: Boolean,
    require: true,
    default: true,
  },
  deleted: {
    type: Boolean,
    require: true,
    default: false,
  },
});

module.exports = mongoose.model('profile', ProfileSchema);
