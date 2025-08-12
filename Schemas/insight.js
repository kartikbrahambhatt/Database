const mongoose = require('mongoose');

const insightSchema = new mongoose.Schema({
  AuthorName: { type: String, required: true },
  Title: { type: String, required: true },
  Heading: { type: String, required: true },
  Description: { type: String, required: true },
  Image: String,
Category: { type: String, required: false },
});

module.exports = mongoose.model('Insight', insightSchema);