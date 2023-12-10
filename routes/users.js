const mongoose = require('mongoose');
const plm = require("passport-local-mongoose")

mongoose.connect("mongodb://127.0.0.1:27017/pin")

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  name: String,
  password: {
    type: String,
    required: true
  },
  email: String,
  post: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "post"
  }],
  profileImage: String,
  boards: {
    type: Array,
    default: []
  }
});

userSchema.plugin(plm);
const User = mongoose.model('user', userSchema);
module.exports = User;
