const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  
  id: {
    type: String,
    required: true,
    unique: true
  },
    title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  }
});

const Blog = mongoose.model('Blog', blogSchema);
module.exports = { Blog };