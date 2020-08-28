const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReplySchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  to: {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'user'
    }
  },
  text: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('reply', ReplySchema);
