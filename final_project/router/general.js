const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// ✅ Task 10: Get book list using async/await
public_users.get('/', async function (req, res) {
  try {
    const fetchBooks = () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(books);
        }, 100);
      });
    };

    const bookList = await fetchBooks();
    return res.status(200).send(JSON.stringify(bookList, null, 4));
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch books", error: error.message });
  }
});

// ✅ Task 11: Get book details by ISBN using async/await
public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    const fetchBookByISBN = (isbn) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const book = books[isbn];
          if (book) {
            resolve(book);
          } else {
            reject(new Error("Book not found for the given ISBN"));
          }
        }, 100);
      });
    };

    const isbn = req.params.isbn;
    const book = await fetchBookByISBN(isbn);
    return res.status(200).send(JSON.stringify(book, null, 4));
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

// ✅ Task 12: Get book details by Author using async/await
public_users.get('/author/:author', async function (req, res) {
  try {
    const fetchBooksByAuthor = (author) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const matchingBooks = [];
          for (let isbn in books) {
            if (books[isbn].author.toLowerCase() === author.toLowerCase()) {
              matchingBooks.push({ isbn, ...books[isbn] });
            }
          }
          if (matchingBooks.length > 0) {
            resolve(matchingBooks);
          } else {
            reject(new Error("No books found for the given author"));
          }
        }, 100);
      });
    };

    const author = req.params.author;
    const booksByAuthor = await fetchBooksByAuthor(author);
    return res.status(200).send(JSON.stringify(booksByAuthor, null, 4));
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

// ✅ Task 13: Get book details by Title using async/await
public_users.get('/title/:title', async function (req, res) {
  try {
    const fetchBooksByTitle = (title) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const matchingBooks = [];
          for (let isbn in books) {
            if (books[isbn].title.toLowerCase() === title.toLowerCase()) {
              matchingBooks.push({ isbn, ...books[isbn] });
            }
          }
          if (matchingBooks.length > 0) {
            resolve(matchingBooks);
          } else {
            reject(new Error("No books found with the given title"));
          }
        }, 100);
      });
    };

    const title = req.params.title;
    const booksByTitle = await fetchBooksByTitle(title);
    return res.status(200).send(JSON.stringify(booksByTitle, null, 4));
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

// Register route
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  const userExists = users.some(user => user.username === username);
  if (userExists) {
    return res.status(409).json({ message: "Username already exists" });
  }

  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully" });
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
