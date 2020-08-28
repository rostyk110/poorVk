const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DialogSchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  admins: {
    type: [Schema.Types.ObjectId]
  },
  participants: [{
    type: Schema.Types.ObjectId,
    ref: 'user'
  }],
  name: {
    type: String
  },
  avatar: {
    type: String,
    default: 'https://scontent.flwo1-1.fna.fbcdn.net/v/t31.0-8/14615739_863297793806213_3122742138544023761_o.png?_nc_cat=106&_nc_sid=09cbfe&_nc_ohc=7D2Uw08gSq8AX8GMN25&_nc_ht=scontent.flwo1-1.fna&oh=de0870eaf972c6909f39564562035f04&oe=5F608328'
  }
});

module.exports = mongoose.model('dialog', DialogSchema);
