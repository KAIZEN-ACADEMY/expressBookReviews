const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register route (still to be implemented)
public_users.post("/register", (req, res) => {
    const { username, password } = req.body;
  
    // Check if username and password are provided
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
  
    // Check if username already exists
    const userExists = users.some(user => user.username === username);
    if (userExists) {
      return res.status(409).json({ message: "Username already exists" });
    }
  
    // Add new user
    users.push({ username, password });
    return res.status(201).json({ message: "User registered successfully" });
  });
  
// ✅ Get the book list available in the shop
public_users.get('/', function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
  
    if (book) {
      return res.status(200).send(JSON.stringify(book, null, 4));
    } else {
      return res.status(404).json({ message: "Book not found for the given ISBN" });
    }
  });
  

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const matchingBooks = [];
  
    for (let isbn in books) {
      if (books[isbn].author.toLowerCase() === author.toLowerCase()) {
        matchingBooks.push({ isbn, ...books[isbn] });
      }
    }
  
    if (matchingBooks.length > 0) {
      return res.status(200).send(JSON.stringify(matchingBooks, null, 4));
    } else {
      return res.status(404).json({ message: "No books found for the given author" });
    }
  });
  

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    const matchingBooks = [];
  
    for (let isbn in books) {
      if (books[isbn].title.toLowerCase() === title.toLowerCase()) {
        matchingBooks.push({ isbn, ...books[isbn] });
      }
    }
  
    if (matchingBooks.length > 0) {
      return res.status(200).send(JSON.stringify(matchingBooks, null, 4));
    } else {
      return res.status(404).json({ message: "No books found with the given title" });
    }
  });
  

// Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
  
    if (book) {
      return res.status(200).send(JSON.stringify(book.reviews, null, 4));
    } else {
      return res.status(404).json({ message: "Book not found for the given ISBN" });
    }
  });
  

module.exports.general = public_users;
