const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  username: { type: String },
  following: { type: [String], default: [] },
});

module.exports = mongoose.model('User', userSchema);