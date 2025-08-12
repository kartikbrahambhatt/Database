const mongoose = require('mongoose');

const AddBlogSchema = new mongoose.Schema({
  image: {
    type: String,
    required: false,
  },
  blogName: {
    type: String,
    required: true
  }, 
  blogTitle: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('AddBlog', AddBlogSchema);
