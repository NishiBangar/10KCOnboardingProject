const mongoose = require('mongoose');

//Schema - Blueprint - how the data should look like
const postSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  imagePath: {
    type: String,
    required: true
  }
});

//Model to work with the schema.
module.exports = mongoose.model('Post', postSchema);
