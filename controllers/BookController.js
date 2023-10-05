const Joi = require("joi");
const { Book } = require("../models/Book");

// Joi schema for validating the request data
const bookSchema = Joi.object({
  ISBN: Joi.string().required(),
  title: Joi.string().required(),
  author: Joi.string().required(),
  publishedYear: Joi.number().required(),
  quantity: Joi.number().required(),
});

// Controller to add a new book to the database
const addBook = async (req, res) => {
  try {
    // Destructure and validate request data
    const { ISBN, title, author, publishedYear, quantity } = req.body;
    const { error } = bookSchema.validate({
      ISBN,
      title,
      author,
      publishedYear,
      quantity,
    });

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Create a new Book object
    const book = new Book(req.body);

    // Save the book to the database
    await book.save();

    res.status(201).json({ message: "Book Added Successfully", book });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

// Controller to update book details
const updateBook = async (req, res) => {
  try {
    const { bookId } = req.params;

    const { ISBN, title, author, publishedYear, quantity } = req.body;

    // Check if the book exists
    const book = await Book.findOne({ _id: bookId });

    if (!book) {
      return res.status(404).json({
        message: "No Book Found For This ID",
      });
    }

    //check if the book was added by the current user
    if (book.user != req.body.user) {
      return res.status(401).json({
        message: "Not Authorized To Update This Book Details",
      });
    }
    // Joi schema for validating the request data
    const bookUpdateSchema = Joi.object({
      ISBN: Joi.string(),
      title: Joi.string(),
      author: Joi.string(),
      publishedYear: Joi.number(),
      quantity: Joi.number(),
    });

    // Validate and update book data
    const { error } = bookUpdateSchema.validate({
      ISBN,
      title,
      author,
      publishedYear,
      quantity,
    });

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Update book fields that are provided in the request
    if (ISBN) book.ISBN = ISBN;
    if (title) book.title = title;
    if (author) book.author = author;
    if (publishedYear) book.publishedYear = publishedYear;
    if (quantity) book.quantity = quantity;

    // Save the updated book
    await book.save();

    res
      .status(200)
      .json({ message: "Book Details Updated Successfully", book });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

// Controller to delete a book by its ID
const deleteBook = async (req, res) => {
  try {
    const { bookId } = req.params;

    // Check if the book exists
    const book = await Book.findOne({ _id: bookId });

    if (!book) {
      return res.status(404).json({
        message: "No Book Found For This ID",
      });
    }

    // Check if the book was added by the current user
    if (book.user != req.body.user) {
      return res.status(401).json({
        message: "Not Authorized To Delete This Book",
      });
    }

    // Delete the book
    await Book.deleteOne({ _id: bookId });

    res.status(200).json({ message: "Book Deleted Successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

// Controller to list all available books
const listBooks = async (req, res) => {
  try {
    // Find all books in the database with a quantity greater than 0 (available books)
    const books = await Book.find({ quantity: { $gt: 0 } });

    if (!books || books.length === 0) {
      return res.status(404).json({
        message: "No available books found in the library.",
      });
    }

    res.status(200).json({ books });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

module.exports = {
  addBook,
  updateBook,
  deleteBook,
  listBooks,
};
