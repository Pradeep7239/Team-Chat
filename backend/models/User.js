const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true },
  displayName: { type: String },
  avatarUrl: { type: String }
});

module.exports = mongoose.model('User', UserSchema);
