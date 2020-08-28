const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2')

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  aboutMe: {
    type: String,
    default: ''
  },
  contacts: {
    youtube: {
      type: String,
      default: ''
    },
    twitter: {
      type: String,
      default: ''
    },
    facebook: {
      type: String,
      default: ''
    },
    linkedin: {
      type: String,
      default: ''
    },
    instagram: {
      type: String,
      default: ''
    }
  },
  lookingForAJob: {
    type: Boolean,
    default: false
  },
  lookingForAJobDescription: {
    type: String,
    default: ''
  },
  date: {
    type: Date,
    default: Date.now
  }
});

ProfileSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('profile', ProfileSchema);
