const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  replies: {
    type: []
  },
  text: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('comment', CommentSchema);
