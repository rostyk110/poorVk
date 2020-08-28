const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  dialog: {
    type: Schema.Types.ObjectId,
    ref: 'dialog'
  },
  text: {
    type: String,
    required: true
  },
  isRead: {
    type: Array
  },
  isEdited: {
    type: Boolean,
    default: false
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('message', MessageSchema);
