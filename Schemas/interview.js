const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
  Name: { type: String, required: true },
  CompanyName: { type: String, required: true },
  Description: { type: String, required: true },
  Position: { type: String, required: true },
  CompanyURL: { type: String, required: true },
  Image: String 
});

module.exports = mongoose.model('Interview', interviewSchema);