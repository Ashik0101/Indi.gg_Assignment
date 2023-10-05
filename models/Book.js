const mongoose = require("mongoose");

// Define the Book schema
const bookSchema = new mongoose.Schema({
  ISBN: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  publishedYear: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // References the User model
    required: true,
  },
});

// Create the Book model
const Book = mongoose.model("Book", bookSchema);

module.exports = { Book };
