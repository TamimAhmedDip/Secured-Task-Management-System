const mongoose = require("mongoose");

// Define the schema
const taskSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  dueDate: {
    type: Date,
  },
  priority: {
    type: Number,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  categories: [
    {
      type: String,
    },
  ],
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

// Create a Mongoose model
module.exports = mongoose.model("Task", taskSchema);
