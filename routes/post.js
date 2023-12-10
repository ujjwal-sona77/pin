const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  description: {
    type: String
  },
  title: {
    type: String
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  },
  image: {
    type: String
  }
});

module.exports = mongoose.model('post', postSchema);

