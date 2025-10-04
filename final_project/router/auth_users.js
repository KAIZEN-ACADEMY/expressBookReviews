const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();


let users = [];

const isValid = (username)=>{ //returns boolean
    return users.some(user => user.username === username);
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
    return users.some(user => user.username === username && user.password === password);
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;
  
    // Check if username and password are provided
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
  
    // Validate credentials
    if (!authenticatedUser(username, password)) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
  
    // Generate JWT
    const token = jwt.sign({ username }, "access", { expiresIn: '1h' });
  
    // Save token in session (if using express-session, or just return it)
    return res.status(200).json({ message: "Login successful", token });
  });
  
// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
  
    if (!token) {
      return res.status(401).json({ message: "Authorization token missing" });
    }
  
    try {
      const decoded = jwt.verify(token, "access");
      const username = decoded.username;
      const isbn = req.params.isbn;
      const review = req.query.review;
  
      if (!review) {
        return res.status(400).json({ message: "Review text is required" });
      }
  
      if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
      }
  
      books[isbn].reviews[username] = review;
  
      return res.status(200).json({ message: "Review added/updated successfully", reviews: books[isbn].reviews });
    } catch (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }
  });
  
  
  
  regd_users.delete("/auth/review/:isbn", (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
  
    if (!token) {
      return res.status(401).json({ message: "Authorization token missing" });
    }
  
    try {
      const decoded = jwt.verify(token, "access");
      const username = decoded.username;
      const isbn = req.params.isbn;
  
      if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
      }
  
      if (!books[isbn].reviews[username]) {
        return res.status(404).json({ message: "No review found for this user on the given book" });
      }
  
      delete books[isbn].reviews[username];
  
      return res.status(200).json({ message: "Review deleted successfully", reviews: books[isbn].reviews });
    } catch (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }
  });
  

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
