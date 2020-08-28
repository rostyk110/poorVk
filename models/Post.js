const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  profile: {
    type: Schema.Types.ObjectId
  },
  text: {
    type: String,
    required: true
  },
  likes: [
    {
      user: {
        type: Schema.Types.ObjectId
      }
    }
  ],
  comments: {
    type: []
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('post', PostSchema);
