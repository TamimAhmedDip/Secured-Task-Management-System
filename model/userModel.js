const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
    enum: ["regular", "admin"], // Enumerate the possible user types
    default: "regular", // Default to "User" if not provided
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
