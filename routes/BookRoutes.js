const express = require("express");
const {
  addBook,
  updateBook,
  deleteBook,
  listBooks,
} = require("../controllers/BookController");

const bookRouter = express.Router();

bookRouter.post("/books", addBook);
bookRouter.patch("/books/:bookId", updateBook);
bookRouter.delete("/books/:bookId", deleteBook);
bookRouter.get("/books", listBooks);

module.exports = { bookRouter };
