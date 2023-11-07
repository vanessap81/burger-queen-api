const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      allowNull: false,
      unique: true,
    },
    name: {
      type: String,
      allowNull: false,
    },
    password: {
      type: String,
      allowNull: false,
    },
    role: {
      type: String,
      allowNull: false,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('users', userSchema);
