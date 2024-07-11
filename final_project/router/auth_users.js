const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

// Check if the user with the given username and password exists
const authenticatedUser = (username, password) => {
  // Filter the users array for any user with the same username and password
  let validusers = users.filter((user) => {
      return (user.username === username && user.password === password);
  });
  // Return true if any valid user is found, otherwise false
  if (validusers.length > 0) {
      return true;
  } else {
      return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if username or password is missing
  if (!username || !password) {
      return res.status(404).json({ message: "Error logging in" });
  }

  // Authenticate user
  if (authenticatedUser(username, password)) {
      // Generate JWT access token
      let accessToken = jwt.sign({
          data: password
      }, 'access', { expiresIn: 60 * 60 });

      // Store access token and username in session
      req.session.authorization = {
          accessToken, username
      }
      return res.status(200).send("User successfully logged in");
  } 
  else {
      return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", async (req, res) => {
  const { isbn } = req.params;
  const { review } = req.body;
  const username = req.session.authorization.username; // Assuming username is stored in session

  if (!username) {
    return res.status(401).send('User not logged in');
  }

  if (!review) {
    return res.status(400).send('Review is required');
  }

  try {
    // Check if the review already exists for the user and ISBN
    let existingReview = await books.findOne({ isbn, username });

    if (existingReview) {
      // Update existing review
      existingReview.review = review;
      await existingReview.save();
      res.send('Review updated');
    } else {
      // Create new review
      const newReview = new Review({ isbn, username, review });
      await newReview.save();
      res.send('Review added');
    }
  } catch (error) {
    res.status(500).send('Server error');
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
