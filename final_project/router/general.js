const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Check if a user with the given username already exists
const doesExist = (username) => {
  // Filter the users array for any user with the same username
  let userswithsamename = users.filter((user) => {
      return user.username === username;
  });
  // Return true if any user with the same username is found, otherwise false
  if (userswithsamename.length > 0) {
      return true;
  } else {
      return false;
  }
}

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (username && password) {
      // Check if the user does not already exist
      if (!doesExist(username)) {
          // Add the new user to the users array
          users.push({"username": username, "password": password});
          return res.status(200).json({message: "User successfully registered. Now you can login"});
      } else {
          return res.status(404).json({message: "User already exists!"});
      }
  }
  // Return error if username or password is missing
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
  await res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
  const isbn = req.params.isbn;
  await res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
  const bookAuthor = req.params.author;
  let matchBooks = []
  for (author in books){
    if (books[author].author === bookAuthor){
      matchBooks.push(books[author]);
    }
  }
  await res.send(matchBooks);
});

// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
  const bookTitle = req.params.title;
  let matchBooks = []
  for (title in books){
    if (books[title].title === bookTitle){
      matchBooks.push(books[title]);
    }
  }
  await res.send(matchBooks);
});

//  Get book review
public_users.get('/review/:isbn', async (req, res) => {
  const bookIsbn = req.params.isbn;
  let matchBooks = [];
  for (isbn in books){
    console.log(isbn);
    if (isbn === bookIsbn){
      matchBooks.push(books[isbn].reviews);
    }
  }
  await res.send(matchBooks);
});

module.exports.general = public_users;
