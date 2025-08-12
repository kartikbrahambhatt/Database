const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  phone: String,
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    default: null,
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true, 
  },
  picture: String,
});

module.exports = mongoose.model('User', UserSchema);
